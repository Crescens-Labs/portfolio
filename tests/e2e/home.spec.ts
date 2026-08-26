import { expect, test } from '@playwright/test';

test.describe('home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('never scrolls horizontally', async ({ page }) => {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, 'the page body scrolls sideways').toBeLessThanOrEqual(0);
  });

  test('the headline and the action are above the fold', async ({ page }) => {
    const vh = page.viewportSize()!.height;
    for (const loc of [
      page.getByRole('heading', { level: 1 }),
      page.locator('#top a[class*="ctaCard"]'),
    ]) {
      const box = await loc.boundingBox();
      expect(box, 'element not laid out').not.toBeNull();
      expect(box!.y + box!.height, 'hero content falls below the fold').toBeLessThanOrEqual(vh);
    }
  });

  test('the hero stays a poster, not a page', async ({ page }) => {
    // The hero earns attention by being short. This is the guard against
    // it slowly refilling with paragraphs.
    const words = await page
      .getByRole('heading', { level: 1 })
      .innerText()
      .then((t) => t.trim().split(/\s+/).length);
    expect(words, 'the hero headline is turning into a paragraph').toBeLessThanOrEqual(12);
  });

  test('the headline uses three tones, not two', async ({ page }) => {
    const colours = await page.evaluate(() => {
      const h1 = document.querySelector('h1')!;
      return [...new Set([...h1.querySelectorAll('span')].map((s) => getComputedStyle(s).color))];
    });
    expect(colours.length, 'white and pink alone read as a template').toBeGreaterThanOrEqual(3);
  });

  test('the giant wordmark spans the full width with every letter present', async ({ page }) => {
    // It used to be sized in `vw`, which can only ever be approximately the
    // width of the screen: a value that fitted at 1440 clipped the last two
    // letters at 390, so the word read CRESCEN. `textLength` solves it
    // exactly, and this asserts both halves, full bleed and nothing cut.
    const { markW, viewW, letters } = await page.evaluate(() => {
      const svg = document.querySelector<SVGSVGElement>('[data-testid="wordmark"]')!;
      return {
        markW: svg.getBoundingClientRect().width,
        viewW: document.documentElement.clientWidth,
        letters: svg.querySelector('text')!.textContent,
      };
    });
    expect(letters, 'the wordmark is not the whole word').toBe('CRESCENS');
    expect(Math.abs(markW - viewW), 'the wordmark does not span the frame').toBeLessThan(2);
  });

  test('the wordmark releases before the next section speaks', async ({ page }) => {
    // The failure this guards is the one that shipped: sticky held all the
    // way into the light section and the mark sat on top of its heading,
    // so both were unreadable. Scroll to the heading and assert nothing
    // overlaps it.
    const heading = page.locator('#about h2');
    await heading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const overlap = await page.evaluate(() => {
      const h = document.querySelector('#about h2')!.getBoundingClientRect();
      const mark = document.querySelector('[data-testid="wordmark"]')!.getBoundingClientRect();
      const gap = Math.min(h.bottom, mark.bottom) - Math.max(h.top, mark.top);
      return gap;
    });
    expect(overlap, 'the giant wordmark is sitting on the next heading').toBeLessThanOrEqual(0);
  });

  test('exactly one h1', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  });

  test('the hero carries no floating object', async ({ page }) => {
    await expect(page.getByTestId('constellation')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Crescens Labs, home' })).toBeVisible();
  });

  test('the nav shares the hero field, with no seam', async ({ page }) => {
    // Rendered outside the hero the bar sat on the flat page background
    // while the hero had gradient and grain, and the join was visible all
    // the way across.
    const inside = await page.evaluate(() => {
      const nav = document.querySelector('header')!;
      return !!nav.closest('section#top');
    });
    expect(inside, 'the nav is outside the hero field').toBe(true);
  });

  test('the nav spans the full content width', async ({ page }) => {
    const { navX, headX } = await page.evaluate(() => ({
      navX: document.querySelector('header')!.getBoundingClientRect().left,
      headX: document.querySelector('h1')!.getBoundingClientRect().left,
    }));
    expect(Math.abs(navX - headX), 'the nav is inset from the page grid').toBeLessThan(2);
  });

  test('the proof strip leads with the result, strongest first', async ({ page }) => {
    await expect(page.getByText(/judged, not self declared/i)).toBeVisible();

    const results = await page.locator('section#top ul li b').allInnerTexts();
    expect(results).toEqual(['Winner', 'Top 7', 'Competed', 'Winner']);

    // A national win outranks a cohort placement. Ordering by how famous
    // the logo is would put Meta first and overstate the weaker claim.
    const first = await page.locator('section#top ul li').first().innerText();
    expect(first).toContain('National Campus Hackathon');
  });


  test('no source credential reaches the browser', async ({ page }) => {
    const html = await page.content();
    expect(html).not.toContain('sk_');
    const bundleLeak = await page.evaluate(() =>
      [...document.querySelectorAll('script')].some((s) => s.textContent?.includes('sk_')),
    );
    expect(bundleLeak, 'a source credential is in the page').toBe(false);
  });

  test('keeps the stack, fourth case study, and lab decrypt surface public', async ({ page }) => {
    expect(await page.locator('#who img[src^="/logos/tech/"]').count()).toBeGreaterThan(0);
    await expect(page.locator('#work').getByRole('heading', { name: 'Franchise System' })).toBeVisible();
    await expect(page.locator('#lab')).toBeVisible();
    await expect(page.locator('#lab canvas[aria-hidden="true"]')).toHaveCount(1);
    await expect(page.locator('#lab').getByText('Field AI').first()).toBeVisible();
  });

  test('the proof section hands over to voices without a blank seam', async ({ page }) => {
    const overlap = await page.evaluate(() => {
      const recognition = document.querySelector('#recognition')!.getBoundingClientRect();
      const voices = document.querySelector('#voices')!.getBoundingClientRect();
      return recognition.bottom - voices.top;
    });
    expect(overlap, 'voices begins after a blank visual gap').toBeGreaterThan(0);
  });
});

test.describe('home, menu', () => {
  // The hamburger is the only navigation at every width now, so this runs
  // on desktop too rather than being skipped there.
  test('opens, keeps focus inside, and closes on escape', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Open menu' });
    await expect(toggle).toBeVisible();

    await toggle.click();
    const dialog = page.getByRole('dialog', { name: 'Menu' });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close menu' })).toBeVisible();

    // Focus must land inside the overlay, or a keyboard user tabs through
    // content they cannot see.
    await expect(dialog.getByRole('link').first()).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test('locks the page behind it', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe('hidden');
  });

  test('the page behind does not move when the menu is scrolled', async ({ page }) => {
    // `overflow: hidden` on the body was never enough on its own. Lenis
    // does not scroll the body, it transforms on its own loop, so the page
    // underneath carried on moving while the overlay was open.
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Open menu' }).click();

    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.move(200, 400);
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(700);
    const after = await page.evaluate(() => window.scrollY);

    expect(Math.abs(after - before), 'the page scrolled behind the menu').toBeLessThan(4);
  });
});

test.describe('home, reduced motion', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(
      await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches),
      'reduced motion emulation did not take',
    ).toBe(true);
  });

  test('nothing is left invisible', async ({ page }) => {
    const hidden = await page.evaluate(() => {
      const out: string[] = [];
      for (const el of document.querySelectorAll<HTMLElement>('main *')) {
        if (el.closest('[aria-hidden="true"]')) continue;
        if (!el.textContent?.trim()) continue;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        if (Number(cs.opacity) < 0.1) out.push(el.className || el.tagName);
      }
      return out;
    });
    expect(hidden).toEqual([]);
  });

  test('the tagline reads as the real string, not scrambled glyphs', async ({ page }) => {
    // DecryptText scrambles on the way in. Opting out of motion has to
    // yield the sentence, not a frozen frame of noise, and the accessible
    // copy is present from first paint either way.
    await expect(page.getByText("DON'T TRUST. VERIFY.").first()).toBeVisible();
  });

});

test.describe('home, mobile decrypt reveal', () => {
  test('shows an in-progress state on mobile before resolving the tagline', async ({ page }) => {
    await page.goto('/');

    const decrypt = page.locator('#about span[class*="decrypt"]');
    const visual = decrypt.locator('span[aria-hidden="true"]');
    await page.locator('#about').scrollIntoViewIfNeeded();

    await expect(decrypt).toHaveAttribute('data-decrypt-state', 'decrypting');
    await expect(visual).not.toHaveText("DON'T TRUST. VERIFY.");
    await expect(decrypt).toHaveAttribute('data-decrypt-state', 'resolved', { timeout: 2_500 });
    await expect(visual).toHaveText("DON'T TRUST. VERIFY.");
  });
});

test.describe('home, mobile first paint', () => {
  test('does not block the hero with an intro curtain', async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) > 767, 'the desktop loader is intentional');
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-intro]')).toBeHidden({ timeout: 500 });
  });
});
