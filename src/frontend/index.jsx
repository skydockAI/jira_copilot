import React, {useEffect, useState, Fragment } from 'react';
import ForgeReconciler, { Text, Textfield, TextArea, Button, LinkButton, ButtonGroup, Box, Spinner, Heading, Label, SectionMessage, ProgressBar, Link } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
  const [features, setFeatures] = useState(null);
  const [adminUrl, setAdminUrl] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);
  const [serverResponse, setServerResponse] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const [customRequest, setCustomRequest] = useState('');

  //Load the list of features
  useEffect(async () => {
    const response = await invoke('loadFeatures');
    setFeatures(response.features);
    setAdminUrl(response.adminUrl);
  }, []);

  const callAction = async (action) => {
    setShowLoading(true);
    setActionFeedback(null);
    const actionResponse = await invoke('callAction', {action});
    setActionFeedback(actionResponse);
    setShowLoading(false);
  };

  const callCustomRequest = async () => {
    setShowLoading(true);
    setActionFeedback(null);
    const response = await invoke('callCustomRequest', {customRequest});
    setActionFeedback(response);
    setShowLoading(false);
  };

  const updateTicketDescription = async () => {
    setShowLoading(true);
    const newDescription = actionFeedback;
    setActionFeedback(null);
    const response = await invoke('updateTicketDescription', { newDescription });
    setServerResponse(response);
    setShowLoading(false);
  };

  const appendTicketDescription = async () => {
    setShowLoading(true);
    const addedContent = actionFeedback;
    setActionFeedback(null);
    const response = await invoke('appendTicketDescription', { addedContent });
    setServerResponse(response);
    setShowLoading(false);
  };

  const addComment = async () => {
    setShowLoading(true);
    const commentContent = actionFeedback;
    setActionFeedback(null);
    const response = await invoke('addComment', { commentContent });
    setServerResponse(response);
    setShowLoading(false);
  };

  return (
    <Fragment>
      <Box paddingBlock='space.100'>
      {features && (
        <Fragment>
          {features.length > 0 ? (
            <ButtonGroup>
              {features.map((feature, index) => (
                <Button key={index} appearance="primary" onClick={async () => { await callAction(feature.id); }}>
                  {feature.icon} {feature.text}
                </Button>
              ))}
              <LinkButton appearance="warning" href={adminUrl}>🛠️ Config</LinkButton>
            </ButtonGroup>
          ) : (
            <SectionMessage appearance="warning">
              <Text>No features have been defined. If this is the first time you use the app, please go to the <Link href={adminUrl} openNewTab>Config page</Link> to load default features.</Text>
            </SectionMessage>
          )}
        </Fragment>
      )}
      </Box>
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
          Request
        </Button>
      </Box>

      <Box paddingBlock='space.100'><ProgressBar value={1} /></Box>

      {serverResponse && (
         <Fragment>
          <Box paddingBlock='space.100'>
            <SectionMessage appearance="information">
              <Text>{serverResponse}</Text>
            </SectionMessage>
          </Box>
        </Fragment>
      )}

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
            <ButtonGroup appearance="primary">
              <Button onClick={async () => {await updateTicketDescription();}}>
                Update Description
              </Button>
              <Button onClick={async () => {await appendTicketDescription();}}>
                Append To Description
              </Button>
              <Button onClick={async () => {await addComment();}}>
                Add as a Comment
              </Button>
            </ButtonGroup>
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