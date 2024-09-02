import React, { useEffect, useState, Fragment } from 'react';
import ForgeReconciler from '@forge/react';
import {
  Text,
  Form,
  FormHeader,
  FormSection,
  FormFooter,
  Label,
  Textfield,
  TextArea,
  Spinner,
  Box,
  SectionMessage,
  Button,
  useForm
} from "@forge/react";
import { invoke } from '@forge/bridge';
const App = () => {
  const { handleSubmit, register, getFieldId } = useForm();
  const [configs, setConfigs] = useState(null)
  const [showLoading, setShowLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);
  
  //Load current prompts
  useEffect(async () => {
    await invoke('getConfigs').then(setConfigs);
  }, []);

  const submitForm = async(data) => {
    setServerResponse(null);
    setShowLoading(true);
    const response = await invoke('updateConfigs', {data});
    setServerResponse(response);
    setShowLoading(false);
  };

  return (
    <>
      {configs && (
        <Fragment>
          <Form onSubmit={handleSubmit(submitForm)}>
            <FormHeader title="Features and prompts configuration">
            </FormHeader>
            <FormSection>
              <Label labelFor={getFieldId("systemPrompt")}>
                System prompt:
              </Label>
              <TextArea {...register("systemPrompt")} defaultValue={configs.systemPrompt || ''} />
              <Label labelFor={getFieldId("features")}>
                Features Definition:
              </Label>
              <TextArea {...register("features")} defaultValue={configs.features || ''} />
              {showLoading && (
                <Fragment>
                  <Box paddingBlock='space.100'>
                    <Spinner size="large" label="processing"/>
                  </Box>
                </Fragment>
              )}
              {serverResponse && (
                <Fragment>
                  <Box paddingBlock='space.100'>
                    <SectionMessage appearance="information">
                      <Text>{serverResponse}</Text>
                    </SectionMessage>
                  </Box>
                </Fragment>
              )}
            </FormSection>
            <FormFooter>
              <Button appearance="primary" type="submit">
                Update
              </Button>
            </FormFooter>
          </Form>
        </Fragment>
      )}
    </>
  );
};
ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
