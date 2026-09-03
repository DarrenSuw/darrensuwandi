'use client';

import { useEffect, useRef, useCallback } from 'react';
import TimelineEntry from '@/components/ui/TimelineEntry';
import { timeline } from '@/data/timeline';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import MaskReveal from '@/components/ui/MaskReveal';

export default function TimelineSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const leftColRef  = useRef<HTMLDivElement>(null);
  const entriesContainerRef = useRef<HTMLDivElement>(null);
  const lineRef     = useRef<HTMLDivElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const dotRef      = useRef<HTMLDivElement>(null);   // glowing head dot on the line
  const rafRef      = useRef<number | null>(null);

  const leftColVisible = useScrollReveal(leftColRef, { threshold: 0.3 });

  // Smoothed value (0→1)
  const currentProgress = useRef(0);
  const targetProgress  = useRef(0);

  // ── DOM write ──────────────────────────────────────────────────────────────
  const applyProgress = useCallback((p: number) => {
    const line = lineRef.current;
    const dot  = dotRef.current;
    if (!line) return;

    line.style.transform = `scaleY(${p})`;

    if (dot) {
      // Move the leading dot to sit exactly at the drawn tip of the line
      // The line is absolutely positioned; its full height is (bottom - top).
      // We read it live so padding/window-resize are handled automatically.
      const lineRect = line.getBoundingClientRect();
      const lineFullH = line.offsetHeight;          // unscaled height in px
      const tipOffset = lineFullH * p;              // pixels from line's top
      dot.style.transform = `translateY(${tipOffset}px) translateX(-50%)`;
      dot.style.opacity   = p > 0.01 ? '1' : '0';
    }
  }, []);

  // ── Compute scroll progress ────────────────────────────────────────────────
  const computeTarget = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const { top, height } = section.getBoundingClientRect();
    const vh = window.innerHeight;

    // We want:
    //   progress = 0  when the section top just hits the viewport top  (top = 0)
    //   progress = 1  when the section bottom just hits the viewport bottom
    //                 i.e. top = vh - height
    //
    // Clamped so it never goes out of [0, 1].
    const scrollableWindow = height - vh;          // how many px the section scrolls through
    if (scrollableWindow <= 0) {
      // Section shorter than viewport → fill based on how far it has entered
      targetProgress.current = Math.min(1, Math.max(0, (vh - top) / height));
      return;
    }
    // progress = -top / scrollableWindow   (top goes 0 → -scrollableWindow as we scroll)
    targetProgress.current = Math.min(1, Math.max(0, -top / scrollableWindow));
  }, []);

  // ── Continuous lerp loop ───────────────────────────────────────────────────
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      if (lineRef.current) lineRef.current.style.transform = 'scaleY(1)';
      applyProgress(1);
      return;
    }

    // Kick off a persistent rAF loop — runs every frame while mounted so we
    // never miss a fractional scroll position update or a lerp catch-up frame.
    let running = true;

    const updateLineHeight = () => {
      const container = entriesContainerRef.current;
      if (!container) return;
      const entries = container.querySelectorAll('[data-timeline-entry]');
      if (entries.length === 0) return;
      
      const lastEntry = entries[entries.length - 1] as HTMLElement;
      // line top is at 22px.
      // last dot center is at lastEntry.offsetTop + 22 (padding) + ~4.5 (radius) = offsetTop + 26.5
      const height = lastEntry.offsetTop + 4.5;
      
      if (trackRef.current) {
        trackRef.current.style.height = `${height}px`;
        trackRef.current.style.bottom = 'auto';
      }
      if (lineRef.current) {
        lineRef.current.style.height = `${height}px`;
        lineRef.current.style.bottom = 'auto';
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateLineHeight();
      computeTarget();
      applyProgress(currentProgress.current);
    });
    if (entriesContainerRef.current) {
      resizeObserver.observe(entriesContainerRef.current);
    }

    const loop = () => {
      if (!running) return;

      computeTarget();

      const diff = targetProgress.current - currentProgress.current;
      // Lerp coefficient: 0.085 → smooth ~12-frame ease; snaps when |diff| < ε
      currentProgress.current += diff * 0.085;
      if (Math.abs(diff) < 0.0003) {
        currentProgress.current = targetProgress.current;
      }

      applyProgress(currentProgress.current);
      rafRef.current = requestAnimationFrame(loop);
    };

    // Seed initial value so there is no "flash" from 0
    computeTarget();
    currentProgress.current = targetProgress.current;
    applyProgress(currentProgress.current);

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      resizeObserver.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [computeTarget, applyProgress]);

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="glass-section"
      style={{ paddingTop: 'var(--section-gap)', paddingBottom: 'var(--section-gap)', borderTop: '1px solid var(--border)' }}
    >
      <div className="sc">
        <div className="grid md:grid-cols-[200px_1fr] gap-12 md:gap-20 items-start relative h-full">

          {/* Left — sticky label */}
          <div ref={leftColRef} className="md:sticky md:top-28 flex flex-col gap-3 z-20">
            <span className="t-label" style={leftColVisible ? { animationName: 'fadeUp', animationDuration: '600ms', animationTimingFunction: 'var(--ease-entrance)', animationFillMode: 'both' } : { opacity: 0 }}>// Timeline</span>
            <MaskReveal visible={leftColVisible} delay={80}>
              <h2 className="t-display" style={{ fontSize: '1.75rem', lineHeight: 1.1 }}>How I<br />got here</h2>
            </MaskReveal>
            <div style={{ width: '24px', height: '2px', background: 'var(--gold)', borderRadius: '1px', marginTop: '8px', ...(leftColVisible ? { animationName: 'fadeUp', animationDuration: '600ms', animationTimingFunction: 'var(--ease-entrance)', animationFillMode: 'both', animationDelay: '160ms' } : { opacity: 0 }) }} />
            <p className="t-body" style={{ fontSize: '0.8125rem', marginTop: '4px', ...(leftColVisible ? { animationName: 'fadeUp', animationDuration: '600ms', animationTimingFunction: 'var(--ease-entrance)', animationFillMode: 'both', animationDelay: '240ms' } : { opacity: 0 }) }}>
              Research, ships, hackathons, milestones — most recent first.
            </p>
          </div>

          {/* Right — entries, with line drawn behind them */}
          <div className="flex flex-col pt-0.5 relative" ref={entriesContainerRef}>

            {/* ── Track rail (faint, always visible) ── */}
            <div
              ref={trackRef}
              aria-hidden
              style={{
                position:     'absolute',
                left:          '7px',
                top:           '22px',
                width:         '2px',
                background:    'rgba(255,255,255,0.05)',
                borderRadius:  '1px',
                pointerEvents: 'none',
                zIndex:         0,
              }}
            />

            {/* ── Scroll-driven progress line ── */}
            <div
              ref={lineRef}
              data-timeline-line
              style={{
                position:      'absolute',
                left:           '7px',
                top:            '22px',
                width:          '2px',
                background:     'linear-gradient(to bottom, rgba(196,154,0,0.95) 0%, rgba(196,154,0,0.55) 30%, rgba(196,154,0,0.2) 70%, rgba(196,154,0,0.05) 100%)',
                boxShadow:      '0 0 8px rgba(196,154,0,0.5), 0 0 20px rgba(196,154,0,0.2)',
                transformOrigin: 'top',
                transform:       'scaleY(0)',
                pointerEvents:  'none',
                zIndex:          0,
                willChange:     'transform',
              }}
            />

            {/* ── Glowing tip dot — travels with the line ── */}
            <div
              ref={dotRef}
              aria-hidden
              style={{
                position:      'absolute',
                left:           '8px',      /* same x centre as the line (left 7px + 1px = centre) */
                top:            '18px',     /* 22px (line top) - 4px (half of 8px height) */
                width:          '8px',
                height:         '8px',
                borderRadius:   '50%',
                background:     '#C49A00',
                boxShadow:      '0 0 0 3px rgba(196,154,0,0.2), 0 0 12px rgba(196,154,0,0.8)',
                transform:       'translateY(0) translateX(-50%)',
                opacity:         '0',
                pointerEvents:  'none',
                zIndex:          1,
                willChange:     'transform, opacity',
                transition:     'opacity 0.3s ease',
              }}
            />

            {timeline.map((entry, i) => (
              <TimelineEntry
                key={entry.id}
                entry={entry}
                isCurrent={i === 0}
                isLast={i === timeline.length - 1}
                index={i}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
