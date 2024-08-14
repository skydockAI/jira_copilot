export const OPENAI_KEY = ''

// For AzureOpenAI user:
// export const AZURE_OPENAI_KEY = '';
// export const AZURE_OPENAI_ENDPOINT = '';
// export const AZURE_OPENAI_VERSION= '';

export const OPENAI_MODEL = 'gpt-4o';

export const VALIDATE_USER_STORY_PROMPT = `Rules for a good user story:
- Have the format of: As a [user role], I want to [perform an action] so that [benefit or value]
- Have acceptance criteria
- Include a list of use cases
Please validate the following user story basing on those rules:\n`;

export const IMPROVE_USER_STORY_PROMPT = `Rules for a good user story:
- Have the format of: As a [user role], I want to [perform an action] so that [benefit or value].
- Have acceptance criteria.
- Include a list of different use cases for the user story.
Please re-write the user story basing on those rules. 
Make sure to include a list of different use cases.
Only return the result, no explanation. Here is the user story:\n`;

export const GENERATE_TEST_CASES_PROMPT = `Generate multiple test cases using BDD format for the user story.
Only return the result in gherkin, no explanation, no code wrapping. 
Here is the user story:\n`;

export const TRANSLATE_TO_VIETNAMESE_PROMPT = `Translate the user story to Vietnamese. Only return the result , no explanation.
Here is the user story:\n`;