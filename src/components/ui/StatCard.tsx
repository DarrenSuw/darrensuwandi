'use client';

interface StatCardProps {
  label: string;
  value: string;
  variant: 'light' | 'dark';
}

export default function StatCard({ label, value, variant }: StatCardProps) {
  const isLight = variant === 'light';

  return (
    <div
      className="card-lift flex flex-col gap-2 p-6 rounded-2xl"
      style={{
        backgroundColor: isLight ? 'var(--surface)' : 'var(--ink-mid)',
        border: isLight ? '1px solid var(--border)' : '1px solid color-mix(in srgb, var(--bg) 6%, transparent)',
      }}
    >
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6875rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: isLight ? 'var(--text-muted)' : 'var(--gold)',
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1.75rem',
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
        color: isLight ? 'var(--text-primary)' : 'var(--bg)',
      }}>
        {value}
      </span>
    </div>
  );
}
