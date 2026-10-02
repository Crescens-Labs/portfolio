import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { MotionProvider } from '@/components/MotionProvider';
import { MusicToggle } from '@/components/MusicToggle';
import { SITE_URL } from '@/lib/seo';
import './globals.css';
import './specks.css';

/**
 * Display and mono faces are self-hosted at build time. The display setting
 * carries the editorial character through its weight, tracking, and leading.
 */
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Crescens Labs, end to end software studio',
    template: '%s, Crescens Labs',
  },
  description:
    'End to end software studio. We structure the problem, architect the solution, build it with you, then train your team and hand it over.',
  applicationName: 'Crescens Labs',
  keywords: [
    'software studio',
    'end to end development',
    'custom web apps',
    'internal systems',
    'AI integration',
    'RAG',
    'offline first',
    'handover',
    'Indonesia',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Crescens Labs',
    title: 'Crescens Labs, end to end software studio',
    description:
      'Most clients arrive sure of the symptom. We find the problem worth solving, then build it with you. Don\u2019t trust. Verify.',
    url: '/',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crescens Labs, end to end software studio',
    description: 'Find the problem worth solving. Then build it with you.',
  },
  robots: { index: true, follow: true },
};

/** Mobile browser chrome takes the void ground, not the default white. */
export const viewport: Viewport = {
  themeColor: '#040706',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`} data-ground="dark" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('crescens-intro')==='1')document.documentElement.setAttribute('data-intro-seen','1')}catch(e){}`,
          }}
        />
        <MotionProvider>{children}</MotionProvider>
        {/* The floating music control. Renders dimmed until a track
            lands at public/audio/theme.mp3. */}
        <MusicToggle />
      </body>
    </html>
  );
}
