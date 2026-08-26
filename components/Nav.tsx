'use client';

import { useEffect, useRef, useState } from 'react';
import { getLenis } from '@/lib/lenis';
import { SOCIALS } from '@/content/home';
import s from './ui.module.css';

/** 15px glyphs for the header social cluster. Strokes and fills both ride
    currentColor, so the hover state is one colour change.

    Exported so the footer renders the ghosts at the same shape as the
    header ones: one helper, one source of truth for the brand's glyphs. */
export function SocialGlyph({ label }: { label: string }) {
  const common = {
    viewBox: '0 0 24 24',
    'aria-hidden': true as const,
    focusable: false as const,
    fill: 'currentColor',
  };
  switch (label) {
    case 'GitHub':
      return (
        <svg {...common}>
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      );
    case 'X':
      return (
        <svg {...common}>
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
        </svg>
      );
    case 'LinkedIn':
      return (
        <svg {...common}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="17.3" cy="6.7" r="1.25" />
        </svg>
      );
  }
}

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Lab', href: '#lab' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

/** Five dots on a C. Same geometry as the hero canvas and the loader. */
function Mark() {
  return (
    <svg className={s.markSvg} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {[-88, -134, 180, 134, 88].map((deg) => {
        const a = (deg * Math.PI) / 180;
        return (
          <circle
            key={deg}
            cx={12 + Math.cos(a) * 9.4}
            cy={12 + Math.sin(a) * 9.4}
            r={2.6}
            fill="currentColor"
          />
        );
      })}
    </svg>
  );
}

/** The nav leaves with the hero so the wordmark owns the opening frame. */
export function Nav() {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  /**
   * Locking the page behind the overlay takes two things, not one.
   *
   * `overflow: hidden` on the body stops native scrolling, but Lenis does
   * not scroll the body. It transforms on its own rAF loop and carries on
   * regardless, which is why the page underneath kept moving while the
   * menu was open. It has to be told to stop as well.
   *
   * `overscroll-behavior: contain` on the panel is the third part, in CSS:
   * without it, reaching the end of a long menu chains the gesture through
   * to whatever is behind.
   */
  useEffect(() => {
    if (!open) return;

    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overscrollBehavior = '';
      lenis?.start();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
        return;
      }
      // A full screen overlay that lets focus wander behind it is a
      // keyboard trap in reverse: the user tabs into content they cannot
      // see and has no idea where they are.
      if (e.key !== 'Tab' || !panel.current) return;
      const items = panel.current.querySelectorAll<HTMLElement>('a, button');
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    panel.current?.querySelector<HTMLElement>('a')?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header className={s.nav}>
        <a className={s.brand} href="#top" aria-label="Crescens Labs, home">
          <Mark />
          <span className={s.wordmark}>CRESCENS</span>
        </a>

        {/*
          The socials sit in the header itself, not inside the menu. The
          menu is one tap away, which sounds close but is a second screen
          between a visitor and the proof that two real people run this
          studio. At one glance the icons answer "where else do they
          exist"; the menu is then free to do its own job.
        */}
        <div className={s.navSide}>
          <nav className={s.navSocials} aria-label="Social media">
            {SOCIALS.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" aria-label={l.label}>
                <SocialGlyph label={l.label} />
              </a>
            ))}
          </nav>

          <button
            ref={toggle}
            type="button"
            className={s.burger}
            aria-expanded={open}
            aria-controls="nav-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={s.burgerBars} data-open={open} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      <div
        ref={panel}
        id="nav-menu"
        className={s.menu}
        data-open={open}
        hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        // The scroll fix. Lenis preventDefaults every wheel event that is
        // not inside a `data-lenis-prevent` subtree, and while the menu is
        // open Lenis is stopped, so the panel's own native scroll was being
        // eaten before it could happen. The attribute exempts it.
        data-lenis-prevent
      >
        <nav className={s.menuNav}>
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ '--i': i } as React.CSSProperties}
            >
              <span className={s.menuIndex}>{String(i + 1).padStart(2, '0')}</span>
              <span className={s.menuLabel}>{l.label}</span>
            </a>
          ))}
        </nav>

{/* The oversized closing block makes the full-screen menu feel intentional
    while preserving a short, scannable link list. */}
        <div className={s.menuFoot}>
          <p className={s.menuStatement}>
            We choose the problem worth solving over the feature list, because the system has to
            outlive the brief.
          </p>

          <div className={s.menuMeta}>
            <p>
              <span>studio</span>
              Two people. End to end.
            </p>
            <p>
              <span>based in</span>
              Indonesia, working remote
            </p>
          </div>

          <p className={s.menuSay}>
            <span>say hello</span>
            <a className={s.menuMail} href="mailto:hi@crescenslabs.com">
              hi@crescenslabs.com
            </a>
            {/* Repeated from the header with labels, because the menu is
                where a deliberate visitor lands. Icons alone are glanceable;
                names are clickable with confidence. */}
            <span className={s.menuSocials}>
              {SOCIALS.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              ))}
            </span>
          </p>
        </div>

        <svg
          className={s.menuGhost}
          viewBox="0 0 1000 146"
          aria-hidden="true"
          focusable="false"
          role="presentation"
        >
          <text x="0" y="146" textLength="1000" lengthAdjust="spacingAndGlyphs">
            CRESCENS
          </text>
        </svg>
      </div>
    </>
  );
}
