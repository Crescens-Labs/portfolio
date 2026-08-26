import type { ReactNode } from 'react';
import s from './ui.module.css';

/**
 * Section kicker. The `+` marker is the accent's smallest appearance and
 * the only decoration allowed above a heading.
 */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className={s.eyebrow}>{children}</p>;
}

/** Small mono label. Uses `--label`, which is brighter than `--body` on
 *  purpose, because 10 to 11px mono needs the extra contrast. */
export function MonoLabel({ children }: { children: ReactNode }) {
  return <span className={s.mono}>{children}</span>;
}

/**
 * The two tone heading. One clause carries the weight in `--ink`, the
 * rest recedes to `--body`, and at most one word takes the accent.
 *
 * Two rules, both enforced in tests:
 *   - one accent word per heading, never two
 *   - line-height 0.9
 */
export function Heading({
  level = 2,
  lead,
  accent,
  tail,
  children,
}: {
  level?: 1 | 2 | 3;
  /** Recedes to --body. The setup clause. */
  lead?: ReactNode;
  /** The single accent word. */
  accent?: ReactNode;
  /** Continues in --ink after the accent. */
  tail?: ReactNode;
  children?: ReactNode;
}) {
  const Tag = (['h1', 'h2', 'h3'] as const)[level - 1];
  return (
    <Tag className={s.head} data-level={level}>
      {lead ? <span className={s.headLead}>{lead} </span> : null}
      {children}
      {accent ? <em className={s.headAccent}>{accent}</em> : null}
      {tail ? <span> {tail}</span> : null}
    </Tag>
  );
}

/** The sentence directly under a heading. Sits at `--ink`, not `--body`,
 *  so it does not grey out at the exact moment it has to be read. */
export function Lead({ children }: { children: ReactNode }) {
  return <p className={s.lead}>{children}</p>;
}

export function Body({ children }: { children: ReactNode }) {
  return <p className={s.body}>{children}</p>;
}
