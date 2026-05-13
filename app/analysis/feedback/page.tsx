'use client'

import { useRouter } from 'next/navigation'
import { useAnalysis } from '@/components/AnalysisProvider'
import { clsx } from 'clsx'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { ResumePreview } from '@/components/ResumePreview'

// Dynamically import components to isolate potential hydration issues
const AnalysisDownloadButton = dynamic(
  () => import('@/components/AnalysisDownloadButton'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full bg-primary/20 text-primary py-3 font-mono text-sm font-bold flex items-center justify-center gap-2 uppercase opacity-50">
        <span className="material-symbols-outlined animate-spin">sync</span>
        INITIALIZING_MODULE...
      </div>
    )
  }
)

export default function AnalysisFeedbackPage() {
  const router = useRouter()
  const { data } = useAnalysis()
  const results = data.results
  const [isMounted, setIsMounted] = useState(false)
  const [isCVModalOpen, setIsCVModalOpen] = useState(false)

  // Ensure client-side rendering only
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true)
  }, [])

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center py-20 font-mono">
        <h2 className="text-primary text-xl mb-4 uppercase text-center">NO_DATA_STREAM_FOUND</h2>
        <button onClick={() => router.push('/analysis')} className="brutalist-button px-6">Return to Entry</button>
      </div>
    )
  }

  // Normalize scores to integers 0-100
  const aggregateScore = Math.round(results.aggregateScore > 1 ? results.aggregateScore : results.aggregateScore * 100)

  return (
    <div className="max-w-container-max mx-auto py-8 grid grid-cols-12 gap-6 font-sans">
      {/* Left Column: Global Score & Meta */}
      <aside className="col-span-12 lg:col-span-3 space-y-6">
        {/* Global Score */}
        <div className="border border-outline-variant bg-surface-container p-6 flex flex-col items-center justify-center text-center text-primary">
          <div className="font-mono text-[11px] uppercase text-on-surface-variant mb-4 tracking-widest leading-none">Aggregate_Match_Index</div>
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle className="text-outline-variant" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="2"></circle>
              <circle 
                className="text-primary transition-all duration-1000" 
                cx="80" 
                cy="80" 
                fill="transparent" 
                r="70" 
                stroke="currentColor" 
                strokeWidth="8"
                strokeDasharray="440"
                strokeDashoffset={440 - (440 * aggregateScore / 100)}
              ></circle>
            </svg>
            <div className="flex flex-col items-center">
              <span className="font-display text-[48px] text-primary leading-none">{aggregateScore}</span>
              <span className="font-mono text-[11px] text-on-surface-variant">/ 100</span>
            </div>
          </div>
          <div className="mt-6 w-full space-y-2">
            <div className="flex justify-between font-mono text-[11px] uppercase">
              <span className="text-on-surface-variant">STATUS:</span>
              <span className="text-primary font-bold">OPTIMIZED</span>
            </div>
            <div className="flex justify-between font-mono text-[11px] uppercase">
              <span className="text-on-surface-variant">CONFIDENCE:</span>
              <span className="text-primary font-bold">HIGH (0.89)</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border border-outline-variant bg-surface-container p-4 space-y-3">
          {/* New Generate CV Button */}
          <button 
            onClick={() => setIsCVModalOpen(true)}
            className="w-full bg-primary text-on-primary py-3 font-mono text-sm font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all uppercase"
          >
            <span className="material-symbols-outlined">description</span>
            GENERATE_CV.PREVIEW
          </button>

          {/* Report Download still available if needed, or we can remove it */}
          {isMounted && <AnalysisDownloadButton results={results} />}
          
          <button 
            onClick={() => router.push('/analysis')}
            className="w-full border border-primary text-primary py-3 font-mono text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/10 transition-all uppercase"
          >
            <span className="material-symbols-outlined">edit</span>
            RE_ANALYZE
          </button>
        </div>
      </aside>

      {/* Main Content: Persona Analysis */}
      <div className="col-span-12 lg:col-span-9 space-y-6">
        {/* Persona Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PersonaCard title="P_01 // ATS_ENGINE" score={results.ats.score} feedback={results.ats.feedback} />
          <PersonaCard title="P_02 // CAREER_HISTORIAN" score={results.career.score} feedback={results.career.feedback} />
          <PersonaCard title="P_03 // STRATEGIST_AI" score={results.strategist.score} feedback={results.strategist.feedback} />
        </div>

        {/* Detailed Feedback Section */}
        <div className="border border-outline-variant bg-surface-container">
          <div className="p-4 border-b border-outline-variant flex items-center justify-between">
            <h2 className="font-display text-2xl text-primary flex items-center gap-3 uppercase leading-none tracking-tight">
              <span className="material-symbols-outlined">analytics</span>
              DETAILED_FEEDBACK_MATRIX
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-container-high border-b border-outline-variant font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                  <th className="p-4 text-left font-bold">Parameter</th>
                  <th className="p-4 text-left font-bold">Status</th>
                  <th className="p-4 text-left font-bold">Findings_Stream</th>
                  <th className="p-4 text-right font-bold">Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-sm">
                {(results.matrix || []).map((row, i) => (
                  <TableRow 
                    key={i} 
                    parameter={row.parameter} 
                    status={row.status} 
                    findings={row.findings} 
                    impact={row.impact} 
                    isWarning={row.type === 'warning'} 
                    isNeutral={row.type === 'neutral'} 
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendation Card */}
        <div className="border border-outline-variant bg-surface-container p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2">
            <span className="material-symbols-outlined text-outline-variant/30 text-[64px]">emergency</span>
          </div>
          <div className="relative z-10">
            <h3 className="font-mono text-[11px] text-primary mb-2 uppercase tracking-widest font-bold">Priority_Recommendation</h3>
            <p className="text-base text-on-surface max-w-2xl leading-relaxed">
              {results.priorityRecommendation}
            </p>
          </div>
        </div>

        {/* Growth & Development Section */}
        <div className="border border-outline-variant bg-surface-container">
          <div className="p-4 border-b border-outline-variant flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">trending_up</span>
            <h2 className="font-display text-2xl text-primary uppercase leading-none tracking-tight">
              GROWTH_&_DEVELOPMENT_PROTOCOL
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="font-mono text-[13px] text-on-surface-variant uppercase font-bold border-l-2 border-primary pl-3">Strategic_Action_Plan</h3>
              <div className="bg-surface-container-low border border-outline-variant p-4 font-sans text-sm leading-relaxed text-on-surface whitespace-pre-line">
                {results.developmentPlan}
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="font-mono text-[13px] text-on-surface-variant uppercase font-bold border-l-2 border-primary pl-3">Skill_Acquisition_Matrix</h3>
              <div className="space-y-4">
                {(results.growthTips || []).map((tip: any, i: number) => (
                  <div key={i} className="border border-outline-variant bg-surface-container-high p-4 hover:border-primary/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-[11px] text-primary uppercase font-bold">{tip.area}</span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 text-[9px] font-bold uppercase">Target: {tip.skillToAcquire}</span>
                    </div>
                    <p className="text-[13px] text-on-surface mb-2 leading-snug">{tip.actionPlan}</p>
                    <div className="flex items-center gap-2 text-[10px] text-on-surface-variant font-mono">
                      <span className="material-symbols-outlined text-[14px]">insights</span>
                      IMPACT: {tip.longTermImpact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CV PREVIEW MODAL */}
      {isCVModalOpen && results.generatedCV && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-container-lowest/90 backdrop-blur-md px-4 py-8 overflow-y-auto">
          <div className="w-full max-w-4xl relative flex flex-col gap-4">
            <div className="flex justify-between items-center text-primary font-mono text-sm font-bold uppercase tracking-widest bg-surface border border-outline-variant p-4">
              <span>[ CV_PREVIEW_MODULE_v4.0 ] // {results.generatedCV.name}</span>
              <button 
                onClick={() => setIsCVModalOpen(false)}
                className="hover:text-white transition-colors"
              >
                [ CLOSE_SESSION ]
              </button>
            </div>
            <div className="flex-grow">
              <ResumePreview resume={results.generatedCV} />
            </div>
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => window.print()}
                className="bg-primary text-on-primary font-mono text-sm font-bold px-8 py-3 uppercase flex items-center gap-2 hover:brightness-110"
              >
                <span className="material-symbols-outlined">print</span>
                SEND_TO_PRINTER
              </button>
              <button 
                onClick={() => setIsCVModalOpen(false)}
                className="border border-outline text-on-surface-variant font-mono text-sm font-bold px-8 py-3 uppercase hover:bg-surface-variant"
              >
                RETURN_TO_MATRIX
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PersonaCard({ title, score, feedback }: { title: string, score: number, feedback: string[] }) {
  const normalizedScore = Math.round(score > 1 ? score : score * 100)

  return (
    <div className="border border-outline-variant bg-surface-container-low flex flex-col h-full">
      <div className="p-3 bg-surface-variant border-b border-outline-variant flex justify-between items-center">
        <span className="font-mono text-[11px] text-on-surface-variant uppercase font-bold">{title}</span>
        <span className="text-primary font-mono text-sm font-bold">{normalizedScore}%</span>
      </div>
      <div className="p-4 flex-grow space-y-4">
        <div className="space-y-3">
          {(feedback || []).map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className={clsx("material-symbols-outlined text-[16px] mt-0.5", (item.toLowerCase().includes('optimal') || item.toLowerCase().includes('standard') || item.toLowerCase().includes('strong') || item.toLowerCase().includes('clear')) ? 'text-primary' : 'text-error')}>
                {(item.toLowerCase().includes('optimal') || item.toLowerCase().includes('standard') || item.toLowerCase().includes('strong') || item.toLowerCase().includes('clear')) ? 'check_circle' : 'cancel'}
              </span>
              <p className="text-sm text-on-surface leading-tight font-sans">{item}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="p-3 border-t border-outline-variant bg-surface-container-lowest">
        <div className="h-1 bg-outline-variant w-full overflow-hidden">
          <div className="h-full bg-primary" style={{ width: `${normalizedScore}%` }}></div>
        </div>
      </div>
    </div>
  )
}

function TableRow({ parameter, status, findings, impact, isWarning = false, isNeutral = false }: {
  parameter: string
  status: string
  findings: string
  impact: string
  isWarning?: boolean
  isNeutral?: boolean
}) {
  return (
    <tr className="hover:bg-surface-variant transition-colors group">
      <td className="p-4 font-mono text-primary font-bold text-[13px]">{parameter}</td>
      <td className="p-4">
        <span className={clsx(
          "px-2 py-0.5 border text-[10px] font-bold uppercase",
          isWarning ? "bg-error-container text-on-error-container border-error/50" : 
          isNeutral ? "bg-surface-variant text-on-surface-variant border-outline-variant" : 
          "bg-primary/20 text-primary border-primary/50"
        )}>
          {status}
        </span>
      </td>
      <td className="p-4 text-on-surface text-sm font-sans">{findings}</td>
      <td className={clsx("p-4 text-right font-mono text-sm font-bold", isWarning ? "text-error" : isNeutral ? "text-on-surface-variant" : "text-primary")}>
        {impact}
      </td>
    </tr>
  )
}
