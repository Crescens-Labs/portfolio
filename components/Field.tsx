import type { CSSProperties, ReactNode } from 'react';
import styles from './field.module.css';

/**
 * The atmospheric background layer: paper grain plus a light bloom.
 *
 * This replaces `assets/hero-background.png` and `assets/section-bg.png`,
 * which were 1376x768 and 3.2 MB together. Measured, those files failed in
 * three ways that a static image cannot fix:
 *
 *   - a 390px phone showed 26% of the width under object-fit: cover, and
 *     the bloom sat at the edge on both files, so mobile got the flat part
 *   - white ink on the section-bg bloom measured 1.03:1
 *   - grain is high frequency noise, the worst case for image compression
 *
 * The fix is to separate what was baked together. The fibre is a real
 * extraction from the hero PNG, tiled at 256px and 37 KB. The bloom is a
 * radial-gradient, so it repositions per breakpoint, respects the alpha
 * budget in tokens.css, and can drift on scroll.
 */

export type BloomLevel = 'none' | 'safe' | 'head' | 'hot';

export type FieldProps = {
  /**
   * How bright the bloom is allowed to get, chosen by what sits on top.
   *
   *   safe  all three text tones stay >= 4.5:1   (body copy welcome)
   *   head  ink and accent stay >= 4.5:1         (headings only)
   *   hot   no text may overlap the bloom core   (negative space only)
   *
   * Never raise a level to make a section prettier. Move the bloom.
   */
  bloom?: BloomLevel;
  /** Bloom centre. Percentages of the band box. */
  x?: string;
  y?: string;
  /** Bloom radius. Second value applies from 900px up. */
  size?: string;
  sizeWide?: string;
  /**
   * Where the bloom moves below 900px. Defaults to top centre, because the
   * edge placements that read well on a monitor fall off a phone entirely.
   */
  xNarrow?: string;
  yNarrow?: string;
  className?: string;
  children?: ReactNode;
};

const LEVEL: Record<BloomLevel, string> = {
  none: '0',
  safe: 'var(--bloom-safe)',
  head: 'var(--bloom-head)',
  hot: 'var(--bloom-hot)',
};

export function Field({
  bloom = 'safe',
  x = '84%',
  y = '18%',
  size = '78vmax',
  sizeWide = '52vmax',
  xNarrow = '62%',
  yNarrow = '10%',
  className,
  children,
}: FieldProps) {
  const style = {
    '--b-a': LEVEL[bloom],
    '--b-x': x,
    '--b-y': y,
    '--b-x-n': xNarrow,
    '--b-y-n': yNarrow,
    '--b-r': size,
    '--b-r-w': sizeWide,
  } as CSSProperties;

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')} style={style}>
      <div className={styles.grain} aria-hidden="true" />
      {bloom !== 'none' && <div className={styles.bloom} aria-hidden="true" />}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
