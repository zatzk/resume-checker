import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'
import * as dotenv from 'dotenv'

dotenv.config()

async function testNvidiaAI() {
  const apiKey = process.env.PUBLIC_NVIDIA_API_KEY
  const apiUrl = process.env.PUBLIC_NVIDIA_API_URL
  const modelName = process.env.PUBLIC_NVIDIA_MODEL || 'meta/llama-3.1-8b-instruct'

  console.log('--- AI_DIAGNOSTIC_START ---')
  
  if (!apiKey || !apiUrl) {
    console.error('ERROR: MISSING_CREDENTIALS')
    return
  }

  const baseUrl = apiUrl.endsWith('/chat/completions') 
    ? apiUrl.replace('/chat/completions', '') 
    : apiUrl

  console.log('BASE_URL:', baseUrl)

  const nvidia = createOpenAI({
    apiKey,
    baseURL: baseUrl,
    compatibility: 'strict',
  })

  try {
    console.log('INITIATING_GENERATE_TEXT...')
    const { text } = await generateText({
      model: nvidia.chat(modelName), // EXPLICIT CHAT
      prompt: 'Say Hello',
    })
    console.log('SUCCESS:', text)
  } catch (error: unknown) {
    const err = error as { message?: string, url?: string, responseBody?: string }
    console.error('FAILED:', err.message)
    if (err.url) console.error('URL_ATTEMPTED:', err.url)
    if (err.responseBody) console.error('RESPONSE:', err.responseBody)
  }
}

testNvidiaAI()
