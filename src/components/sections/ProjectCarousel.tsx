'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import type { Project } from '@/data/projects';

const STATUS_COLOR: Record<string, string> = {
  LIVE: '#4ade80',
  SAAS: '#C49A00',
  HACKATHON: '#a78bfa',
  RESEARCH: '#38bdf8',
  ONGOING: '#C49A00',
};

const STATUS_BG: Record<string, string> = {
  LIVE:      'rgba(74,222,128,0.12)',
  SAAS:      'rgba(196,154,0,0.12)',
  HACKATHON: 'rgba(167,139,250,0.12)',
  RESEARCH:  'rgba(56,189,248,0.12)',
  ONGOING:   'rgba(196,154,0,0.12)',
};


interface Props {
  projects: Project[];
  onOpenProject: (p: Project) => void;
  entranceVisible?: boolean;
}

/* ─── Card dimensions (every card identical) ─── */
const CARD_W = 380;   // px — matches min(380px, 88vw) on CSS side
const IMG_H  = 220;   // px — the preview screenshot zone
const BODY_H = 230;   // px — the text/meta zone below

export default function ProjectCarousel({ projects, onOpenProject, entranceVisible = true }: Props) {
  const [idx, setIdx] = useState(0);
  const n = projects.length;
  const next = () => setIdx((i) => (i + 1) % n);
  const prev = () => setIdx((i) => (i - 1 + n) % n);

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const MIN_SWIPE = 50;

  // Entrance: center card rises; outer wrapper fades in 150ms after center starts
  const stageStyle: React.CSSProperties = entranceVisible
    ? { animationName: 'carouselEntrance', animationDuration: '600ms', animationTimingFunction: 'var(--ease-entrance)', animationFillMode: 'both' }
    : { opacity: 0, transform: 'translateY(30px)' };

  const navStyle: React.CSSProperties = entranceVisible
    ? { animationName: 'fadeIn', animationDuration: '500ms', animationTimingFunction: 'var(--ease-entrance)', animationFillMode: 'both', animationDelay: '150ms' }
    : { opacity: 0 };

  return (
    <div className="w-full flex flex-col gap-8">
      <style>{`
        @keyframes carouselEntrance {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .carousel-card {
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.6s;
        }
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
      {/* ── Stage ── */}
      <div
        className="relative flex justify-center items-center h-[430px] md:h-[452px]"
        style={{ perspective: '1200px', ...stageStyle }}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          touchEndX.current = e.changedTouches[0].clientX;
          const delta = touchStartX.current - touchEndX.current;
          if (delta > MIN_SWIPE) next();
          if (delta < -MIN_SWIPE) prev();
        }}
      >
        {projects.map((p, i) => {
          const raw = ((i - idx) + n) % n;
          const off = raw > n / 2 ? raw - n : raw;

          const isCenter = off === 0;
          const isL      = off === -1;
          const isR      = off === 1;
          if (!isCenter && !isL && !isR) return null;

          const tx  = isL ? '-64%' : isR ? '64%' : '0%';
          const sc  = isCenter ? 1 : 0.82;
          const ry  = isL ? '16deg' : isR ? '-16deg' : '0deg';
          const op  = isCenter ? 1 : 0.48;

          const dotColor = STATUS_COLOR[p.status] ?? '#C49A00';
          const statusBg = STATUS_BG[p.status]   ?? 'rgba(196,154,0,0.12)';

          return (
            <div
              key={p.id}
              className={`absolute carousel-card h-[auto] md:h-[450px] max-h-[75vh]`}
              style={{
                width:          `min(${CARD_W}px, 88vw)`,
                transform:      `translateX(${tx}) scale(${sc})`,
                opacity:        op,
                zIndex:         isCenter ? 30 : 20,
                cursor:         isCenter ? 'default' : 'pointer',
              }}
              onClick={() => { if (isL) prev(); else if (isR) next(); }}
            >
              <div
                style={{
                  width:        '100%',
                  height:       '100%',
                  borderRadius: 'var(--radius-xl)',
                  overflow:     'hidden',
                  border:       isCenter
                    ? '1px solid rgba(196,154,0,0.35)'
                    : '1px solid var(--border)',
                  boxShadow: isCenter
                    ? '0 24px 80px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05), 0 0 0 1px rgba(196,154,0,0.08)'
                    : '0 4px 16px rgba(0,0,0,0.05)',
                  background:   'var(--bg)',
                  display:      'flex',
                  flexDirection: 'column',
                }}
              >
                {/* ── Preview zone ── */}
                <div
                  className="w-full shrink-0 relative overflow-hidden h-[180px] md:h-[220px]"
                  style={{
                    background: p.previewImage ? 'transparent' : 'var(--surface)',
                  }}
                >
                  {p.previewImage ? (
                    <>
                      <div style={{ position: 'absolute', top: '46px', left: 0, right: 0, bottom: 0 }}>
                        <Image
                          src={p.previewImage}
                          alt={`${p.name} UI preview`}
                          fill
                          sizes={`${CARD_W}px`}
                          style={{ objectFit: 'cover', objectPosition: 'top center' }}
                          priority={isCenter}
                          draggable={false}
                        />
                      </div>
                      {/* Bottom fade so it bleeds into the card body */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to bottom, transparent 40%, var(--bg) 100%)',
                      }} />
                    </>
                  ) : (
                    /* Placeholder grid for projects without a screenshot */
                    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                      {/* Subtle grid */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                        opacity: 0.6,
                      }} />
                      {/* Category label centered */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: '8px',
                          letterSpacing: '0.14em', textTransform: 'uppercase',
                          color: 'var(--text-muted)', opacity: 0.6,
                        }}>{p.category}</span>
                      </div>
                      {/* Bottom fade */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to bottom, transparent 30%, var(--bg) 100%)',
                      }} />
                    </div>
                  )}

                  {/* Status badge — top-left */}
                  <div style={{
                    position: 'absolute', top: '16px', left: '16px',
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '3px 9px',
                    borderRadius: 'var(--radius-pill)',
                    background: statusBg,
                    border: `1px solid ${dotColor}33`,
                  }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: dotColor, display: 'block' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: dotColor }}>
                      {p.status}
                    </span>
                  </div>

                  {/* Date — top-right */}
                  <div style={{
                    position: 'absolute', top: '16px', right: '16px',
                    fontFamily: 'var(--font-mono)', fontSize: '7.5px',
                    letterSpacing: '0.08em', color: 'var(--text-muted)',
                    background: 'rgba(240,240,238,0.97)',
                    padding: '3px 8px', borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--border)',
                  }}>
                    {p.date}
                  </div>
                </div>

                {/* ── Body zone ── */}
                <div
                  className="flex-1 flex flex-col gap-[10px] p-[16px_20px_18px] h-auto md:h-[230px]"
                >
                  {/* Category label */}
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '8px',
                    letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold-text)',
                  }}>{p.category}</span>

                  {/* Title + description */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-display)', fontWeight: 700,
                      fontSize: '1.1875rem', letterSpacing: '-0.02em',
                      color: 'var(--text-primary)', lineHeight: 1.2,
                    }}>{p.name}</h3>
                    <p className="t-body" style={{
                      fontSize: '0.8125rem', lineHeight: 1.65,
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>{p.description}</p>
                  </div>

                  {/* Stack pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {p.stack.slice(0, 4).map(tech => (
                      <span key={tech} style={{
                        fontFamily: 'var(--font-mono)', fontSize: '7.5px',
                        letterSpacing: '0.08em', padding: '2px 7px',
                        border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)',
                        color: 'var(--text-muted)', background: 'var(--surface)',
                      }}>{tech}</span>
                    ))}
                    {p.stack.length > 4 && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7.5px', color: 'var(--text-muted)', padding: '2px 4px' }}>
                        +{p.stack.length - 4}
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    className="ts-btn"
                    onClick={(e) => { e.stopPropagation(); if (isCenter) onOpenProject(p); if (isL) prev(); if (isR) next(); }}
                    style={{
                      width: '100%', padding: '9px 0',
                      borderRadius: 'var(--radius-md)',
                      fontFamily: 'var(--font-mono)', fontSize: '8.5px',
                      letterSpacing: '0.13em', textTransform: 'uppercase',
                      fontWeight: 600, border: 'none', cursor: 'pointer',
                      background:   isCenter ? 'var(--ink)'       : 'var(--surface)',
                      color:        isCenter ? 'var(--bg)'        : 'var(--text-muted)',
                      transition:   'background 0.2s, color 0.2s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                    onMouseEnter={e => { if (isCenter) (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold)'; }}
                    onMouseLeave={e => { if (isCenter) (e.currentTarget as HTMLButtonElement).style.background = 'var(--ink)'; }}
                  >
                    {isCenter ? (
                      <>
                        <span className="slide-arrow-wrap">
                          <span className="slide-arrow-current">↗</span>
                          <span className="slide-arrow-next">↗</span>
                        </span>
                        <span>Explore Solution &amp; Specs</span>
                      </>
                    ) : isL ? '← Rotate' : 'Rotate →'}
                  </button>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Navigation row (Desktop) ── */}
      <div className="hidden md:flex items-center justify-center gap-3" style={navStyle}>
        <div className="flex items-center justify-center min-w-[44px] min-h-[44px]">
          <button onClick={prev} aria-label="Previous project" className="btn-ghost flex items-center justify-center" style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}>←</button>
        </div>
        <div className="flex items-center gap-1.5">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Go to project ${i + 1}`}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <span className="rounded-full transition-all" style={{ width: i === idx ? '12px' : '6px', height: '6px', background: i === idx ? 'var(--gold)' : 'var(--border)' }} />
            </button>
          ))}
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', minWidth: '40px', textAlign: 'center' }}>
          {idx + 1} / {n}
        </span>
        <div className="flex items-center justify-center min-w-[44px] min-h-[44px]">
          <button onClick={next} aria-label="Next project" className="btn-ghost flex items-center justify-center" style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}>→</button>
        </div>
      </div>

      {/* ── Navigation row (Mobile) ── */}
      <div className="flex md:hidden flex-row items-center justify-center gap-[8px]" style={{ marginTop: '16px', ...navStyle }}>
        <button onClick={prev} className="flex items-center justify-center min-w-[44px] min-h-[44px]">
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', border: '1px solid var(--border-strong)', borderRadius: '50%', background: 'transparent', color: 'var(--ink)', fontSize: '14px' }}>←</span>
        </button>
        <div className="flex items-center gap-[5px]">
          {projects.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === idx ? '14px' : '6px',
                height: '6px',
                borderRadius: i === idx ? '3px' : '50%',
                background: i === idx ? 'var(--gold)' : 'var(--border-strong)',
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', minWidth: '32px', textAlign: 'center' }}>
          {idx + 1} / {n}
        </span>
        <button onClick={next} className="flex items-center justify-center min-w-[44px] min-h-[44px]">
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', border: '1px solid var(--border-strong)', borderRadius: '50%', background: 'transparent', color: 'var(--ink)', fontSize: '14px' }}>→</span>
        </button>
      </div>
    </div>
  );
}
