'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'research', label: 'Research' },
  { id: 'writing', label: 'Writing' },
  { id: 'projects', label: 'Projects' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'recognition', label: 'Recognition' },
];

export default function DotNav() {
  const [activeId, setActiveId] = useState<string>('about');
  const [labelVisible, setLabelVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setActive = useCallback((id: string) => {
    setActiveId(id);
    setLabelVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setLabelVisible(false), 2200);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { threshold: [0.25, 0.5] }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [setActive]);

  return (
    <div
      className="fixed hidden md:flex flex-col gap-[14px]"
      style={{ right: '24px', top: '50%', transform: 'translateY(-50%)', zIndex: 50 }}
    >
      {SECTIONS.map(({ id, label }) => {
        const isActive = activeId === id;
        return (
          <div key={id} className="relative flex items-center justify-end gap-3">
            <span
              className="absolute right-[22px] whitespace-nowrap transition-all duration-300"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--ink)',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                opacity: isActive && labelVisible ? 1 : 0,
                transform: isActive && labelVisible ? 'translateX(0)' : 'translateX(6px)',
                pointerEvents: 'none',
              }}
            >
              {label}
            </span>

            <a
              href={`#${id}`}
              aria-label={`Go to ${label}`}
              style={{
                display: 'block',
                width: isActive ? '13px' : '9px',
                height: isActive ? '13px' : '9px',
                borderRadius: '50%',
                backgroundColor: isActive ? 'var(--gold)' : 'var(--border-strong)',
                boxShadow: isActive ? '0 0 0 4px rgba(196,154,0,0.18), 0 0 10px rgba(196,154,0,0.3)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--gold)';
                e.currentTarget.style.transform = 'scale(1.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = isActive ? 'var(--gold)' : 'var(--border-strong)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
