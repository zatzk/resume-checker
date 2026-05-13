import { createOpenAI } from '@ai-sdk/openai'
import { google } from '@ai-sdk/google'
import { streamText } from 'ai'

export async function POST(req: Request) {
  const { cvText, jobRequirements, persona } = await req.json()

  let systemPrompt = ''

  if (persona === 'ats') {
    systemPrompt = `You are an ATS (Applicant Tracking System) Simulator. 
    Analyze the following CV against the Job Requirements. 
    Focus on keyword density, structural parsing, formatting issues, and technical alignment.
    Provide a score from 0 to 100.
    List critical structural flaws and missing keywords.`
  } else if (persona === 'career') {
    systemPrompt = `You are a Senior Career Analyst. 
    Analyze the CV and Job Requirements. 
    Focus on career trajectory, narrative impact, skill presentation, and market competitiveness.
    Provide a score from 0 to 100.
    List strategic improvements to the professional story.`
  } else if (persona === 'strategist') {
    systemPrompt = `You are an Anti-system Strategist. 
    Analyze the CV and Job Requirements. 
    Look for unconventional ways to stand out. 
    Identify "loopholes" in the hiring process and highlight unique "rebel" traits.
    Provide a score from 0 to 100.
    Provide non-obvious, high-impact tactical advice.`
  }

  // AI Provider Configuration (Agnostic)
  const nvidiaApiKey = process.env.PUBLIC_NVIDIA_API_KEY
  const nvidiaUrl = process.env.PUBLIC_NVIDIA_API_URL // Expected to be full URL or base URL
  const nvidiaModel = process.env.PUBLIC_NVIDIA_MODEL || 'meta/llama-3.1-8b-instruct'

  let model;

  if (nvidiaApiKey && nvidiaUrl) {
    // Treat as OpenAI-compatible provider
    const baseUrl = nvidiaUrl.endsWith('/chat/completions') 
      ? nvidiaUrl.replace('/chat/completions', '') 
      : nvidiaUrl

    const nvidia = createOpenAI({
      apiKey: nvidiaApiKey,
      baseURL: baseUrl,
    })
    model = nvidia(nvidiaModel)
  } else {
    // Fallback to Google if configured, otherwise this might fail if no keys exist
    model = google('gemini-1.5-pro')
  }

  const result = streamText({
    model,
    system: systemPrompt,
    prompt: `CV CONTENT:\n${cvText}\n\nJOB REQUIREMENTS:\n${jobRequirements}`,
  })

  return result.toDataStreamResponse()
}
