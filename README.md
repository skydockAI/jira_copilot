# Jira Copilot
**Your AI-Powered Jira tool**

## What is Jira Copilot?
Jira Copilot is an AI-powered Jira tool serving as a Proof of Concept (POC) to demonstrate how GenAI can significantly boost team productivity when working with Jira.

## Technology Stack
Jira Copilot is developed using the Atlassian Forge framework, utilizing NodeJs for the backend and React for the frontend. This integration ensures a seamless experience within the Jira environment. For Generative AI services, Jira Copilot supports both OpenAI and AzureOpenAI APIs, providing flexibility in choosing the AI infrastructure that best suits an organization's needs.

## Requirements
See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Instructions:
- Clone the source code:
```bash
git clone https://github.com/skydockAI/jira_copilot.git
```
- Open [config.js](/src/resolvers/config.js) file and configure your OpenAI or AzureOpenAPI keys

- Install required libraries:
```bash
npm install
```
- Register the app (assuming that you have successfully setup Forge and login):
```bash
forge register
```

- Build and deploy the app:
```bash
forge deploy
```

- Install the app to your Atlassian site:
```bash
forge install
```

## Features
- A powerful and flexible framework that supports a wide range of smart functionalities (features) such as:
    + Ticket Validation and Recommendations
    + Ticket Rewriting
    + Ticket Summarization
    + Test Case Generation in BDD Format
    + Language Translation
    + etc...
- Ability to save AI generated contents by:
    + Updating ticket description
    + Appending to ticket description
    + Adding as a comment
- An Configuration page for site admins to manage system prompt and features definition
- Custom Prompts for Extended Functionality

## Screenshots
- Running for the first time:
<img src="/resources/first_time.png" alt="Running for the first time"></img>

- Manage system prompt and features definition:
<img src="/resources/config_page.png" alt="Manage system prompt and features definition"></img>

- Full UI with pre-defined features:
<img src="/resources/features_ui.png" alt="Full UI with pre-defined features"></img>

- Feature: Validate user story:
<img src="/resources/feature_validate.png" alt="Feature: Validate user story"></img>

- Feature: Re-write user story:
<img src="/resources/feature_improve.png" alt="Feature: Re-write user story"></img>

- Feature: Summarize ticket description:
<img src="/resources/feature_summarize.png" alt="Feature: Summarize ticket description"></img>

- Feature: Generate test cases:
<img src="/resources/feature_create_test_cases.png" alt="Feature: Generate test cases"></img>

- Feature: Language translation:
<img src="/resources/feature_translate.png" alt="Feature: Language translation"></img>

- Save AI response: Append to ticket description:
<img src="/resources/append_to_description.png" alt="Save AI response: Append to ticket description"></img>

- Save AI response: Add as a comment:
<img src="/resources/add_as_comment.png" alt="Save AI response: Add as a comment"></img>

- Custom request:
<img src="/resources/custom_request.png" alt="Custom request"></img>

## License:
**Slides Assistant** is open-source and licensed under the [GPL-3.0](LICENSE) license.
