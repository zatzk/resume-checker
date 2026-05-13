'use client'

import { PDFDownloadLink } from '@react-pdf/renderer'
import { AnalysisReportPDF } from './AnalysisReportPDF'
import { AnalysisData, AnalysisResults } from './AnalysisProvider'
import { useEffect, useState } from 'react'

export default function AnalysisDownloadButton({ results }: { data?: AnalysisData; results: AnalysisResults }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="w-full bg-primary/20 text-primary py-3 font-mono text-sm font-bold flex items-center justify-center gap-2 uppercase opacity-50">
        <span className="material-symbols-outlined animate-spin">sync</span>
        INITIALIZING_PDF...
      </div>
    )
  }

  return (
    <PDFDownloadLink
      document={<AnalysisReportPDF results={results} />}
      fileName={`ANALYSIS_REPORT_${(results.company || 'JOB').toUpperCase().replace(/\s+/g, '_')}.pdf`}
      className="w-full bg-primary text-on-primary py-3 font-mono text-sm font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all uppercase"
    >
      {({ loading }) => (
        <>
          <span className="material-symbols-outlined">{loading ? 'sync' : 'download'}</span>
          {loading ? 'GENERATING...' : 'GENERATE_REPORT.PDF'}
        </>
      )}
    </PDFDownloadLink>
  )
}
