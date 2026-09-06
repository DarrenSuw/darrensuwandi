'use client';

import { useRef, useEffect, useState } from 'react';
import { academic, competitions, participation } from '@/data/awards';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import MaskReveal from '@/components/ui/MaskReveal';


function easeOut(t: number) { return 1 - (1 - t) * (1 - t); }

export default function RecognitionSection() {
  // ── Refs & visibility ───────────────────────────
  const headerRef  = useRef<HTMLDivElement>(null);
  const inkCardRef = useRef<HTMLDivElement>(null);
  const awardsRef  = useRef<HTMLDivElement>(null);
  const stripRef   = useRef<HTMLDivElement>(null);

  const headerVisible  = useScrollReveal(headerRef,  { threshold: 0.3 });
  const inkVisible     = useScrollReveal(inkCardRef, { threshold: 0.2 });
  const awardsVisible  = useScrollReveal(awardsRef,  { threshold: 0.2 });
  const stripVisible   = useScrollReveal(stripRef,   { threshold: 0.3 });

  // ── GPA count-up ────────────────────────────────
  const [gpaDisplay, setGpaDisplay] = useState('0.00');
  const hasCounted = useRef(false);

  useEffect(() => {
    if (!inkVisible || hasCounted.current) return;
    hasCounted.current = true;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = parseFloat(academic.gpa);
    if (prefersReduced || isNaN(target)) {
      setGpaDisplay(academic.gpa);
      return;
    }

    const duration = 1000;
    const start = performance.now();
    function tick(now: number) {
      const t = easeOut(Math.min((now - start) / duration, 1));
      setGpaDisplay((target * t).toFixed(2));
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inkVisible]);

  // ── Shared entrance helper ───────────────────────
  const reveal = (visible: boolean, delay: number, translateY = 20, duration = 600): React.CSSProperties =>
    visible
      ? { animationName: 'recognitionReveal', animationDuration: `${duration}ms`, animationTimingFunction: 'var(--ease-entrance)', animationFillMode: 'both', animationDelay: `${delay}ms` }
      : { opacity: 0, transform: `translateY(${translateY}px)` };

  // last award card finishes at 500 + 150 = 650ms; participation strip 200ms after
  const stripDelay = 650 + 200;

  return (
    <>
      <style>{`
        @keyframes recognitionReveal {
          from { opacity: 0; transform: translateY(var(--rev-y, 20px)); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes badgePop {
          from { opacity: 0; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <section id="recognition" className="glass-section" style={{ paddingTop: 'var(--section-gap)', paddingBottom: 'var(--section-gap)', borderTop: '1px solid var(--border)' }}>
        <div className="sc">
          {/* Header */}
          <div ref={headerRef} className="flex flex-col gap-4 mb-12">
            <span
              className="t-label"
              style={headerVisible ? { animationName:'fadeUp', animationDuration:'600ms', animationTimingFunction:'var(--ease-entrance)', animationFillMode:'both', animationDelay:'0ms' } : { opacity:0 }}
            >// Recognition</span>
            <MaskReveal visible={headerVisible} delay={80}>
              <h2
                className="t-display"
                style={{ fontSize: 'clamp(1.875rem, 3.5vw, 2.75rem)' }}
              >Academic &amp; Competition Record</h2>
            </MaskReveal>

          </div>

          <div className="flex flex-col gap-5">
            {/* Dark XMUM card — heavier entrance (700ms, 40px) */}
            <div
              ref={inkCardRef}
              className="grid md:grid-cols-[1fr_auto] gap-8 p-8 rounded-2xl relative overflow-hidden"
              style={{
                background: 'var(--ink)',
                ...(inkVisible
                  ? { animationName:'recognitionReveal', animationDuration:'700ms', animationTimingFunction:'var(--ease-entrance)', animationFillMode:'both', '--rev-y':'40px' } as React.CSSProperties
                  : { opacity:0, transform:'translateY(40px)' }),
              }}
            >
              {/* Subtle inner glow */}
              <div className="absolute top-0 right-0 w-56 h-56 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(196,154,0,0.08), transparent 70%)' }} />
              <div className="relative flex flex-col gap-5">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)' }}>{academic.duration}</span>
                <div>
                  <h3 className="t-display" style={{ fontSize: '1.5rem', color: 'var(--bg)', marginBottom: '4px' }}>{academic.institution}</h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{academic.program} · {academic.location}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {academic.deansList.map(dl => (
                    <span key={dl.label} style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 10px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius-pill)', color: 'rgba(255,255,255,0.6)' }}>
                      Dean&apos;s List · {dl.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative flex flex-col gap-5 md:items-end">
                <div className="flex flex-col gap-0.5 md:items-end">
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>GPA</span>
                  {/* GPA count-up — /4.00 fades in simultaneously */}
                  <span className="t-display" style={{ fontSize: '2.75rem', color: 'var(--bg)' }}>
                    {gpaDisplay}
                    <span
                      style={inkVisible
                        ? { animationName:'fadeIn', animationDuration:'1000ms', animationTimingFunction:'var(--ease-entrance)', animationFillMode:'both' }
                        : { opacity:0 }}
                    > / 4.00</span>
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 md:items-end">
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Scholarship</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--gold)' }}>{academic.scholarship}</span>
                </div>
              </div>
            </div>

            {/* Award cards — stagger 150ms, badges pop after their card */}
            <div ref={awardsRef} className="grid md:grid-cols-2 gap-0" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
              {competitions.map((comp, i) => (
                <div
                  key={comp.id}
                  className={`flex flex-col gap-3 p-6 ${i === 0 ? 'border-b md:border-b-0 md:border-r border-[var(--border)]' : ''}`}
                  style={{
                    ...(awardsVisible
                      ? { animationName:'recognitionReveal', animationDuration:'500ms', animationTimingFunction:'var(--ease-entrance)', animationFillMode:'both', animationDelay:`${i * 150}ms` }
                      : { opacity:0, transform:'translateY(20px)' }),
                  }}
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Badge — pops with overshoot 100ms after card starts */}
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase',
                        padding: '3px 8px', borderRadius: 'var(--radius-sm)', background: 'rgba(196,154,0,0.08)', color: 'var(--gold-dark)', border: '1px solid rgba(196,154,0,0.25)',
                        ...(awardsVisible
                          ? { animationName:'badgePop', animationDuration:'300ms', animationTimingFunction:'var(--ease-arrival)', animationFillMode:'both', animationDelay:`${i * 150 + 100}ms` }
                          : { opacity:0, transform:'scale(0.8)' }),
                      }}
                    >{comp.badge}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>{comp.date}</span>
                  </div>
                  <div>
                    <h4 className="t-display" style={{ fontSize: '1.0625rem', marginBottom: '3px' }}>{comp.name}</h4>
                    {comp.division && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{comp.division}</p>}
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--gold)', letterSpacing: '0.08em', marginTop: '6px', display: 'block' }}>
                      Project: {comp.project}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Participation strip — fades in after last award card completes */}
            <div
              ref={stripRef}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5"
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                ...(stripVisible
                  ? { animationName:'fadeIn', animationDuration:'400ms', animationTimingFunction:'var(--ease-entrance)', animationFillMode:'both', animationDelay:`${stripDelay}ms` }
                  : { opacity:0 }),
              }}
            >
              <span className="t-eyebrow">Also participated:</span>
              {participation.map((p, i) => (
                <span key={i} style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {p.name}{i < participation.length - 1 ? ' ·' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
