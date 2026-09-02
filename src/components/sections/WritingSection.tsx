'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import MaskReveal from '@/components/ui/MaskReveal';


const posts = [
  {
    id: 'post-1',
    date: 'Coming soon',
    readTime: '—',
    title: 'Why Anti-Leakage Pipelines Matter in XAI',
    excerpt: 'How improper train/test boundaries corrupt SHAP values — and the pipeline design choices that prevent it.',
    tags: ['XAI', 'SHAP', 'ML Pipelines'],
  },
  {
    id: 'post-2',
    date: 'Coming soon',
    readTime: '—',
    title: 'Building a Multi-Agent Swarm with LangGraph',
    excerpt: 'Lessons from architecting a ReAct-based multi-agent career platform: orchestration, state, failure modes.',
    tags: ['LangGraph', 'Multi-Agent', 'AI Engineering'],
  },
  {
    id: 'post-3',
    date: 'Coming soon',
    readTime: '—',
    title: 'From Research to SaaS: Six Months of Resume Forge',
    excerpt: 'What it takes to go from prototype to production SaaS — architecture decisions, missteps, and what shipped.',
    tags: ['SaaS', 'Product', 'Next.js'],
  },
];

export default function WritingSection() {
  const leftRef  = useRef<HTMLDivElement>(null);
  const rowsRef  = useRef<HTMLDivElement>(null);

  const leftVisible = useScrollReveal(leftRef,  { threshold: 0.3 });
  const rowsVisible = useScrollReveal(rowsRef,  { threshold: 0.2 });

  const rowReveal = (i: number): React.CSSProperties =>
    rowsVisible
      ? {
          animationName: 'writingRowReveal',
          animationDuration: '500ms',
          animationTimingFunction: 'var(--ease-entrance)',
          animationFillMode: 'both',
          animationDelay: `${100 + i * 100}ms`,
        }
      : { opacity: 0, transform: 'translateY(16px)' };

  return (
    <>
      <style>{`
        @keyframes writingRowReveal {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .writing-row {
          transition: transform 0.2s var(--ease-entrance);
        }
        .writing-row:hover {
          transform: translateY(-2px);
        }
        .writing-row:hover .writing-row-border {
          border-left-color: var(--gold) !important;
        }
      `}</style>

      <section id="writing" className="glass-section" style={{ paddingTop: 'var(--section-gap)', paddingBottom: 'var(--section-gap)', borderTop: '1px solid var(--border)' }}>
        <div className="sc">
          {/* Header — left column fades up as one unit */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div ref={leftRef}>
              <span
                className="t-label"
                style={{
                  display: 'block', marginBottom: '12px',
                  ...(leftVisible ? { animationName:'fadeUp', animationDuration:'600ms', animationTimingFunction:'var(--ease-entrance)', animationFillMode:'both', animationDelay:'0ms' } : { opacity:0 })
                }}
              >// Writing</span>
              <MaskReveal visible={leftVisible} delay={80}>
                <h2 className="t-display" style={{ fontSize: 'clamp(1.875rem, 3vw, 2.5rem)' }}>
                  Notes from the lab<br />and the codebase
                </h2>
              </MaskReveal>
            </div>

            <p
              className="t-body"
              style={{
                maxWidth: '30ch',
                fontSize: '0.875rem',
                ...(leftVisible ? { animationName:'fadeIn', animationDuration:'500ms', animationTimingFunction:'var(--ease-entrance)', animationFillMode:'both', animationDelay:'120ms' } : { opacity:0 }),
              }}
            >
              Technical writing on ML research, AI engineering, and product. Posts arrive when ready.
            </p>
          </div>

          {/* Posts */}
          <div ref={rowsRef}>
            {posts.map((post, i) => (
              <article
                key={post.id}
                className="writing-row group flex flex-col md:flex-row md:items-start gap-6 cursor-pointer"
                style={{
                  padding: '20px 0',
                  borderTop: '1px solid var(--border)',
                  borderBottom: i === posts.length - 1 ? '1px solid var(--border)' : 'none',
                  ...rowReveal(i),
                }}
              >
                {/* Meta */}
                <div className="shrink-0 md:w-36 flex md:flex-col gap-3 md:gap-1 pt-0.5">
                  <span className="t-eyebrow">{post.date}</span>
                  <span className="t-eyebrow">{post.readTime} min</span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1.5 flex-1">
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', letterSpacing: '-0.01em', color: 'var(--text-primary)', lineHeight: 1.35 }}>
                    {post.title}
                  </h3>
                  <p className="t-body" style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>{post.excerpt}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {post.tags.map(tag => (
                      <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', padding: '2px 7px' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow — existing animation untouched */}
                <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-1.5 self-center" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>→</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
