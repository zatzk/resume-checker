'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAnalysis, ContentStatus } from '@/components/AnalysisProvider'
import { clsx } from 'clsx'

export default function AnalysisEntryPage() {
  const router = useRouter()
  const { setCVText, data, setContentCheck } = useAnalysis()
  const [inputText, setInputText] = useState(data.cvText)
  const [isExtracting, setIsExtracting] = useState(false)

  // Stable heuristic content checker
  useEffect(() => {
    const text = inputText.toLowerCase()
    
    const check: ContentStatus = {
      personalInfo: text.length > 10 && (text.includes('name') || /([a-z]+ [a-z]+)/.test(text)),
      experience: text.includes('experience') || text.includes('position') || text.includes('company') || text.includes('201') || text.includes('202'),
      education: text.includes('education') || text.includes('university') || text.includes('bachelor') || text.includes('degree'),
      skills: text.includes('skills') || text.includes('tech') || text.includes('tools') || text.length > 50,
      metrics: /\d+%/.test(text) || text.includes('increased') || text.includes('reduced') || text.includes('saved'),
      contact: text.includes('@') || /\d{3}/.test(text) || text.includes('linkedin'),
      languages: text.includes('language') || text.includes('english') || text.includes('native') || text.includes('fluent'),
      certifications: text.includes('cert') || text.includes('course') || text.includes('license')
    }

    setContentCheck(check)
  }, [inputText, setContentCheck])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsExtracting(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('EXTRACTION_FAILED')

      const result = await response.json()
      if (result.text) {
        setInputText(result.text)
        setCVText(result.text)
      }
    } catch (error) {
      console.error(error)
      alert('FILE_INGESTION_ERROR: Unable to parse document.')
    } finally {
      setIsExtracting(false)
    }
  }

  const handleExecute = () => {
    if (!inputText.trim()) {
      alert('REQUIRED: SOURCE_DATA_BUFFER_EMPTY')
      return
    }
    setCVText(inputText)
    router.push('/analysis/new')
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* System Status Header */}
      <div className="w-full max-w-5xl mb-8 flex justify-between items-end border-b border-outline-variant pb-2">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] text-primary uppercase tracking-widest leading-none font-bold">[ SYSTEM_READY ]</span>
          <h1 className="font-display text-4xl text-on-surface uppercase leading-none">Analysis Entry Path</h1>
        </div>
        <div className="text-right hidden md:block">
          <span className="font-mono text-sm text-on-surface-variant uppercase">NODE_04 // CV_PARSER_V2.1</span>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Card A: RESUME_CONTENT_CHECKER */}
        <section className="group bg-surface-container border border-outline-variant hover:border-primary transition-all duration-200 flex flex-col">
          <div className="bg-surface-variant border-b border-outline-variant px-4 py-2 flex justify-between items-center">
            <span className="font-mono text-sm text-primary font-bold uppercase">RESUME_CONTENT_CHECKER</span>
            <span className="w-2 h-2 bg-primary"></span>
          </div>
          <div className="p-6 flex flex-col gap-4 overflow-y-auto">
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-2">
              Validate document structure against standard industrial parsing protocols. Ensure all required metadata fields are populated.
            </p>
            
            <div className="flex flex-col gap-2 font-mono text-sm uppercase">
              <CheckItem label="Personal Information" ok={data.contentCheck.personalInfo} />
              <CheckItem label="Professional Experience" ok={data.contentCheck.experience} />
              <CheckItem label="Academic Background" ok={data.contentCheck.education} />
              <CheckItem label="Technical Skills" ok={data.contentCheck.skills} />
              <CheckItem label="Achievements with Metrics" ok={data.contentCheck.metrics} />
              <CheckItem label="Contact" ok={data.contentCheck.contact} />
              <CheckItem label="Languages" ok={data.contentCheck.languages} />
              <CheckItem label="Certifications (Optional)" ok={data.contentCheck.certifications} />
            </div>
          </div>
          <div className="mt-auto border-t border-outline-variant px-6 py-4 opacity-50">
            <div className="flex justify-between font-mono text-[11px] text-on-surface-variant uppercase">
              <span>Compliance_Scan</span>
              <span>Level_03_Verified</span>
            </div>
          </div>
        </section>

        {/* Card B: INITIATE_NEW_STREAM */}
        <section className="group bg-surface-container border border-outline-variant hover:border-secondary transition-all duration-200">
          <div className="bg-surface-variant border-b border-outline-variant px-4 py-2 flex justify-between items-center">
            <span className="font-mono text-sm text-secondary font-bold uppercase">INITIATE_NEW_STREAM</span>
            <span className="w-2 h-2 bg-secondary"></span>
          </div>
          <div className="p-6 flex flex-col gap-6">
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              Input new source data for processing. System supports direct file ingestion or manual text buffer injection for real-time analysis.
            </p>
            <div className="flex flex-col gap-3">
              <div className="relative group/upload">
                <input 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  id="file-upload" 
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  disabled={isExtracting}
                />
                <label 
                  className={clsx(
                    "w-full border border-secondary text-on-surface bg-secondary/5 hover:bg-secondary/10 flex items-center justify-between px-4 py-3 transition-colors cursor-pointer",
                    isExtracting && "opacity-50 cursor-wait"
                  )}
                  htmlFor="file-upload"
                >
                  <div className="flex items-center gap-3 font-mono text-sm uppercase">
                    <span className={clsx("material-symbols-outlined text-secondary", isExtracting && "animate-spin")}>
                      {isExtracting ? 'sync' : 'upload_file'}
                    </span>
                    <span>{isExtracting ? 'PARSING_DOCUMENT...' : 'UPLOAD_SOURCE (PDF)'}</span>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-sm">add</span>
                </label>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[11px] text-on-surface-variant uppercase tracking-widest font-bold">Manual_Buffer_Input</label>
                <textarea 
                  className="brutalist-input w-full h-32 placeholder:text-outline-variant font-mono" 
                  placeholder="PASTE_SOURCE_TEXT_HERE..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button 
                  onClick={handleExecute}
                  disabled={isExtracting}
                  className="w-full bg-secondary text-on-secondary font-mono text-sm font-bold py-3 hover:bg-secondary-container transition-colors uppercase tracking-tight text-center disabled:opacity-50"
                >
                  ENTER
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Documentation */}
      <div className="w-full max-w-5xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-outline-variant pt-6 opacity-60">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] text-primary uppercase font-bold tracking-widest">Security_Protocol</span>
          <p className="font-mono text-[12px] leading-tight uppercase">All uploads are encrypted via AES-256 and purged after session timeout.</p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] text-primary uppercase font-bold tracking-widest">Engine_Version</span>
          <p className="font-mono text-[12px] leading-tight uppercase">CAREEROS_CORE_PARSER_V4.0 // BUILD_8829</p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] text-primary uppercase font-bold tracking-widest">Connectivity</span>
          <p className="font-mono text-[12px] leading-tight uppercase">LATENCY: 12ms // STATUS: OPTIMAL</p>
        </div>
      </div>
    </div>
  )
}

function CheckItem({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-outline-variant/30">
      <span className={clsx("uppercase transition-colors", ok ? "text-on-surface" : "text-on-surface-variant")}>
        {label}
      </span>
      <span className={clsx("font-bold tracking-tighter", ok ? "text-primary" : "text-outline opacity-40")}>
        {ok ? "[ OK ]" : "[ MISSING ]"}
      </span>
    </div>
  )
}
