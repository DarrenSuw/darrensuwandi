'use client';

import { useRef, useCallback } from 'react';
import type { TimelineEntry as T } from '@/data/timeline';
import { useScrollReveal } from '@/hooks/useScrollReveal';

// ── Per-type accent palette ────────────────────────────────────────────────────
const GOLD = { dot: '#C49A00', glow: 'rgba(196,154,0,0.12)', bg: 'rgba(196,154,0,0.03)', border: 'rgba(196,154,0,0.15)' };
const NEUTRAL = { dot: 'var(--border-strong)', glow: 'rgba(0,0,0,0.03)', bg: 'rgba(0,0,0,0.015)', border: 'var(--border)' };

const TYPE_ACCENT: Record<string, { dot: string; glow: string; bg: string; border: string; label: string }> = {
  award:     { ...GOLD, label: 'AWARD' },
  research:  { ...NEUTRAL, label: 'RESEARCH' },
  project:   { ...NEUTRAL, label: 'PROJECT' },
  hackathon: { ...NEUTRAL, label: 'HACKATHON' },
  education: { ...NEUTRAL, label: 'EDUCATION' },
};

const FALLBACK = { ...NEUTRAL, label: 'EVENT' };

export default function TimelineEntry({
  entry,
  isCurrent,
  isLast,
  index = 0,
}: {
  entry: T;
  isCurrent?: boolean;
  isLast?: boolean;
  index?: number;
}) {
  const ref     = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollReveal(ref, { threshold: 0.08 });

  const accent  = TYPE_ACCENT[entry.type] ?? FALLBACK;
  const isAward = entry.type === 'award';
  const isEd    = entry.type === 'education';
  const dotColor = isCurrent ? '#C49A00' : accent.dot;
  const dotSize  = isCurrent ? 16 : isEd ? 9 : 12;

  const isClickable = !!entry.projectId;

  // ── Mouse-tracking tilt + spotlight ──────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card) return;

    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;
    const tiltX  = ((y - cy) / cy) * -15;   // max ±15° tilt
    const tiltY  = ((x - cx) / cx) *  15;

    card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)';
    card.style.borderColor = 'var(--border-strong)';
    card.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease-out, border-color 0.2s ease';

    if (glow) {
      glow.style.opacity = '1';
      glow.style.background = `radial-gradient(250px circle at ${x}px ${y}px, ${accent.glow}, transparent 70%)`;
    }
  }, [accent.glow]);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (card) {
      card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.boxShadow = 'none';
      card.style.borderColor = accent.border;
      card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.5s cubic-bezier(0.34,1.56,0.64,1), border-color 0.5s ease';
    }
    if (glow) glow.style.opacity = '0';
  }, [accent.border]);

  // ── Reveal timings — stagger each entry 60ms ──────────────────────────────────
  const revealDelay = Math.min(index * 60, 300);

  const entryReveal: React.CSSProperties = isVisible
    ? {
        animationName:           'tlReveal',
        animationDuration:       '700ms',
        animationTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
        animationFillMode:       'both',
        animationDelay:          `${revealDelay}ms`,
      }
    : { opacity: 0, transform: 'translateX(24px)' };

  const dotReveal: React.CSSProperties = isVisible
    ? {
        animationName:           'tlDotPop',
        animationDuration:       '450ms',
        animationTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)',
        animationFillMode:       'both',
        animationDelay:          `${revealDelay + 100}ms`,
      }
    : { opacity: 0, transform: 'scale(0)' };

  const currentDotStyle: React.CSSProperties = isCurrent
    ? { animation: `tlDotPop 450ms cubic-bezier(0.34,1.56,0.64,1) both ${revealDelay + 100}ms, tlPulse 3.5s ease-in-out infinite ${revealDelay + 600}ms` }
    : dotReveal;

  return (
    <>
      <style>{`
        @keyframes tlReveal {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes tlDotPop {
          from { opacity: 0; transform: scale(0); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes tlPulse {
          0%   { box-shadow: 0 0 0 0 rgba(196,154,0,0.45); }
          65%  { box-shadow: 0 0 0 10px rgba(196,154,0,0); }
          100% { box-shadow: 0 0 0 0 rgba(196,154,0,0);    }
        }
        @keyframes currentLineGlow {
          0%,100% { opacity: 0.5; }
          50%      { opacity: 1;   }
        }
        .tl-card-clickable:hover .tl-arrow { opacity: 1; transform: translate(0,0); }
        .tl-arrow { opacity: 0; transform: translate(-4px,4px); transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .tl-card-clickable:hover .tl-type-chip { opacity: 1; }
        .tl-type-chip { transition: opacity 0.2s ease; }
        .tl-card { transform-style: preserve-3d; }
        .tl-content { transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1); transform: translateZ(0); }
        .tl-card:hover .tl-content { transform: translateZ(40px); }
      `}</style>

      <div
        ref={ref}
        data-timeline-entry
        className={`relative flex gap-5 md:gap-7 group ${isClickable ? 'tl-card-clickable' : ''}`}
        style={{ paddingBottom: isLast ? 0 : '36px', zIndex: 1 }}
      >
        {/* ── Dot column ─────────────────────────────────── */}
        <div
          className="relative z-10 flex-shrink-0 flex justify-center"
          style={{ width: '16px', paddingTop: '22px' }}
        >
          {/* Active glow beam */}
          {isCurrent && (
            <div
              style={{
                position: 'absolute',
                top: '22px',
                bottom: '-36px',
                left: '7px',
                width: '2px',
                background: `linear-gradient(to bottom, ${dotColor}80, transparent)`,
                animation: 'currentLineGlow 2.5s ease-in-out infinite',
                pointerEvents: 'none',
                zIndex: -1,
              }}
            />
          )}

          {/* Dot */}
          <div
            style={{
              width:        `${dotSize}px`,
              height:       `${dotSize}px`,
              borderRadius: '50%',
              background:   'var(--bg)', /* outline style */
              border:       `2px solid ${dotColor}`,
              boxShadow:    (isCurrent || isAward) ? `0 0 12px ${dotColor}60, inset 0 0 4px ${dotColor}30` : 'none',
              transition:   'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
              flexShrink:   0,
              ...currentDotStyle,
            }}
            className="group-hover:scale-125 group-hover:shadow-md tl-dot"
          />
        </div>

        {/* ── Content Card Wrapper (handles animation separate from JS tilt) ── */}
        <div className="flex-1 min-w-0" style={{ ...entryReveal, perspective: '1000px' }}>
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={isClickable ? () => window.dispatchEvent(new CustomEvent('openProjectModal', { detail: entry.projectId })) : undefined}
            className={`tl-card relative flex flex-col h-full rounded-2xl border ${isClickable ? 'cursor-pointer' : ''}`}
            style={{
              padding:         '20px 22px 22px',
              background:      accent.bg,
              borderColor:     accent.border,
              backdropFilter:  'blur(12px)',
              transition:      'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, border-color 0.3s ease',
              willChange:      'transform',
            }}
          >
            {/* Mouse-tracking spotlight overlay */}
          <div
            ref={glowRef}
            style={{
              position:      'absolute',
              inset:          0,
              borderRadius:  'inherit',
              opacity:        0,
              transition:    'opacity 0.15s ease',
              pointerEvents: 'none',
              zIndex:         0,
              transform:     'translateZ(0)',
            }}
          />

          {/* Hover border shimmer — top edge */}
          <div
            className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `linear-gradient(90deg, transparent, ${dotColor}60, transparent)`, transform: 'translateZ(0)' }}
          />

          {/* Card content (above overlay) */}
          <div className="tl-content relative z-[1] flex flex-col gap-2">
            {/* Top row: date + type chip + arrow */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span
                  style={{
                    fontFamily:    'var(--font-mono)',
                    fontSize:      '10px',
                    letterSpacing: '0.08em',
                    color:          isCurrent ? dotColor : 'var(--text-muted)',
                    fontWeight:     isCurrent ? 500 : 400,
                  }}
                >
                  {entry.date}
                </span>

                {isCurrent && (
                  <span
                    style={{
                      display:       'inline-flex',
                      alignItems:    'center',
                      gap:           '4px',
                      fontFamily:    'var(--font-mono)',
                      fontSize:      '8px',
                      letterSpacing: '0.1em',
                      color:          dotColor,
                      background:    `${dotColor}15`,
                      border:        `1px solid ${dotColor}30`,
                      borderRadius:  'var(--radius-sm)',
                      padding:       '2px 6px',
                    }}
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: dotColor }} />
                    LIVE
                  </span>
                )}

                {/* Type chip — shows on hover */}
                {!isCurrent && (
                  <span
                    className="tl-type-chip opacity-0"
                    style={{
                      fontFamily:    'var(--font-mono)',
                      fontSize:      '8px',
                      letterSpacing: '0.1em',
                      color:          dotColor,
                      background:    `${dotColor}12`,
                      border:        `1px solid ${dotColor}25`,
                      borderRadius:  'var(--radius-sm)',
                      padding:       '2px 6px',
                    }}
                  >
                    {accent.label}
                  </span>
                )}
              </div>

              {/* Arrow icon for clickable entries */}
              {isClickable && (
                <span className="tl-arrow flex-shrink-0" style={{ color: dotColor }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
                  </svg>
                </span>
              )}
            </div>

            {/* Title row */}
            <div className="flex flex-wrap items-center gap-2.5 mt-0.5">
              <h3
                style={{
                  fontFamily:    'var(--font-display)',
                  fontWeight:     isEd ? 500 : 700,
                  fontSize:       isEd ? '1rem' : '1.125rem',
                  color:          isEd ? 'var(--text-secondary)' : 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  lineHeight:     1.2,
                }}
              >
                {entry.title}
              </h3>

              {isAward && entry.badge && (
                <span
                  style={{
                    fontFamily:    'var(--font-mono)',
                    fontSize:      '8px',
                    fontWeight:     600,
                    letterSpacing: '0.08em',
                    padding:       '3px 8px',
                    borderRadius:  'var(--radius-sm)',
                    background:    'linear-gradient(90deg, rgba(196,154,0,0.12), rgba(196,154,0,0.06))',
                    color:         'var(--gold-dark)',
                    border:        '1px solid rgba(196,154,0,0.32)',
                  }}
                >
                  {entry.badge}
                </span>
              )}
            </div>

            {/* Description */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight:  300,
                fontSize:   '0.875rem',
                color:      'var(--text-muted)',
                lineHeight:  1.75,
                marginTop:  '2px',
              }}
            >
              {entry.description}
            </p>

            {/* "View details" text hint for clickable entries */}
            {isClickable && (
              <span
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1 flex items-center gap-1"
                style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      '9px',
                  letterSpacing: '0.08em',
                  color:          dotColor,
                }}
              >
                <span style={{ display: 'inline-block', width: '12px', height: '1px', background: dotColor }} />
                VIEW PROJECT DETAILS
              </span>
            )}
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
