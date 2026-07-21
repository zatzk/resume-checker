import { generateObject } from 'ai'
import { z } from 'zod'
import { getAIModel, FAST_PROVIDER_OPTIONS } from '@/lib/ai-provider'

export async function POST(req: Request) {
  try {
    const { rawText }: { rawText: string } = await req.json()

    if (!rawText || !rawText.trim()) {
      return Response.json({ error: 'Text to extract is required' }, { status: 400 })
    }

    const model = getAIModel()

    const { object } = await generateObject({
      model,
      providerOptions: FAST_PROVIDER_OPTIONS,
      schema: z.object({
        name: z.string().describe("Candidate's full name"),
        title: z.string().describe("Professional headline / target title"),
        contact: z.object({
          location: z.string(),
          email: z.string(),
          linkedin: z.string(),
          github: z.string(),
          portfolio: z.string()
        }),
        summary: z.string().describe("Comprehensive professional summary"),
        skills: z.array(
          z.object({
            category: z.string(),
            items: z.array(z.string())
          })
        ),
        experience: z.array(
          z.object({
            company: z.string(),
            location: z.string(),
            title: z.string(),
            dates: z.string(),
            summaryText: z.string().optional(),
            responsibilities: z.array(z.string())
          })
        ),
        projects: z.array(
          z.object({
            name: z.string(),
            subtitle: z.string(),
            description: z.string(),
            techStack: z.array(z.string()).optional(),
            link: z.string().optional()
          })
        ),
        education: z.array(
          z.object({
            degree: z.string(),
            institution: z.string(),
            dates: z.string()
          })
        ),
        certifications: z.array(z.string()),
        languages: z.array(
          z.object({
            language: z.string(),
            level: z.string()
          })
        )
      }),
      system: `You are an expert CV Parser and Career Data Extraction System.
      Extract all candidate details from the provided unstructured text/notes into a structured Master CV schema.
      Do not omit important achievements or bullet points.
      Normalize dates, companies, degree names, and skills cleanly.`,
      prompt: `UNSTRUCTURED_CV_TEXT:\n${rawText}`
    })

    return Response.json(object)
  } catch (error: unknown) {
    console.error('EXTRACTION_FAILED:', error)
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    return Response.json({ error: 'EXTRACTION_FAILED', details: message }, { status: 500 })
  }
}
