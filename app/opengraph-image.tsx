import { ImageResponse } from 'next/og';

/**
 * The social card, drawn in the site's own materials: the void field,
 * the five dot C, the wordmark, the tagline. No screenshot of the page,
 * because the page moves; the card is the identity holding still.
 *
 * next/og renders this at request time in production and at build time
 * for static export, so the card can never drift from the palette
 * constants below. If DESIGN-SYSTEM.md changes, change them here.
 */

const FIELD = '#08120E';
const ACCENT = '#F9B4D6';
const INK = '#EDF1EE';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Crescens Labs, end to end software studio. Don\u2019t trust. Verify.';

/** The five dots of the C on their arc, same angles the loader converges on. */
const DOTS = [-88, -134, 180, 134, 88].map((deg) => {
  const a = (deg * Math.PI) / 180;
  return {
    x: Math.round(Math.cos(a) * 92),
    y: Math.round(Math.sin(a) * 92),
  };
});

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 84px',
          background: FIELD,
          color: INK,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 22, letterSpacing: 6, color: '#8FA79A' }}>
          END TO END SOFTWARE STUDIO
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 56 }}>
          <div
            style={{
              display: 'flex',
              position: 'relative',
              width: 200,
              height: 200,
            }}
          >
            {DOTS.map((d, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 100 + d.x - 13,
                  top: 100 + d.y - 13,
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: ACCENT,
                  display: 'flex',
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 96, fontWeight: 800, letterSpacing: -4 }}>
              CRESCENS
            </div>
            <div style={{ display: 'flex', fontSize: 96, fontWeight: 800, letterSpacing: -4, color: ACCENT }}>
              LABS
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', fontSize: 26, letterSpacing: 4, color: ACCENT }}>
            DON&apos;T TRUST. VERIFY.
          </div>
          <div style={{ display: 'flex', fontSize: 22, color: '#8FA79A' }}>crescens.dev</div>
        </div>
      </div>
    ),
    size,
  );
}
