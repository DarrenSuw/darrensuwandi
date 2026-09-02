'use client';

import { ReactNode } from 'react';

interface MaskRevealProps {
  children: ReactNode;
  visible: boolean;
  delay?: number;
}

export default function MaskReveal({ children, visible, delay = 0 }: MaskRevealProps) {
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div style={{ overflow: 'hidden', display: 'block' }}>
      <div
        style={{
          display: 'block',
          transform: visible || prefersReduced ? 'translateY(0)' : 'translateY(110%)',
          opacity: visible || prefersReduced ? 1 : 0,
          transition: prefersReduced ? 'none' : `transform 600ms var(--ease-entrance) ${delay}ms, opacity 600ms var(--ease-entrance) ${delay}ms`,
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </div>
    </div>
  );
}
