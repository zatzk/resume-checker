import { createOpenAI } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'
import * as dotenv from 'dotenv'

dotenv.config()

async function testNvidiaObject() {
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

  const nvidia = createOpenAI({
    apiKey,
    baseURL: baseUrl,
  })

  try {
    console.log('INITIATING_GENERATE_OBJECT...')
    const start = Date.now()
    const { object } = await generateObject({
      model: nvidia.chat(modelName),
      schema: z.object({
        jobTitle: z.string(),
        company: z.string(),
        aggregateScore: z.number().int().min(0).max(100)
      }),
      prompt: 'Job: Senior Full Stack Engineer at TechCorp. Score: 85',
    })
    console.log(`SUCCESS (${Date.now() - start}ms):`, object)
  } catch (error: unknown) {
    const err = error as { message?: string, url?: string, responseBody?: string }
    console.error('FAILED:', err.message)
    if (err.url) console.error('URL_ATTEMPTED:', err.url)
    if (err.responseBody) console.error('RESPONSE:', err.responseBody)
  }
}

testNvidiaObject()
