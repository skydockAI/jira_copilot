import { storage } from '@forge/api';

export const OPENAI_KEY = ''

// For AzureOpenAI user:
export const AZURE_OPENAI_KEY = '';
export const AZURE_OPENAI_ENDPOINT = '';
export const AZURE_OPENAI_VERSION= '';

export const OPENAI_MODEL = 'gpt-4o';

export const SYSTEM_PROMPT_KEY = 'SYSTEM_PROMPT_KEY';
export const FEATURES_KEY = 'FEATURES_KEY';
export const DEFAULT_SYSTEM_PROMPT = 'You are a helpful AI assistant';
export const DEFAULT_FEATURES = `{
	"features": [
		{
			"id": "validate",
			"icon": "✅",
			"text": "Validate",
			"prompt": "A good user story should have the format of: As a [user role], I want to [perform an action] so that [benefit or value]. A user story should also include acceptance criteria and a list of use cases. Please validate the following user story basing on those rules:"
		},
    {
			"id": "improve",
			"icon": "💡",
			"text": "Improve",
			"prompt": "A good user story should have the format of: As a [user role], I want to [perform an action] so that [benefit or value]. A user story should also include acceptance criteria and a list of use cases. Please re-write the following user story basing on those rules, only return the result, no explanation:"
		},
    {
			"id": "summarize",
			"icon": "📝",
			"text": "Summarize",
			"prompt": "Summarize the following Jira ticket:"
		},
    {
			"id": "create_test_cases",
			"icon": "🔍",
			"text": "Create Test Cases",
			"prompt": "Generate multiple test cases using BDD format for the following user story, only return the result in gherkin, no explanation, no code wrapping:"
		},
    {
			"id": "translate_Vietnamese",
			"icon": "🇻🇳",
			"text": "Translate to Vietnamese",
			"prompt": "Translate the following Jira ticket to Vietnamese, only return the result , no explanation:"
		}
	]
}`

export async function checkToSetDefaultConfigs(){
    const systemPrompt = await storage.get(SYSTEM_PROMPT_KEY);
    if (systemPrompt === null || systemPrompt === undefined) {
        await storage.set(SYSTEM_PROMPT_KEY, DEFAULT_SYSTEM_PROMPT);
    }
    const features = await storage.get(FEATURES_KEY);
    if (features === null || features === undefined) {
        await storage.set(FEATURES_KEY, DEFAULT_FEATURES);
    }
}

export function deleteConfigs(){
  storage.delete(SYSTEM_PROMPT_KEY);
  storage.delete(FEATURES_KEY);
}