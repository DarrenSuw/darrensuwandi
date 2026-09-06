'use client';

import { useState, useEffect, useRef } from 'react';
import type { Project } from '@/data/projects';

interface Props {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

type Tab = 'overview' | 'architecture' | 'implementation' | 'results';

const STATUS_COLOR: Record<string, string> = {
  LIVE: '#4ade80', SAAS: '#C49A00', HACKATHON: '#a78bfa', RESEARCH: '#38bdf8',
};

const TAB_LABELS: { key: Tab; label: string; emoji: string }[] = [
  { key: 'overview',        label: 'Overview',        emoji: '◈' },
  { key: 'architecture',    label: 'Architecture',    emoji: '⬡' },
  { key: 'implementation',  label: 'Implementation',  emoji: '⬣' },
  { key: 'results',         label: 'Results',         emoji: '◉' },
];

const TAB_HEADINGS: Record<Tab, { challenge: string; solution: string }> = {
  overview:       { challenge: 'The Problem',         solution: 'What It Does' },
  architecture:   { challenge: 'Design Constraints',  solution: 'System Architecture' },
  implementation: { challenge: 'Engineering Focus',   solution: 'How It Was Built' },
  results:        { challenge: 'Success Criteria',    solution: 'Outcomes & Impact' },
};

// Static left-column context per tab — short framing text.
const TAB_CONTEXT: Record<string, Record<Tab, string>> = {
  'resume-forge': {
    overview:       'Building a production SaaS solo meant every layer — OCR pipeline, ATS algorithm, diffing UI, billing — had to be designed and shipped by one person in 6 months.',
    architecture:   'The decoupled frontend/backend model lets the AI editor and ATS auditor evolve independently. Zustand keeps the UI in sync with live diff previews without prop drilling.',
    implementation: 'The hardest problem was building AgenticDiff — a React component that maps AI-proposed character-level changes back to the original parsed PDF structure with visual clarity.',
    results:        'Shipped to production with zero co-founders: Stripe billing, Redis caching, and Supabase persistence on day one. The agentic editor handles real CV rewrites end-to-end.',
  },
  'omni-qc': {
    overview:       'Factory AOI systems generate up to 70% false positives — boards flagged incorrectly waste technician time and slow throughput. A smarter risk layer was needed upstream.',
    architecture:   'The 5-stage pipeline is protocol-agnostic (OPC-UA, MQTT, IPC-CFX) so it plugs into existing MES without ripping out infrastructure. On-prem edge container option for air-gapped factories.',
    implementation: 'XGBoost was chosen over deep learning specifically for its speed on tabular data and SHAP compatibility — critical for ISO-level audit trails in regulated manufacturing.',
    results:        'Silver Award at SEA-CICSIC 2026 validates the approach. Projected 30–50% false alarm reduction directly translates to throughput gains across target production lines.',
  },
  'orion-reimbursement': {
    overview:       'Expense reimbursement is a high-friction, error-prone process. Manual triage, policy lookup, and approval chains create delays and compliance gaps at scale.',
    architecture:   'A deterministic policy engine (no LLM) handles rule checking for auditability. LLM calls are isolated to extraction, intelligence, and decision nodes — minimizing hallucination surface.',
    implementation: 'Designed and built the full frontend — Employee claim wizard, Manager swipe-to-approve cards, and Finance analytics. Also handled product pitch and design system.',
    results:        '85% backend test coverage. Playwright E2E covers all three role-based flows. Nightly GitHub Actions run live regression against the ILMU API.',
  },
  'startup-emp': {
    overview:       'Accelerators lose institutional memory when program managers rotate. Spreadsheets can\'t semantically match startups to mentors or persist cross-cohort learnings.',
    architecture:   'A storage abstraction layer lets the system run fully offline (local JSON) or in production (Firestore) — critical for hackathon demos without cloud credentials.',
    implementation: 'Gemini multimodal endpoint processes pitch deck images, graphs, and text in a single byte-stream call — no OCR step required. 25+ decks processed simultaneously with progress tracking.',
    results:        'Live on Firebase Hosting + Cloud Run (asia-southeast1). Sub-200ms extraction latency. Demo video and pitch deck publicly accessible. Submitted at MyHack 2025.',
  },
  'orion-hackathon': {
    overview:       'Enterprise procurement involves compliance checks, budget headroom queries, and catalog matching — all currently manual and slow. A structured agentic pipeline can automate all three in parallel.',
    architecture:   'Parallel fan-out to three independent agents then a 5-condition security gate is the core routing innovation — preventing any single agent failure from blocking the whole workflow.',
    implementation: 'Token budgeting in PromptBuilder ensures 4 sequential GLM calls stay within cost thresholds. Redis checkpointing means the workflow survives mid-flight crashes and can resume.',
    results:        'Full Docker Compose stack runs locally in one command. 5-table Supabase schema with audit log. CI/CD gate enforces pytest coverage before any merge to main.',
  },
  'kerjacerdas': {
    overview:       'Indonesia\'s job market has a triple mismatch: skill expectations vs. supply, geographic distribution, and salary transparency. Conventional keyword search can\'t resolve semantic gaps.',
    architecture:   'HNSW pgvector index provides sub-10ms nearest-neighbor queries at scale. The Token Efficiency Gate prevents wasted LLM spend when vector similarity is already conclusive.',
    implementation: 'Hybrid ranking (cosine + skill overlap + region + salary + experience) replicates recruiter intuition mathematically. PII regex filtering runs before any external model call.',
    results:        'Full 4-phase CI/CD pipeline. Employer monetization model (Pay-to-Unlock) built and functional. 7 formal documentation files including sequence diagrams and API specification.',
  },
  'blackjack-q-trainer': {
    overview:       'Standard Blackjack simulators hard-code basic strategy. This project trains an RL agent from scratch — no pre-loaded tables — and tests whether card counting + Kelly sizing produces positive EV.',
    architecture:   'Three clean modules (engine, agent, UI) with no shared globals. Threading allows 200K training episodes to run in the background without freezing the Pygame event loop.',
    implementation: 'Epsilon decay from 50% to 5% over training prevents premature convergence. Half-Kelly at low bankroll prevents ruin while still capturing positive-EV edges from counting.',
    results:        'Policy heatmaps reveal learned strategy deviations from basic strategy, especially at high true counts. Persistent Q-table enables long-run training across multiple sessions.',
  },
  'studybuddy': {
    overview:       'Students context-switch between note-taking, YouTube lectures, PDFs, and flashcard apps — losing flow state. One unified AI interface covers all study modalities.',
    architecture:   'Provider-agnostic backend: swapping Gemini → GPT → Claude requires only a model selector change — all prompting logic is provider-independent. Conversation history kept client-side for privacy.',
    implementation: 'Typewriter animation with cancel support keeps the UI feeling responsive even on long generations. YouTube transcript fetch is server-side to avoid CORS and API key exposure in the app.',
    results:        'Fully cross-platform Flutter build (iOS, Android, desktop). Three AI backends, YouTube Q&A, PDF analysis, image generation, and flashcard scoring — all in a single app.',
  },
};

export default function ProjectModal({ project, isOpen, onClose, onNext, onPrev }: Props) {
  const [tab, setTab] = useState<Tab>('overview');

  // Reset tab when project changes
  useEffect(() => { setTab('overview'); }, [project?.id]);

  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Focus trap & Escape
  useEffect(() => {
    if (!isOpen) {
      if (triggerRef.current) {
        triggerRef.current.focus();
        triggerRef.current = null;
      }
      return;
    }

    triggerRef.current = document.activeElement as HTMLElement;
    const modal = modalRef.current;

    if (modal) {
      const focusable = Array.from(
        modal.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      );
      if (focusable.length) focusable[0].focus();

      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
          return;
        }
        if (e.key === 'Tab' && focusable.length > 0) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const dotColor = STATUS_COLOR[project.status] ?? '#C49A00';
  const ctx = TAB_CONTEXT[project.id]?.[tab];
  const headings = TAB_HEADINGS[tab];

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      style={{
        paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))'
      }}
    >
      <style>{`
        .slide-arrow-wrap {
          display: inline-flex;
          position: relative;
          overflow: hidden;
          width: 1em;
          height: 1em;
          align-items: center;
          justify-content: center;
        }
        .slide-arrow-current {
          position: absolute;
          transition: transform 300ms var(--ease-entrance), opacity 300ms var(--ease-entrance);
        }
        .slide-arrow-next {
          position: absolute;
          opacity: 0;
          transform: translate(-6px, 6px);
          transition: transform 300ms var(--ease-entrance), opacity 300ms var(--ease-entrance);
        }
        .ts-btn:hover .slide-arrow-current {
          transform: translate(6px, -6px);
          opacity: 0;
        }
        .ts-btn:hover .slide-arrow-next {
          transform: translate(0, 0);
          opacity: 1;
        }
      `}</style>
      <style>{`
        .modal-stat-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .modal-stat-cell {
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        /* 2-col: right border on col 0 (even), bottom border on row 0 */
        .modal-stat-cell:nth-child(odd) {
          border-right: 1px solid var(--border);
        }
        .modal-stat-cell:nth-child(1),
        .modal-stat-cell:nth-child(2) {
          border-bottom: 1px solid var(--border);
        }
        @media (min-width: 768px) {
          .modal-stat-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          .modal-stat-cell:nth-child(odd) {
            border-right: 1px solid var(--border);
          }
          .modal-stat-cell:nth-child(even) {
            border-right: 1px solid var(--border);
          }
          .modal-stat-cell:last-child {
            border-right: none;
          }
          .modal-stat-cell:nth-child(1),
          .modal-stat-cell:nth-child(2) {
            border-bottom: none;
          }
        }
      `}</style>
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-lg"

        style={{ background: 'rgba(248,248,247,0.72)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl flex flex-col"
        style={{ background: 'var(--bg)', border: '1px solid var(--border)', boxShadow: '0 40px 100px rgba(0,0,0,0.14)' }}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.name} details`}
      >
        {/* ── Sticky header ── */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between gap-4 px-7 py-4"
          style={{ borderBottom: '1px solid var(--border)', background: 'rgba(248,248,247,0.96)', backdropFilter: 'blur(10px)' }}
        >
          <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dotColor }} />
            <span
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.10em',
                textTransform: 'uppercase', color: 'var(--text-muted)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}
            >
              {project.status} · {project.category} · {project.role}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onPrev}
              aria-label="Previous project"
              className="hover-gold min-w-[44px] min-h-[44px] flex items-center justify-center"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--text-muted)' }}
            >←</button>
            <button
              onClick={onNext}
              aria-label="Next project"
              className="hover-gold min-w-[44px] min-h-[44px] flex items-center justify-center"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--text-muted)' }}
            >→</button>
            <div className="w-px h-4 mx-1.5" style={{ background: 'var(--border)' }} />
            <button
              onClick={onClose}
              aria-label="Close project details"
              className="hover-gold min-w-[44px] min-h-[44px] flex items-center justify-center rounded"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--text-muted)' }}
            >✕</button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-col gap-8 p-7 md:p-9">

          {/* Title + CTA buttons */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="t-display" style={{ fontSize: '1.75rem' }}>{project.name}</h2>
              <p className="t-body" style={{ fontSize: '0.9rem', maxWidth: '58ch' }}>{project.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ink ts-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.4.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.32-1.75-1.32-1.75-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.23 1.83 1.23 1.06 1.82 2.78 1.29 3.46.99.1-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z"/>
                  </svg>
                  View on GitHub
                  <span className="slide-arrow-wrap">
                    <span className="slide-arrow-current">↗</span>
                    <span className="slide-arrow-next">↗</span>
                  </span>
                </a>

              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold ts-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  ◉ Live App
                  <span className="slide-arrow-wrap">
                    <span className="slide-arrow-current">↗</span>
                    <span className="slide-arrow-next">↗</span>
                  </span>
                </a>

              )}
            </div>
          </div>

          {/* Stats strip */}
          <div className="modal-stat-grid">
            {project.stats.map((s, i) => (
              <div key={i} className="modal-stat-cell">
                <span className="t-eyebrow">{s.label}</span>
                <span className="t-display" style={{ fontSize: '1rem' }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Stack pills */}
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map(tech => (
              <span
                key={tech}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.09em',
                  padding: '3px 9px', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)',
                  color: 'var(--text-muted)', background: 'var(--surface)',
                }}
              >{tech}</span>
            ))}
          </div>

          {/* Tabs */}
          <div>
            <div className="flex gap-0" style={{ borderBottom: '1px solid var(--border)' }}>
              {TAB_LABELS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em',
                    textTransform: 'uppercase', padding: '9px 14px',
                    color: tab === t.key ? 'var(--text-primary)' : 'var(--text-muted)',
                    borderBottom: tab === t.key ? '2px solid var(--gold)' : '2px solid transparent',
                    marginBottom: '-1px', background: 'transparent',
                    transition: 'color 0.15s', fontWeight: tab === t.key ? 600 : 400,
                  }}
                >
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8 pt-6">
              {/* Left — context / framing */}
              <div className="flex flex-col gap-3">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  ● {headings.challenge}
                </span>
                <p className="t-body" style={{ fontSize: '0.875rem', lineHeight: 1.78 }}>
                  {ctx ?? 'Context coming soon.'}
                </p>
              </div>
              {/* Right — main content */}
              <div className="flex flex-col gap-3">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                  ● {headings.solution}
                </span>
                <p className="t-body" style={{ fontSize: '0.875rem', lineHeight: 1.78, color: 'var(--text-primary)' }}>
                  {project[tab]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
