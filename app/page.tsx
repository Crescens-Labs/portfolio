import dynamic from 'next/dynamic';
import { Loader } from '@/components/Loader';
import { GiantWordmark, Hero } from '@/components/sections/Hero';
import { Wrap } from '@/components/layout';
import { RevealText } from '@/components/RevealText';
import { DecryptText } from '@/components/DecryptText';
import { TAGLINE } from '@/content/home';
import { homeJsonLd } from '@/lib/seo';
import h from '@/components/sections/sections.module.css';
import s from './page.module.css';

const Who = dynamic(() => import('@/components/sections/Who').then((m) => m.Who));
const Stats = dynamic(() => import('@/components/sections/Who').then((m) => m.Stats));
const Bento = dynamic(() => import('@/components/sections/Bento').then((m) => m.Bento));
const Services = dynamic(() => import('@/components/sections/Build').then((m) => m.Services));
const Process = dynamic(() => import('@/components/sections/Process').then((m) => m.Process));
const Together = dynamic(() => import('@/components/sections/Together').then((m) => m.Together));
const Work = dynamic(() => import('@/components/sections/Work').then((m) => m.Work));
const Recognition = dynamic(() => import('@/components/sections/Recognition').then((m) => m.Recognition));
const Voices = dynamic(() => import('@/components/sections/Voices').then((m) => m.Voices));
const Team = dynamic(() => import('@/components/sections/Team').then((m) => m.Team));
const Lab = dynamic(() => import('@/components/sections/Lab').then((m) => m.Lab));
const Engagement = dynamic(() => import('@/components/sections/Engagement').then((m) => m.Engagement));
const Faq = dynamic(() => import('@/components/sections/Faq').then((m) => m.Faq));
const Contact = dynamic(() => import('@/components/sections/Contact').then((m) => m.Contact));
const Footer = dynamic(() => import('@/components/sections/Footer').then((m) => m.Footer));

export default function Home() {
  return (
    <>
      <Loader />
      <main>
        {/*
          The wordmark is sticky inside THIS box, so the box defines both
          where the effect starts and where it ends.

          The mark rests inside the hero's own bottom padding, so the dark
          behind it at the moment it locks is the hero's field, grain and
          vignette included. A separate dark band could not match that and
          left a hard line across the full width.

          The cream run out then rises through the held letters and sweeps
          the inversion across them. Without it the blend flipped in a
          single frame, which read as a glitch rather than a transition.

          The zone closes before the section below it, so the mark releases
          and scrolls away instead of sitting on top of that section's
          heading, which is what it did when the two shared a container.
        */}
        <div className={s.heroZone}>
          <Hero />
          <GiantWordmark />
          <div className={h.wordmarkRunLight} aria-hidden="true" />
        </div>

        {/* The thesis (light) sits inside the hero's cream run out, so
            the inversion sweep ends on the first paragraph. The tagline
            reads as the studio's operating principle rather than a
            second sales line stacked on top of the hero's. */}
        <section data-ground="light" className={s.thesis} id="about">
          <Wrap>
            <p className={s.thesisEyebrow}>+ the principle</p>
            <RevealText
              as="h2"
              distance={0.95}
              text="Most people arrive sure of the symptom. |Finding the cause is the work.| Building it is the easy part."
            />

            <div className={s.taglineRow}>
              <p className={s.taglineText}>
                <DecryptText text="DON'T TRUST. VERIFY." />
              </p>
              <p className={s.thesisNote}>{TAGLINE.note}</p>
            </div>
          </Wrap>
        </section>

        {/* Ground rhythm: dark, dark, dark, dark, light, dark, dark,
            light, dark, dark, void. Cream sections break the dark run
            twice (the thesis, Together, Team, Engagement) so the page
            never reads as one long heavy band, and the void ground
            drops the bottom out at the very end. */}
        <Who />
        <Stats />
        <Bento />
        <Services />
        <Process />
        <Together />
        <Work />
        <Recognition />
        <Voices />
        <Team />
        <Lab />
        <Engagement />
        <Faq />
        <Contact />
      </main>
      <Footer />

      {/* Structured data, built from the same content modules the page
          renders. One source of truth: the FAQ questions below the fold
          and the FAQPage entity can never disagree. */}
      {homeJsonLd().map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
    </>
  );
}