'use client'

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'

export interface MatrixItem {
  parameter: string
  status: string
  findings: string
  impact: string
  type: 'optimal' | 'warning' | 'neutral'
}

export interface AmericanResume {
  name: string
  email: string
  phone: string
  location: string
  linkedin?: string
  website?: string
  socials?: { platform: string; url: string }[]
  summary: string
  experience: {
    title: string
    company: string
    location: string
    dates: string
    responsibilities: string[]
  }[]
  skills: { category: string; items: string[] }[]
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
  languages?: { language: string; level: string }[]
}

export interface ContentStatus {
  personalInfo: boolean
  experience: boolean
  education: boolean
  skills: boolean
  metrics: boolean
  contact: boolean
  languages: boolean
  certifications: boolean
}

export interface AnalysisResults {
  jobTitle?: string
  company?: string
  aggregateScore: number
  detailedScores: {
    structure: number
    formatting: number
    keywords: number
    impact: number
  }
  ats: { score: number; feedback: string[]; persona: string }
  career: { score: number; feedback: string[]; persona: string }
  strategist: { score: number; feedback: string[]; persona: string }
  matrix: MatrixItem[]
  priorityRecommendation: string
  generatedCV?: AmericanResume
}

export interface AnalysisData {
  cvText: string
  jobTitle: string
  company: string
  minSalary: string
  maxSalary: string
  jobDescription: string
  results?: AnalysisResults
  contentCheck: ContentStatus
}

interface AnalysisContextType {
  data: AnalysisData
  setCVText: (text: string) => void
  setJobData: (job: Partial<AnalysisData>) => void
  setResults: (results: AnalysisResults) => void
  setContentCheck: (check: ContentStatus) => void
  reset: () => void
}

const defaultContentCheck: ContentStatus = {
  personalInfo: false,
  experience: false,
  education: false,
  skills: false,
  metrics: false,
  contact: false,
  languages: false,
  certifications: false
}

const defaultData: AnalysisData = {
  cvText: '',
  jobTitle: '',
  company: '',
  minSalary: '',
  maxSalary: '',
  jobDescription: '',
  contentCheck: defaultContentCheck
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined)

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AnalysisData>(defaultData)

  const setCVText = useCallback((cvText: string) => 
    setData(prev => prev.cvText === cvText ? prev : ({ ...prev, cvText })), [])
  
  const setJobData = useCallback((job: Partial<AnalysisData>) => 
    setData(prev => ({ ...prev, ...job })), [])

  const setResults = useCallback((results: AnalysisResults) => 
    setData(prev => ({ ...prev, results })), [])

  const setContentCheck = useCallback((contentCheck: ContentStatus) => {
    setData(prev => {
      // Deep compare to prevent infinite loops
      const hasChanged = (Object.keys(contentCheck) as Array<keyof ContentStatus>).some(
        key => contentCheck[key] !== prev.contentCheck[key]
      )
      if (!hasChanged) return prev
      return { ...prev, contentCheck }
    })
  }, [])

  const reset = useCallback(() => setData(defaultData), [])

  return (
    <AnalysisContext.Provider value={{ data, setCVText, setJobData, setResults, setContentCheck, reset }}>
      {children}
    </AnalysisContext.Provider>
  )
}

export function useAnalysis() {
  const context = useContext(AnalysisContext)
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider')
  }
  return context
}
