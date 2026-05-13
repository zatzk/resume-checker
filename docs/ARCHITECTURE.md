# Technical Architecture Report: cv-tool

## 1. Overview
The `cv-tool` is a professional resume diagnostic and optimization engine built with a "Terminal Industrial" aesthetic. It leverages modern AI to transform raw CV data into high-fidelity "American Model" resumes, providing multi-persona feedback (ATS, Career, Strategist) along the way.

## 2. Tech Stack & Integrations

| Layer | Technology | Integration Role |
|-------|------------|------------------|
| **Framework** | Next.js 16 (App Router) | Full-stack framework, SSR, and API routes. |
| **Database** | Prisma + SQLite | Type-safe ORM with local file-based persistence. |
| **Styling** | Tailwind CSS 4 | Zero-config, CSS-first styling with custom `@theme` tokens. |
| **AI Orchestration** | Vercel AI SDK (`ai`) | Structured object generation and provider agnosticism. |
| AI Providers | Google (Gemini), NVIDIA (Llama) | Core LLM engines for analysis and generation. |
| **PDF Processing** | @react-pdf/renderer | Client-side/Server-side PDF generation from JSON schema. |
| **Parsing** | pdf-parse v2 | Text extraction from uploaded resume files (fixed for Next.js worker bundling). |
| **Validation** | Zod | Runtime schema validation for AI outputs and API requests. |

## 3. Architecture & Data Flow

### 3.1 Data Flow: Resume Optimization
1.  **Extraction**: Raw text is extracted from user-uploaded PDFs via `api/extract-text`. Fixed `pdf-parse` v2 class instantiation and Next.js worker bundling issues via `serverExternalPackages`.
2.  **Analysis Input**: Extracted text and Job Descriptions are passed to `api/analyze`.
3.  **AI Transformation**:
    *   `generateObject` (Vercel AI SDK) uses a Zod schema to enforce a structured response.
    *   **Growth & Development Protocol**: Enhanced analysis now includes "Growth Tips" (Area, Skill to Acquire, Action Plan, Impact) and a "Strategic Action Plan".
    *   Heuristics calculate scores for ATS, Career, and Strategy personas.
    *   **Resume Worded Standards**: The engine rewrites the CV into an "American Resume Model" JSON structure following quantified achievement standards (Action Verb + Quantified Accomplishment + Metric/Impact).
4.  **State Hydration**: Results are stored in the `AnalysisProvider` context for multi-page access (`/analysis/loading` -> `/analysis/feedback`).
5.  **Artifact Generation**: The JSON structure is passed to `CVDocument.tsx` (`@react-pdf/renderer`) and `ResumePreview.tsx` for final rendering and preview.

### 3.2 System State Management
*   **Persistent State**: Stored in SQLite (via Prisma) for Applications, CVs, and User Profiles.
*   **Ephemeral Session State**: Managed via React Context (`AnalysisProvider`) to bridge the gap between AI generation and user preview/editing.

## 4. Project Structure

```text
├── app/                  # Next.js App Router
│   ├── analysis/         # Analysis flow (New -> Loading -> Feedback)
│   ├── api/              # AI and data endpoints
│   ├── dashboard/        # User main hub
│   ├── globals.css       # Tailwind 4 theme and Brutalist components
│   └── layout.tsx        # Root layout with Sidebar integration
├── components/           # UI Layer
│   ├── ui/               # (Pending) Primitive shadcn-style components
│   ├── AnalysisProvider  # Global analysis state
│   ├── ResumePreview     # High-fidelity CV rendering (HTML)
│   └── CVDocument        # High-fidelity CV rendering (PDF)
├── lib/                  # Utilities
│   ├── prisma.ts         # Database client singleton
│   └── mockData.ts       # Development fixtures
├── prisma/               # Database Schema
│   └── schema.prisma     # Models: UserProfile, Project, CV, Application, AnalysisReport
└── scripts/              # Dev tools
    └── test-ai.ts        # AI prompt testing utility
```

## 5. Technical Foundation Status (RAG)

| Module | Status | Notes |
|--------|--------|-------|
| **Database Setup** | 🟢 GREEN | Prisma schema is robust and covers all necessary domains. |
| **API Routing** | 🟢 GREEN | Clean separation of concerns; AI integration is highly structured. |
| **UI Component Library**| 🟡 AMBER | Aesthetic is strong, but relies on global CSS classes rather than modularized components in `components/ui`. |
| **AI Integration** | 🟢 GREEN | Excellent use of `generateObject` for deterministic behavior. |
| **State Management** | 🟢 GREEN | Context provider handles the heavy lifting of multi-step analysis. |

## 6. Architectural Debt & Recommendations

### 6.1 Identified Debt
1.  **Auth Layer**: No authentication system (NextAuth) is currently implemented. Data is global or relies on local DB state without user isolation.
2.  **Component Modularization**: UI components like `brutalist-button` are in `globals.css`. These should be moved to a proper `components/ui` library (e.g., using `cva` for variants).
3.  **Storage**: PDF extractions are purely text-based. No binary storage (S3/Vercel Blob) for original user uploads.
4.  **Testing**: Missing unit tests for the complex AI transformation logic and PDF generation.

### 6.2 Recommendations
*   **Implement Auth**: Integrate Auth.js (NextAuth) to secure the `dashboard` and `profile` routes.
*   **Component Migration**: Move `globals.css` components into a shadcn-like structure in `components/ui` to improve maintainability.
*   **Error Boundaries**: Add React Error Boundaries specifically for the PDF rendering and AI streaming components.
*   **AI Mocking**: Implement a mock AI provider for development to save API credits and enable offline testing.
