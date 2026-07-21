export interface MasterCV {
  name: string
  title: string
  contact: {
    location: string
    email: string
    phone?: string
    linkedin: string
    github: string
    portfolio: string
  }
  summary: string
  skills: {
    category: string
    items: string[]
  }[]
  experience: {
    company: string
    location: string
    title: string
    dates: string
    summaryText?: string
    responsibilities: string[]
  }[]
  projects: {
    name: string
    subtitle: string
    description: string
    techStack?: string[]
    link?: string
  }[]
  education: {
    degree: string
    institution: string
    dates: string
  }[]
  certifications: string[]
  languages: {
    language: string
    level: string
  }[]
}

export interface JobAnalysis {
  jobTitle: string
  company: string
  aggregateScore: number
  detailedScores: {
    structure: number
    formatting: number
    keywords: number
    impact: number
  }
  ats: {
    score: number
    feedback: string[]
    persona: string
  }
  career: {
    score: number
    feedback: string[]
    persona: string
  }
  strategist: {
    score: number
    feedback: string[]
    persona: string
  }
  matrix: {
    parameter: string
    status: string
    findings: string
    impact: string
    type: 'optimal' | 'warning' | 'neutral'
  }[]
  priorityKeywords: string[]
  keyRequirements: string[]
  growthTips: {
    area: string
    skillToAcquire: string
    actionPlan: string
    longTermImpact: string
  }[]
  priorityRecommendation: string
}

export interface GeneratedCV {
  name: string
  email: string
  phone: string
  location: string
  linkedin?: string
  website?: string
  summary: string
  experience: {
    title: string
    company: string
    location: string
    dates: string
    responsibilities: string[]
  }[]
  skills: {
    category: string
    items: string[]
  }[]
  education: {
    degree: string
    school: string
    location: string
    dates: string
  }[]
  certifications?: string[]
  projects?: {
    name: string
    description: string
    link?: string
  }[]
  languages?: {
    language: string
    level: string
  }[]
}

export interface ReviewDelta {
  summarySuggestions: string
  bulletsToEnhance: {
    company: string
    originalBullet: string
    enhancedBullet: string
    reason: string
  }[]
  missingKeywordsToAdd: string[]
  generalFeedback: string[]
}
