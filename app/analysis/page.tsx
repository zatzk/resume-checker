'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAnalysis } from '@/components/AnalysisProvider'

export default function AnalysisEntryPage() {
  const router = useRouter()
  const { setJobData } = useAnalysis()
  const [jobDescription, setJobDescription] = useState('')

  const handleExecute = () => {
    if (!jobDescription.trim()) {
      alert('REQUIRED: Please paste the job description text.')
      return
    }
    setJobData({ jobDescription })
    router.push('/analysis/loading')
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 font-sans">
      {/* Header */}
      <div className="w-full max-w-4xl mb-8 flex justify-between items-end border-b border-outline-variant pb-3">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] text-primary uppercase tracking-widest leading-none font-bold">[ MASTER_CV_CONNECTED ]</span>
          <h1 className="font-display text-4xl text-on-surface uppercase leading-none">CV Tailor Protocol</h1>
        </div>
        <div className="text-right hidden md:block font-mono text-xs text-on-surface-variant uppercase">
          <span>SOURCE: curriculum.md</span>
        </div>
      </div>

      {/* Main Input Form */}
      <div className="w-full max-w-4xl border border-outline-variant bg-surface-container p-6 space-y-6">
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs text-primary uppercase font-bold tracking-widest">
            01. PASTE TARGET JOB APPLICATION / DESCRIPTION (PLAIN TEXT)
          </label>
          <p className="text-xs text-on-surface-variant">
            Paste the job requirements, responsibilities, or role specifications below. The system will analyze fit, select relevant experience bullets from your master CV (`curriculum.md`), run a reviewer critique, and generate a tailored American-style CV PDF.
          </p>
        </div>

        <textarea
          className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary text-on-surface font-mono p-4 text-xs leading-relaxed min-h-[320px] outline-none transition-colors placeholder:text-outline/40"
          placeholder="Paste job posting text here (e.g., qualifications, responsibilities, technical stack)..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <div className="flex items-center justify-between border-t border-outline-variant pt-4">
          <span className="font-mono text-[11px] text-outline uppercase">
            {jobDescription.length} CHARS IN BUFFER
          </span>
          <button
            onClick={handleExecute}
            className="bg-[#FFB300] hover:bg-primary-container text-on-primary-container font-mono text-xs font-bold px-8 py-3.5 uppercase flex items-center gap-2 transition-all active:scale-[0.98]"
          >
            <span>TAILOR CV & GENERATE PDF</span>
            <span className="material-symbols-outlined text-sm">bolt</span>
          </button>
        </div>
      </div>
    </div>
  )
}
