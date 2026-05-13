export interface Application {
  ref: string
  status: string
  statusColor: string
  role: string
  company: string
  appliedDate: string
  salary: string
  link?: string
  requirements?: string
}

export const dashboardData = {
  recentCVs: [
    { id: 'SF_ENG_2024', role: 'Staff Software Engineer', atsScore: 94, analystRating: 'A-', strategistRank: '02/100' },
    { id: 'LD_PRD_2024', role: 'Lead Product Manager', atsScore: 88, analystRating: 'B+', strategistRank: '14/100' },
    { id: 'CT_ARH_2024', role: 'Cloud Architect', atsScore: 72, analystRating: 'C+', strategistRank: '42/100' },
  ],
  heatmapData: Array.from({ length: 40 }, () => 
    Array.from({ length: 5 }, () => Math.random())
  )
}

export const profileData = {
  experience: [
    {
      period: '2022.01 — PRESENT',
      role: 'Lead Architect',
      company: 'Quantum Systems Corp',
      description: 'Orchestrating high-availability microservices architecture and managing distributed engineering teams for mission-critical logistics software.',
      tech: ['RUST', 'K8S', 'GRPC']
    },
    {
      period: '2019.05 — 2021.12',
      role: 'Senior SWE',
      company: 'Cyberdyne Data Ltd',
      description: 'Developed neural processing pipelines and automated data ingestion protocols for legacy mainframe migration projects.',
      tech: ['GO', 'PYTHON', 'POSTGRES']
    }
  ],
  techStack: [
    'Rust', 'Go', 'TS', 'C++', 'React.js', 'Next.js', 'GraphQL', 'Node.js', 'Terraform', 'Auth0'
  ],
  idioms: [
    { label: 'English', level: 'C2', progress: 5 },
    { label: 'Portuguese', level: 'Native', progress: 5 },
    { label: 'Spanish', level: 'B2', progress: 3 }
  ],
  activeProjects: [
    {
      id: 'NEURAL_SHIELD_PROX',
      status: 'deployed',
      title: 'NEURAL_SHIELD_PROX',
      description: 'A decentralized firewall leveraging ML-based pattern recognition to mitigate zero-day vulnerabilities in industrial IoT networks.',
      stars: '1.4k',
      forks: '242'
    },
    {
      id: 'CORE_VOID_ENGINE',
      status: 'staged',
      title: 'CORE_VOID_ENGINE',
      description: 'High-performance voxel rendering engine built in Rust, optimized for low-spec hardware and real-time planetary simulation.',
      stars: '892',
      forks: '45'
    }
  ]
}

export const trackerData: { applications: Application[] } = {
  applications: [
    {
      ref: 'APP_2023_091',
      status: 'CV SENT',
      statusColor: 'bg-tertiary-container text-on-tertiary-container',
      role: 'Senior Systems Architect',
      company: 'CyberDyne Systems Corporation',
      appliedDate: '2023.10.12',
      salary: '$180,000.00 — $220,000.00 USD',
      link: 'https://cyberdyne.systems/careers/91',
      requirements: `[CORE_QUALIFICATIONS]
- 10+ years experience in Distributed Systems Architecture.
- Expertise in low-latency processing and neural-net integration.
- Proficiency in C++, Rust, and Assembly (ARM/x86).
- Previous experience with SkyNet-level automated defense protocols.

[RESPONSIBILITIES]
- Design and oversee the migration of legacy mainframe logic to autonomous edge nodes.
- Maintain 99.999% uptime for global monitoring clusters.
- Lead a team of junior replicant engineers in high-pressure cycles.
- Interface directly with T-800 series hardware engineers for kernel optimization.`
    },
    {
      ref: 'APP_2023_088',
      status: 'RECEIVED',
      statusColor: 'bg-secondary-container text-on-secondary-container',
      role: 'Lead Backend Engineer',
      company: 'Tyrell Corporation',
      appliedDate: '2023.10.05',
      salary: '$165,000.00 — $190,000.00 USD',
      link: 'https://tyrell.corp/jobs/88',
      requirements: `More human than human is our motto.
Need expert Node.js and Go experience for replicant memory management.
Experience with Off-world colony infrastructure is a plus.`
    },
    {
      ref: 'APP_2023_082',
      status: 'REJECTED',
      statusColor: 'bg-error-container text-on-error-container',
      role: 'Full Stack Developer',
      company: 'Omni Consumer Products',
      appliedDate: '2023.09.28',
      salary: '$140,000.00 — $160,000.00 USD',
      link: 'https://ocp.detroit/careers/82',
      requirements: `Building the future of law enforcement.
React, TypeScript, and C++ for ED-209 interface design.
Must be able to work in high-crime urban areas.`
    },
    {
      ref: 'APP_2023_075',
      status: 'HIRED',
      statusColor: 'bg-primary text-on-primary',
      role: 'Core Protocol Engineer',
      company: 'Weyland-Yutani Corp',
      appliedDate: '2023.09.15',
      salary: 'ACCEPTED',
      link: 'https://weyland-yutani.com/careers/75',
      requirements: `Building better worlds.
Deep kernel knowledge required for USCSS Nostromo maintenance.`
    }
  ]
}
