'use client';

import React, { useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import MaskReveal from '@/components/ui/MaskReveal';
import {
  SiPython, SiC, SiCplusplus, SiTypescript, SiJavascript, SiMysql,
  SiN8N, SiUnity, SiBlender, SiAndroidstudio, SiWireshark,
  SiNextdotjs, SiFastapi, SiPytorch, SiScikitlearn, SiPandas,
  SiOptuna, SiPydantic,
} from 'react-icons/si';
import { IconType } from 'react-icons';

/* ─────────────────────────────────────────────────────────
   Data — each entry is either an react-icons IconType
   or a fallback node for icons not in Simple Icons
   ───────────────────────────────────────────────────────── */

type Tech = {
  name: string;
  descriptor: string;
  Icon?: IconType;
  fallback?: React.ReactNode;
  brandColor: string;
};

const LANGUAGES: Tech[] = [
  { name: 'Python',     descriptor: 'Primary language — ML & backend',      Icon: SiPython,     brandColor: '#3776AB' },
  { name: 'C',          descriptor: 'Systems & embedded programming',        Icon: SiC,          brandColor: '#A8B9CC' },
  { name: 'C++',        descriptor: 'Performance-critical systems',          Icon: SiCplusplus,  brandColor: '#00599C' },
  { name: 'TypeScript', descriptor: 'Type-safe full-stack development',      Icon: SiTypescript, brandColor: '#3178C6' },
  { name: 'JavaScript', descriptor: 'Web interactivity & scripting',         Icon: SiJavascript, brandColor: '#F7DF1E' },
  { name: 'SQL',        descriptor: 'MySQL · data querying & modeling',      Icon: SiMysql,      brandColor: '#4479A1' },
];

const TOOLS: Tech[] = [
  { name: 'n8n',            descriptor: 'Workflow automation & integrations', Icon: SiN8N,            brandColor: '#EA4B71' },
  { name: 'Unity',          descriptor: '3D/2D game development engine',      Icon: SiUnity,          brandColor: '#FFFFFF' },
  { name: 'Blender',        descriptor: '3D modeling, rendering & VFX',       Icon: SiBlender,        brandColor: '#E87D0D' },
  { name: 'Android Studio', descriptor: 'Android app development IDE',        Icon: SiAndroidstudio,  brandColor: '#3DDC84' },
  { name: 'Wireshark',      descriptor: 'Network protocol analysis',          Icon: SiWireshark,      brandColor: '#1679A7' },
  {
    name: 'Weka',
    descriptor: 'ML workbench & data mining',
    brandColor: '#C42D2D',
    fallback: (
      <svg viewBox="0 0 40 40" width="36" height="36">
        <rect width="40" height="40" rx="8" fill="currentColor" opacity="0.12"/>
        <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
          fill="currentColor" fontFamily="Georgia,serif" fontWeight="700" fontSize="22">W</text>
      </svg>
    ),
  },
];

const FRAMEWORKS: Tech[] = [
  { name: 'Next.js',     descriptor: 'Full-stack React framework',          Icon: SiNextdotjs,  brandColor: '#000000' },
  { name: 'FastAPI',     descriptor: 'High-performance Python API',         Icon: SiFastapi,    brandColor: '#009688' },
  { name: 'PyTorch',     descriptor: 'Deep learning & neural nets',         Icon: SiPytorch,    brandColor: '#EE4C2C' },
  { name: 'Scikit-Learn',descriptor: 'Classical ML algorithms',             Icon: SiScikitlearn,brandColor: '#F7931E' },
  { name: 'Optuna',      descriptor: 'Hyperparameter optimization',         Icon: SiOptuna,     brandColor: '#3E84E5' },
  {
    name: 'SHAP',
    descriptor: 'Explainable AI & model insights',
    brandColor: '#FF0051',
    fallback: (
      <svg viewBox="0 0 40 40" width="36" height="36">
        <rect width="40" height="40" rx="8" fill="currentColor" opacity="0.12"/>
        <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
          fill="currentColor" fontFamily="monospace" fontWeight="700" fontSize="13">SHAP</text>
      </svg>
    ),
  },
  {
    name: 'SMOTE',
    descriptor: 'Imbalanced data resampling',
    brandColor: '#7C3AED',
    fallback: (
      <svg viewBox="0 0 40 40" width="36" height="36">
        <rect width="40" height="40" rx="8" fill="currentColor" opacity="0.12"/>
        <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
          fill="currentColor" fontFamily="monospace" fontWeight="700" fontSize="10">SMOTE</text>
      </svg>
    ),
  },
  { name: 'Pandas',   descriptor: 'Data analysis & manipulation',        Icon: SiPandas,   brandColor: '#150458' },
  { name: 'Pydantic', descriptor: 'Data validation with Python types',   Icon: SiPydantic, brandColor: '#E92063' },
];

/* ─────────────────────────────────────────────────────────
   Card component
   ───────────────────────────────────────────────────────── */
function TechCard({ tech }: { tech: Tech }) {
  const iconNode = tech.Icon
    ? <tech.Icon size={34} />
    : tech.fallback;

  return (
    <div className="ts-card-wrap">
      <div className="ts-card-inner">

        {/* Front */}
        <div className="ts-face ts-front">
          <div className="ts-icon ts-icon-front">{iconNode}</div>
          <span className="ts-label">{tech.name}</span>
        </div>

        {/* Back */}
        <div className="ts-face ts-back">
          <div className="ts-icon ts-icon-back">{iconNode}</div>
          <span className="ts-label-back">{tech.name}</span>
          <span className="ts-desc">{tech.descriptor}</span>
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Group component — each group triggers its own scroll reveal
   ───────────────────────────────────────────────────────── */
function TechGroup({ label, items }: { label: string; items: Tech[] }) {
  const groupRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollReveal(groupRef, { threshold: 0.2 });

  return (
    <div className="ts-group" ref={groupRef}>
      <div className="ts-group-header">
        <span className="t-eyebrow" style={{ whiteSpace: 'nowrap' }}>{label}</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </div>
      <div className="ts-grid">
        {items.map((t, i) => (
          <div
            key={t.name}
            style={isVisible ? {
              animationName: 'scaleIn',
              animationDuration: '400ms',
              animationTimingFunction: 'var(--ease-entrance)',
              animationFillMode: 'both',
              animationDelay: `${i * 60}ms`,
            } : { opacity: 0, transform: 'scale(0.88)' }}
          >
            <TechCard tech={t} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Section
   ───────────────────────────────────────────────────────── */
export default function TechStackSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerVisible = useScrollReveal(headerRef, { threshold: 0.3 });

  const headerReveal = (delay: number): React.CSSProperties =>
    headerVisible
      ? { animationName: 'fadeUp', animationDuration: '600ms', animationTimingFunction: 'var(--ease-entrance)', animationFillMode: 'both', animationDelay: `${delay}ms` }
      : { opacity: 0 };

  return (
    <>
      <style>{`
        /* ── Wrapper / perspective ── */
        .ts-card-wrap {
          perspective: 900px;
          width: 96px;
          height: 96px;
        }
        @media (min-width: 768px) {
          .ts-card-wrap {
            width: 112px;
            height: 112px;
          }
        }
        .ts-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.52s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ts-card-wrap:hover .ts-card-inner {
          transform: rotateY(180deg);
        }

        /* ── Shared face ── */
        .ts-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 8px;
        }

        /* ── Front ── */
        .ts-front {
          background: var(--surface);
          border: 1px solid var(--border);
          transition: border-color 0.2s;
        }
        .ts-card-wrap:hover .ts-front {
          border-color: rgba(196,154,0,0.4);
        }
        .ts-icon-front {
          color: var(--text-secondary);
          opacity: 0.8;
          transition: opacity 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ts-label {
          font-family: var(--font-mono);
          font-size: 7.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
          text-align: center;
          line-height: 1.4;
        }

        /* ── Back ── */
        .ts-back {
          background: var(--ink);
          border: 1px solid rgba(196,154,0,0.45);
          transform: rotateY(180deg);
          box-shadow:
            0 0 24px rgba(196,154,0,0.30),
            0 0 64px rgba(196,154,0,0.12),
            inset 0 0 22px rgba(196,154,0,0.07);
        }
        .ts-icon-back {
          color: var(--gold);
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 0 8px rgba(196,154,0,0.55));
        }
        .ts-label-back {
          font-family: var(--font-mono);
          font-size: 7.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
          text-align: center;
        }
        .ts-desc {
          font-family: var(--font-body);
          font-size: 7px;
          color: rgba(255,255,255,0.38);
          text-align: center;
          line-height: 1.55;
          padding: 0 3px;
        }

        /* ── Group ── */
        .ts-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .ts-group-header {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .ts-grid {
          display: grid;
          grid-template-columns: repeat(3, 96px);
          justify-content: center;
          gap: 8px;
        }
        @media (min-width: 768px) {
          .ts-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
          }
        }
      `}</style>

      <section
        id="techstack"
        className="glass-section"
        style={{
          paddingTop: 'var(--section-gap)',
          paddingBottom: 'var(--section-gap)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div className="sc">
          {/* Header — staggered fade-up */}
          <div ref={headerRef} className="flex flex-col gap-4 mb-14">
            <span className="t-label" style={headerReveal(0)}>// Tech Stack</span>
            <MaskReveal visible={headerVisible} delay={80}>
              <h2 className="t-display" style={{ fontSize: 'clamp(1.875rem,3.5vw,2.75rem)' }}>
                Tools &amp; Technologies
              </h2>
            </MaskReveal>

            <p className="t-body" style={{ maxWidth: '520px', fontSize: '0.875rem', ...headerReveal(160) }}>
              Languages, frameworks, and tools I reach for — hover a card to flip it.
            </p>
          </div>

          <div className="flex flex-col gap-14">
            <TechGroup label="Languages"             items={LANGUAGES}   />
            <TechGroup label="Tools & DevOps"        items={TOOLS}       />
            <TechGroup label="Frameworks & Libraries" items={FRAMEWORKS}  />
          </div>
        </div>
      </section>
    </>
  );
}
