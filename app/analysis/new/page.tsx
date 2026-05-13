'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAnalysis } from '@/components/AnalysisProvider'

export default function NewAnalysisApplicationPage() {
  const router = useRouter()
  const { setJobData, data } = useAnalysis()
  
  const [jobDescription, setJobDescription] = useState(data.jobDescription)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!jobDescription.trim()) {
      alert('REQUIRED: FIELD_VALIDATION_FAILURE')
      return
    }
    // Only jobDescription is necessary now, we can clear or keep others
    setJobData({ jobDescription })
    router.push('/analysis/loading')
  }

  return (
    <div className="flex-grow flex flex-col font-sans">
      <main className="flex-grow max-w-container-max mx-auto w-full grid grid-cols-12 gap-6 pb-20">
        {/* LEFT PANEL: NAVIGATION & CONTEXT */}
        <aside className="col-span-12 md:col-span-3 brutalist-card h-fit border-outline-variant bg-surface">
          <div className="flex items-center gap-2 mb-6 border-b border-outline-variant pb-2">
            <div className="w-2 h-2 bg-primary"></div>
            <span className="font-mono text-sm uppercase tracking-widest text-primary font-bold">LAB_PROTOCOL</span>
          </div>
          <div className="space-y-4">
            <div className="group cursor-pointer">
              <p className="font-mono text-[11px] text-outline mb-1 uppercase tracking-tighter">CURRENT_SESSION</p>
              <p className="font-mono text-sm text-on-surface uppercase">JOB_ANALYSIS_092</p>
            </div>
            <div className="group">
              <p className="font-mono text-[11px] text-outline mb-1 uppercase tracking-tighter">MODULE_STATUS</p>
              <p className="font-mono text-sm text-secondary flex items-center gap-2 uppercase">
                <span className="w-1.5 h-1.5 bg-secondary"></span>
                WAITING_FOR_INPUT
              </p>
            </div>
            <div className="pt-4 border-t border-outline-variant">
              <ul className="space-y-2 font-mono text-sm uppercase">
                <li className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-[16px]">terminal</span> 
                  DATA_ENTRY
                </li>
                <li className="flex items-center gap-2 text-on-surface-variant opacity-50">
                  <span className="material-symbols-outlined text-[16px]">biotech</span> 
                  SEMANTIC_PARSE
                </li>
                <li className="flex items-center gap-2 text-on-surface-variant opacity-50">
                  <span className="material-symbols-outlined text-[16px]">monitoring</span> 
                  MARKET_CORRELATION
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* CENTER PANEL: DATA ENTRY FORM */}
        <section className="col-span-12 md:col-span-9 space-y-6">
          {/* FORM HEADER */}
          <div className="relative border border-outline-variant bg-surface p-6">
            <div className="absolute top-0 right-0 p-2 opacity-20">
              <span className="font-mono text-[11px] uppercase tracking-tighter">FORM_11_REV_E</span>
            </div>
            <h1 className="font-display text-4xl text-on-surface uppercase mb-2 leading-none">NEW ANALYSIS_APPLICATION</h1>
            <p className="text-sm text-on-surface-variant max-w-2xl">Enter raw job parameters to initiate the deep-scan protocol. System requires precise formatting for Company and Salary vectors to ensure parity across existing profile data.</p>
          </div>

          {/* FORM FIELDS GRID */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-px bg-outline-variant border border-outline-variant shadow-2xl">
            {/* JOB DESCRIPTION ONLY */}
            <div className="bg-surface p-6 focus-within:bg-surface-container-high transition-colors">
              <label className="block font-mono text-[11px] text-primary uppercase mb-2 font-bold tracking-widest leading-none">01. SPECIFICATION_DATA (JOB_DESCRIPTION / REQUIREMENTS)</label>
              <textarea 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary-container text-on-surface font-mono px-4 py-3 outline-none transition-all placeholder:text-outline/40 resize-none min-h-[400px]" 
                placeholder="PASTE_RAW_REQUIREMENTS_DATA_HERE..." 
              />
              <div className="flex justify-between mt-2 font-mono text-[11px] text-outline uppercase tracking-tighter">
                <span>READY_FOR_BUFFER_STREAM</span>
                <span>{jobDescription.length} / 50,000 CHARS</span>
              </div>
            </div>
            {/* PRIMARY ACTION */}
            <div className="bg-surface p-6 flex justify-end">
              <button 
                className="bg-[#FFB300] hover:bg-primary-container text-on-primary-container font-mono text-sm font-bold px-8 py-3 uppercase flex items-center gap-2 transition-all active:scale-[0.98]" 
                type="submit"
              >
                <span>PROCEED_TO_ANALYSIS</span>
                <span className="material-symbols-outlined text-[18px]">bolt</span>
              </button>
            </div>
          </form>

          {/* DECORATIVE DATA VIS */}
          <div className="grid grid-cols-3 gap-6 opacity-40">
            <div className="h-1 bg-outline-variant"></div>
            <div className="h-1 bg-primary"></div>
            <div className="h-1 bg-outline-variant"></div>
          </div>
        </section>
      </main>

      {/* SYSTEM STATUS FOOTER */}
      <footer className="fixed bottom-0 w-full z-40 bg-surface-container border-t border-outline-variant h-10 flex items-center px-4 md:px-8 justify-between font-mono text-[11px] uppercase">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="text-primary font-bold">[SYSTEM_READY]</span>
            <div className="flex items-center gap-2 text-outline border-l border-outline-variant pl-4">
              <span>CPU: 67%</span>
              <div className="w-12 h-1 bg-outline-variant"><div className="h-full bg-secondary w-2/3"></div></div>
            </div>
            <div className="flex items-center gap-2 text-outline border-l border-outline-variant pl-4">
              <span>BUF: 24%</span>
              <div className="w-12 h-1 bg-outline-variant"><div className="h-full bg-tertiary w-1/4"></div></div>
            </div>
            <div className="flex items-center gap-2 text-outline border-l border-outline-variant pl-4">
              <span>LNK: 92%</span>
              <div className="w-12 h-1 bg-outline-variant"><div className="h-full bg-primary w-5/6"></div></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-outline">
            <span className="material-symbols-outlined text-[14px]">history</span>
            <span>SYNC_STABLE</span>
          </div>
          <div className="text-primary font-bold">V3.11.0_LATEST</div>
        </div>
      </footer>
    </div>
  )
}
