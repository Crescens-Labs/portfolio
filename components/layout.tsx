import type { ElementType, ReactNode } from 'react';
import { Field, type BloomLevel } from './Field';
import s from './ui.module.css';

export type Ground = 'dark' | 'light' | 'void';

/**
 * A full width horizontal band. Owns its ground, so the page gets tonal
 * rhythm by stacking bands rather than by overriding colours inline.
 */
export function Band({
  ground = 'dark',
  bloom = 'none',
  bloomX,
  bloomY,
  bloomSize,
  tight,
  id,
  children,
}: {
  ground?: Ground;
  bloom?: BloomLevel;
  bloomX?: string;
  bloomY?: string;
  bloomSize?: string;
  /** Half the vertical padding. For bands that continue the one above. */
  tight?: boolean;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} data-ground={ground} className={s.band}>
      <Field bloom={bloom} x={bloomX} y={bloomY} sizeWide={bloomSize}>
        <div className={tight ? s.padSm : s.pad}>{children}</div>
      </Field>
    </section>
  );
}

/** Centres content and owns the page gutter. */
export function Wrap({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={[s.wrap, className].filter(Boolean).join(' ')}>{children}</div>;
}

/** Four column hairline grid, reduced to one column below 900px. */
export function Grid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={[s.grid, className].filter(Boolean).join(' ')}>{children}</div>;
}

export function Col({
  span = 1,
  as: Tag = 'div',
  children,
}: {
  span?: 1 | 2 | 3 | 4;
  as?: ElementType;
  children: ReactNode;
}) {
  return (
    <Tag className={s.col} data-span={span}>
      {children}
    </Tag>
  );
}

export function Hairline({ vertical = false }: { vertical?: boolean }) {
  return <span aria-hidden="true" className={vertical ? s.hlV : s.hlH} />;
}

/**
 * A column that pins while its sibling scrolls past.
 *
 * CSS sticky preserves normal flow and needs no spacer element.
 */
export function StickyRail({
  offset = 'nav',
  children,
}: {
  offset?: 'nav' | 'section';
  children: ReactNode;
}) {
  return (
    <div className={s.sticky} data-offset={offset}>
      {children}
    </div>
  );
}
