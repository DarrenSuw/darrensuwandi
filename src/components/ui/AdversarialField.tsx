'use client';

import { useEffect, useRef } from 'react';

const SPACING = 44;
const TICK_W = 1.5;
const TICK_H = 12;
const RADIUS = 130;
const EASE = 0.12;
const SETTLE = 0.08;

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function lerpAngle(a: number, b: number, t: number) {
  const diff = ((b - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  return a + diff * t;
}

interface TickAnim { angle: number; scaleY: number; r: number; g: number; b: number; }
interface AnimTick { x: number; y: number; anim: TickAnim; }

export default function AdversarialField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let mouseX = -9999;
    let mouseY = -9999;
    let mouseIdle = true;
    let scrollIdle = true;
    let lastScrollY = -1;
    const active = new Map<string, TickAnim>();
    // Reuse array across frames — avoids GC pressure at 60fps
    const animatedTicks: AnimTick[] = [];

    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    }
    resize();

    function draw() {
      if (!canvas) return;
      raf = requestAnimationFrame(draw);

      // Skip rendering only when mouse AND scroll are both idle with no active ticks
      const curScrollY = window.scrollY;
      if (curScrollY !== lastScrollY) { scrollIdle = false; lastScrollY = curScrollY; }
      if (mouseIdle && scrollIdle && active.size === 0) return;
      // Once drawn, if scroll hasn't changed mark scroll as idle again
      scrollIdle = true;

      const dpr = window.devicePixelRatio || 1;
      const scrollY = window.scrollY;
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      ctx.beginPath();
      ctx.fillStyle = 'rgba(150,150,146,0.72)';

      animatedTicks.length = 0; // reset reusable array

      const curDocX = mouseX;
      const curDocY = mouseY + scrollY;

      const rowStart = Math.floor(scrollY / SPACING) - 1;
      const rowEnd = rowStart + Math.ceil(H / SPACING) + 2;
      const colStart = -1;
      const colEnd = Math.ceil(W / SPACING) + 2;

      for (let row = rowStart; row <= rowEnd; row++) {
        for (let col = colStart; col <= colEnd; col++) {
          const docX = col * SPACING + SPACING / 2;
          const docY = row * SPACING + SPACING / 2;
          const canvasX = docX;
          const canvasY = docY - scrollY;

          const dx = docX - curDocX;
          const dy = docY - curDocY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const inRadius = dist < RADIUS;

          const key = `${col},${row}`;
          let anim = active.get(key);

          if (inRadius) {
            if (!anim) {
              anim = { angle: 0, scaleY: 1, r: 150, g: 150, b: 146 };
              active.set(key, anim);
            }
            const strength = Math.pow(1 - dist / RADIUS, 2);
            anim.angle = lerpAngle(anim.angle, Math.atan2(dy, dx) + Math.PI / 2, EASE * 1.4);
            anim.scaleY = lerp(anim.scaleY, 1 + strength * 0.6, EASE);
            anim.r = lerp(anim.r, 196, EASE);
            anim.g = lerp(anim.g, 154, EASE);
            anim.b = lerp(anim.b, 0, EASE);
          } else if (anim) {
            anim.angle = lerpAngle(anim.angle, 0, SETTLE * 1.4);
            anim.scaleY = lerp(anim.scaleY, 1, SETTLE);
            anim.r = lerp(anim.r, 150, SETTLE);
            anim.g = lerp(anim.g, 150, SETTLE);
            anim.b = lerp(anim.b, 146, SETTLE);
            if (Math.abs(anim.angle) < 0.005 && Math.abs(anim.scaleY - 1) < 0.005) {
              active.delete(key);
              anim = undefined;
            }
          }

          if (anim) {
            animatedTicks.push({ x: canvasX, y: canvasY, anim });
          } else {
            ctx.rect(canvasX - TICK_W / 2, canvasY - TICK_H / 2, TICK_W, TICK_H);
          }
        }
      }
      ctx.fill();

      for (const { x, y, anim } of animatedTicks) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(anim.angle);
        ctx.scale(1, anim.scaleY);
        ctx.fillStyle = `rgb(${Math.round(anim.r)},${Math.round(anim.g)},${Math.round(anim.b)})`;
        ctx.fillRect(-TICK_W / 2, -TICK_H / 2, TICK_W, TICK_H);
        ctx.restore();
      }
      ctx.restore();
    }

    let idleTimer = 0;
    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseIdle = false;
      clearTimeout(idleTimer);
      // Mark idle 2s after last mouse move
      idleTimer = window.setTimeout(() => { mouseIdle = true; }, 2000);
    }
    function onLeave() {
      mouseX = -9999;
      mouseY = -9999;
      mouseIdle = true;
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', resize, { passive: true });
    draw();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      id="global-adversarial-field"
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}
    />
  );
}

