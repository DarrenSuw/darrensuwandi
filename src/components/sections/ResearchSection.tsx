'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import MaskReveal from '@/components/ui/MaskReveal';


const researchStats = [
  { label: 'Primary Classifier', value: 'XGBoost' },
  { label: 'Explainability', value: 'SHAP' },
  { label: 'Pipeline Design', value: 'Anti-Leakage' },
];

export default function ResearchSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef  = useRef<HTMLDivElement>(null);
  const supervisorRef = useRef<HTMLDivElement>(null);

  const headerVisible     = useScrollReveal(headerRef,     { threshold: 0.3 });
  const cardsVisible      = useScrollReveal(cardsRef,      { threshold: 0.3 });
  const supervisorVisible = useScrollReveal(supervisorRef, { threshold: 0.3 });

  // method card entrance: translateX(-12px) + opacity, 500ms, stagger 0/120/240
  const cardReveal = (i: number): React.CSSProperties =>
    cardsVisible
      ? {
          animationName: 'researchCardReveal',
          animationDuration: '500ms',
          animationTimingFunction: 'var(--ease-entrance)',
          animationFillMode: 'both',
          animationDelay: `${i * 120}ms`,
        }
      : { opacity: 0, transform: 'translateX(-12px)' };

  // supervisor fade-in: starts after cards complete (240 + 500 = 740ms)
  const supervisorReveal = (i: number): React.CSSProperties =>
    supervisorVisible
      ? {
          animationName: 'fadeIn',
          animationDuration: '400ms',
          animationTimingFunction: 'var(--ease-entrance)',
          animationFillMode: 'both',
          animationDelay: `${740 + i * 100}ms`,
        }
      : { opacity: 0 };

  return (
    <>
      <style>{`
        @keyframes researchCardReveal {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .research-method-cell {
          transition: border-color 0.2s;
        }
        .research-method-cell:hover {
          border-color: rgba(196,154,0,0.45) !important;
        }
        .research-method-cell:hover .research-method-label {
          color: var(--gold) !important;
          transition: color 0.2s;
        }
        .research-method-label {
          transition: color 0.2s;
        }
      `}</style>

      <section id="research" className="glass-section" style={{ paddingTop: 'var(--section-gap)', paddingBottom: 'var(--section-gap)', borderTop: '1px solid var(--border)' }}>
        <div className="sc">

          {/* Header */}
          <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
            <div className="flex flex-col gap-4" style={{ maxWidth: '50ch' }}>
              <span
                className="t-label"
                style={headerVisible ? { animationName:'fadeUp', animationDuration:'600ms', animationTimingFunction:'var(--ease-entrance)', animationFillMode:'both', animationDelay:'0ms' } : { opacity:0 }}
              >// Research</span>
              <MaskReveal visible={headerVisible} delay={80}>
                <h2
                  className="t-display"
                  style={{ fontSize: 'clamp(1.875rem, 3.5vw, 2.75rem)' }}
                >
                  Adversarial ML<br />&amp; Explainability
                </h2>
              </MaskReveal>

              <p
                className="t-body"
                style={{ fontSize: '0.9rem', ...(headerVisible ? { animationName:'fadeUp', animationDuration:'600ms', animationTimingFunction:'var(--ease-entrance)', animationFillMode:'both', animationDelay:'160ms' } : { opacity:0 }) }}
              >
                Research at XMUM under Dr. Teh Jia Yew and Dr. Goh Sim Kuan. Building pipelines that are robust to adversarial inputs and interpretable via feature attribution.
              </p>
            </div>

            {/* Paper chip — existing ping dot untouched */}
            <div
              className="flex items-center gap-3 shrink-0"
              style={{
                border: '1px solid var(--gold)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 16px',
                background: 'rgba(196,154,0,0.04)',
                ...(headerVisible ? { animationName:'fadeUp', animationDuration:'600ms', animationTimingFunction:'var(--ease-entrance)', animationFillMode:'both', animationDelay:'260ms' } : { opacity:0 }),
              }}
            >
              <span className="relative flex" style={{ width: '7px', height: '7px', flexShrink: 0 }}>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full" style={{ backgroundColor: 'var(--gold)', opacity: 0.6 }} />
                <span className="relative inline-flex rounded-full" style={{ width: '7px', height: '7px', backgroundColor: 'var(--gold)' }} />
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                Manuscript in preparation · IET Information Security
              </span>
            </div>
          </div>

          {/* Method cards */}
          <div
            ref={cardsRef}
            className="grid grid-cols-3"
            style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
          >
            {researchStats.map((s, i) => (
              <div
                key={s.label}
                className="research-method-cell flex flex-col gap-2 p-6"
                style={{
                  borderRight: i < researchStats.length - 1 ? '1px solid var(--border)' : 'none',
                  ...cardReveal(i),
                }}
              >
                <span className="t-label research-method-label" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                <span className="t-display" style={{ fontSize: '1.625rem' }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Supervisors */}
          <div ref={supervisorRef} className="flex flex-wrap gap-x-10 gap-y-4 mt-10 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
            {[
              { role: 'Supervisor',   name: 'Dr. Teh Jia Yew' },
              { role: 'Co-Supervisor', name: 'Dr. Goh Sim Kuan' },
              { role: 'Institution',  name: 'Xiamen University Malaysia' },
            ].map((s, i) => (
              <div key={s.role} className="flex flex-col gap-1" style={supervisorReveal(i)}>
                <span className="t-eyebrow">{s.role}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
