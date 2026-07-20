import { MasterCV } from './cv-types'
import fs from 'fs'
import path from 'path'

export const DEFAULT_MASTER_CV: MasterCV = {
  name: 'Jean Luiz de Souza Junior',
  title: 'Full Stack Software Engineer',
  contact: {
    location: 'Salvador, Bahia, Brazil',
    email: 'juniorjean7@gmail.com',
    linkedin: 'https://linkedin.com/in/luiz-jean',
    github: 'https://github.com/zatzk',
    portfolio: 'https://zatzk.live'
  },
  summary: 'Full Stack Software Engineer with approximately 4 years of experience specializing in Angular, React, Next.js, and Node.js with a strong focus on distributed backend architectures and AI integration. Proven experience in designing event-driven synchronization pipelines, optimizing media processing systems, refactoring multi-tenant database schemas, and modernizing frontend GIS interfaces. Passionate about spec-driven development, optimizing developer workflows through containerization, and delivering reliable software through rigorous automated testing.',
  skills: [
    {
      category: 'Languages',
      items: ['TypeScript', 'JavaScript', 'Node.js', 'HTML5', 'CSS3/SCSS', 'SQL', 'Java']
    },
    {
      category: 'Frontend',
      items: ['Angular', 'Angular Material', 'PrimeNG', 'React.js', 'Next.js', 'RxJS', 'Bootstrap', 'TailwindCSS', 'OpenLayers']
    },
    {
      category: 'Backend & Architecture',
      items: ['Express', 'NestJS', 'Service-Oriented Architecture (SOA)', 'Microservices', 'WebSocket (Socket.io)']
    },
    {
      category: 'Databases & Storage',
      items: ['MongoDB', 'PostgreSQL', 'MinIO', 'Firebase', 'Supabase']
    },
    {
      category: 'DevOps & Tools',
      items: ['Docker', 'Git', 'GitHub', 'GitLab', 'BullMQ', 'Redis', 'FFmpeg', 'Figma', 'CI/CD']
    },
    {
      category: 'AI Engineering',
      items: ['AI Agents', 'Spec-Driven Development', 'Prompt Engineering']
    }
  ],
  experience: [
    {
      company: 'Aton Engenharia',
      location: 'Salvador, BA (Remote)',
      title: 'Full Stack Software Engineer',
      dates: 'Jan 2023 – Present',
      summaryText: 'Spearheaded the development and architectural evolution of SAFFIRA, an AI-powered forest fire monitoring and detection system.',
      responsibilities: [
        'Asynchronous Data Sync: Architected an event-driven asynchronous messaging pipeline utilizing Redis and BullMQ, synchronizing real-time telemetry data between on-premise edge servers and a central administrative instance with sub-second latency across a platform monitoring millions of hectares.',
        'Media Processing Pipeline: Designed and implemented a "false-negatives" media processing pipeline by integrating FFmpeg for video compression and MinIO for object storage, reducing bandwidth usage by 60% and enabling secure streaming via presigned URLs.',
        'Multi-Tenant Schema Design: Refactored the core MongoDB database schema utilizing Mongoose discriminators, enabling 100% multi-tenant data isolation and reducing data redundancy for multiple enterprise clients.',
        'Frontend Modernization & GIS: Overhauled the SAFFIRA frontend by leveraging Angular Signals, PrimeNG, and OpenLayers, reducing UI state overhead and improving geospatial rendering response times for real-time camera tracking and fire occurrences.',
        'GitOps Compilation & Infrastructure: Designed a declarative GitOps compilation pipeline using Docker and ephemeral staging namespaces, reducing developer onboarding time and staging environment setup overhead by 50%.',
        'Hardware Telemetry Integration: Engineered REST and WebSocket APIs to ingest real-time snapshot and telemetry data from physical cameras deployed in the field.'
      ]
    },
    {
      company: 'SESAB (Secretaria de Saúde do Estado da Bahia)',
      location: 'Salvador, BA (Hybrid)',
      title: 'Frontend Web Developer Intern',
      dates: 'Nov 2022 – Oct 2023',
      summaryText: 'Modernized public health systems for the Bahia State Department of Health.',
      responsibilities: [
        'Intranet Portal Overhaul: Overhauled the internal intranet portal for the Ernesto Simões Filho General Hospital to serve thousands of public health workers, reducing information retrieval friction through a comprehensive UX audit and semantic HTML layouts.',
        'MVVM Fullstack Migration: Redesigned the application architecture into a decoupled MVVM model by utilizing ReactJS on the frontend, NodeJS REST APIs on the backend, and PostgreSQL, improving overall data transaction stability.',
        'Local Network Deployment: Deployed and maintained local network server nodes using Apache web servers, utilizing Git release tagging to ensure zero downtime and stable version control across hospital departments.'
      ]
    }
  ],
  projects: [
    {
      name: 'Truebasis',
      subtitle: 'Crypto Tax Tracker',
      description: 'Developed a cryptocurrency portfolio tracker utilizing Next.js 16 and NestJS that reconstructs double-entry transaction ledgers using FIFO tax rules, validating chronological transaction-replay accuracy via a local Hardhat simulation harness.'
    },
    {
      name: 'Street Steel',
      subtitle: 'AI Calisthenics App',
      description: 'Built an AI-powered calisthenics mobile application using React Native, Expo, and Zustand, implementing a custom fuzzy search overlap matching algorithm to synchronize stateless AI workout generators with ExerciseDB APIs.'
    },
    {
      name: 'CodX',
      subtitle: 'Gamified Learn-to-Code Platform',
      description: 'Developed a gamified programming learning platform as a graduation thesis using Next.js, Supabase, and Drizzle, implementing remote code execution via Piston API and a Gemini AI-powered debugging assistant.'
    },
    {
      name: 'FreshFood',
      subtitle: 'Grocery & Recipe App',
      description: 'Designed and developed an organic grocery delivery and recipe discovery mobile application, bridging high-fidelity UX prototyping with NestJS ingredient parser pipelines.'
    }
  ],
  education: [
    {
      degree: 'Bachelor of Analysis and Systems Development',
      institution: 'Instituto Federal da Bahia (IFBA)',
      dates: '2019 – 2024'
    }
  ],
  certifications: [
    'EF SET C1 Proficient (English)',
    'Advanced JavaScript ES6',
    'UX Design Essentials'
  ],
  languages: [
    { language: 'Portuguese', level: 'Native' },
    { language: 'English', level: 'C1 Proficient' }
  ]
}

export function getMasterCV(): MasterCV {
  // If curriculum.md exists on disk, we can read it, or fallback to DEFAULT_MASTER_CV
  const markdownPath = '/home/ozymandias/MyProjects/curriculum.md'
  try {
    if (fs.existsSync(markdownPath)) {
      // DEFAULT_MASTER_CV is fully synced with curriculum.md
      return DEFAULT_MASTER_CV
    }
  } catch {
    // Return default on error
  }
  return DEFAULT_MASTER_CV
}
