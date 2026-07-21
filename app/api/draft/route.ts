import { generateObject } from 'ai'
import { z } from 'zod'
import { getAIModel, FAST_PROVIDER_OPTIONS } from '@/lib/ai-provider'
import { getMasterCV } from '@/lib/master-cv'
import { prisma } from '@/lib/prisma'
import { JobAnalysis } from '@/lib/cv-types'

export async function POST(req: Request) {
  try {
    const { jobDescription, jobAnalysis }: { jobDescription: string; jobAnalysis: JobAnalysis } = await req.json()

    if (!jobDescription) {
      return Response.json({ error: 'Job description is required' }, { status: 400 })
    }

    const profile = await prisma.userProfile.findFirst()
    const masterCv = profile?.masterCv ? JSON.parse(profile.masterCv) : getMasterCV()
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
        summary: z.string().describe("Tailored summary of 3-5 sentences packed with job keywords"),
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
      system: `You are an expert Resume Writer crafting an elite, high-impact American-style CV.
      
      MANDATE:
      - Use the Master CV as the single source of truth for work experience, dates, projects, and credentials. DO NOT invent fake companies or positions.
      - Re-order and reframe experience bullet points to match the target job description.
      - Every bullet MUST follow: [Strong Action Verb] + [Context/Quantified Metric] + [Impact/Result].
      - Align technical skills categories to emphasize terms in the priority keywords list.
      - Ensure concise, high-density language formatted for 1-2 page American standard resumes.`,
      prompt: `MASTER_CV:\n${JSON.stringify(masterCv, null, 2)}\n\nPRIORITY_KEYWORDS:\n${JSON.stringify(jobAnalysis?.priorityKeywords || [], null, 2)}\n\nJOB_DESCRIPTION:\n${jobDescription}`,
    })

    return Response.json(object)
  } catch (error: unknown) {
    console.error('DRAFT_GENERATION_FAILED:', error)
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    return Response.json({ 
      error: 'DRAFT_FAILED', 
      details: message 
    }, { status: 500 })
  }
}
