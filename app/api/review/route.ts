import { generateObject } from 'ai'
import { z } from 'zod'
import { getAIModel, FAST_PROVIDER_OPTIONS } from '@/lib/ai-provider'
import { GeneratedCV } from '@/lib/cv-types'

export async function POST(req: Request) {
  try {
    const { draftCV, jobDescription }: { draftCV: GeneratedCV; jobDescription: string } = await req.json()

    if (!draftCV || !jobDescription) {
      return Response.json({ error: 'Draft CV and Job Description are required' }, { status: 400 })
    }

    const model = getAIModel()

    const { object } = await generateObject({
      model,
      providerOptions: FAST_PROVIDER_OPTIONS,
      schema: z.object({
        summarySuggestions: z.string().describe("Critical polish suggestions or improved draft for the summary"),
        bulletsToEnhance: z.array(z.object({
          company: z.string(),
          originalBullet: z.string(),
          enhancedBullet: z.string(),
          reason: z.string()
        })),
        missingKeywordsToAdd: z.array(z.string()),
        generalFeedback: z.array(z.string())
      }),
      system: `You are a strict, skeptical Senior Hiring Manager and ATS Reviewer.
      Review the drafted CV against the target Job Description.
      Identify weak action verbs, missed high-priority keywords, or vague impact descriptions.
      Provide high-leverage delta improvements without rewriting the whole document.`,
      prompt: `DRAFT_CV:\n${JSON.stringify(draftCV, null, 2)}\n\nJOB_DESCRIPTION:\n${jobDescription}`,
    })

    return Response.json(object)
  } catch (error: unknown) {
    console.error('REVIEW_FAILED:', error)
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    return Response.json({ 
      error: 'REVIEW_FAILED', 
      details: message 
    }, { status: 500 })
  }
}
