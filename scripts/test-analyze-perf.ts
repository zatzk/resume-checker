import { generateObject } from 'ai'
import { z } from 'zod'
import { getAIModel } from '../lib/ai-provider'
import { getMasterCV } from '../lib/master-cv'
import * as dotenv from 'dotenv'

dotenv.config()

async function test() {
  const masterCv = getMasterCV()
  const jobDescription = 'Senior Full Stack Software Engineer at TechCorp. Must know React, Node, Next.js, Docker, SQL.'
  const model = getAIModel()

  console.log('Testing full analyze schema performance...')
  const start = Date.now()
  try {
    const { object } = await generateObject({
      model,
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
        matrix: z.array(z.object({
          parameter: z.string(),
          status: z.string(),
          findings: z.string(),
          impact: z.string(),
          type: z.enum(['optimal', 'warning', 'neutral'])
        })),
        priorityKeywords: z.array(z.string()),
        priorityRecommendation: z.string(),
      }),
      prompt: `CV:\n${JSON.stringify(masterCv)}\n\nJOB:\n${jobDescription}`
    })
    console.log(`COMPLETED IN ${Date.now() - start}ms:`, object)
  } catch (err) {
    console.error('FAILED:', err)
  }
}

test()
