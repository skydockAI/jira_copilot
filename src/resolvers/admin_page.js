import Resolver from '@forge/resolver';
import { storage } from '@forge/api';
import * as Config from './config'

const resolver = new Resolver();

resolver.define('getConfigs', async ({ context, payload }) => {
  await Config.checkToSetDefaultConfigs();
  const systemPrompt = await storage.get(Config.SYSTEM_PROMPT_KEY);
  const features = await storage.get(Config.FEATURES_KEY);
  return {
    systemPrompt: systemPrompt,
    features: features
  }
});

resolver.define('updateConfigs', async ({ context, payload }) => {
  const systemPrompt = payload.data.systemPrompt;
  const features = payload.data.features;

  if (systemPrompt !== null && systemPrompt !== undefined) {
    await storage.set(Config.SYSTEM_PROMPT_KEY, systemPrompt)
  }
  if (features !== null && features !== undefined) {
    await storage.set(Config.FEATURES_KEY, features)
  }
  return '[SUCCESS] Configs have been updated successfully';
});

export const handler = resolver.getDefinitions();
