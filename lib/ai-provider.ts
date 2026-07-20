import { createOpenAI } from '@ai-sdk/openai'
import { google } from '@ai-sdk/google'

export function getAIModel() {
  const nvidiaApiKey = process.env.PUBLIC_NVIDIA_API_KEY
  const nvidiaUrl = process.env.PUBLIC_NVIDIA_API_URL
  const nvidiaModel = process.env.PUBLIC_NVIDIA_MODEL || 'meta/llama-3.1-8b-instruct'

  if (nvidiaApiKey && nvidiaUrl) {
    const baseUrl = nvidiaUrl.endsWith('/chat/completions') 
      ? nvidiaUrl.replace('/chat/completions', '') 
      : nvidiaUrl

    const nvidia = createOpenAI({
      apiKey: nvidiaApiKey,
      baseURL: baseUrl,
    })
    return nvidia.chat(nvidiaModel)
  }

  // Fallback to Google Gemini
  return google('gemini-1.5-pro')
}

export const FAST_PROVIDER_OPTIONS = {
  openai: {
    structuredOutputs: false
  }
}
