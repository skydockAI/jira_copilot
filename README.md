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

- Run
```bash
npm install
```
- Register your app app by running (assuming that you have successfully setup Forge and login):
```bash
forge register
```

- Build and deploy your app by running:
```bash
forge deploy
```

- Install your app in an Atlassian site by running:
```bash
forge install
```
## Features
- Jira Ticket Validation and Recommendations
- Ticket Rewriting
- Test Case Generation in BDD Format
- Language Translation
- Custom Prompts for Extended Functionality

## License:
**Slides Assistant** is open-source and licensed under the [GPL-3.0](LICENSE) license.
