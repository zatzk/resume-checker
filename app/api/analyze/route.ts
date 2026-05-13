import { createOpenAI } from '@ai-sdk/openai'
import { google } from '@ai-sdk/google'
import { generateObject } from 'ai'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const { cvText, jobDescription } = await req.json()

    // AI Provider Configuration (Agnostic)
    const nvidiaApiKey = process.env.PUBLIC_NVIDIA_API_KEY
    const nvidiaUrl = process.env.PUBLIC_NVIDIA_API_URL
    const nvidiaModel = process.env.PUBLIC_NVIDIA_MODEL || 'meta/llama-3.1-8b-instruct'

    let model;

    if (nvidiaApiKey && nvidiaUrl) {
      const baseUrl = nvidiaUrl.endsWith('/chat/completions') 
        ? nvidiaUrl.replace('/chat/completions', '') 
        : nvidiaUrl

      const nvidia = createOpenAI({
        apiKey: nvidiaApiKey,
        baseURL: baseUrl,
        compatibility: 'strict', 
      })
      model = nvidia.chat(nvidiaModel)
    } else {
      model = google('gemini-1.5-pro')
    }

    const { object } = await generateObject({
      model,
      schema: z.object({
        jobTitle: z.string(),
        company: z.string(),
        aggregateScore: z.number().int().min(0).max(100),
        ats: z.object({
          score: z.number().int().min(0).max(100),
          feedback: z.array(z.string()).length(3)
        }),
        career: z.object({
          score: z.number().int().min(0).max(100),
          feedback: z.array(z.string()).length(3)
        }),
        strategist: z.object({
          score: z.number().int().min(0).max(100),
          feedback: z.array(z.string()).length(3)
        }),
        matrix: z.array(z.object({
          parameter: z.string(),
          status: z.string(),
          findings: z.string(),
          impact: z.string(),
          type: z.enum(['optimal', 'warning', 'neutral'])
        })).length(5),
        priorityRecommendation: z.string(),
        growthTips: z.array(z.object({
          area: z.string(),
          skillToAcquire: z.string(),
          actionPlan: z.string(),
          longTermImpact: z.string()
        })).min(3),
        developmentPlan: z.string(),
        generatedCV: z.object({
          name: z.string(),
          email: z.string(),
          phone: z.string(),
          location: z.string(),
          linkedin: z.string().optional(),
          website: z.string().optional(),
          socials: z.array(z.object({
            platform: z.string(),
            url: z.string()
          })).optional(),
          summary: z.string(),
          experience: z.array(z.object({
            title: z.string(),
            company: z.string(),
            location: z.string(),
            dates: z.string(),
            responsibilities: z.array(z.string())
          })),
          skills: z.array(z.string()),
          education: z.array(z.object({
            degree: z.string(),
            school: z.string(),
            location: z.string(),
            dates: z.string()
          })),
          certifications: z.array(z.string()).optional(),
          languages: z.array(z.object({
            language: z.string(),
            level: z.string()
          })).optional()
        })
      }),
      system: `You are an elite Executive Career Strategist and ATS Optimization Expert. 
      Your mission is to perform a surgical analysis of the user's CV against the target Job Description and transform it into a world-class, high-depth American-style resume.

      CORE MANDATE:
      - EXHAUSTIVE EXTRACTION: Capture all contact info, links, and credentials from the source CV.
      - STRATEGIC DEPTH: Provide a "Growth & Development" section that gives the user a clear path to bridge skill gaps and advance their career.
      - ATS-FRIENDLY GENERATION: Create a single-column, keyword-optimized resume that emphasizes impact over activities.

      ANALYSIS GUIDELINES:
      - Feedback must be brutal, professional, and actionable.
      - Matrix must include 5 critical parameters: Formatting, Keyword Density, Impact Measurement (Metrics), Career Progression, and Job Relevancy.
      - Growth Tips must be specific (e.g., "Learn Kubernetes to bridge the infrastructure gap" instead of "Improve tech skills").

      RESUME REFORMULATION RULES (The "Resume Worded" Standard):
      - SUMMARY: 4+ sentences. Professional, high-energy, and packed with 5+ key skills from the job spec.
      - EXPERIENCE BULLETS: Every bullet must follow the format: [Action Verb] + [Quantified Accomplishment] + [Metric/Impact].
        * Poor: "Responsible for data analysis."
        * Elite: "Analyzed 25,000+ monthly active user datasets to guide marketing strategy, resulting in a 2x increase in engagement time and 30% reduction in churn."
      - If metrics are missing in the original CV, use your expert knowledge to infer REASONABLE, plausible industry-standard ranges (e.g., "15-20% efficiency gain") while maintaining integrity.
      - SKILLS: Group by category (e.g., "Technical: Python, AWS; Analytical: Tableau, Regression Analysis").
      
      Generate a comprehensive JSON response matching the required schema.`,
      prompt: `CV_DATA:\n${cvText}\n\nJOB_SPECIFICATIONS:\n${jobDescription}`,
    })

    return Response.json(object)
  } catch (error: unknown) {
    console.error('AI_ANALYSIS_FAILED:', error)
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    const url = (error as { url?: string }).url
    return Response.json({ 
      error: 'ANALYSIS_STREAM_INTERRUPTED', 
      details: message,
      url: url
    }, { status: 500 })
  }
}
