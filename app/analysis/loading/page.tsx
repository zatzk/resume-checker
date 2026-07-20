'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAnalysis } from '@/components/AnalysisProvider'
import { clsx } from 'clsx'

export default function AnalysisLoadingPage() {
  const router = useRouter()
  const { data, setResults, setJobData } = useAnalysis()
  const [progress, setProgress] = useState(10)
  const [currentStep, setCurrentStep] = useState<string>('PHASE 1: PARSING & ANALYZING FIT')
  const [logs, setLogs] = useState<string[]>([
    'INITIATING MULTI-STAGE CV PIPELINE...'
  ])
  const hasCalledApi = useRef(false)

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg])
  }

  useEffect(() => {
    if (!data.jobDescription) {
      router.push('/analysis/new')
      return
    }

    if (hasCalledApi.current) return
    hasCalledApi.current = true

    const runPipeline = async () => {
      try {
        // --- PHASE 1: ANALYZE ---
        setCurrentStep('PHASE 1/4: ANALYZING JOB FIT & KEYWORDS')
        setProgress(25)
        addLog('Phase 1: Analyzing job specifications against master profile...')
        
        const analyzeRes = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobDescription: data.jobDescription })
        })

        if (!analyzeRes.ok) {
          const err = await analyzeRes.json()
          throw new Error(err.details || 'Phase 1 Analysis failed')
        }

        const jobAnalysis = await analyzeRes.json()
        addLog(`Phase 1 Complete: Score ${jobAnalysis.aggregateScore}% | Target: ${jobAnalysis.jobTitle || 'Role'} at ${jobAnalysis.company || 'Company'}`)

        // Update Job title & company
        setJobData({
          jobTitle: jobAnalysis.jobTitle,
          company: jobAnalysis.company
        })

        // --- PHASE 2: DRAFT ---
        setCurrentStep('PHASE 2/4: DRAFTING TAILORED CV')
        setProgress(50)
        addLog('Phase 2: Drafting tailored CV from curriculum.md master data...')

        const draftRes = await fetch('/api/draft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            jobDescription: data.jobDescription,
            jobAnalysis 
          })
        })

        if (!draftRes.ok) {
          const err = await draftRes.json()
          throw new Error(err.details || 'Phase 2 Draft failed')
        }

        const draftCV = await draftRes.json()
        addLog('Phase 2 Complete: Initial draft rendered with keyword alignment.')

        // --- PHASE 3: REVIEW ---
        setCurrentStep('PHASE 3/4: REVIEWER CRITIQUE & ACTION VERB POLISH')
        setProgress(75)
        addLog('Phase 3: Running critical reviewer agent audit...')

        const reviewRes = await fetch('/api/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            draftCV,
            jobDescription: data.jobDescription 
          })
        })

        if (!reviewRes.ok) {
          const err = await reviewRes.json()
          throw new Error(err.details || 'Phase 3 Review failed')
        }

        const reviewDelta = await reviewRes.json()
        addLog(`Phase 3 Complete: ${reviewDelta.bulletsToEnhance?.length || 0} bullet point enhancements identified.`)

        // --- PHASE 4: FINALIZE ---
        setCurrentStep('PHASE 4/4: APPLYING DELTA & FINALIZING CV')
        setProgress(95)
        addLog('Phase 4: Applying reviewer delta & finalizing American-style PDF structure...')

        const finalizeRes = await fetch('/api/finalize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            draftCV,
            reviewDelta,
            jobDescription: data.jobDescription
          })
        })

        if (!finalizeRes.ok) {
          const err = await finalizeRes.json()
          throw new Error(err.details || 'Phase 4 Finalize failed')
        }

        const finalCV = await finalizeRes.json()
        addLog('Phase 4 Complete: High-fidelity American CV document generated successfully.')

        // Combine full results for Feedback & Preview
        const fullResults = {
          ...jobAnalysis,
          generatedCV: finalCV
        }

        setResults(fullResults)
        setProgress(100)

        setTimeout(() => {
          router.push('/analysis/feedback')
        }, 800)

      } catch (error: unknown) {
        console.error(error)
        const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
        alert(`PIPELINE_ERROR: ${message}`)
        router.push('/analysis/new')
      }
    }

    runPipeline()
  }, [data.jobDescription, router, setJobData, setResults])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-sans py-12 px-4">
      <section className="w-full max-w-4xl border border-outline-variant bg-surface-container-low p-6 relative">
        <div className="absolute -top-px -left-px w-2 h-2 border-t-2 border-l-2 border-primary"></div>
        <div className="absolute -top-px -right-px w-2 h-2 border-t-2 border-l-2 border-primary rotate-90"></div>
        <div className="absolute -bottom-px -left-px w-2 h-2 border-t-2 border-l-2 border-primary -rotate-90"></div>
        <div className="absolute -bottom-px -right-px w-2 h-2 border-t-2 border-l-2 border-primary rotate-180"></div>
        
        <div className="flex flex-col items-center gap-8 py-4">
          <div className="w-full space-y-6 px-4 md:px-8">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="font-mono text-[11px] text-primary uppercase tracking-[0.2em] font-bold">[ {currentStep} ]</span>
                <span className="font-mono text-[10px] text-on-surface-variant uppercase">{progress}% COMPLETE</span>
              </div>
              <div className="h-6 w-full border border-primary p-[2px] bg-surface-container-lowest">
                <div className="h-full bg-primary flex items-center px-2 overflow-hidden transition-all duration-300" style={{ width: `${progress}%` }}>
                  <div className="w-full h-[1px] bg-on-primary/30 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Pipeline Stage Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-[11px] uppercase">
              <StageBox step={1} title="01. ANALYZE" active={progress >= 25} done={progress > 25} />
              <StageBox step={2} title="02. DRAFT" active={progress >= 50} done={progress > 50} />
              <StageBox step={3} title="03. REVIEW" active={progress >= 75} done={progress > 75} />
              <StageBox step={4} title="04. FINALIZE" active={progress >= 95} done={progress === 100} />
            </div>
          </div>

          <div className="w-full bg-surface-container-lowest border border-outline-variant">
            <div className="bg-surface-variant px-4 py-1.5 border-b border-outline-variant flex justify-between items-center">
              <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">PIPELINE_EXECUTION_LOG</span>
              <span className="font-mono text-[10px] text-primary font-bold">MULTI_PHASE_MODE</span>
            </div>
            <div className="p-4 h-52 overflow-y-auto font-mono text-xs text-on-surface-variant space-y-2 uppercase">
              {logs.map((log, i) => (
                <p key={i} className={clsx("flex gap-2", i === logs.length - 1 ? "text-primary animate-pulse font-bold" : "text-primary/80")}>
                  <span className="text-primary">&gt;</span> {log}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function StageBox({ step, title, active, done }: { step: number; title: string; active: boolean; done: boolean }) {
  return (
    <div className={clsx(
      "border p-3 flex flex-col gap-1 transition-all",
      done ? "border-primary bg-primary/10 text-primary font-bold" :
      active ? "border-primary text-primary animate-pulse bg-surface-container-high" :
      "border-outline-variant text-outline opacity-40 bg-surface"
    )}>
      <span className="text-[10px]">STEP 0{step}</span>
      <span className="text-xs">{title}</span>
    </div>
  )
}
