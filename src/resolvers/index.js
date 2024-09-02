import Resolver from '@forge/resolver';
import api, { route, storage } from '@forge/api';
import OpenAI, { AzureOpenAI } from "openai";
import * as Config from './config'

// Use OpenAI if there is a valid OPENAI_KEY, otherwise use AzureOpenAI
const ai_client = Config.OPENAI_KEY && Config.OPENAI_KEY.trim() !== ''
  ? new OpenAI({ apiKey: Config.OPENAI_KEY })
  : new AzureOpenAI({
      apiKey: Config.AZURE_OPENAI_KEY, 
      endpoint: Config.AZURE_OPENAI_ENDPOINT, 
      apiVersion: Config.AZURE_OPENAI_VERSION
    });

const resolver = new Resolver();

resolver.define('loadFeatures', async ({ context, payload }) => {

  // Get the App ID and Environment ID
  const localId = context.localId;
  const cleanedString = localId
  .replace("ari:cloud:ecosystem::extension/", "")
  .replace(/\/static\/jira-copilot-issue-panel-[^\/]+$/, "");
  const parts = cleanedString.split('/');
  var appId = null;
  var environmentId = null;
  if (parts.length === 2) {
    appId = parts[0];
    environmentId = parts[1];
  }

  // Get the current workspace domain
  var domain = null;
  const response = await api.asUser().requestJira(route`/rest/api/2/serverInfo`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  if (response.ok) {
    const responseData = await response.json();
    domain = responseData.baseUrl;
  }

  // Construct the URL for Admin Config page
  var adminUrl = "";
  if (appId && environmentId && domain){
    adminUrl = `${domain}/jira/settings/apps/${appId}/${environmentId}`
  }
  console.log(adminUrl);
 
  const featuresJson = await storage.get(Config.FEATURES_KEY);
  const features = featuresJson && featuresJson.trim() !== '' ? JSON.parse(featuresJson).features : [];
  return {
    features: features,
    adminUrl: adminUrl
  };
});

resolver.define('callAction', async ({ context, payload }) => {
  const issueKey = context.extension.issue.key;
  const action = payload.action;
  const featuresJson = await storage.get(Config.FEATURES_KEY);
  const features = featuresJson && featuresJson.trim() !== '' ? JSON.parse(featuresJson).features : [];
  const systemPromptRaw = await storage.get(Config.SYSTEM_PROMPT_KEY);
  const systemPrompt = systemPromptRaw && systemPromptRaw.trim() !== '' ? systemPromptRaw : Config.DEFAULT_SYSTEM_PROMPT;
  const matchingFeature = features.find(feature => feature.id === action);
  if (matchingFeature) {
    const issueResponse = await api.asUser().requestJira(route`/rest/api/2/issue/${issueKey}?fields=description,issuetype`);
    const {description, issuetype} = (await issueResponse.json()).fields;
    var question = `${matchingFeature.prompt}${description}`;

    const chatCompletion = await ai_client.chat.completions.create({
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: question }],
      model: Config.OPENAI_MODEL
    });
    const responseMessage = chatCompletion.choices[0].message.content;
    return responseMessage;
  } else {
    return `[ERROR] No feature named "${action}" found in the configurations.`;
  }
});

resolver.define('callCustomRequest', async ({ context, payload }) => {
  const customRequest = payload.customRequest;
  const issueKey = context.extension.issue.key;

  const systemPromptRaw = await storage.get(Config.SYSTEM_PROMPT_KEY);
  const systemPrompt = systemPromptRaw && systemPromptRaw.trim() !== '' ? systemPromptRaw : Config.DEFAULT_SYSTEM_PROMPT;

  const issueResponse = await api.asUser().requestJira(route`/rest/api/2/issue/${issueKey}?fields=description`);
  const {description} = (await issueResponse.json()).fields;
  const question = `${customRequest}.\nHere is the Jira ticket:\n${description}`

  console.log(systemPrompt);
  const chatCompletion = await ai_client.chat.completions.create({
    messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: question }],
    model: Config.OPENAI_MODEL
  });
  const responseMessage = chatCompletion.choices[0].message.content

  return responseMessage;
});


resolver.define('updateTicketDescription', async ({ context, payload }) => {
  const newDescription = payload.newDescription;
  const issueKey = context.extension.issue.key;

  var bodyData = JSON.stringify({
    fields: {
        description: newDescription
    }
  });
  const putResponse = await api.asUser().requestJira(route`/rest/api/2/issue/${issueKey}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: bodyData
  });
  if (putResponse.ok) {
    return '[SUCCESS] Please reload the ticket to see updated content';
  } 
  else {
      return `[ERROR] ${putResponse.statusText}`;
  }
});

resolver.define('appendTicketDescription', async ({ context, payload }) => {
  const addedContent = payload.addedContent;
  const issueKey = context.extension.issue.key;

  const issueResponse = await api.asUser().requestJira(route`/rest/api/2/issue/${issueKey}?fields=description`);
  const {description} = (await issueResponse.json()).fields;

  const newDescription = `${description}\n --- \n💡 *ADDED BY JIRA COPILOT* :\n${addedContent}`;

  var bodyData = JSON.stringify({
    fields: {
        description: newDescription
    }
  });
  const putResponse = await api.asUser().requestJira(route`/rest/api/2/issue/${issueKey}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: bodyData
  });
  if (putResponse.ok) {
    return '[SUCCESS] Please reload the ticket to see updated content';
  } 
  else {
      return `[ERROR] ${putResponse.statusText}`;
  }
});

resolver.define('addComment', async ({ context, payload }) => {
  const commentContent = `💡 *GENERATED BY JIRA COPILOT* :\n${payload.commentContent}`;
  const issueKey = context.extension.issue.key;

  var bodyData = JSON.stringify({
    body: commentContent
  });
  
  const response = await api.asUser().requestJira(route`/rest/api/2/issue/${issueKey}/comment`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: bodyData
  });

  if (response.ok) {
    return '[SUCCESS] Please reload the ticket to see added comment';
  } 
  else {
      return `[ERROR] ${response.statusText}`;
  }
});

export const handler = resolver.getDefinitions();
