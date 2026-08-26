/**
 * The single GSAP entry point. Nothing else in the app imports `gsap`
 * directly, so plugin registration happens exactly once and never on the
 * server.
 *
 * Division of labour, fixed:
 *   GSAP   -> scroll linked work only (pin, scrub, reveal)
 *   Motion -> component state and exit animation
 *   CSS    -> everything that can be a transition
 *
 * Anything that can be CSS should be CSS. There is no third library.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';

/** The house easing, identical to the CSS `--ease` token. */
export const HOUSE_EASE = 'cubic-bezier(0.44, 0, 0.56, 1)';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP);

  // One easing token for the whole site, defined once from the same four
  // control points as the CSS variable so JS and CSS motion cannot drift.
  CustomEase.create('house', 'M0,0 C0.44,0 0.56,1 1,1');

  gsap.defaults({ ease: 'house', duration: 1 });

  // Motion is decoration. If the visitor opted out, scroll effects resolve
  // to their end state instantly rather than being skipped, so nothing is
  // left sitting at opacity 0.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/**
 * True when the visitor has asked for reduced motion.
 * Read at call time, never cached, the setting can change live.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export { gsap, ScrollTrigger, CustomEase, useGSAP };
