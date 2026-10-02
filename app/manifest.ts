import type { MetadataRoute } from 'next';

/**
 * Install surface and OS chrome. The colours are the void ground, so the
 * splash, the Android task switcher and the mobile address bar all read as
 * the same field the page opens on rather than a white flash before it.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Crescens Labs',
    short_name: 'Crescens',
    description: 'End to end software studio. Find the problem worth solving, then build it with you.',
    start_url: '/',
    display: 'standalone',
    background_color: '#040706',
    theme_color: '#040706',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/apple-icon.png', type: 'image/png', sizes: '180x180' },
    ],
  };
}
