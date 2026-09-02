export type TimelineEntryType = 'research' | 'award' | 'project' | 'education' | 'hackathon'

export type TimelineEntry = {
  id: string
  date: string
  type: TimelineEntryType
  title: string
  description: string
  badge?: string
}

// All dates/titles are as given in the blueprint. Descriptions are one-liners —
// tighten any that feel flat, but the facts here should already be correct.
export const timeline: TimelineEntry[] = [
  {
    id: 'ml-researcher-xmum',
    date: '2026 · Current Focus',
    type: 'research',
    title: 'ML Researcher — XMUM',
    description: 'Adversarial ML + XAI under Dr. Teh Jia Yew and Dr. Goh Sim Kuan. Paper in preparation.',
  },
  {
    id: 'resume-forge-v1',
    date: 'Aug 2026',
    type: 'project',
    title: 'Resume Forge — v1 shipped',
    description: 'SaaS product shipped after a 6-month build.',
  },
  {
    id: 'sea-cicsic-2026',
    date: 'Jun 2026',
    type: 'award',
    title: 'SEA-CICSIC 2026 — Omni-QC',
    description: 'Undergraduate Division, Silver Award.',
    badge: 'Silver Award',
  },
  {
    id: 'digdaya-2026',
    date: 'May 2026',
    type: 'award',
    title: 'Digdaya 2026 — Startup EMP',
    description: 'Finalist.',
    badge: 'Finalist',
  },
  {
    id: 'orion-kerjacerdas',
    date: 'Apr 2026',
    type: 'hackathon',
    title: 'Orion · KerjaCerdas',
    description: 'UM Hackathon participant.',
  },
  {
    id: 'omniqc-lead-aska',
    date: 'Mar 2026',
    type: 'project',
    title: 'Omni-QC — Project Lead (7-person team)',
    description: 'AskA commissioned by XMUM MQA.',
  },
  {
    id: 'resumeforge-studybuddy',
    date: 'Feb 2026',
    type: 'project',
    title: 'Resume Forge initiated · StudyBuddy shipped',
    description: '[[fill in — one line on what shipped/started here]]',
  },
  {
    id: 'blackjack-myhack',
    date: 'Jan 2026',
    type: 'hackathon',
    title: 'Blackjack Q-Trainer · MyHack Google Hackathon',
    description: '[[fill in — one line]]',
  },
  {
    id: 'xmum-enrolled',
    date: 'Sep 2025',
    type: 'education',
    title: 'Enrolled XMUM · AI Club member',
    description: "Dean's List, Semester 1.",
  },
]
