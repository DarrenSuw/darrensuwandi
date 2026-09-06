'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import Magnetic from '@/components/ui/Magnetic';

const stats = [
  { label: 'ENGINEERING', value: '8+ Systems Built', numeric: false },
  { label: 'EXPERTISE',   value: 'Full-Stack AI',    numeric: false },
  { label: 'RESEARCH',    value: 'Adversarial ML',   numeric: false },
  { label: 'HACKATHONS',  value: '4x Competitor',    numeric: false },
];

const highlights = [
  { label: 'CURRENT',     value: 'XAI Research', sub: 'Undergrad Researcher' },
  { label: 'ACADEMICS',   value: '3.86 CGPA',    sub: '#2 Ranked - Full Scholarship' },
  { label: 'RECOGNITION', value: "Dean's List",  sub: '3x Consecutive'       },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function parseValue(v: string): { num: number; suffix: string } {
  const match = v.match(/^([\d.]+)(.*)$/);
  if (!match) return { num: 0, suffix: v };
  return { num: parseFloat(match[1]), suffix: match[2] };
}
function easeOut(t: number) { return 1 - (1 - t) * (1 - t); }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

// ── Component ──────────────────────────────────────────────────────────────────
export default function HeroAboutSequence() {
  const [reducedMotion, setReducedMotion] = useState(false);

  // ── Stat count-up (from original HeroSection, unchanged) ────────────────────
  const statsRef     = useRef<HTMLDivElement>(null);
  const statsVisible = useScrollReveal(statsRef, { threshold: 0.1 });
  const [displayed, setDisplayed] = useState(stats.map((s) => s.value));
  const hasCountedUp = useRef(false);

  useEffect(() => {
    if (!statsVisible || hasCountedUp.current) return;
    hasCountedUp.current = true;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setDisplayed(stats.map((s) => s.value)); return; }
    const duration = 900;
    const start = performance.now();
    function tick(now: number) {
      const rawT = Math.min((now - start) / duration, 1);
      const t    = easeOut(rawT);
      setDisplayed(stats.map((s) => {
        if (!s.numeric) return s.value;
        const { num, suffix } = parseValue(s.value);
        const decimals = s.value.includes('.')
          ? (s.value.split('.')[1]?.replace(/\D/g, '').length ?? 0)
          : 0;
        return (num * t).toFixed(decimals) + suffix;
      }));
      if (rawT < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [statsVisible]);

  // ── Hero entrance animation helpers (from original HeroSection) ──────────────
  const delays = [0, 80, 160, 240, 340, 440, 580];
  const revealStyle = (i: number): React.CSSProperties => ({
    animationName:           'fadeUp',
    animationDuration:       '600ms',
    animationTimingFunction: 'var(--ease-entrance)',
    animationFillMode:       'both',
    animationDelay:          `${delays[i]}ms`,
  });

  // ── Scroll-sequence refs ──────────────────────────────────────────────────────
  const wrapperRef        = useRef<HTMLElement>(null);
  const heroContentRef    = useRef<HTMLDivElement>(null);
  const photoRef          = useRef<HTMLDivElement>(null);
  const aboutContentRef   = useRef<HTMLDivElement>(null);

  // Smoothing state
  const currentProgress = useRef(0);
  const targetProgress  = useRef(0);




  // Writes computed values directly to element styles — no React state, no re-renders
  function updateSequence() {
    const progress = currentProgress.current;

    // We leave the global field alone to avoid double grid / background disappearing issues

    if (progress <= 0.4) {
      // ── Stage 1 (0.0 → 0.4): Hero + DBField fade out; photo static; About hidden ──
      const stage1  = progress / 0.4; // 0→1
      const opacity = 1 - stage1;
      const done    = opacity < 0.05; // fully inactive threshold

      if (heroContentRef.current) {
        heroContentRef.current.style.opacity       = String(opacity);
        heroContentRef.current.style.pointerEvents = done ? 'none' : 'auto';
      }

      if (photoRef.current)        photoRef.current.style.transform       = 'translateX(0)';
      if (aboutContentRef.current) {
        aboutContentRef.current.style.opacity       = '0';
        aboutContentRef.current.style.transform     = 'translateY(16px)';
        aboutContentRef.current.style.pointerEvents = 'none';
      }
    } else {
      // ── Stage 2 (0.4 → 1.0): Photo slides left; About fades in; Hero stays gone ──
      const local = (progress - 0.4) / 0.6; // 0→1 within Stage 2

      if (heroContentRef.current) {
        heroContentRef.current.style.opacity       = '0';
        heroContentRef.current.style.pointerEvents = 'none';
      }

      if (photoRef.current) {
        // Photo container is 50% wide, right-anchored.
        // translateX(-100%) moves it by 100% of its own width = 50vw → lands at left half.
        // This is NOT a full -100vw translate; it is -50vw (half viewport), landing in place.
        photoRef.current.style.transform = `translateX(${-local * 100}%)`;
      }
      if (aboutContentRef.current) {
        aboutContentRef.current.style.opacity       = String(local);
        aboutContentRef.current.style.transform     = `translateY(${16 * (1 - local)}px)`;
        aboutContentRef.current.style.pointerEvents = local > 0.05 ? 'auto' : 'none';
      }
    }
  }

  // ── Mount: detect mode, attach listeners ──────────────────────────────────────
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setReducedMotion(true); return; }

    // Removed JS width check on mount to allow CSS media queries to handle responsiveness naturally
    
    // Initial layout and target
    const el = wrapperRef.current;
    const initRect = wrapperRef.current?.getBoundingClientRect();
    if (initRect && initRect.height > 0) {
       const initialTarget = clamp(
         (window.scrollY - (window.scrollY + initRect.top)) / (initRect.height - window.innerHeight),
         0, 1
       );
       targetProgress.current = initialTarget;
       currentProgress.current = initialTarget;
    }



    // Continuous rAF loop for lerping
    let rafId: number | null = null;
    const loop = () => {
      // Lerp step as specified
      currentProgress.current += (targetProgress.current - currentProgress.current) * 0.1;
      
      // Stop continuous rAF if we are very close to target, to save CPU. 
      // It will wake up on next scroll.
      if (Math.abs(targetProgress.current - currentProgress.current) > 0.0001) {
        updateSequence();
        rafId = requestAnimationFrame(loop);
      } else {
        // Ensure final exact value is applied
        currentProgress.current = targetProgress.current;
        updateSequence();
        rafId = null;
      }
    };

    const handleScroll = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const wrapperHeight = rect.height;
      if (wrapperHeight === 0) return; // desktop sequence is hidden via CSS
      
      const wrapperTop = window.scrollY + rect.top;
      targetProgress.current = clamp(
        (window.scrollY - wrapperTop) / (wrapperHeight - window.innerHeight),
        0, 1
      );
      if (!rafId) rafId = requestAnimationFrame(loop);
    };

    const handleResize = () => {
      handleScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    updateSequence(); // initialise at current scroll position

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafId) cancelAnimationFrame(rafId);


    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Shared sub-components (Phase 6 hover styles preserved verbatim) ────────────
  const aboutHighlightStyles = (
    <style>{`
      .about-highlight-cell {
        transition: transform 0.2s var(--ease-entrance), border-color 0.2s;
      }
      .about-highlight-cell:hover {
        transform: translateY(-2px);
        border-color: var(--gold) !important;
      }
    `}</style>
  );

  const highlightCards = (
    <div
      className="grid grid-cols-1 sm:grid-cols-3 gap-0"
      style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}
    >
      {highlights.map((item, i) => (
        <div
          key={item.label}
          className="about-highlight-cell flex flex-col gap-1.5 p-5"
          style={{ borderRight: i < highlights.length - 1 ? '1px solid var(--border)' : 'none' }}
        >
          <span className="t-eyebrow">{item.label}</span>
          <span className="t-display" style={{ fontSize: '1rem' }}>{item.value}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', color: 'var(--gold)' }}>
            {item.sub}
          </span>
        </div>
      ))}
    </div>
  );

  // About paragraphs — identical copy from original AboutSection
  const aboutParagraphs = (
    <div className="flex flex-col gap-5">
      <p className="t-body" style={{ fontSize: '0.9375rem' }}>
        I&apos;m two years into a Bachelor of Digital Media &amp; Technology at Xiamen University Malaysia on a full scholarship (Ranked #2 in major), three Dean&apos;s List semesters, 3.86 GPA, and still figuring out the difference between research I can publish and engineering I can ship. Most of my work lives in that gap.
      </p>
      <p className="t-body" style={{ fontSize: '0.9375rem' }}>
        Right now that means co-authoring a paper with Dr. Teh Jia Yew and Dr. Goh Sim Kuan on why most SHAP pipelines are quietly broken, while also running Resume Forge, a SaaS I built solo over six months. Omni-QC, a PCB inspection system I led for a 7-person team, won Silver at SEA-CICSIC earlier this year.
      </p>
      <p className="t-body" style={{ fontSize: '0.9375rem' }}>
        I&apos;m Indonesian, based in Malaysia. I write mostly in Python. I think about pipelines a lot.
      </p>
    </div>
  );

  // ── REDUCED MOTION: two static, in-flow sections; single photo instance ────────
  if (reducedMotion) {
    return (
      <>
        {aboutHighlightStyles}

        {/* Hero — photo right (Stage 1 resting position), text left, no animation */}
        <section
          id="about"
          className="glass-section"
          style={{ paddingTop: '140px', paddingBottom: 'var(--space-9)' }}
        >
          <div className="sc">
            <div className="grid md:grid-cols-[1fr_300px] gap-12 md:gap-16 items-center mb-16">
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                  <span style={{ display: 'block', width: '20px', height: '1px', background: 'var(--gold)' }} />
                  <span className="t-label">ML RESEARCHER &amp; AI ENGINEER · BASED IN MALAYSIA</span>
                </div>
                <h1
                  className="t-display gold-glow"
                  style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', maxWidth: '20ch', marginBottom: 'var(--space-4)', lineHeight: 1.1 }}
                >
                  Building ML systems that reason, explain, and hold up under <span style={{ color: 'var(--gold)' }}>pressure.</span>
                </h1>
                <p className="t-body" style={{ maxWidth: '46ch', marginBottom: 'var(--space-6)', fontSize: '0.9375rem' }}>
                  I research adversarial robustness and explainability. Shipping the full-stack systems around the models that pass.
                </p>
                <div className="flex flex-wrap gap-2.5">
                  <Magnetic><a href="#research" className="btn-ink">View Research</a></Magnetic>
                  <Magnetic><a href="#projects" className="btn-gold">See Projects</a></Magnetic>
                  <Magnetic><a href="/resume.pdf" download className="btn-ghost">Resume ↓</a></Magnetic>
                </div>
              </div>
              {/* Photo at Stage 1 resting position — right side, single instance */}
              <div className="hidden md:block relative" style={{ width: '300px', aspectRatio: '3/4', flexShrink: 0 }}>
                <Image
                  src="/darren-desaturated.png"
                  alt="Darren Cornelius Suwandi"
                  fill
                  style={{ objectFit: 'contain', objectPosition: 'center bottom' }}
                  priority
                />
              </div>
            </div>
            {/* Stat strip */}
            <div
              className="flex flex-wrap gap-y-6"
              style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-5)' }}
            >
              {stats.map((s, i) => (
                <div key={i} className="flex flex-col gap-1.5" style={{ paddingRight: 'var(--space-7)', paddingLeft: i !== 0 ? 'var(--space-7)' : '0', borderLeft: i !== 0 ? '1px solid var(--border)' : 'none' }}>
                  <span className="t-eyebrow">{s.label}</span>
                  <span className="t-display" style={{ fontSize: '1rem', letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About — normal in-flow below hero, no second photo */}
        <section
          className="glass-section"
          style={{ paddingTop: 'var(--section-gap)', paddingBottom: 'var(--section-gap)', borderTop: '1px solid var(--border)' }}
        >
          <div className="sc">
            <div className="grid md:grid-cols-[200px_1fr] gap-16 md:gap-24 items-start">
              <div style={{ paddingTop: '2px' }}>
                <span className="t-label" style={{ display: 'block', marginBottom: '16px' }}>// About</span>
                <h2 className="t-display" style={{ fontSize: '1.75rem' }}>Who I am</h2>
                <div style={{ width: '28px', height: '2px', background: 'var(--gold)', borderRadius: '1px', marginTop: '12px' }} />
              </div>
              <div className="flex flex-col gap-8">
                {aboutParagraphs}
                {highlightCards}
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // ── NORMAL RENDER: mobile stack + desktop sticky sequence ──────────────────────
  return (
    <div id="about">
      {aboutHighlightStyles}

      {/* ────────────────────────────────────────────────────────────────────
          MOBILE (below md): vertical stack — no sticky, no scroll listener.
          Spec order: photo → Hero content → About content.
         ──────────────────────────────────────────────────────────────────── */}
      <section
        className="glass-section md:hidden"
        style={{ paddingTop: '110px', paddingBottom: 'var(--space-9)' }}
      >
        <div className="sc">
          {/* Photo */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
            <Image
              src="/darren-desaturated.png"
              alt="Darren Cornelius Suwandi"
              width={280}
              height={373}
              style={{
                width: '65vw',
                maxWidth: '280px',
                height: 'auto',
                objectFit: 'contain',
                objectPosition: 'bottom center',
                display: 'block',
              }}
              priority
            />
          </div>
          {/* Hero text */}
          <div className="flex items-center gap-3 mb-6" style={revealStyle(0)}>
            <span style={{ display: 'block', width: '20px', height: '1px', background: 'var(--gold)' }} />
            <span className="t-label">ML RESEARCHER &amp; AI ENGINEER · BASED IN MALAYSIA</span>
          </div>
          <h1
            className="t-display gold-glow"
            style={{ ...revealStyle(1), fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', maxWidth: '20ch', marginBottom: 'var(--space-4)', lineHeight: 1.1 }}
          >
            Building ML systems that reason, explain, and hold up under <span style={{ color: 'var(--gold)' }}>pressure.</span>
          </h1>
          <p className="t-body" style={{ ...revealStyle(2), maxWidth: '46ch', marginBottom: 'var(--space-6)', fontSize: '0.9375rem' }}>
            I research adversarial robustness and explainability. Shipping the full-stack systems around the models that pass.
          </p>
          <div className="flex flex-wrap gap-2.5" style={revealStyle(3)}>
            <Magnetic><a href="#research" className="btn-ink">View Research</a></Magnetic>
            <Magnetic><a href="#projects" className="btn-gold">See Projects</a></Magnetic>
          </div>
          <div style={{ ...revealStyle(3), marginTop: '10px' }}>
            <Magnetic><a href="/resume.pdf" download className="btn-ghost">Resume ↓</a></Magnetic>
          </div>


          {/* Stat strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-4" style={{ ...revealStyle(4), borderTop: '1px solid var(--border)', paddingTop: 'var(--space-5)', marginTop: 'var(--space-5)' }}>
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col gap-1.5" style={{ paddingLeft: i % 2 !== 0 ? 'var(--space-4)' : '0', borderLeft: i % 2 !== 0 ? '1px solid var(--border)' : 'none' }}>
                <span className="t-eyebrow">{s.label}</span>
                <span className="t-display" style={{ fontSize: '1rem', letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile About */}
      <section
        className="glass-section md:hidden"
        style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--section-gap)', borderTop: '1px solid var(--border)' }}
      >
        <div className="sc">
          <div style={{ paddingTop: '2px', marginBottom: 'var(--space-6)' }}>
            <span className="t-label" style={{ display: 'block', marginBottom: '16px' }}>// About</span>
            <h2 className="t-display" style={{ fontSize: '1.75rem' }}>Who I am</h2>
            <div style={{ width: '28px', height: '2px', background: 'var(--gold)', borderRadius: '1px', marginTop: '12px' }} />
          </div>
          <div className="flex flex-col gap-8">
            {aboutParagraphs}
            {highlightCards}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────
          DESKTOP (md and above): sticky 200vh scroll sequence.
         ──────────────────────────────────────────────────────────────────── */}
      <section
        ref={wrapperRef as React.RefObject<HTMLElement>}
        className="glass-section hidden md:block"
        style={{ position: 'relative', minHeight: '200vh' }}
      >
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>



          {/* Hero content layer — left half — z-index 1 */}
          <div
            ref={heroContentRef}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingTop: '140px',
              paddingBottom: 'var(--space-9)',
            }}
          >
            <div className="sc" style={{ width: '100%' }}>
              <div style={{ maxWidth: '50%', paddingRight: 'var(--space-7)' }}>
                {/* Eyebrow — delay 0 */}
                <div className="flex items-center gap-3 mb-6 md:mb-8" style={revealStyle(0)}>
                  <span style={{ display: 'block', width: '20px', height: '1px', background: 'var(--gold)' }} />
                  <span className="t-label">ML RESEARCHER &amp; AI ENGINEER · BASED IN MALAYSIA</span>
                </div>
                {/* Headline — delay 80 */}
                <h1
                  className="t-display gold-glow"
                  style={{ ...revealStyle(1), fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', maxWidth: '20ch', marginBottom: 'var(--space-4)', lineHeight: 1.1 }}
                >
                  Building ML systems that reason, explain, and hold up under <span style={{ color: 'var(--gold)' }}>pressure.</span>
                </h1>
                {/* Subtext — delay 160 */}
                <p className="t-body" style={{ ...revealStyle(2), maxWidth: '46ch', marginBottom: 'var(--space-6)', fontSize: '0.9375rem' }}>
                  I research adversarial robustness and explainability. Shipping the full-stack systems around the models that pass.
                </p>
                {/* CTAs — delay 240 */}
                <div className="flex flex-wrap gap-2.5" style={revealStyle(3)}>
                  <Magnetic><a href="#research" className="btn-ink">View Research</a></Magnetic>
                  <Magnetic><a href="#projects" className="btn-gold">See Projects</a></Magnetic>
                  <Magnetic><a href="/resume.pdf" download className="btn-ghost">Resume ↓</a></Magnetic>
                </div>


                {/* Stat strip — delay 340; count-up triggered by IntersectionObserver */}
                <div
                  ref={statsRef}
                  className="flex flex-wrap gap-y-6"
                  style={{ ...revealStyle(4), borderTop: '1px solid var(--border)', paddingTop: 'var(--space-5)', marginTop: 'var(--space-7)' }}
                >
                  {stats.map((s, i) => (
                    <div key={i} className="flex flex-col gap-1.5" style={{ paddingRight: 'var(--space-7)', paddingLeft: i !== 0 ? 'var(--space-7)' : '0', borderLeft: i !== 0 ? '1px solid var(--border)' : 'none' }}>
                      <span className="t-eyebrow">{s.label}</span>
                      <span
                        className="t-display"
                        style={{
                          fontSize: '1rem',
                          letterSpacing: '-0.01em',
                          color: 'var(--text-primary)',
                          ...(!s.numeric && statsVisible
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
          </div>

          {/* Photo layer — z-index 2.
              Starts: right half (right:0, width:50%).
              Stage 2: translateX(-100%) slides it into left half position
              (100% of its own 50%-viewport width = 50vw, not 100vw). */}
          <div
            ref={photoRef}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '50%',
              height: '100%',
              zIndex: 2,
              willChange: 'transform',
            }}
          >
            <Image
              src="/darren-desaturated.png"
              alt="Darren Cornelius Suwandi"
              fill
              style={{ objectFit: 'contain', objectPosition: 'center bottom' }}
              priority
            />
          </div>

          {/* About content layer — z-index 1.
              Initially: opacity 0, pointer-events none, translateY 16px.
              Stage 2: fades and lifts into view on the right half. */}
          <div
            ref={aboutContentRef}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              opacity: 0,
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingTop: 'var(--section-gap)',
              paddingBottom: 'var(--section-gap)',
            }}
          >
            <div className="sc" style={{ width: '100%' }}>
              {/* Content lives in the right half — margin-left: 50% */}
              <div style={{ marginLeft: '50%', paddingLeft: 'var(--space-7)', overflowY: 'auto', maxHeight: '100vh' }}>
                {/* About heading — unchanged from original AboutSection */}
                <div style={{ paddingTop: '2px', marginBottom: 'var(--space-5)' }}>
                  <span className="t-label" style={{ display: 'block', marginBottom: '16px' }}>// About</span>
                  <h2 className="t-display" style={{ fontSize: '1.75rem' }}>Who I am</h2>
                  <div style={{ width: '28px', height: '2px', background: 'var(--gold)', borderRadius: '1px', marginTop: '12px' }} />
                </div>
                {/* About paragraphs — unchanged from original AboutSection */}
                <div style={{ marginBottom: 'var(--space-6)' }}>
                  {aboutParagraphs}
                </div>
                {/* Highlight cards — unchanged from original, Phase 6 hover preserved */}
                {highlightCards}
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
