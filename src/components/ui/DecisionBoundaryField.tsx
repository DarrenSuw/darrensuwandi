'use client';

import { useEffect, useRef } from 'react';

// ── Color interpolation ──────────────────────────────────────────────────────
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.round(v).toString(16).padStart(2, '0'))
      .join('')
  );
}

function lerpColor(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return rgbToHex(
    ca.r + (cb.r - ca.r) * t,
    ca.g + (cb.g - ca.g) * t,
    ca.b + (cb.b - ca.b) * t,
  );
}

// ── Constants ────────────────────────────────────────────────────────────────
const GRID         = 40;
const RADIUS       = 130;
const REST_COLOR   = '#D9D9D6';
const ACTIVE_COLOR = '#C49A00';
const TICK_TRANSITION =
  'transform 0.45s cubic-bezier(0.2, 0.7, 0.3, 1), background-color 0.45s ease, opacity 0.45s ease';

type TickData = {
  el: HTMLDivElement;
  cx: number;
  cy: number;
  restRotation: number; // ±6deg resting noise
};

// ── Component ────────────────────────────────────────────────────────────────
export default function DecisionBoundaryField() {
  const containerRef   = useRef<HTMLDivElement>(null);
  const ticksRef       = useRef<TickData[]>([]);
  const cursorRef      = useRef({ x: -999, y: -999 });
  const activeSetRef   = useRef<Set<number>>(new Set());
  const rafIdRef       = useRef<number | null>(null);
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Style helpers — write directly to el.style, no React re-renders ───────
  function applyResting(t: TickData): void {
    t.el.style.transform       = `rotate(${t.restRotation}deg) scaleY(1)`;
    t.el.style.backgroundColor = REST_COLOR;
    t.el.style.opacity         = '0.5';
  }

  function applyActive(t: TickData, dx: number, dy: number, dist: number): void {
    const strength = Math.max(0, 1 - dist / RADIUS);
    const angle    = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // +90 aligns vertical rest
    t.el.style.transform       = `rotate(${angle}deg) scaleY(${1 + strength * 0.6})`;
    t.el.style.backgroundColor = lerpColor(REST_COLOR, ACTIVE_COLOR, strength);
    t.el.style.opacity         = String(0.4 + strength * 0.6);
  }

  // ── Tick generation — runs on mount and on debounced resize ───────────────
  function generateTicks(isTouch: boolean, prefersReduced: boolean): void {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous ticks
    ticksRef.current.forEach((t) => t.el.remove());
    ticksRef.current = [];
    activeSetRef.current.clear();

    const w = container.offsetWidth;
    const h = container.offsetHeight;

    const cols = Math.floor(w / GRID);
    const rows = Math.floor(h / GRID);

    // Center the grid so partial gaps are equal on all edges
    const offsetX = (w - cols * GRID) / 2 + GRID / 2;
    const offsetY = (h - rows * GRID) / 2 + GRID / 2;

    const fragment = document.createDocumentFragment();
    const newTicks: TickData[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cx           = offsetX + col * GRID;
        const cy           = offsetY + row * GRID;
        const restRotation = Math.random() * 12 - 6; // ±6deg feature noise

        const el = document.createElement('div') as HTMLDivElement;

        el.style.position        = 'absolute';
        el.style.left            = `${cx - 1}px`;  // 2px wide, center-aligned
        el.style.top             = `${cy - 7}px`;  // 14px tall, center-aligned
        el.style.width           = '2px';
        el.style.height          = '14px';
        el.style.borderRadius    = '1px';
        el.style.backgroundColor = REST_COLOR;
        el.style.opacity         = '0.5';
        el.style.transform       = `rotate(${restRotation}deg) scaleY(1)`;
        el.style.transformOrigin = 'center center';

        if (!prefersReduced) {
          el.style.transition = TICK_TRANSITION;
        }

        // Touch fallback: CSS idle drift instead of mouse interaction
        if (isTouch && !prefersReduced) {
          const duration = 3 + Math.random() * 3; // 3–6s
          const delay    = Math.random() * 3;      // 0–3s
          el.style.animation = `idleDrift ${duration}s ease-in-out ${delay}s infinite alternate`;
        }

        fragment.appendChild(el);
        newTicks.push({ el, cx, cy, restRotation });
      }
    }

    container.appendChild(fragment);
    ticksRef.current = newTicks;
  }

  // ── rAF update — only touches delta DOM elements ──────────────────────────
  function updateTicks(): void {
    const ticks     = ticksRef.current;
    const cursor    = cursorRef.current;
    const activeSet = activeSetRef.current;
    const newActive = new Set<number>();

    // Pure JS distance pass — no DOM access
    for (let i = 0; i < ticks.length; i++) {
      const t    = ticks[i];
      const dx   = cursor.x - t.cx;
      const dy   = cursor.y - t.cy;
      const dist = Math.hypot(dx, dy);
      if (dist < RADIUS) {
        newActive.add(i);
      }
    }

    // Apply active styles to all ticks currently in radius (tracks cursor angle per-frame)
    for (const i of newActive) {
      const t    = ticks[i];
      const dx   = cursor.x - t.cx;
      const dy   = cursor.y - t.cy;
      const dist = Math.hypot(dx, dy);
      applyActive(t, dx, dy, dist);
    }

    // Reset only ticks that just left the radius — resting ticks are never touched
    for (const i of activeSet) {
      if (!newActive.has(i)) {
        applyResting(ticks[i]);
      }
    }

    activeSetRef.current = newActive;
  }

  // ── Mount / cleanup ───────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isTouch        = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    generateTicks(isTouch, prefersReduced);

    // Reduced-motion: static ticks only — no interaction, no drift
    // Touch: CSS idle drift handles animation — no mouse listeners needed
    if (isTouch || prefersReduced) return;

    // Attach mouse events to the parent (hero section) — the field itself
    // has pointer-events: none and cannot receive events directly
    const parent = container.parentElement;
    if (!parent) return;

    // rAF-throttled mousemove handler — spec pattern
    const handleMouseMove = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      cursorRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(() => {
          updateTicks();
          rafIdRef.current = null;
        });
      }
    };

    const handleMouseLeave = () => {
      cursorRef.current = { x: -999, y: -999 };
      // Reset ALL currently active ticks to resting — clear the set
      const ticks = ticksRef.current;
      for (const i of activeSetRef.current) {
        applyResting(ticks[i]);
      }
      activeSetRef.current.clear();
      // Cancel any pending rAF frame
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };

    // Debounced resize — regenerate tick grid after 100ms settle
    const handleResize = () => {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(() => {
        generateTicks(isTouch, prefersReduced);
      }, 100);
    };

    parent.addEventListener('mousemove', handleMouseMove);
    parent.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    return () => {
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    />
  );
}
