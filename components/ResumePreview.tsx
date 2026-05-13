'use client'

import { AmericanResume } from './AnalysisProvider'

export function ResumePreview({ resume }: { resume: AmericanResume }) {
  return (
    <div className="bg-white text-black p-10 md:p-14 shadow-2xl w-full max-w-[850px] mx-auto font-serif leading-normal overflow-hidden print:shadow-none print:p-0">
      {/* Header */}
      <header className="text-center border-b-2 border-black pb-4 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">{resume.name || 'FULL NAME'}</h1>
        <div className="text-[11px] flex flex-wrap justify-center gap-x-4 gap-y-1 text-gray-800 font-sans uppercase font-medium">
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && (
            <>
              <span className="opacity-30">•</span>
              <span>{resume.phone}</span>
            </>
          )}
          {resume.location && (
            <>
              <span className="opacity-30">•</span>
              <span>{resume.location}</span>
            </>
          )}
        </div>
        <div className="text-[11px] flex flex-wrap justify-center gap-x-4 gap-y-1 text-blue-800 font-sans uppercase font-bold mt-1 underline">
          {resume.linkedin && <a href={resume.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
          {resume.website && <a href={resume.website} target="_blank" rel="noreferrer">Portfolio</a>}
          {resume.socials?.map((social, i) => (
            <a key={i} href={social.url} target="_blank" rel="noreferrer">{social.platform}</a>
          ))}
        </div>
      </header>

      {/* Summary */}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase border-b border-gray-400 mb-2 font-sans tracking-widest py-1 bg-gray-50 px-2">Professional Summary</h2>
        <p className="text-[13px] leading-relaxed text-justify px-2 italic">{resume.summary}</p>
      </section>

      {/* Experience */}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase border-b border-gray-400 mb-4 font-sans tracking-widest py-1 bg-gray-50 px-2">Professional Experience</h2>
        <div className="space-y-6 px-2">
          {resume.experience.map((exp, i) => (
            <div key={i} className="break-inside-avoid">
              <div className="flex justify-between items-baseline mb-0.5 font-sans">
                <h3 className="font-bold text-sm uppercase">{exp.company}</h3>
                <span className="text-[11px] font-bold">{exp.dates}</span>
              </div>
              <div className="flex justify-between items-baseline mb-2 font-sans italic">
                <span className="font-bold text-[12px]">{exp.title}</span>
                <span className="text-[11px]">{exp.location}</span>
              </div>
              <ul className="list-disc ml-5 space-y-1">
                {exp.responsibilities.map((resp, j) => (
                  <li key={j} className="text-[12px] leading-snug text-gray-900">{resp}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase border-b border-gray-400 mb-3 font-sans tracking-widest py-1 bg-gray-50 px-2">Core Competencies</h2>
        <div className="space-y-2 px-2">
          {resume.skills.map((skillGroup, i) => (
            <div key={i} className="text-[11px] font-sans flex gap-2">
              <span className="font-bold uppercase min-w-[120px]">{skillGroup.category}:</span>
              <span className="text-gray-700">{skillGroup.items.join(', ')}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase border-b border-gray-400 mb-3 font-sans tracking-widest py-1 bg-gray-50 px-2">Key Projects</h2>
          <div className="space-y-4 px-2">
            {resume.projects.map((proj, i) => (
              <div key={i} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-1 font-sans">
                  <h3 className="font-bold text-[12px] uppercase">{proj.name}</h3>
                  {proj.link && <a href={proj.link} className="text-[10px] text-blue-700 underline" target="_blank" rel="noreferrer">Project Link</a>}
                </div>
                <p className="text-[12px] leading-snug text-gray-900">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase border-b border-gray-400 mb-3 font-sans tracking-widest py-1 bg-gray-50 px-2">Education</h2>
        <div className="space-y-3 px-2">
          {resume.education.map((edu, i) => (
            <div key={i} className="flex justify-between items-baseline font-sans break-inside-avoid">
              <div className="text-sm">
                <span className="font-bold uppercase">{edu.school}</span>
                <span className="text-gray-600"> — {edu.degree}</span>
              </div>
              <span className="text-[11px] italic font-bold">{edu.dates}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Optional: Certs & Languages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
        {resume.certifications && resume.certifications.length > 0 && (
          <section>
            <h2 className="text-[10px] font-bold uppercase border-b border-gray-400 mb-2 font-sans tracking-widest py-1 opacity-70">Certifications</h2>
            <ul className="list-none space-y-1">
              {resume.certifications.map((cert, i) => (
                <li key={i} className="text-[10px] font-sans font-bold text-gray-700 uppercase">• {cert}</li>
              ))}
            </ul>
          </section>
        )}
        {resume.languages && resume.languages.length > 0 && (
          <section>
            <h2 className="text-[10px] font-bold uppercase border-b border-gray-400 mb-2 font-sans tracking-widest py-1 opacity-70">Languages</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {resume.languages.map((lang, i) => (
                <div key={i} className="text-[10px] font-sans font-bold text-gray-700 uppercase flex gap-2">
                  <span>{lang.language}</span>
                  <span className="text-gray-400">({lang.level})</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Industrial Footer Label */}
      <div className="mt-12 pt-4 border-t border-gray-100 text-center opacity-20 select-none print:hidden">
        <span className="font-mono text-[8px] uppercase tracking-[0.5em]">Optimized by TERMINAL_CRMS_ENGINE_v4.0</span>
      </div>
    </div>
  )
}
