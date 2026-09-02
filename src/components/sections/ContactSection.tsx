'use client';

import { useRef, useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import MaskReveal from '@/components/ui/MaskReveal';

export default function ContactSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('darrensuwandi06@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Section entrance
  const sectionRef = useRef<HTMLDivElement>(null);
  const visible = useScrollReveal(sectionRef, { threshold: 0.3 });

  const reveal = (delay: number): React.CSSProperties =>
    visible
      ? { animationName: 'fadeUp', animationDuration: '600ms', animationTimingFunction: 'var(--ease-entrance)', animationFillMode: 'both', animationDelay: `${delay}ms` }
      : { opacity: 0 };

  return (
    <>
      <style>{`
        .contact-icon {
          transition: color 0.2s, transform 0.2s var(--ease-entrance);
        }
        .contact-icon:hover {
          transform: scale(1.15) translateY(-3px);
        }
      `}</style>

      <section
        id="contact"
        className="glass-section"
        style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--section-gap)', paddingBottom: 'var(--space-9)' }}
      >
        <div ref={sectionRef} className="sc max-w-[800px] mx-auto flex flex-col items-center text-center">

          {/* Glassmorphism Eyebrow — delay 0 */}
          <div className="flex justify-center mb-10" style={reveal(0)}>
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full shadow-sm" style={{ background: 'rgba(248,248,247,0.4)', backdropFilter: 'blur(12px)', border: '1px solid var(--border)' }}>
              <span style={{ display: 'block', width: '20px', height: '1px', background: 'var(--gold)' }} />
              <span className="t-label">Get in touch</span>
              <span style={{ display: 'block', width: '20px', height: '1px', background: 'var(--gold)' }} />
            </div>
          </div>

          {/* Center Content */}
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-4">
              {/* Headline — delay 80 */}
              <MaskReveal visible={visible} delay={80}>
                <h2 className="t-display" style={{ fontSize: '1.75rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  Let&apos;s build something exceptional.
                </h2>
              </MaskReveal>
              {/* Subtext — delay 160 */}

              <p className="t-body" style={{ fontSize: '0.9375rem', maxWidth: '42ch', ...reveal(160) }}>
                Whether it&apos;s a research collaboration, engineering role, or just to say hi — my inbox is always open.
              </p>
            </div>

            {/* Icon Links — delay 240 */}
            <div className="flex items-center gap-7" style={reveal(240)}>
              {/* Email */}
              <button
                onClick={handleCopyEmail}
                className="contact-icon hover-gold transition-colors relative flex items-center justify-center"
                style={{ color: copied ? 'var(--gold)' : 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none' }}
                aria-label="Copy Email"
              >
                {copied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', background: 'var(--ink)', color: 'var(--bg)', padding: '4px 8px', borderRadius: '4px', pointerEvents: 'none' }}>Copied!</span>}
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
              </button>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/darren-cornelius-suwandi" target="_blank" rel="noreferrer" className="contact-icon hover-gold transition-colors flex items-center justify-center" style={{ color: 'var(--text-muted)' }} aria-label="LinkedIn">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              {/* GitHub */}
              <a href="https://github.com/DarrenSuw" target="_blank" rel="noreferrer" className="contact-icon hover-gold transition-colors flex items-center justify-center" style={{ color: 'var(--text-muted)' }} aria-label="GitHub">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              </a>
            </div>

            {/* Direct Email Text */}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.04em', marginTop: '-8px' }}>
              darrensuwandi06@gmail.com
            </span>
          </div>

          {/* Footer */}
          <div className="w-full pt-8 mt-24 flex items-center justify-center" style={{ borderTop: '1px solid var(--border)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
              Darren Cornelius Suwandi · 2025–2026 · Built with Next.js
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
