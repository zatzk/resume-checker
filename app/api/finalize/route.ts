import { generateObject } from 'ai'
import { z } from 'zod'
import { getAIModel, FAST_PROVIDER_OPTIONS } from '@/lib/ai-provider'
import { GeneratedCV, ReviewDelta } from '@/lib/cv-types'

export async function POST(req: Request) {
  try {
    const { draftCV, reviewDelta, jobDescription }: { draftCV: GeneratedCV; reviewDelta: ReviewDelta; jobDescription: string } = await req.json()

    if (!draftCV || !reviewDelta) {
      return Response.json({ error: 'Draft CV and Review Delta are required' }, { status: 400 })
    }

    const model = getAIModel()

    const { object } = await generateObject({
      model,
      providerOptions: FAST_PROVIDER_OPTIONS,
      schema: z.object({
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        location: z.string(),
        linkedin: z.string().optional(),
        website: z.string().optional(),
        summary: z.string(),
        experience: z.array(z.object({
          title: z.string(),
          company: z.string(),
          location: z.string(),
          dates: z.string(),
          responsibilities: z.array(z.string())
        })),
        skills: z.array(z.object({
          category: z.string(),
          items: z.array(z.string())
        })),
        education: z.array(z.object({
          degree: z.string(),
          school: z.string(),
          location: z.string(),
          dates: z.string()
        })),
        certifications: z.array(z.string()).optional(),
        projects: z.array(z.object({
          name: z.string(),
          description: z.string(),
          link: z.string().optional()
        })).optional(),
        languages: z.array(z.object({
          language: z.string(),
          level: z.string()
        })).optional()
      }),
      system: `You are the Finalizing Editor for an elite ATS resume builder.
      Apply the reviewer's delta improvements to the draft CV.
      Incorporate missing keywords cleanly into appropriate skill categories or experience bullets.
      Ensure flawless grammar, consistent tense (past tense for previous roles, present tense for current role), and maximum impact density.`,
      prompt: `DRAFT_CV:\n${JSON.stringify(draftCV, null, 2)}\n\nREVIEWER_DELTA:\n${JSON.stringify(reviewDelta, null, 2)}\n\nJOB_DESCRIPTION:\n${jobDescription}`,
    })

    return Response.json(object)
  } catch (error: unknown) {
    console.error('FINALIZE_FAILED:', error)
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    return Response.json({ 
      error: 'FINALIZE_FAILED', 
      details: message 
    }, { status: 500 })
  }
}
