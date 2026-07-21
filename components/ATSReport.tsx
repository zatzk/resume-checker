'use client'

import { ATSReport as ATSReportType } from '@/lib/latex-compiler'

export function ATSReportView({ report }: { report?: ATSReportType }) {
  if (!report) return null

  return (
    <div className="brutalist-card border-outline-variant bg-surface-container-low p-4 font-mono text-xs space-y-3">
      <div className="flex justify-between items-center border-b border-outline-variant pb-2">
        <span className="font-bold text-primary uppercase tracking-wider flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">fact_check</span>
          ATS PDF Text-Layer Verification
        </span>
        <span className="text-[10px] text-on-surface-variant uppercase">
          PAGES: {report.pageCount} / 2 ENFORCED
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className={`border p-2 flex items-center gap-2 ${report.passChecks.cleanExtraction ? 'border-secondary text-secondary bg-secondary/10' : 'border-error text-error'}`}>
          <span>{report.passChecks.cleanExtraction ? '✔' : '✖'}</span>
          <span>Clean Text Layer</span>
        </div>
        <div className={`border p-2 flex items-center gap-2 ${report.passChecks.contactDetailsVisible ? 'border-secondary text-secondary bg-secondary/10' : 'border-error text-error'}`}>
          <span>{report.passChecks.contactDetailsVisible ? '✔' : '✖'}</span>
          <span>Literal Contact Text</span>
        </div>
        <div className={`border p-2 flex items-center gap-2 ${report.passChecks.pageCountEnforced ? 'border-secondary text-secondary bg-secondary/10' : 'border-error text-error'}`}>
          <span>{report.passChecks.pageCountEnforced ? '✔' : '✖'}</span>
          <span>Strict Page Bound</span>
        </div>
      </div>

      {report.keywordCoverage && report.keywordCoverage.length > 0 && (
        <div className="pt-2">
          <span className="text-[10px] text-on-surface-variant uppercase block mb-1">Target Keyword Match Rate</span>
          <div className="flex flex-wrap gap-1">
            {report.keywordCoverage.map((item, idx) => (
              <span
                key={idx}
                className={`px-2 py-0.5 text-[10px] border uppercase font-bold ${item.matched ? 'border-primary text-primary bg-primary/10' : 'border-outline-variant text-outline opacity-50'}`}
              >
                {item.keyword} {item.matched ? '✔' : '✖'}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
