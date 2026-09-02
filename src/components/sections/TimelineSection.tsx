'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import TimelineEntry from '@/components/ui/TimelineEntry';
import { timeline } from '@/data/timeline';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import MaskReveal from '@/components/ui/MaskReveal';

export default function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);
  const rafRef     = useRef<number | null>(null);

  const leftColVisible = useScrollReveal(leftColRef, { threshold: 0.3 });

  // Smoothing state
  const currentProgress = useRef(0);
  const targetProgress  = useRef(0);
  const currentOffset   = useRef(0);
  const targetOffset    = useRef(0);

  // ── Scroll-linked line draw + parallax ─────────────────
  const updateStyle = useCallback(() => {
    const line    = lineRef.current;
    const leftCol = leftColRef.current;
    if (line) line.style.transform = `scaleY(${currentProgress.current})`;
    if (leftCol) leftCol.style.transform = `translateY(${currentOffset.current}px)`;
  }, []);

  const handleScroll = useCallback(() => {
    const section = sectionRef.current;

    const line    = lineRef.current;
    const leftCol = leftColRef.current;
    if (!section || !line || !leftCol) return;

    const { top, height } = section.getBoundingClientRect();
    const vh = window.innerHeight;

    // Line progress: 0 when section top is at bottom of viewport, 1 when bottom is at top
    targetProgress.current = Math.min(1, Math.max(0, (vh - top) / (height + vh)));

    // Parallax: 0.15× scroll relative to section, clamped to section bounds
    const scrolled = Math.max(0, -top); // how much we've scrolled into section
    targetOffset.current = scrolled * 0.15;
  }, []);


  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const line    = lineRef.current;
    const leftCol = leftColRef.current;

    if (prefersReduced) {
      if (line) line.style.transform = 'scaleY(1)';
      return;
    }

    // Add will-change only while section is in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (leftCol) {
          leftCol.style.willChange = entry.isIntersecting ? 'transform' : 'auto';
        }
      },
      { threshold: 0 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    // Continuous rAF loop for lerping
    const loop = () => {
      currentProgress.current += (targetProgress.current - currentProgress.current) * 0.1;
      currentOffset.current += (targetOffset.current - currentOffset.current) * 0.1;
      
      if (
        Math.abs(targetProgress.current - currentProgress.current) > 0.0001 ||
        Math.abs(targetOffset.current - currentOffset.current) > 0.01
      ) {
        updateStyle();
        rafRef.current = requestAnimationFrame(loop);
      } else {
        currentProgress.current = targetProgress.current;
        currentOffset.current = targetOffset.current;
        updateStyle();
        rafRef.current = null;
      }
    };

    // RAF-throttled scroll handler
    const onScroll = () => {
      handleScroll();
      if (!rafRef.current) rafRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initialize immediately
    handleScroll();
    currentProgress.current = targetProgress.current;
    currentOffset.current = targetOffset.current;
    updateStyle();
 // initial call

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      if (leftCol) leftCol.style.willChange = 'auto';
    };
  }, [handleScroll]);

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="glass-section"
      style={{ paddingTop: 'var(--section-gap)', paddingBottom: 'var(--section-gap)', borderTop: '1px solid var(--border)' }}
    >
      <div className="sc">
        <div className="grid md:grid-cols-[200px_1fr] gap-12 md:gap-20 items-start">

          {/* Left — sticky label with parallax */}
          <div ref={leftColRef} className="md:sticky md:top-28 flex flex-col gap-3">
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
          <div className="flex flex-col pt-0.5 relative">
            {/* The continuous vertical line — scaleY is driven by scroll */}
            <div
              ref={lineRef}
              data-timeline-line
              style={{
                position: 'absolute',
                left: '5px',  /* center of the 12px "current" dot */
                top: '12px',
                bottom: '12px',
                width: '1px',
                background: 'var(--border)',
                transformOrigin: 'top',
                transform: 'scaleY(0)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            {timeline.map((entry, i) => (
              <TimelineEntry
                key={entry.id}
                entry={entry}
                isCurrent={i === 0}
                isLast={i === timeline.length - 1}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
