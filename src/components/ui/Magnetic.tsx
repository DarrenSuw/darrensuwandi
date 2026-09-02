'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export default function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let isHovering = false;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const padding = 20;

      // Check if within bounds + 20px padding
      if (
        e.clientX >= rect.left - padding &&
        e.clientX <= rect.right + padding &&
        e.clientY >= rect.top - padding &&
        e.clientY <= rect.bottom + padding
      ) {
        if (!isHovering) {
          isHovering = true;
          el.style.transition = 'none'; // No CSS transition while active
        }

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;

        // Apply 0.3 multiplier and clamp to max 10px displacement
        targetX = Math.max(-10, Math.min(10, dx * 0.3));
        targetY = Math.max(-10, Math.min(10, dy * 0.3));

        if (!rafId.current) {
          rafId.current = requestAnimationFrame(updateTransform);
        }
      } else if (isHovering) {
        handleMouseLeave();
      }
    };

    const handleMouseLeave = () => {
      if (!isHovering) return;
      isHovering = false;
      targetX = 0;
      targetY = 0;
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      el.style.transition = 'transform 0.45s var(--ease-arrival)';
      el.style.transform = 'translate(0px, 0px)';
    };

    const updateTransform = () => {
      if (!isHovering) {
        rafId.current = null;
        return;
      }
      el.style.transform = `translate(${targetX}px, ${targetY}px)`;
      rafId.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div ref={ref} style={{ display: 'inline-block' }}>
      {children}
    </div>
  );
}
