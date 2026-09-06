export type AcademicHonor = {
  institution: string
  program: string
  location: string
  gpa: string
  duration: string
  scholarship: string
  deansList: { label: string; date: string }[]
}

export type CompetitionAward = {
  id: string
  badge: string // e.g. 'SILVER AWARD', 'FINALIST'
  name: string
  division?: string
  project: string
  date: string
}

export type Participation = {
  name: string
  date?: string
}

export const academic: AcademicHonor = {
  institution: 'Xiamen University Malaysia',
  program: 'Bachelor of Digital Media & Technology',
  location: 'Selangor, Malaysia',
  gpa: '3.86 / 4.00',
  duration: 'Sep 2024 – Aug 2028',
  scholarship: 'Full Tuition Scholarship · 2024 – Present',
  deansList: [
    { label: 'Sem 1', date: 'Sep 2024' },
    { label: 'Sem 2', date: 'Apr 2025' },
    { label: 'Sem 3', date: 'Sep 2025' },
  ],
}

export const competitions: CompetitionAward[] = [
  {
    id: 'sea-cicsic-2026',
    badge: 'SILVER AWARD',
    name: 'SEA-CICSIC 2026',
    division: 'Undergraduate Division',
    project: 'Omni-QC',
    date: 'Jun 2026',
  },
  {
    id: 'digdaya-2026',
    badge: 'FINALIST',
    name: 'Digdaya 2026',
    project: 'KerjaCerdas',
    date: 'May 2026',
  },
]

export const participation: Participation[] = [
  { name: 'UM Hackathon 2026' },
  { name: 'MyHack Google Hackathon 2026' },
]
