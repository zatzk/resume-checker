'use client'

import { useState, useEffect } from 'react'
import { MasterCV } from '@/lib/cv-types'
import { DEFAULT_MASTER_CV } from '@/lib/master-cv'
import { clsx } from 'clsx'

export default function ProfilePage() {
  const [cv, setCv] = useState<MasterCV>(DEFAULT_MASTER_CV)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [importText, setImportText] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data: MasterCV) => {
        if (data && data.name) {
          setCv(data)
        }
      })
      .catch((err) => console.error('Failed to load profile:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaveSuccess(false)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cv)
      })
      if (res.ok) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        alert('Failed to save profile changes.')
      }
    } catch (err) {
      console.error(err)
      alert('Error saving profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleSmartImport = async () => {
    if (!importText.trim()) {
      alert('Please paste some experience text or CV notes first.')
      return
    }
    setExtracting(true)
    try {
      const res = await fetch('/api/profile/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: importText })
      })
      if (!res.ok) throw new Error('Extraction failed')
      const extracted: MasterCV = await res.json()
      setCv(extracted)
      setImportText('')
      alert('Profile successfully parsed and updated! Review the fields below and click Save.')
    } catch (err) {
      console.error(err)
      alert('Failed to extract profile from text.')
    } finally {
      setExtracting(false)
    }
  }

  // --- Helper state updates ---
  const updateContact = (key: keyof MasterCV['contact'], val: string) => {
    setCv((prev) => ({
      ...prev,
      contact: { ...prev.contact, [key]: val }
    }))
  }

  const updateSkillCategory = (catIdx: number, newCategory: string) => {
    setCv((prev) => {
      const skills = [...prev.skills]
      skills[catIdx] = { ...skills[catIdx], category: newCategory }
      return { ...prev, skills }
    })
  }

  const updateSkillItems = (catIdx: number, itemsStr: string) => {
    const items = itemsStr.split(',').map((s) => s.trim()).filter(Boolean)
    setCv((prev) => {
      const skills = [...prev.skills]
      skills[catIdx] = { ...skills[catIdx], items }
      return { ...prev, skills }
    })
  }

  const addSkillCategory = () => {
    setCv((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), { category: 'New Category', items: ['Skill 1'] }]
    }))
  }

  const removeSkillCategory = (catIdx: number) => {
    setCv((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== catIdx)
    }))
  }

  const updateExpField = (expIdx: number, field: string, val: string) => {
    setCv((prev) => {
      const exp = [...prev.experience]
      exp[expIdx] = { ...exp[expIdx], [field]: val }
      return { ...prev, experience: exp }
    })
  }

  const updateResponsibility = (expIdx: number, respIdx: number, val: string) => {
    setCv((prev) => {
      const exp = [...prev.experience]
      const resps = [...exp[expIdx].responsibilities]
      resps[respIdx] = val
      exp[expIdx] = { ...exp[expIdx], responsibilities: resps }
      return { ...prev, experience: exp }
    })
  }

  const addResponsibility = (expIdx: number) => {
    setCv((prev) => {
      const exp = [...prev.experience]
      const resps = [...(exp[expIdx].responsibilities || []), 'New key achievement or responsibility']
      exp[expIdx] = { ...exp[expIdx], responsibilities: resps }
      return { ...prev, experience: exp }
    })
  }

  const removeResponsibility = (expIdx: number, respIdx: number) => {
    setCv((prev) => {
      const exp = [...prev.experience]
      const resps = exp[expIdx].responsibilities.filter((_, i) => i !== respIdx)
      exp[expIdx] = { ...exp[expIdx], responsibilities: resps }
      return { ...prev, experience: exp }
    })
  }

  const addExperience = () => {
    setCv((prev) => ({
      ...prev,
      experience: [
        {
          company: 'Company Name',
          title: 'Job Title',
          location: 'Location',
          dates: 'Jan 2024 – Present',
          summaryText: '',
          responsibilities: ['Key responsibility or achievement']
        },
        ...prev.experience
      ]
    }))
  }

  const removeExperience = (expIdx: number) => {
    setCv((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== expIdx)
    }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 font-mono text-primary">
        <span className="material-symbols-outlined animate-spin mr-2">sync</span>
        LOADING_MASTER_PROFILE...
      </div>
    )
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header Section */}
      <section className="pb-6 border-b border-outline-variant flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs text-primary font-bold uppercase tracking-widest">[ LIVING_PROFILE_BUILDER ]</span>
            {saveSuccess && <span className="font-mono text-xs text-secondary font-bold uppercase">✔ SAVED_TO_DATABASE</span>}
          </div>
          <h1 className="font-display text-4xl text-on-surface uppercase tracking-tight leading-none">Master Candidate Profile</h1>
          <p className="font-mono text-xs text-on-surface-variant max-w-2xl mt-1">
            Block-by-block editor for your master professional identity. Changes here automatically feed into all AI application generators.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="/api/profile/download-master"
            target="_blank"
            rel="noreferrer"
            className="brutalist-button px-4 py-2 text-xs flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span>Download Master PDF</span>
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#FFB300] hover:bg-primary-container text-on-primary-container font-mono text-xs font-bold px-6 py-2 uppercase flex items-center gap-2 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-sm">{saving ? 'sync' : 'save'}</span>
            <span>{saving ? 'SAVING...' : 'SAVE CHANGES'}</span>
          </button>
        </div>
      </section>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Smart Import Drawer & System Status */}
        <aside className="md:col-span-4 space-y-6">
          <div className="brutalist-card border-outline-variant bg-surface-container">
            <div className="flex items-center justify-between border-b border-outline-variant pb-2 mb-4">
              <h2 className="font-mono text-xs font-bold text-primary uppercase flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">terminal</span>
                AI Smart Import
              </h2>
              <span className="text-[10px] font-mono text-on-surface-variant uppercase">PARSER_v2</span>
            </div>
            <div className="space-y-4">
              <textarea
                className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary text-on-surface font-mono p-3 text-xs min-h-[180px] outline-none placeholder:text-outline/40"
                placeholder="Paste raw resume text, LinkedIn export, or new experience notes here..."
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
              ></textarea>
              <button
                onClick={handleSmartImport}
                disabled={extracting}
                className="w-full brutalist-button-primary py-2 text-xs font-mono font-bold flex items-center justify-center gap-2 uppercase"
              >
                <span className="material-symbols-outlined text-sm">{extracting ? 'sync' : 'auto_fix_high'}</span>
                <span>{extracting ? 'PARSING TEXT...' : 'Parse & Overwrite Profile'}</span>
              </button>
            </div>
          </div>

          <div className="brutalist-card border-outline-variant bg-surface-container-low">
            <h3 className="font-mono text-xs font-bold text-on-surface border-b border-outline-variant pb-2 mb-3 uppercase">
              Personal Details
            </h3>
            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[10px] text-on-surface-variant block uppercase">Full Name</label>
                <input
                  type="text"
                  className="brutalist-input w-full mt-1"
                  value={cv.name || ''}
                  onChange={(e) => setCv({ ...cv, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] text-on-surface-variant block uppercase">Title / Headline</label>
                <input
                  type="text"
                  className="brutalist-input w-full mt-1"
                  value={cv.title || ''}
                  onChange={(e) => setCv({ ...cv, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] text-on-surface-variant block uppercase">Email</label>
                <input
                  type="text"
                  className="brutalist-input w-full mt-1"
                  value={cv.contact?.email || ''}
                  onChange={(e) => updateContact('email', e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] text-on-surface-variant block uppercase">Phone</label>
                <input
                  type="text"
                  className="brutalist-input w-full mt-1"
                  value={cv.contact?.phone || ''}
                  onChange={(e) => updateContact('phone', e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] text-on-surface-variant block uppercase">Location</label>
                <input
                  type="text"
                  className="brutalist-input w-full mt-1"
                  value={cv.contact?.location || ''}
                  onChange={(e) => updateContact('location', e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] text-on-surface-variant block uppercase">LinkedIn URL</label>
                <input
                  type="text"
                  className="brutalist-input w-full mt-1"
                  value={cv.contact?.linkedin || ''}
                  onChange={(e) => updateContact('linkedin', e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] text-on-surface-variant block uppercase">Portfolio / GitHub</label>
                <input
                  type="text"
                  className="brutalist-input w-full mt-1"
                  value={cv.contact?.portfolio || ''}
                  onChange={(e) => updateContact('portfolio', e.target.value)}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Block-by-Block Profile Editor */}
        <div className="md:col-span-8 space-y-6">
          {/* Summary */}
          <div className="brutalist-card border-outline-variant">
            <h3 className="font-mono text-xs font-bold text-primary uppercase border-b border-outline-variant pb-2 mb-3">
              01. Executive Summary
            </h3>
            <textarea
              className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary font-mono text-xs p-3 min-h-[100px] leading-relaxed outline-none"
              value={cv.summary || ''}
              onChange={(e) => setCv({ ...cv, summary: e.target.value })}
            />
          </div>

          {/* Core Competencies */}
          <div className="brutalist-card border-outline-variant">
            <div className="flex justify-between items-center border-b border-outline-variant pb-2 mb-4">
              <h3 className="font-mono text-xs font-bold text-primary uppercase">02. Core Competencies</h3>
              <button
                onClick={addSkillCategory}
                className="text-xs font-mono text-primary font-bold uppercase hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">add</span> Add Category
              </button>
            </div>
            <div className="space-y-4">
              {cv.skills?.map((group, idx) => (
                <div key={idx} className="border border-outline-variant/60 p-3 bg-surface-container-lowest space-y-2 relative">
                  <button
                    onClick={() => removeSkillCategory(idx)}
                    className="absolute top-2 right-2 text-error text-xs hover:underline font-mono"
                  >
                    Remove
                  </button>
                  <input
                    type="text"
                    className="font-mono font-bold text-xs bg-transparent border-b border-outline-variant outline-none w-2/3"
                    value={group.category}
                    onChange={(e) => updateSkillCategory(idx, e.target.value)}
                  />
                  <input
                    type="text"
                    className="font-mono text-xs w-full bg-surface-container p-2 border border-outline-variant outline-none"
                    placeholder="Comma separated items (e.g. React, Next.js, Node.js)"
                    value={group.items.join(', ')}
                    onChange={(e) => updateSkillItems(idx, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Professional Experience */}
          <div className="brutalist-card border-outline-variant">
            <div className="flex justify-between items-center border-b border-outline-variant pb-2 mb-4">
              <h3 className="font-mono text-xs font-bold text-primary uppercase">03. Professional Experience</h3>
              <button
                onClick={addExperience}
                className="text-xs font-mono text-primary font-bold uppercase hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">add</span> Add Role
              </button>
            </div>
            <div className="space-y-6">
              {cv.experience?.map((exp, expIdx) => (
                <div key={expIdx} className="border border-outline-variant p-4 bg-surface-container-lowest space-y-3 relative">
                  <button
                    onClick={() => removeExperience(expIdx)}
                    className="absolute top-3 right-3 text-error text-xs hover:underline font-mono"
                  >
                    Delete Role
                  </button>
                  <div className="grid grid-cols-2 gap-3 font-mono text-xs pr-16">
                    <div>
                      <label className="text-[10px] text-on-surface-variant block uppercase">Company</label>
                      <input
                        type="text"
                        className="brutalist-input w-full"
                        value={exp.company}
                        onChange={(e) => updateExpField(expIdx, 'company', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-on-surface-variant block uppercase">Title</label>
                      <input
                        type="text"
                        className="brutalist-input w-full"
                        value={exp.title}
                        onChange={(e) => updateExpField(expIdx, 'title', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-on-surface-variant block uppercase">Dates</label>
                      <input
                        type="text"
                        className="brutalist-input w-full"
                        value={exp.dates}
                        onChange={(e) => updateExpField(expIdx, 'dates', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-on-surface-variant block uppercase">Location</label>
                      <input
                        type="text"
                        className="brutalist-input w-full"
                        value={exp.location}
                        onChange={(e) => updateExpField(expIdx, 'location', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Bullet points */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center">
                      <label className="font-mono text-[10px] text-primary uppercase font-bold">Key Responsibilities / Achievements</label>
                      <button
                        onClick={() => addResponsibility(expIdx)}
                        className="text-[10px] font-mono text-primary font-bold uppercase hover:underline"
                      >
                        + Add Bullet
                      </button>
                    </div>
                    {exp.responsibilities?.map((bullet, rIdx) => (
                      <div key={rIdx} className="flex items-center gap-2">
                        <span className="text-primary font-mono text-xs">•</span>
                        <input
                          type="text"
                          className="font-mono text-xs w-full bg-surface-container p-2 border border-outline-variant outline-none"
                          value={bullet}
                          onChange={(e) => updateResponsibility(expIdx, rIdx, e.target.value)}
                        />
                        <button
                          onClick={() => removeResponsibility(expIdx, rIdx)}
                          className="text-error text-xs font-mono font-bold px-1 hover:underline"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Projects */}
          <div className="brutalist-card border-outline-variant">
            <h3 className="font-mono text-xs font-bold text-primary uppercase border-b border-outline-variant pb-2 mb-4">
              04. Selected Projects
            </h3>
            <div className="space-y-4">
              {cv.projects?.map((proj, pIdx) => (
                <div key={pIdx} className="border border-outline-variant p-3 bg-surface-container-lowest space-y-2">
                  <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                    <input
                      type="text"
                      className="font-bold brutalist-input"
                      placeholder="Project Name"
                      value={proj.name}
                      onChange={(e) => {
                        const projects = [...cv.projects]
                        projects[pIdx] = { ...projects[pIdx], name: e.target.value }
                        setCv({ ...cv, projects })
                      }}
                    />
                    <input
                      type="text"
                      className="brutalist-input"
                      placeholder="Link (optional)"
                      value={proj.link || ''}
                      onChange={(e) => {
                        const projects = [...cv.projects]
                        projects[pIdx] = { ...projects[pIdx], link: e.target.value }
                        setCv({ ...cv, projects })
                      }}
                    />
                  </div>
                  <textarea
                    className="w-full font-mono text-xs p-2 bg-surface-container border border-outline-variant outline-none min-h-[60px]"
                    placeholder="Project description and key technical features..."
                    value={proj.description}
                    onChange={(e) => {
                      const projects = [...cv.projects]
                      projects[pIdx] = { ...projects[pIdx], description: e.target.value }
                      setCv({ ...cv, projects })
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
