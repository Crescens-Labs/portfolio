'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import s from './ui.module.css';

/**
 * The primary call to action. Kicker above, label left, vertical three dot
 * marker right, echoing the logo's dot cluster.
 */
export function CTACard({
  kicker,
  label,
  href,
}: {
  kicker?: string;
  label: string;
  href: string;
}) {
  return (
    <div>
      {kicker ? <p className={s.ctaKick}>{kicker}</p> : null}
      <a className={s.cta} href={href}>
        {label}
        <span className={s.ctaDots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </a>
    </div>
  );
}

/**
 * One cell of the stat row. `source` is required, not optional, because
 * the tagline is "Don't trust. Verify." and an unattributed number makes
 * that a liability rather than a promise.
 *
 * The value counts up when the cell scrolls into view (M6). Only pure
 * numerals count: "80%+" climbs to 80 and keeps its suffix, while "5 to 1"
 * is a relationship, not a quantity, and renders as text. Under reduced
 * motion the final value is simply there.
 */
export function StatCell({
  index = 0,
  total = 4,
  label,
  value,
  caption,
  source,
}: {
  index?: number;
  total?: number;
  label: string;
  value: string;
  caption: string;
  source: string;
}) {
  const match = value.match(/^(\d+)([%+x×]*)$/);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : '';

  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(target ?? 0);
  const [inview, setInview] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (target !== null) setN(target);
      setInview(true);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        setInview(true);
        // Text values like "5 to 1" enter with the same card animation,
        // they just skip the count.
        if (target === null) return;
        const t0 = performance.now();
        const DUR = 1100 + index * 120;
        const tick = (now: number) => {
          const t = Math.min(1, (now - t0) / DUR);
          setN(Math.round((1 - (1 - t) ** 3) * target));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, index]);

  return (
    <div className={s.stat} data-in={inview} data-testid="stat" ref={ref} style={{ '--i': index } as React.CSSProperties}>
      <span className={s.dots} aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <i key={i} className={i <= index ? s.dotOn : undefined} />
        ))}
      </span>
      <p className={s.statLabel}>{label}</p>
      <p className={s.statValue}>
        {target === null ? value : <>{n}<em>{suffix}</em></>}
      </p>
      <p className={s.statCap}>{caption}</p>
      <p className={s.statSrc} data-testid="stat-source">
        <span aria-hidden="true">src / </span>
        {source}
      </p>
    </div>
  );
}

/**
 * Accordion with a dot to bar marker. The marker is a transform on a
 * pseudo element, so open and close cost no layout.
 */
export function Accordion({ items }: { items: { q: string; a: ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const base = useId();

  return (
    <div className={s.acc}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className={s.accRow}>
            <h3 className={s.accHead}>
              <button
                type="button"
                className={s.accBtn}
                aria-expanded={isOpen}
                aria-controls={`${base}-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className={s.accMark} data-open={isOpen} aria-hidden="true" />
                {item.q}
              </button>
            </h3>
            <div id={`${base}-${i}`} className={s.accPanel} data-open={isOpen} hidden={!isOpen}>
              <div className={s.accInner}>{item.a}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Infinite marquee. Two identical tracks translated by -50%, so the loop
 * is seamless without measuring anything.
 *
 * Under reduced motion the animation stops and the row becomes a normal
 * horizontally scrollable list, which is the honest fallback: the content
 * stays reachable rather than frozen mid-slide.
 */
export function Marquee({
  children,
  speed = 42,
  reverse = false,
}: {
  children: ReactNode;
  speed?: number;
  /** Runs the track against the direction of the one above it, so two
      stacked marquees read as two belts rather than one repeated. */
  reverse?: boolean;
}) {
  return (
    <div
      className={s.marquee}
      data-reverse={reverse || undefined}
      style={{ '--speed': `${speed}s` } as React.CSSProperties}
    >
      <div className={s.mqTrack}>
        <div className={s.mqRow}>{children}</div>
        <div className={s.mqRow} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Label above, recessed panel, accent focus ring.
 *  Named FormField, not Field, because `Field` is the background layer. */
export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  const id = useId();
  return (
    <div className={s.formField}>
      <label className={s.formLabel} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className={s.formInput}
      />
    </div>
  );
}
