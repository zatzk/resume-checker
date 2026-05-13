'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAnalysis } from '@/components/AnalysisProvider'
import { clsx } from 'clsx'

export default function AnalysisLoadingPage() {
  const router = useRouter()
  const { data, setResults, setJobData } = useAnalysis()
  const [progress, setProgress] = useState(0)
  const [logIndex, setLogIndex] = useState(0)
  const hasCalledApi = useRef(false)

  const logs = [
    'INITIATING MULTI-PERSONA HEURISTICS...',
    'SIMULATING ATS RECRUITER PERSPECTIVE...',
    'ANALYZING TECH_STACK_DENSITY...',
    'GENERATING STRATEGIC RECOMMENDATIONS...',
    'VECTORIZING CROSS-DOMAIN INSIGHTS...',
    'WAIT_STATE: IO_BUFFER_FLUSHING...',
    'FINALIZING FEEDBACK MATRIX...'
  ]

  useEffect(() => {
    if (!data.cvText || !data.jobDescription) {
      router.push('/analysis')
      return
    }

    if (hasCalledApi.current) return
    hasCalledApi.current = true

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev
        return prev + 0.5
      })
    }, 50)

    const logInterval = setInterval(() => {
      setLogIndex(prev => (prev + 1) % logs.length)
    }, 1500)

    const runAnalysis = async () => {
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cvText: data.cvText,
            jobDescription: data.jobDescription
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.details || 'API_FAILURE')
        }

        const results = await response.json()
        
        // Update context with extracted job title and company
        setJobData({
          jobTitle: results.jobTitle,
          company: results.company
        })
        
        setResults(results)
        setProgress(100)
        
        setTimeout(() => {
          router.push('/analysis/feedback')
        }, 1000)
      } catch (error: unknown) {
        console.error(error)
        const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
        alert(`ANALYSIS_CRITICAL_FAILURE: ${message}`)
        router.push('/analysis')
      }
    }

    runAnalysis()

    return () => {
      clearInterval(interval)
      clearInterval(logInterval)
    }
  }, [data, router, setResults, setJobData, logs.length])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-sans">
      <section className="w-full max-w-4xl border border-outline-variant bg-surface-container-low p-6 relative">
        <div className="absolute -top-px -left-px w-2 h-2 border-t-2 border-l-2 border-primary"></div>
        <div className="absolute -top-px -right-px w-2 h-2 border-t-2 border-l-2 border-primary rotate-90"></div>
        <div className="absolute -bottom-px -left-px w-2 h-2 border-t-2 border-l-2 border-primary -rotate-90"></div>
        <div className="absolute -bottom-px -right-px w-2 h-2 border-t-2 border-l-2 border-primary rotate-180"></div>
        
        <div className="flex flex-col items-center gap-8 py-8">
          <div className="w-full space-y-6 px-8">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="font-mono text-[11px] text-primary uppercase tracking-[0.2em] font-bold">[ PROCESSING ]</span>
                <span className="font-mono text-[10px] text-on-surface-variant uppercase">Core_Thread_Active</span>
              </div>
              <div className="h-6 w-full border border-primary p-[2px] bg-surface-container-lowest">
                <div className="h-full bg-primary flex items-center px-2 overflow-hidden transition-all duration-300" style={{ width: `${progress}%` }}>
                  <div className="w-full h-[1px] bg-on-primary/30 animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <MetricBar label="ANALYZING_DATA_NODES" value="85%" color="text-tertiary" barColor="bg-tertiary/60" />
              <MetricBar label="HEURISTIC_MAPPING" value="ACTIVE" color="text-secondary" barColor="bg-secondary/60" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-mono text-[10px] text-on-surface-variant uppercase">[ NEURAL_SYNAPSE_LOAD ]</span>
                  <span className="font-mono text-[10px] text-primary font-bold">SYNC_OK</span>
                </div>
                <div className="h-2 w-full border border-outline-variant p-[1px] bg-surface-container-lowest flex gap-[2px]">
                  {[1,2,3,4,5].map(i => <div key={i} className="h-full w-2 bg-primary"></div>)}
                  {[1,2].map(i => <div key={i} className="h-full w-2 bg-primary/20"></div>)}
                </div>
              </div>
              <MetricBar label="IO_BUFFER_FLOW" value="OPTIMAL" color="text-on-surface-variant" barColor="bg-outline-variant" />
            </div>
          </div>

          <div className="w-full bg-surface-container-lowest border border-outline-variant">
            <div className="bg-surface-variant px-4 py-1 border-b border-outline-variant flex justify-between items-center">
              <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">Process_Log_Output</span>
              <span className="font-mono text-[10px] text-primary/60 font-bold">SYS_V2.4.0</span>
            </div>
            <div className="p-4 h-48 overflow-hidden font-mono text-sm text-on-surface-variant space-y-2 uppercase">
              {logs.slice(0, logIndex + 1).map((log, i) => (
                <p key={i} className={clsx("flex gap-2", i === logIndex ? "text-primary animate-pulse" : "text-primary/80")}>
                  <span className="text-primary">&gt;</span> {log}
                </p>
              ))}
              <p className="flex gap-2 animate-pulse"><span className="text-primary">&gt;</span> VECTORIZING CROSS-DOMAIN INSIGHTS...</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl font-mono text-[11px] uppercase">
        <ContextCard icon="account_circle" label="User_Context" title="SYS_ADMIN_01" sub="LEVEL_4_AUTH" subColor="text-tertiary" />
        <ContextCard icon="dataset" label="Target_Dataset" title="CANDIDATE_MATRIX.DB" sub="42.8 MB / 10,240 ENTRIES" subColor="text-on-surface-variant" />
        <ContextCard icon="lan" label="Network_Relay" title="EDGE_NODE_BETA" sub="LATENCY: 12ms" subColor="text-secondary" />
      </div>
    </div>
  )
}

function MetricBar({ label, value, color, barColor }: { label: string, value: string, color: string, barColor: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between font-mono text-[10px] text-on-surface-variant uppercase">
        <span>[ {label} ]</span>
        <span className={clsx(color, "font-bold")}>{value}</span>
      </div>
      <div className="h-2 w-full border border-outline-variant p-[1px] bg-surface-container-lowest">
        <div className={clsx("h-full transition-all duration-500", barColor)} style={{ width: value.includes('%') ? value : '100%' }}></div>
      </div>
    </div>
  )
}

function ContextCard({ icon, label, title, sub, subColor }: { icon: string, label: string, title: string, sub: string, subColor: string }) {
  return (
    <div className="border border-outline-variant p-4 flex flex-col gap-2 bg-surface">
      <span className="text-[11px] text-on-surface-variant uppercase">{label}</span>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-surface-variant flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
        </div>
        <div>
          <p className="text-sm text-on-surface uppercase font-bold">{title}</p>
          <p className={clsx("text-[10px] uppercase", subColor)}>{sub}</p>
        </div>
      </div>
    </div>
  )
}
