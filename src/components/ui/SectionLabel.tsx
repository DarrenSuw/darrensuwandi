'use client';

export default function SectionLabel({ children }: { children: string }) {
  return (
    <span
      className="inline-flex items-center gap-2"
      style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)' }}
    >
      <span style={{ display: 'inline-block', width: '16px', height: '1px', background: 'var(--gold)' }} />
      {"// "}{children}
    </span>
  );
}
