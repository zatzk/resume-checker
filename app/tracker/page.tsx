'use client'

import { useState, useEffect, useMemo } from 'react'
import { trackerData, Application } from '@/lib/mockData'
import { clsx } from 'clsx'

export default function TrackerPage() {
  const [apps, setApps] = useState<Application[]>(trackerData.applications)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesSearch = app.role.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                           app.company.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchesStatus = statusFilter === 'ALL' || app.status.replace('_', ' ') === statusFilter.replace('_', ' ')
      return matchesSearch && matchesStatus
    })
  }, [apps, debouncedSearch, statusFilter])

  const handleOpenView = (app: Application) => {
    setSelectedApp(app)
    setIsViewModalOpen(true)
  }

  const handleDelete = (ref: string) => {
    if (confirm(`INITIALIZE_PURGE: ${ref}?`)) {
      setApps(apps.filter(a => a.ref !== ref))
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Actions Section */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-outline-variant pb-4 gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-4xl text-primary uppercase tracking-tight leading-none">ACTIVE_APPLICATIONS_TRACKER</h1>
          <p className="font-mono text-sm text-on-surface-variant uppercase tracking-tighter">NODE: 0x882A // STATUS: MONITORING_MARKET</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="brutalist-button-primary group"
        >
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
                <label className="text-[11px] font-mono uppercase text-on-surface-variant mb-2 block tracking-widest">Search_Query</label>
                <input 
                  className="brutalist-input w-full" 
                  placeholder="CMD: SEARCH..." 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase text-on-surface-variant block tracking-widest">Status_Flags</label>
                <div className="flex flex-wrap gap-2">
                  {['ALL', 'CV_SENT', 'RECEIVED', 'INTERVIEW', 'REJECTED', 'HIRED'].map((status) => (
                    <span 
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={clsx(
                        "border px-2 py-1 text-[11px] font-mono cursor-pointer transition-colors uppercase",
                        statusFilter === status 
                          ? "bg-surface-variant text-primary border-primary" 
                          : "border-outline-variant text-on-surface-variant hover:border-primary"
                      )}
                    >
                      {status}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="brutalist-card bg-surface-container-low border-outline-variant hidden lg:block">
            <h3 className="font-mono text-sm font-bold text-primary mb-2 uppercase">SYSTEM_STATS</h3>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">TOTAL_APPS:</span>
                <span className="text-primary font-bold">{apps.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">WIN_RATE:</span>
                <span className="text-tertiary font-bold">12.5%</span>
              </div>
              <div className="w-full bg-surface-variant h-1 mt-4">
                <div className="bg-primary h-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-[10px] text-on-surface-variant mt-2 uppercase">QUOTA: 65% REACHED FOR CURRENT_MONTH</p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="col-span-12 lg:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredApps.map((app) => (
              <div key={app.ref} className="brutalist-card border-outline-variant group hover:border-primary transition-colors p-0 overflow-hidden">
                <div className="bg-surface-container-high px-4 py-2 flex justify-between items-center border-b border-outline-variant">
                  <span className="font-mono text-[11px] text-on-surface-variant uppercase">REF: {app.ref}</span>
                  <span className={clsx(app.statusColor, "px-2 py-0.5 font-mono text-[11px] font-bold uppercase")}>
                    {app.status}
                  </span>
                </div>
                <div className="p-4">
                  <h2 className="font-display text-2xl text-primary mb-1 uppercase leading-none">{app.role}</h2>
                  <p className="font-mono text-sm text-on-surface mb-4 uppercase">{app.company}</p>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    <div className="bg-surface-container-lowest p-2 border border-outline-variant/30">
                      <p className="text-[11px] font-mono text-on-surface-variant uppercase">Applied</p>
                      <p className="font-mono text-sm">{app.appliedDate}</p>
                    </div>
                    <div className="bg-surface-container-lowest p-2 border border-outline-variant/30">
                      <p className="text-[11px] font-mono text-on-surface-variant uppercase">Salary / Offer</p>
                      <p className="font-mono text-sm truncate">{app.salary}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 brutalist-button text-[11px] font-bold py-2">
                      <span className="material-symbols-outlined text-sm">description</span>
                      Generate Targeted CV
                    </button>
                    
                    <button 
                      onClick={() => handleOpenView(app)}
                      className={clsx(
                        "aspect-square border p-2 flex items-center justify-center transition-colors group/edit",
                        app.status === 'HIRED' ? "border-primary hover:bg-primary/10" : "border-outline-variant hover:border-primary"
                      )} 
                      title="Edit Application"
                    >
                      <span className={clsx(
                        "material-symbols-outlined text-[20px]",
                        app.status === 'HIRED' ? "text-primary" : "text-on-surface-variant group-hover/edit:text-primary"
                      )}>edit</span>
                    </button>

                    <button 
                      onClick={() => handleDelete(app.ref)}
                      className={clsx(
                        "aspect-square border p-2 flex items-center justify-center transition-colors group/del",
                        app.status === 'HIRED' ? "border-primary hover:border-error hover:bg-error/10" : "border-outline-variant hover:border-error"
                      )} 
                      title="Remove Application"
                    >
                      <span className={clsx(
                        "material-symbols-outlined text-[20px]",
                        app.status === 'HIRED' ? "text-primary group-hover/del:text-error" : "text-on-surface-variant group-hover/del:text-error"
                      )}>delete</span>
                    </button>

                    <button 
                      onClick={() => handleOpenView(app)}
                      className={clsx(
                        "aspect-square border p-2 flex items-center justify-center transition-colors group/view",
                        app.status === 'HIRED' ? "border-primary hover:bg-primary/10" : "border-outline-variant hover:border-primary"
                      )}
                      title="View Details"
                    >
                      <span className={clsx(
                        "material-symbols-outlined",
                        app.status === 'HIRED' ? "text-primary" : "text-on-surface-variant group-hover/view:text-primary"
                      )}>open_in_new</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-sm px-4">
          <div className="w-full max-w-2xl bg-surface border border-primary-container shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-surface-container-high border-b border-outline-variant px-6 py-4 flex justify-between items-center">
              <h2 className="font-mono text-sm font-bold text-primary flex items-center gap-2 uppercase">
                <span className="material-symbols-outlined text-lg">add_box</span>
                NEW_APPLICATION_ENTRY
              </h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-on-surface-variant block">Position</label>
                  <input className="brutalist-input w-full text-primary" placeholder="e.g. Senior Architect" type="text"/>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-on-surface-variant block">Job Link</label>
                  <input className="brutalist-input w-full text-primary" placeholder="https://career.portal/..." type="text"/>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-mono uppercase text-on-surface-variant block">Salary</label>
                  <div className="flex gap-2">
                    <select className="brutalist-input min-w-[100px] text-primary">
                      <option>USD</option>
                      <option>EUR</option>
                      <option>BRL</option>
                      <option>GBP</option>
                    </select>
                    <input className="brutalist-input flex-1 text-primary" placeholder="Numeric value..." type="number"/>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-on-surface-variant block">Date Applied</label>
                  <input className="brutalist-input w-full text-primary" type="date"/>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-on-surface-variant block">Status</label>
                  <select className="brutalist-input w-full text-primary">
                    <option>CV Sent</option>
                    <option>Received</option>
                    <option>Rejected</option>
                    <option>Hired</option>
                  </select>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-mono uppercase text-on-surface-variant block">Job Requirements & Responsibilities</label>
                  <textarea className="brutalist-input w-full min-h-[120px] resize-none text-primary" placeholder="Enter detailed job requirements..."></textarea>
                </div>
              </div>
            </div>
            <div className="p-6 pt-0 flex gap-4">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all py-3 font-mono text-sm uppercase font-bold"
              >
                CANCEL
              </button>
              <button className="flex-2 brutalist-button-primary py-3 px-8 text-sm">
                <span className="material-symbols-outlined text-sm">terminal</span>
                INITIALIZE_APPLICATION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedApp && (
        <div className="fixed inset-0 z-[100] bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-surface border border-primary shadow-[0_0_20px_rgba(255,179,0,0.15)] flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-primary bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="led-indicator"></div>
                <h2 className="font-mono text-sm font-bold text-primary tracking-widest uppercase truncate">APPLICATION_DETAILS_VIEW // {selectedApp.ref}</h2>
              </div>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="text-on-surface-variant hover:text-primary transition-colors p-1 flex items-center justify-center"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-surface-container-low border border-outline-variant p-4">
                  <p className="text-[11px] font-mono text-on-surface-variant uppercase mb-1">Position</p>
                  <p className="font-display text-2xl text-primary uppercase leading-tight">{selectedApp.role}</p>
                </div>
                <div className="bg-surface-container-low border border-outline-variant p-4">
                  <p className="text-[11px] font-mono text-on-surface-variant uppercase mb-1">Company</p>
                  <p className="font-mono text-sm text-on-surface uppercase">{selectedApp.company}</p>
                </div>
                <div className="bg-surface-container-low border border-outline-variant p-4">
                  <p className="text-[11px] font-mono text-on-surface-variant uppercase mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <span className={clsx(selectedApp.statusColor, "px-2 py-0.5 text-[11px] font-mono uppercase font-bold")}>{selectedApp.status}</span>
                  </div>
                </div>
                <div className="bg-surface-container-low border border-outline-variant p-4">
                  <p className="text-[11px] font-mono text-on-surface-variant uppercase mb-1">Date_Applied</p>
                  <p className="font-mono text-sm">{selectedApp.appliedDate}</p>
                </div>
                <div className="bg-surface-container-low border border-outline-variant p-4 md:col-span-2">
                  <p className="text-[11px] font-mono text-on-surface-variant uppercase mb-1">Salary_Expectation</p>
                  <p className="font-mono text-sm text-primary">{selectedApp.salary} <span className="text-on-surface-variant text-[10px] ml-1">(ANNUAL)</span></p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                  <h3 className="font-mono text-sm font-bold text-primary uppercase">JOB_REQUIREMENTS_&_SPECIFICATIONS</h3>
                  <span className="text-[11px] font-mono text-on-surface-variant uppercase">CHAR_COUNT: {selectedApp.requirements?.length || 0}</span>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant p-6 font-mono text-sm text-on-surface-variant leading-relaxed">
                  <pre className="whitespace-pre-wrap font-mono uppercase">
                    {`> INITIALIZING REQUIREMENT PARSER...\n> SUCCESS.\n\n${selectedApp.requirements || 'NO_DATA_FOUND'}`}
                  </pre>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-surface-container-high border-t border-outline-variant flex justify-end gap-4">
              <button className="brutalist-button px-6 py-2">
                <span className="material-symbols-outlined text-sm">edit</span>
                EDIT_ENTRY
              </button>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="bg-surface-container-highest text-on-surface px-6 py-2 border border-outline-variant font-mono text-sm font-bold uppercase hover:border-primary hover:text-primary transition-all"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
