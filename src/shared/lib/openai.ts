import OpenAI from 'openai';

let client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  const key = process.env.OpenAI_API_Key?.trim();
  if (!key) {
    throw new Error('Missing OpenAI_API_Key');
  }
  client ??= new OpenAI({ apiKey: key });
  return client;
}
