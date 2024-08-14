import React, { useState, Fragment } from 'react';
import ForgeReconciler, { Text, Textfield, TextArea, Button, ButtonGroup, Box, Spinner, Heading, Label, Inline } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
  const [actionFeedback, setActionFeedback] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const [showSecondLoading, setShowSecondLoading] = useState(false);
  const [customRequest, setCustomRequest] = useState('');
  const [customResponse, setCustomResponse] = useState(null);
  
  const ACTIONS = [
    ['✅ Validate', 'validate'],
    ['💡 Improve', 'improve'],
    ['🔍 Generate Test Cases', 'generateTestCases'],
    ['🇻🇳 Translate To Vietnamese', 'translateVietnamese']
  ];

  const callAction = async (action) => {
    setShowLoading(true);
    setActionFeedback(null);
    const actionResponse = await invoke('callAction', {action});
    setActionFeedback(actionResponse);
    setShowLoading(false);
  };

  const callCustomRequest = async () => {
    setCustomResponse(null);
    setShowSecondLoading(true);
    const response = await invoke('callCustomRequest', { customRequest });
    setCustomResponse(response);
    setShowSecondLoading(false);
  };

  const updateTicketDescription = async () => {
    setShowLoading(true);
    const newDescription = actionFeedback;
    setActionFeedback(null);
    const response = await invoke('updateTicketDescription', { newDescription });
    setActionFeedback(response);
    setShowLoading(false);
  };

  return (
    <Fragment>
       <Box paddingBlock='space.100'>
       <ButtonGroup appearance="primary">
        {ACTIONS.map(([label, action]) => (
          <Button
            onClick={async () => {
              await callAction(action);
            }}
          >
            {label}
          </Button>
        ))}
        </ButtonGroup>
      </Box>
      {showLoading && (
         <Fragment>
          <Box paddingBlock='space.100'>
            <Spinner size="large" label="processing"/>
          </Box>
        </Fragment>
      )}

      {actionFeedback && (
        <Fragment>
          <Box paddingBlock='space.100'>
            <Heading as="h4">Result:</Heading>
            <TextArea appearance="subtle" value={actionFeedback} onChange={(e) => setActionFeedback(e.target.value)}/>
          </Box>
          <Box paddingBlock='space.100'>
            <Button
              appearance="primary"
              onClick={async () => {
                await updateTicketDescription();
              }}
            >
              Update Ticket Description
            </Button>
          </Box>
        </Fragment>
      )}

      <Box paddingBlock='space.100'>
        <Label labelFor="customRequest">Custom request</Label>
        <Textfield id="customRequest" value={customRequest} onChange={(e) => setCustomRequest(e.target.value)}/>
      </Box>
      
      <Box paddingBlock='space.100'>
        <Button
          appearance="primary"
          onClick={async () => {
            await callCustomRequest();
          }}
        >
          Send
        </Button>
      </Box>
      {showSecondLoading && (
         <Fragment>
          <Box paddingBlock='space.100'>
            <Spinner size="large" label="processing"/>
          </Box>
        </Fragment>
      )}
      {customResponse && (
        <Fragment>
          <Box paddingBlock='space.100'>
            <Heading as="h4">Result:</Heading>
            <TextArea appearance="subtle" value={customResponse}/>
          </Box>
        </Fragment>
      )}
    </Fragment>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);