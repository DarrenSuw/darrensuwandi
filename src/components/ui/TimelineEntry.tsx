'use client';

import { useRef } from 'react';
import type { TimelineEntry as T } from '@/data/timeline';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const DOT_COLOR: Record<string, string> = {
  award:     '#C49A00',
  research:  '#C49A00',
  project:   '#111110',
  hackathon: '#a78bfa',
  education: '#D9D9D6',
};

export default function TimelineEntry({ entry, isCurrent, isLast }: { entry: T; isCurrent?: boolean; isLast?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  // Trigger when the dot crosses ~70% of viewport height
  const isVisible = useScrollReveal(ref, { threshold: 0.1 });

  const isAward = entry.type === 'award';
  const isEd    = entry.type === 'education';
  const dotColor = isCurrent ? '#C49A00' : (DOT_COLOR[entry.type] ?? '#D9D9D6');
  const dotSize  = isCurrent ? 12 : isEd ? 7 : 9;

  // Entry: translateX(20px) → 0 + opacity, 450ms ease-out
  const entryReveal: React.CSSProperties = isVisible
    ? { animationName: 'timelineEntryReveal', animationDuration: '450ms', animationTimingFunction: 'ease-out', animationFillMode: 'both' }
    : { opacity: 0, transform: 'translateX(20px)' };

  // Dot: scale(0)→1, 100ms after text starts, ease-arrival (overshoot)
  const dotReveal: React.CSSProperties = isVisible
    ? { animationName: 'timelineDotPop', animationDuration: '380ms', animationTimingFunction: 'var(--ease-arrival)', animationFillMode: 'both', animationDelay: '100ms' }
    : { opacity: 0, transform: 'scale(0)' };

  // "Current Focus" dot pulse — only looping animation on the page
  const currentDotExtra: React.CSSProperties = isCurrent
    ? { animation: `timelineDotPop 380ms var(--ease-arrival) both 100ms, dotPulseSlow 4.5s ease-in-out infinite 500ms` }
    : dotReveal;

  return (
    <>
      <style>{`
        @keyframes timelineEntryReveal {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes timelineDotPop {
          from { opacity: 0; transform: scale(0); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div ref={ref} className="relative flex gap-5" style={{ paddingBottom: isLast ? 0 : '28px', zIndex: 1 }}>
        {/* Dot */}
        <div
          className="relative z-10 flex-shrink-0 mt-1"
          style={{ width: `${dotSize}px` }}
        >
          <div
            className="rounded-full"
            data-current-dot={isCurrent ? 'true' : undefined}
            style={{
              width: `${dotSize}px`,
              height: `${dotSize}px`,
              background: dotColor,
              boxShadow: (isCurrent || isAward) ? `0 0 8px rgba(196,154,0,0.4)` : 'none',
              ...currentDotExtra,
            }}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1 flex-1 min-w-0 pb-1" style={entryReveal}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', color: isCurrent ? 'var(--gold)' : 'var(--text-muted)' }}>{entry.date}</span>
          <div className="flex flex-wrap items-center gap-2">
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: isEd ? 500 : 600, fontSize: isEd ? '0.9rem' : '1rem', color: isEd ? 'var(--text-secondary)' : 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              {entry.title}
            </h3>
            {isAward && entry.badge && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em', padding: '2px 7px', borderRadius: 'var(--radius-sm)', background: 'rgba(196,154,0,0.08)', color: 'var(--gold-dark)', border: '1px solid rgba(196,154,0,0.3)' }}>
                {entry.badge}
              </span>
            )}
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: isEd ? '0.8125rem' : '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
            {entry.description}
          </p>
        </div>
      </div>
    </>
  );
}
