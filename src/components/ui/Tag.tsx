'use client';

interface TagProps {
  label: string;
}

export default function Tag({ label }: TagProps) {
  return (
    <span
      className="inline-flex items-center justify-center transition-all"
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '0.06em',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-pill)',
        padding: '3px 10px',
        color: 'var(--text-secondary)',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--gold)';
        e.currentTarget.style.color = 'var(--gold)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.color = 'var(--text-secondary)';
      }}
    >
      {label}
    </span>
  );
}
