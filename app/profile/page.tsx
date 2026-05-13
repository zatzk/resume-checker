import { profileData } from '@/lib/mockData'

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      {/* Hero/Header Section */}
      <section className="pb-10 border-b border-outline-variant flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl text-primary uppercase tracking-tight mb-2 leading-none">ALIVE CV // SYSTEM_STATE: ACTIVE</h1>
          <p className="font-mono text-sm text-on-surface-variant max-w-2xl">Dynamic data-orchestration for professional identity. Real-time ingestion and modular profiling for mission-critical career deployments.</p>
        </div>
        <div className="flex gap-2">
          <span className="font-mono text-[11px] bg-surface-container-high px-3 py-1 border border-outline-variant text-primary uppercase tracking-tighter">Build: v4.2.0-STABLE</span>
          <span className="font-mono text-[11px] bg-surface-container-high px-3 py-1 border border-outline-variant text-secondary uppercase tracking-tighter">Sync: 100%</span>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Smart Import & System Status */}
        <aside className="md:col-span-4 flex flex-col gap-6">
          <div className="brutalist-card border-outline-variant">
            <div className="flex items-center justify-between border-b border-outline-variant pb-2 mb-4">
              <h2 className="font-mono text-sm font-bold text-primary uppercase flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">terminal</span>
                Smart Import
              </h2>
              <span className="text-[11px] font-mono text-on-surface-variant">LISTENING...</span>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <textarea 
                  className="brutalist-input w-full h-48 resize-none" 
                  placeholder="Paste experience snippets, project descriptions, or technical lists here..."
                ></textarea>
                <div className="absolute bottom-2 right-2 text-[11px] font-mono text-outline-variant">HEX_BUFFER_0x2A</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select className="brutalist-input text-[11px]">
                  <option>Experience History</option>
                  <option>Tech Stack</option>
                  <option>Project Log</option>
                  <option>Certifications</option>
                </select>
                <button className="brutalist-button-primary text-[11px] py-1.5 h-auto">
                  Parse & Inject
                </button>
              </div>
            </div>
          </div>

          {/* Profile Statistics Component */}
          <div className="brutalist-card border-outline-variant">
            <div className="border-b border-outline-variant pb-2 mb-4">
              <h2 className="font-mono text-sm font-bold text-on-surface uppercase leading-none">System Status</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-tighter">Core Density</span>
                <span className="font-mono text-[11px] text-primary">88.4%</span>
              </div>
              <div className="w-full bg-surface-container-lowest h-1 border border-outline-variant">
                <div className="bg-primary h-full w-[88.4%]"></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-tighter">Node Reliability</span>
                <span className="font-mono text-[11px] text-secondary">MAX_STABLE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-tighter">Last Update</span>
                <span className="font-mono text-[11px] text-on-surface">2024.10.12_14:20</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Data Column */}
        <div className="md:col-span-8 space-y-6">
          {/* Experience History */}
          <div className="brutalist-card p-0 border-outline-variant overflow-hidden">
            <div className="bg-surface-container-high border-b border-outline-variant px-4 py-2 flex items-center justify-between">
              <h2 className="font-mono text-sm font-bold text-primary uppercase">Experience History</h2>
              <span className="material-symbols-outlined text-primary text-[18px]">history</span>
            </div>
            <div className="divide-y divide-outline-variant">
              {profileData.experience.map((exp, i) => (
                <div key={i} className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 hover:bg-surface-variant transition-colors duration-100 group">
                  <div className="md:col-span-1">
                    <span className="font-mono text-[11px] text-secondary block mb-1">{exp.period}</span>
                    <span className="font-mono text-sm font-bold text-on-surface block uppercase leading-none">{exp.role}</span>
                  </div>
                  <div className="md:col-span-3">
                    <h3 className="font-sans font-bold text-primary mb-1 uppercase text-base">{exp.company}</h3>
                    <p className="text-sm text-on-surface-variant mb-3">{exp.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.tech.map((t) => (
                        <span key={t} className="bg-surface-container-lowest border border-outline-variant px-2 py-0.5 text-[11px] font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack & Idioms */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 brutalist-card border-outline-variant">
              <div className="bg-surface-container-high -mx-4 -mt-4 border-b border-outline-variant px-4 py-2 flex items-center justify-between">
                <h2 className="font-mono text-sm font-bold text-secondary uppercase">Tech Stack</h2>
                <span className="material-symbols-outlined text-secondary text-[18px]">terminal</span>
              </div>
              <div className="pt-4 flex flex-wrap gap-2">
                {profileData.techStack.map((tech) => (
                  <span key={tech} className="bg-surface-container-lowest border border-outline-variant px-3 py-1 text-[11px] font-mono text-on-surface uppercase">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 brutalist-card border-outline-variant">
              <div className="bg-surface-container-high -mx-4 -mt-4 border-b border-outline-variant px-4 py-2 flex items-center justify-between">
                <h2 className="font-mono text-sm font-bold text-tertiary uppercase">Idioms</h2>
                <span className="material-symbols-outlined text-tertiary text-[18px]">language</span>
              </div>
              <div className="pt-4 space-y-4">
                {profileData.idioms.map((idiom) => (
                  <div key={idiom.label} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-mono text-on-surface-variant uppercase">{idiom.label}</span>
                      <span className="text-[11px] font-mono text-primary">{idiom.level}</span>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-2 w-full ${i < idiom.progress ? 'bg-primary' : 'bg-surface-container-lowest border border-outline-variant'}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Projects Log */}
          <div className="brutalist-card p-0 border-outline-variant overflow-hidden">
            <div className="bg-surface-container-high border-b border-outline-variant px-4 py-2 flex items-center justify-between">
              <h2 className="font-mono text-sm font-bold text-primary uppercase">Active Projects</h2>
              <span className="material-symbols-outlined text-primary text-[18px]">account_tree</span>
            </div>
            <div className="p-4 space-y-4">
              {profileData.activeProjects.map((project) => (
                <div key={project.id} className="border border-outline-variant bg-surface-container-lowest p-4 relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 p-2 text-on-primary font-mono text-[10px] uppercase ${project.status === 'deployed' ? 'bg-primary' : 'bg-secondary'}`}>
                    {project.status}
                  </div>
                  <h3 className="font-display text-2xl text-primary mb-2 leading-none uppercase">{project.title}</h3>
                  <p className="text-sm text-on-surface-variant mb-4 font-sans">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] text-secondary">star</span>
                      <span className="font-mono text-[11px] text-on-surface">{project.stars} Stars</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] text-tertiary">fork_right</span>
                      <span className="font-mono text-[11px] text-on-surface">{project.forks} Forks</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-20 right-8 md:bottom-8 md:right-8 w-14 h-14 bg-primary text-on-primary flex items-center justify-center border border-primary hover:bg-primary-container transition-all group z-40">
        <span className="material-symbols-outlined text-[24px]">add</span>
        <span className="absolute right-full mr-4 bg-surface-container border border-outline-variant px-3 py-1 text-[11px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity uppercase text-primary">New Entry</span>
      </button>
    </div>
  )
}
