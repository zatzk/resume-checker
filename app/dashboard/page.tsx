'use client'

import Link from 'next/link'
import { dashboardData } from '@/lib/mockData'
import { useAnalysis } from '@/components/AnalysisProvider'

export default function DashboardPage() {
  const { data } = useAnalysis()
  const latestResult = data.results

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 font-sans">
      {/* Column 1 (approx 70%) */}
      <div className="space-y-6">
        {/* 2. ANALYZE_MATCH (Compact Action Module) */}
        <section className="brutalist-card border-outline-variant flex flex-col group p-0">
          <div className="bg-surface-variant/50 px-4 py-2 border-b border-outline-variant flex justify-between items-center">
            <span className="font-mono text-[11px] text-primary uppercase tracking-widest font-bold">DIAGNOSTIC_MODULE_v2.1</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-primary"></div>
              <div className="w-2 h-2 bg-outline-variant"></div>
            </div>
          </div>
          <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 space-y-2">
              <h2 className="font-display text-2xl text-primary uppercase leading-none">Analyze_Match</h2>
              <p className="text-on-surface-variant text-sm max-w-xl">
                Heuristic analysis on existing CV data. Identifies logic gaps and ATS compatibility.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link href="/analysis" className="brutalist-button-primary px-8 py-3 min-w-[140px]">
                <span>Enter</span>
                <span className="material-symbols-outlined text-[18px]">terminal</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 3. CV LIBRARY (Single Column List) */}
        <section className="flex flex-col gap-4">
          <div className="flex items-end justify-between border-b border-outline-variant pb-2">
            <h2 className="font-display text-2xl text-primary uppercase leading-none">CV Library</h2>
            <span className="font-mono text-[11px] text-on-surface-variant uppercase">LOCAL_STORAGE_INDEX: 004</span>
          </div>
          <div className="space-y-2">
            {/* Dynamic Result from Analysis Context */}
            {latestResult && (
              <div className="brutalist-card border-primary hover:bg-primary/5 transition-colors flex flex-col md:flex-row md:items-center gap-4 p-4 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-[10px] text-primary block mb-1 uppercase font-bold tracking-widest">[ LATEST_ANALYSIS ]</span>
                  <h3 className="font-mono font-bold uppercase text-on-surface truncate">
                    {latestResult.jobTitle || data.jobTitle || 'Analysis Result'}
                  </h3>
                  {latestResult.company && (
                    <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-tighter">
                      Target: {latestResult.company}
                    </p>
                  )}
                </div>
                <div className="flex flex-col md:flex-row gap-6 items-center md:w-[60%]">
                  <div className="w-full space-y-1">
                    <div className="flex justify-between text-[10px] font-mono uppercase">
                      <span className="text-primary font-bold">Match Index</span>
                      <span className="text-primary font-bold">{latestResult.aggregateScore}%</span>
                    </div>
                    <div className="w-full h-1 bg-surface-variant">
                      <div className="h-1 bg-primary transition-all duration-1000" style={{ width: `${latestResult.aggregateScore}%` }}></div>
                    </div>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto shrink-0 justify-between md:justify-end">
                    <Link 
                      href="/analysis/feedback"
                      className="flex items-center gap-2 border border-primary text-primary px-3 py-1 text-[11px] font-mono uppercase hover:bg-primary hover:text-on-primary transition-colors font-bold"
                    >
                      View Report
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {dashboardData.recentCVs.map((cv) => (
              <div key={cv.id} className="brutalist-card border-outline-variant hover:border-secondary transition-colors flex flex-col md:flex-row md:items-center gap-4 p-4 opacity-80">
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-[10px] text-on-surface-variant block mb-1 uppercase">ID: {cv.id}</span>
                  <h3 className="font-mono font-bold uppercase text-on-surface truncate">{cv.role}</h3>
                </div>
                <div className="flex flex-col md:flex-row gap-6 items-center md:w-[60%]">
                  <div className="w-full space-y-1">
                    <div className="flex justify-between text-[10px] font-mono uppercase tracking-tighter">
                      <span className="text-outline">ATS Score</span>
                      <span className="text-primary">{cv.atsScore}%</span>
                    </div>
                    <div className="w-full h-1 bg-surface-variant">
                      <div className="h-1 bg-primary" style={{ width: `${cv.atsScore}%` }}></div>
                    </div>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto shrink-0 justify-between md:justify-start">
                    <div className="flex flex-col text-[10px] font-mono uppercase items-center min-w-[60px]">
                      <span className="text-outline">Analyst</span>
                      <span className="text-secondary">{cv.analystRating}</span>
                    </div>
                    <div className="flex flex-col text-[10px] font-mono uppercase items-center min-w-[60px]">
                      <span className="text-outline">Strategist</span>
                      <span className="text-tertiary">{cv.strategistRank.split('/')[0]}</span>
                    </div>
                    <div className="flex items-center text-outline hover:text-primary cursor-pointer">
                      <span className="material-symbols-outlined">more_vert</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* INITIALIZE NEW INSTANCE placeholder */}
            <div className="border border-dashed border-outline-variant p-4 flex flex-row items-center justify-center text-center gap-3 group cursor-pointer hover:bg-surface-variant/20 transition-colors">
              <span className="material-symbols-outlined text-outline group-hover:text-primary">add_circle</span>
              <span className="font-mono text-[11px] text-outline uppercase group-hover:text-primary tracking-widest font-bold">Initialize New Instance</span>
            </div>
          </div>
        </section>
      </div>

      {/* Column 2 (approx 30%) */}
      <div className="space-y-6">
        {/* 5. ACTIVITY LOG */}
        <section className="brutalist-card border-outline-variant p-0 sticky top-24">
          <div className="bg-surface-variant/50 px-4 py-2 border-b border-outline-variant flex justify-between items-center">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">30D_DENSITY</span>
            <span className="font-mono text-[10px] text-secondary font-bold">ACTIVE</span>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-1.5 justify-center">
              {dashboardData.heatmapData.slice(0, 14).map((col, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  {col.map((intensity, j) => (
                    <div 
                      key={j} 
                      className={`w-3 h-3 ${
                        intensity > 0.8 ? 'bg-primary' : 
                        intensity > 0.5 ? 'bg-primary/40' : 
                        intensity > 0.2 ? 'bg-primary/10' : 
                        'bg-surface-variant'
                      }`}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-2 font-mono text-[10px] text-outline uppercase">
              <div className="flex justify-between">
                <span>2024-OCT-15</span>
                <span>TODAY</span>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2 border-t border-outline-variant/30">
                <span>Density:</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-surface-variant"></div>
                  <div className="w-2 h-2 bg-primary/20"></div>
                  <div className="w-2 h-2 bg-primary/60"></div>
                  <div className="w-2 h-2 bg-primary"></div>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-3 font-mono">
              <div className="bg-surface-container-low border border-outline-variant/50 p-3">
                <div className="text-[10px] text-on-surface-variant uppercase mb-1">Last Update</div>
                <div className="text-sm text-primary font-bold uppercase">T-04:22:01</div>
              </div>
              <div className="bg-surface-container-low border border-outline-variant/50 p-3">
                <div className="text-[10px] text-on-surface-variant uppercase mb-1">System Load</div>
                <div className="text-sm text-secondary font-bold uppercase">Optimal</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
