'use client'

import { useState, useEffect, useMemo } from 'react'
import { clsx } from 'clsx'
import { ATSReportView } from '@/components/ATSReport'
import { PDFPreviewModal } from '@/components/PDFPreviewModal'
import { ATSReport } from '@/lib/latex-compiler'

export interface DBApplication {
  id: string
  company: string
  role: string
  status: string
  salaryRange?: string
  link?: string
  requirements?: string
  notes?: string
  createdAt: string
  cvs?: {
    id: string
    name: string
    type: string
    content: string
    createdAt: string
  }[]
}

export default function TrackerPage() {
  const [apps, setApps] = useState<DBApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedApp, setSelectedApp] = useState<DBApplication | null>(null)

  // Package generation state
  const [generatingId, setGeneratingId] = useState<string | null>(null)

  // PDF Preview Modal state
  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: ''
  })

  // Add application form state
  const [newCompany, setNewCompany] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newSalary, setNewSalary] = useState('')
  const [newLink, setNewLink] = useState('')
  const [newRequirements, setNewRequirements] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchApps = async () => {
    try {
      const res = await fetch('/api/applications')
      if (res.ok) {
        const data = await res.json()
        setApps(data)
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApps()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesSearch =
        app.role.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        app.company.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchesStatus =
        statusFilter === 'ALL' || app.status.replace(/_/g, ' ') === statusFilter.replace(/_/g, ' ')
      return matchesSearch && matchesStatus
    })
  }, [apps, debouncedSearch, statusFilter])

  const handleAddApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCompany.trim() || !newRole.trim()) {
      alert('Company Name and Role Title are required.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: newCompany,
          role: newRole,
          salaryRange: newSalary,
          link: newLink,
          requirements: newRequirements
        })
      })
      if (res.ok) {
        setIsAddModalOpen(false)
        setNewCompany('')
        setNewRole('')
        setNewSalary('')
        setNewLink('')
        setNewRequirements('')
        await fetchApps()
      } else {
        alert('Failed to add application card.')
      }
    } catch (err) {
      console.error(err)
      alert('Error creating application card.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string, company: string) => {
    if (confirm(`INITIALIZE_PURGE: Delete application for ${company}?`)) {
      try {
        const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' })
        if (res.ok) {
          setApps((prev) => prev.filter((a) => a.id !== id))
        }
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleGeneratePackage = async (appId: string) => {
    setGeneratingId(appId)
    try {
      const res = await fetch(`/api/applications/${appId}/generate`, { method: 'POST' })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.details || 'Generation failed')
      }
      await fetchApps()
      alert('Application package (Tailored CV PDF + Cover Letter PDF + ATS Verification) generated successfully!')
    } catch (err: unknown) {
      console.error(err)
      const msg = err instanceof Error ? err.message : 'UNKNOWN_ERROR'
      alert(`PACKAGE_GENERATION_ERROR: ${msg}`)
    } finally {
      setGeneratingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 font-mono text-primary">
        <span className="material-symbols-outlined animate-spin mr-2">sync</span>
        LOADING_APPLICATION_TRACKER...
      </div>
    )
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header Actions Section */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-outline-variant pb-4 gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-4xl text-primary uppercase tracking-tight leading-none">
            ACTIVE_APPLICATIONS_TRACKER
          </h1>
          <p className="font-mono text-sm text-on-surface-variant uppercase tracking-tighter">
            NODE: PRISMA_DB // CARDS: {apps.length} ACTIVE
          </p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="brutalist-button-primary group">
          <span className="material-symbols-outlined">add_box</span>
          <span className="font-mono font-bold uppercase text-sm">Add New Application</span>
        </button>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Filter Sidebar */}
        <aside className="col-span-12 lg:col-span-3 space-y-6">
          <div className="brutalist-card bg-surface-container-low border-outline-variant">
            <h3 className="font-mono text-sm font-bold text-primary mb-4 border-b border-outline-variant pb-2 flex items-center justify-between uppercase">
              FILTERS.EXE
              <span className="material-symbols-outlined text-sm">filter_list</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-mono uppercase text-on-surface-variant mb-2 block tracking-widest">
                  Search_Query
                </label>
                <input
                  className="brutalist-input w-full text-xs font-mono"
                  placeholder="SEARCH ROLE OR COMPANY..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase text-on-surface-variant block tracking-widest">
                  Status_Flags
                </label>
                <div className="flex flex-wrap gap-2">
                  {['ALL', 'CV_SENT', 'RECEIVED', 'INTERVIEW', 'REJECTED', 'HIRED'].map((status) => (
                    <span
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={clsx(
                        'border px-2 py-1 text-[11px] font-mono cursor-pointer transition-colors uppercase',
                        statusFilter === status
                          ? 'bg-surface-variant text-primary border-primary font-bold'
                          : 'border-outline-variant text-on-surface-variant hover:border-primary'
                      )}
                    >
                      {status}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Application Cards Column */}
        <main className="col-span-12 lg:col-span-9 space-y-6">
          {filteredApps.length === 0 ? (
            <div className="brutalist-card p-12 text-center font-mono text-on-surface-variant border-dashed">
              NO_APPLICATIONS_MATCH_FILTER
            </div>
          ) : (
            filteredApps.map((app) => {
              const hasGeneratedCv = app.cvs && app.cvs.length > 0
              const latestCv = hasGeneratedCv ? app.cvs![app.cvs!.length - 1] : null
              let parsedContent: { atsReport?: ATSReport } | null = null
              if (latestCv) {
                try {
                  parsedContent = JSON.parse(latestCv.content)
                } catch {
                  parsedContent = null
                }
              }

              return (
                <div
                  key={app.id}
                  className="brutalist-card border-outline-variant bg-surface-container hover:border-primary transition-all p-6 space-y-4 relative"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-outline-variant pb-3 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-2xl text-on-surface uppercase leading-none">{app.role}</h3>
                        <span className="font-mono text-[10px] bg-primary/10 text-primary px-2 py-0.5 border border-primary/30 uppercase font-bold">
                          {app.status}
                        </span>
                      </div>
                      <p className="font-mono text-xs text-primary font-bold uppercase mt-1">@ {app.company}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(app.id, app.company)}
                        className="text-error hover:underline font-mono text-xs uppercase"
                      >
                        PURGE
                      </button>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-on-surface-variant">
                    {app.salaryRange && (
                      <div>
                        <span className="text-[10px] uppercase text-outline block">Salary Index</span>
                        <span className="text-on-surface font-bold">{app.salaryRange}</span>
                      </div>
                    )}
                    {app.link && (
                      <div>
                        <span className="text-[10px] uppercase text-outline block">Job Link</span>
                        <a href={app.link} target="_blank" rel="noreferrer" className="text-primary underline truncate block">
                          {app.link}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Requirements Snippet */}
                  {app.requirements && (
                    <div className="bg-surface-container-lowest p-3 border border-outline-variant/60 font-mono text-xs max-h-24 overflow-y-auto whitespace-pre-wrap text-on-surface-variant">
                      {app.requirements}
                    </div>
                  )}

                  {/* ATS Verification Report (if generated) */}
                  {parsedContent?.atsReport && (
                    <ATSReportView report={parsedContent.atsReport} />
                  )}

                  {/* Card Action Controls */}
                  <div className="flex flex-wrap items-center justify-between pt-2 border-t border-outline-variant gap-3">
                    <button
                      onClick={() => handleGeneratePackage(app.id)}
                      disabled={generatingId === app.id}
                      className="bg-[#FFB300] hover:bg-primary-container text-on-primary-container font-mono text-xs font-bold px-6 py-2.5 uppercase flex items-center gap-2 transition-all active:scale-[0.98]"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {generatingId === app.id ? 'sync' : 'auto_mode'}
                      </span>
                      <span>
                        {generatingId === app.id
                          ? 'GENERATING LATEX PACKAGE...'
                          : hasGeneratedCv
                          ? 'RE-GENERATE PACKAGE'
                          : 'GENERATE TAILORED PACKAGE'}
                      </span>
                    </button>

                    {hasGeneratedCv && (
                      <div className="flex flex-wrap gap-2 font-mono text-xs">
                        <button
                          onClick={() =>
                            setPreviewModal({
                              isOpen: true,
                              url: `/api/applications/${app.id}/download?type=cv`,
                              title: `${app.company} — Tailored CV PDF`
                            })
                          }
                          className="brutalist-button px-3 py-1.5 flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span> Preview CV
                        </button>
                        <a
                          href={`/api/applications/${app.id}/download?type=cv`}
                          target="_blank"
                          rel="noreferrer"
                          className="brutalist-button px-3 py-1.5 flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">download</span> CV PDF
                        </a>
                        <a
                          href={`/api/applications/${app.id}/download?type=cover`}
                          target="_blank"
                          rel="noreferrer"
                          className="brutalist-button px-3 py-1.5 flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">download</span> Cover PDF
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </main>
      </div>

      {/* Add New Application Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container border-2 border-primary w-full max-w-xl p-6 space-y-4 font-sans shadow-2xl">
            <div className="flex justify-between items-center border-b border-outline-variant pb-2">
              <h2 className="font-display text-2xl text-primary uppercase">Add Job Application Card</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="font-mono text-sm text-outline hover:text-primary">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddApplication} className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-[10px] text-on-surface-variant block uppercase mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  className="brutalist-input w-full"
                  placeholder="e.g. Quantum Systems Corp"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] text-on-surface-variant block uppercase mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  className="brutalist-input w-full"
                  placeholder="e.g. Lead Systems Architect"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] text-on-surface-variant block uppercase mb-1">Salary Range (optional)</label>
                <input
                  type="text"
                  className="brutalist-input w-full"
                  placeholder="e.g. $160,000 — $190,000 USD"
                  value={newSalary}
                  onChange={(e) => setNewSalary(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] text-on-surface-variant block uppercase mb-1">Job Link (optional)</label>
                <input
                  type="text"
                  className="brutalist-input w-full"
                  placeholder="https://..."
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] text-on-surface-variant block uppercase mb-1">Job Description / Requirements *</label>
                <textarea
                  required
                  className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface font-mono p-3 text-xs min-h-[120px] outline-none"
                  placeholder="Paste the job qualifications, responsibilities, or tech stack here..."
                  value={newRequirements}
                  onChange={(e) => setNewRequirements(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="brutalist-button px-4 py-2"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="brutalist-button-primary px-6 py-2"
                >
                  {submitting ? 'CREATING...' : 'CREATE CARD'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      <PDFPreviewModal
        isOpen={previewModal.isOpen}
        pdfUrl={previewModal.url}
        title={previewModal.title}
        onClose={() => setPreviewModal({ isOpen: false, url: '', title: '' })}
      />
    </div>
  )
}
