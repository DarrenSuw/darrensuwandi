'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Magnetic from '@/components/ui/Magnetic';



const navLinks = [
  { href: '#research', label: 'Research' },
  { href: '#writing', label: 'Writing' },
  { href: '#projects', label: 'Projects' },
  { href: '#timeline', label: 'Timeline' },
  { href: '#recognition', label: 'Recognition' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (

    <header
      className="fixed top-0 left-0 w-full z-50 flex justify-center"
      style={{ padding: '14px 24px' }}
    >
      <nav
        className="w-full flex items-center justify-between backdrop-blur-xl"
        style={{
          maxWidth: 'var(--container)',
          background: 'rgba(248,248,247,0.82)',
          borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--border)',
          padding: '9px 16px 9px 18px',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="D" width={22} height={22} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
            DCS
          </span>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '5px 11px', borderRadius: 'var(--radius-pill)', transition: 'color 0.18s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right CTAs */}
        <div className="flex items-center gap-2">
          <a href="/resume.pdf" download className="btn-ghost hidden md:inline-flex">Resume ↓</a>
          <Magnetic>
            <a href="#contact" className="btn-gold">Get in touch</a>
          </Magnetic>
          <button
            className="md:hidden p-1.5 flex flex-col gap-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="w-4 h-px transition-transform" style={{ background: 'var(--text-primary)', transform: isOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none' }} />
            <div className="w-4 h-px transition-opacity" style={{ background: 'var(--text-primary)', opacity: isOpen ? 0 : 1 }} />
            <div className="w-4 h-px transition-transform" style={{ background: 'var(--text-primary)', transform: isOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full px-6 pt-2">
          <div
            className="flex flex-col p-4 backdrop-blur-xl"
            style={{
              background: 'rgba(248,248,247,0.96)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}
          >
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="py-3 px-4"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-primary)', borderBottom: '1px solid var(--border)' }}
              >
                {label}
              </Link>
            ))}
            <a
              href="/resume.pdf"
              download
              onClick={() => setIsOpen(false)}
              className="py-3 px-4"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)' }}
            >
              Resume ↓
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

