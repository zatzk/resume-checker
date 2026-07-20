import { generateObject } from 'ai'
import { z } from 'zod'
import { getAIModel, FAST_PROVIDER_OPTIONS } from '@/lib/ai-provider'
import { getMasterCV } from '@/lib/master-cv'

export async function POST(req: Request) {
  try {
    const { jobDescription, cvText } = await req.json()

    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
      return Response.json({ error: 'Job description text is required' }, { status: 400 })
    }

    const masterCv = getMasterCV()
    const cvContent = cvText || JSON.stringify(masterCv, null, 2)

    const model = getAIModel()

    const { object } = await generateObject({
      model,
      providerOptions: FAST_PROVIDER_OPTIONS,
      schema: z.object({
        jobTitle: z.string(),
        company: z.string(),
        aggregateScore: z.number().int().min(0).max(100),
        detailedScores: z.object({
          structure: z.number().int().min(0).max(100),
          formatting: z.number().int().min(0).max(100),
          keywords: z.number().int().min(0).max(100),
          impact: z.number().int().min(0).max(100),
        }),
        ats: z.object({
          score: z.number().int().min(0).max(100),
          feedback: z.array(z.string()),
          persona: z.string()
        }),
        career: z.object({
          score: z.number().int().min(0).max(100),
          feedback: z.array(z.string()),
          persona: z.string()
        }),
        strategist: z.object({
          score: z.number().int().min(0).max(100),
          feedback: z.array(z.string()),
          persona: z.string()
        }),
        matrix: z.array(z.object({
          parameter: z.string(),
          status: z.string(),
          findings: z.string(),
          impact: z.string(),
          type: z.enum(['optimal', 'warning', 'neutral'])
        })),
        priorityKeywords: z.array(z.string()),
        keyRequirements: z.array(z.string()),
        priorityRecommendation: z.string(),
        growthTips: z.array(z.object({
          area: z.string(),
          skillToAcquire: z.string(),
          actionPlan: z.string(),
          longTermImpact: z.string()
        })),
      }),
      system: `You are an elite Executive Career Strategist and ATS Optimization Expert. 
      Your mission is to perform a surgical analysis of the user's CV against the target Job Description.

      ### PERSONAS FOR FEEDBACK:
      1. ATS Engine: Focus on technical parsing, keyword density, and formatting. Provide 3 feedback bullets.
      2. Career Historian: Focus on career progression, consistency, and narrative. Provide 3 feedback bullets.
      3. The Strategist: Focus on market relevancy, impact, and value proposition. Provide 3 feedback bullets.

      Extract priority keywords and key requirements from the job description and compare them against the user's qualifications.
      Provide a matrix of 5 parameters: Formatting, Keyword Density, Impact Measurement, Career Progression, Job Relevancy.`,
      prompt: `CV_DATA:\n${cvContent}\n\nJOB_SPECIFICATIONS:\n${jobDescription}`,
    })

    return Response.json(object)
  } catch (error: unknown) {
    console.error('AI_ANALYSIS_FAILED:', error)
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    return Response.json({ 
      error: 'ANALYSIS_FAILED', 
      details: message 
    }, { status: 500 })
  }
}
