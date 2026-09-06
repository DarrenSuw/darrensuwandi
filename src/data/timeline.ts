export type TimelineEntryType = 'research' | 'award' | 'project' | 'education' | 'hackathon'

export type TimelineEntry = {
  id: string
  projectId?: string
  date: string
  type: TimelineEntryType
  title: string
  description: string
  badge?: string
}

export const timeline: TimelineEntry[] = [
  {
    id: 'whatif-forecaster',
    projectId: 'whatif-forecaster',
    date: 'Apr 2026 - Present',
    type: 'project',
    title: 'WhatIf Forecaster',
    description: 'Engineered a decoupled AutoML SaaS platform utilizing FastAPI and FLAML to automate model selection with real-time training logs streamed via SSE.',
  },
  {
    id: 'resume-forge',
    projectId: 'resume-forge',
    date: 'Feb 2026 - Aug 2026',
    type: 'project',
    title: 'Resume Forge',
    description: 'Architected a dual-phase ATS scoring engine and an agentic editing suite with Zustand state management.',
  },
  {
    id: 'kerjacerdas-job',
    projectId: 'kerjacerdas',
    date: 'Apr 2026 - Jun 2026',
    type: 'project',
    title: 'KerjaCerdas Job-Matching Platform',
    description: 'Architected a LangGraph ReAct Supervisor Swarm routing parallel worker agents, built a hybrid ranking engine on PostgreSQL (pgvector).',
  },
  {
    id: 'sea-cicsic-2026',
    projectId: 'omni-qc',
    date: 'Jun 2026',
    type: 'award',
    title: 'SEA-CICSIC 2026 — Omni-QC',
    description: 'Silver Award in the Undergraduate Division. Engineered rapid-viability full-stack AI prototypes.',
    badge: 'Silver Award',
  },
  {
    id: 'startup-emp',
    projectId: 'startup-emp',
    date: 'May 2026',
    type: 'project',
    title: 'Startup EMP',
    description: 'Architected a serverless FastAPI application on Google Cloud Run and Firestore, integrating a LangGraph-orchestrated Gemini pipeline.',
  },
  {
    id: 'digdaya-2026',
    projectId: 'kerjacerdas',
    date: 'May 2026',
    type: 'award',
    title: 'Digdaya 2026 — KerjaCerdas',
    description: 'Finalist. Mitigated LLM hallucinations via strict Pydantic schema enforcement.',
    badge: 'Finalist',
  },
  {
    id: 'omniqc',
    projectId: 'omni-qc',
    date: 'Mar 2026 - May 2026',
    type: 'project',
    title: 'Omni-QC SMT Quality Control System',
    description: 'Directed a 7-person engineering team to deliver a predictive defect-routing SaaS, reducing total AOI inspection workloads by 30-50%.',
  },
  {
    id: 'orion-reimbursement',
    projectId: 'orion-reimbursement',
    date: 'Apr 2026',
    type: 'project',
    title: 'Orion Reimbursement System',
    description: 'Led the frontend architecture delivering a role-based React and TypeScript dashboard integrated with a 6-agent LangGraph workflow.',
  },
  {
    id: 'aska-maintenance',
    projectId: 'aska-automation',
    date: 'Mar 2026 - Apr 2026',
    type: 'project',
    title: 'AskA Maintenance Automation',
    description: 'Engineered intelligent email routing and automated worker assignment via Google Calendar while deploying an LLM conversational agent.',
  },
  {
    id: 'study-buddy',
    projectId: 'studybuddy',
    date: 'Feb 2026 - Mar 2026',
    type: 'project',
    title: 'Study Buddy',
    description: 'Developed a cross-platform learning assistant integrating Gemini, GPT, and Claude APIs with automated data processing pipelines.',
  },
  {
    id: 'blackjack-qtrainer',
    projectId: 'blackjack-q-trainer',
    date: 'Jan 2026 - Apr 2026',
    type: 'project',
    title: 'Blackjack Q-Trainer',
    description: 'Developed a Reinforcement Learning simulation, training a Q-Learning agent over 200,000 episodes with dynamic bankroll sizing.',
  },
  {
    id: 'hackathons-2026',
    date: 'Jan 2026 - Apr 2026',
    type: 'hackathon',
    title: 'UM Hackathon & MyHack Google Hackathon',
    description: 'Active Hackathon Competitor engineering rapid-viability full-stack AI prototypes under strict 24-to-48-hour constraints.',
  },
  {
    id: 'coding-club',
    date: 'Apr 2026 - Present',
    type: 'education',
    title: 'Coding Club Member',
    description: 'Engaged in practical engineering workshops focusing on CI/CD pipelines and full-stack web development.',
  },
  {
    id: 'xmum-enrolled',
    date: 'Sep 2025 - Present',
    type: 'education',
    title: 'Artificial Intelligence Club Member & Enrolled XMUM',
    description: 'Participated in technical discourse and collaborative initiatives focused on Git workflows, n8n automation, and machine learning.',
  },
]
