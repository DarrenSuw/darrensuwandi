'use client';

import { useEffect, useRef, useState } from 'react';
import { academic, competitions } from '@/data/awards';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import DecisionBoundaryField from '@/components/ui/DecisionBoundaryField';

const deansListCount = academic.deansList.length;
const gpa = academic.gpa;
const silverAward = competitions.find((c) => c.badge === 'SILVER AWARD');

// Static display values (used as targets for count-up and as fallback)
const stats = [
  { label: 'GPA',            value: gpa,                          numeric: true  },
  { label: "Dean's List",    value: `${deansListCount}×`,         numeric: true  },
  { label: silverAward?.name ?? 'SEA-CICSIC 2026', value: 'Silver Award', numeric: false },
  { label: 'Authorship',     value: '1 Paper (In Prep)',             numeric: false },
];

// Parse a display value into its numeric component and suffix
function parseValue(v: string): { num: number; suffix: string } {
  const match = v.match(/^([\d.]+)(.*)$/);
  if (!match) return { num: 0, suffix: v };
  return { num: parseFloat(match[1]), suffix: match[2] };
}

// easeOut quad for the count-up
function easeOut(t: number) {
  return 1 - (1 - t) * (1 - t);
}

export default function HeroSection() {
  // ── Stat strip count-up ─────────────────────────
  const statsRef = useRef<HTMLDivElement>(null);
  const statsVisible = useScrollReveal(statsRef, { threshold: 0.5 });
  const [displayed, setDisplayed] = useState(stats.map(s => s.value));
  const hasCountedUp = useRef(false);

  useEffect(() => {
    if (!statsVisible || hasCountedUp.current) return;
    hasCountedUp.current = true;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisplayed(stats.map(s => s.value));
      return;
    }

    const duration = 900;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const rawT = Math.min(elapsed / duration, 1);
      const t = easeOut(rawT);

      setDisplayed(stats.map((s) => {
        if (!s.numeric) return s.value; // non-numeric fades in as-is
        const { num, suffix } = parseValue(s.value);
        const current = num * t;
        // format with same decimal places as target
        const decimals = s.value.includes('.') ? (s.value.split('.')[1]?.replace(/\D/g, '').length ?? 0) : 0;
        return current.toFixed(decimals) + suffix;
      }));

      if (rawT < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [statsVisible]);

  // ── Load-time entrance delays ───────────────────
  const delays = [0, 80, 160, 240, 340, 440, 580];
  const revealStyle = (i: number): React.CSSProperties => ({
    animationName: 'fadeUp',
    animationDuration: '600ms',
    animationTimingFunction: 'var(--ease-entrance)',
    animationFillMode: 'both',
    animationDelay: `${delays[i]}ms`,
  });

  return (
    <section id="hero" className="glass-section" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '140px', paddingBottom: 'var(--space-9)' }}>
      <DecisionBoundaryField />
      <div style={{ position: 'relative', zIndex: 1 }}>
      <div className="sc">

        <div className="grid md:grid-cols-[240px_1fr] gap-12 md:gap-16 items-center mb-16">
          {/* Left: Image Placeholder */}
          <div
            className="w-full relative rounded-2xl overflow-hidden shadow-sm flex-shrink-0"
            style={{ aspectRatio: '3/4', background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            {/* 3:4 Image placeholder reserved for your photo */}
          </div>

          {/* Right: Text Content — each child gets a staggered fadeUp */}
          <div className="flex flex-col">
            {/* Eyebrow — delay 0 */}
            <div className="flex items-center gap-3 mb-6 md:mb-8" style={revealStyle(0)}>
              <span style={{ display: 'block', width: '20px', height: '1px', background: 'var(--gold)' }} />
              <span className="t-label">ML Researcher &amp; AI Engineer</span>
            </div>

            {/* Headline — delay 80 */}
            <h1
              className="t-display gold-glow"
              style={{ ...revealStyle(1), fontSize: 'clamp(2.25rem, 4.5vw, 4.25rem)', maxWidth: '20ch', marginBottom: 'var(--space-4)', lineHeight: 1.1 }}
            >
              Building ML systems that reason, explain, and hold up under{' '}
              <span style={{ color: 'var(--gold)' }}>pressure.</span>
            </h1>

            {/* Subtext — delay 240 (was 160 for line2, but headline is one block) */}
            <p className="t-body" style={{ ...revealStyle(2), maxWidth: '46ch', marginBottom: 'var(--space-6)', fontSize: '0.9375rem' }}>
              I research adversarial robustness and explainability — and ship the full-stack systems around the models that pass.
            </p>

            {/* CTAs — delay 340 */}
            <div className="flex flex-wrap gap-2.5" style={revealStyle(3)}>
              <a href="#research" className="btn-ink">View Research</a>
              <a href="#projects" className="btn-gold">See Projects</a>
              <a href="/resume.pdf" download className="btn-ghost">Resume ↓</a>
            </div>
          </div>
        </div>

        {/* Stat strip — delay 580; count-up triggered by scroll into view */}
        <div
          ref={statsRef}
          className="flex flex-wrap gap-y-6"
          style={{
            ...revealStyle(4),
            borderTop: '1px solid var(--border)',
            paddingTop: 'var(--space-5)',
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="flex flex-col gap-1.5"
              style={{
                paddingRight: 'var(--space-7)',
                paddingLeft: i !== 0 ? 'var(--space-7)' : '0',
                borderLeft: i !== 0 ? '1px solid var(--border)' : 'none',
              }}
            >
              <span className="t-eyebrow">{s.label}</span>
              <span
                className="t-display"
                style={{
                  fontSize: '1rem',
                  letterSpacing: '-0.01em',
                  color: 'var(--text-primary)',
                  // non-numeric stats use a fadeIn animation when stats are visible
                  ...((!s.numeric && statsVisible)
                    ? { animationName: 'fadeIn', animationDuration: '900ms', animationTimingFunction: 'var(--ease-entrance)', animationFillMode: 'both' }
                    : {}),
                }}
              >
                {displayed[i]}
              </span>
            </div>
          ))}
        </div>

      </div>
      </div>
    </section>
  );
}
