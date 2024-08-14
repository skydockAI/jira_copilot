import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';
import OpenAI, { AzureOpenAI } from "openai";
import * as Config from './config'

const ai_client = new OpenAI({apiKey: Config.OPENAI_KEY});

// For AzureOpenAI user:
// const ai_client = new AzureOpenAI({
//   apiKey: Config.AZURE_OPENAI_KEY, 
//   endpoint: Config.AZURE_OPENAI_ENDPOINT, 
//   apiVersion:  Config.AZURE_OPENAI_VERSION
// });

const resolver = new Resolver();

resolver.define('callAction', async ({ context, payload }) => {
  const issueKey = context.extension.issue.key;
  const action = payload.action;
  const issueResponse = await api.asUser().requestJira(route`/rest/api/2/issue/${issueKey}?fields=description,issuetype`);
  const {description, issuetype} = (await issueResponse.json()).fields;
  var question = '';
  switch (action){
    case 'validate':
      if (issuetype.name == 'Story'){
        question = `${Config.VALIDATE_USER_STORY_PROMPT}${description}`;
      }
      else {
        return `No validation rule found for issue type ${issuetype.name}`;
      }
      break;
    case 'improve':
      if (issuetype.name == 'Story'){
        question = `${Config.IMPROVE_USER_STORY_PROMPT}${description}`;
      }
      else {
        return `No improvement rule found for issue type ${issuetype.name}`;
      }
      break;
    case 'generateTestCases':
      question = `${Config.GENERATE_TEST_CASES_PROMPT}${description}`;
      break;
    case 'translateVietnamese':
      question = `${Config.TRANSLATE_TO_VIETNAMESE_PROMPT}${description}`;
      break;
    default:
      return '[ERROR]: Unknown action';
  }
  const chatCompletion = await ai_client.chat.completions.create({
    messages: [{ role: 'user', content: question }],
    model: Config.OPENAI_MODEL
  });
  const responseMessage = chatCompletion.choices[0].message.content;
  return responseMessage;
});

resolver.define('callCustomRequest', async ({ context, payload }) => {
  const customRequest = payload.customRequest;
  const issueKey = context.extension.issue.key;

  const issueResponse = await api.asUser().requestJira(route`/rest/api/2/issue/${issueKey}?fields=description`);
  const {description} = (await issueResponse.json()).fields;
  const question = `${customRequest}.\nHere is the user story:\n${description}`

  const chatCompletion = await ai_client.chat.completions.create({
    messages: [{ role: 'user', content: question }],
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
  return newDescription;
});

export const handler = resolver.getDefinitions();
