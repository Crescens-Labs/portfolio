import { expect, test } from '@playwright/test';

/**
 * GATE 3. Runs at 390, 768 and 1440 through the project matrix.
 *
 * The reduced-motion block is the one that matters. Everything else here
 * would be caught in review eventually; a page that renders blank only for
 * visitors who opted out of motion would not.
 */

test.describe('styleguide', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/styleguide');
    await page.waitForLoadState('networkidle');
  });

  test('never scrolls horizontally', async ({ page }) => {
    const overflow = await page.evaluate(() => {
      const d = document.documentElement;
      return d.scrollWidth - d.clientWidth;
    });
    expect(overflow, 'the page body scrolls sideways').toBeLessThanOrEqual(0);
  });

  test('every primitive is present', async ({ page }) => {
    for (const label of [
      'tokens',
      'type',
      'reveal, pinned',
      'pinned steps',
      'process',
      'stats',
      'marquee',
      'decrypt + magnetic',
    ]) {
      await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
    }
    await expect(page.getByRole('progressbar').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /end to end/i })).toBeVisible();
  });

  test('every numeric stat carries a source', async ({ page }) => {
    // Explicit test ids, not a class substring. `[class*="stat"]` also
    // matched the grid wrapper, so the source locator resolved to four
    // nodes at once and failed on strict mode rather than on the claim.
    const cells = page.getByTestId('stat');
    const n = await cells.count();
    expect(n).toBeGreaterThan(0);
    for (let i = 0; i < n; i += 1) {
      const src = cells.nth(i).getByTestId('stat-source');
      await expect(src, 'a stat shipped without attribution').not.toBeEmpty();
    }
  });

  test('the accordion opens and reports state', async ({ page }) => {
    const btn = page.getByRole('button', { name: /end to end/i });
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
    await btn.click();
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByText(/Structure, architect, iterate/)).toBeVisible();
  });
});

test.describe('reduced motion', () => {
  /**
   * `test.use({ reducedMotion })` did not reach `matchMedia` here: the page
   * reported `prefers-reduced-motion: reduce` as false, every guard fell
   * through, and GSAP ran. Calling emulateMedia on the page directly does
   * apply. Worth knowing that the config-level option can silently no-op,
   * because a green suite would have meant nothing.
   */
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/styleguide');
    await page.waitForLoadState('networkidle');

    // Guard the guard. If emulation ever stops applying, this file goes red
    // here rather than passing for the wrong reason.
    expect(
      await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches),
      'reduced motion emulation did not take, nothing below this proves anything',
    ).toBe(true);
  });

  test('nothing is left invisible', async ({ page }) => {
    const hidden = await page.evaluate(() => {
      const out: string[] = [];
      for (const el of document.querySelectorAll<HTMLElement>('main *')) {
        if (el.getAttribute('aria-hidden') === 'true') continue;
        if (!el.textContent?.trim()) continue;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        if (Number(cs.opacity) < 0.1) out.push(el.className || el.tagName);
      }
      return out;
    });
    expect(hidden, 'elements are stuck invisible under reduced motion').toEqual([]);
  });

  test('the reveal spine is fully readable without scrolling to it', async ({ page }) => {
    const words = page.locator('[class*="word"]');
    const n = await words.count();
    expect(n).toBeGreaterThan(5);

    // Every word must already be at ink or accent, not the dim start colour.
    const dim = await page.evaluate(() => {
      const els = [...document.querySelectorAll<HTMLElement>('[class*="word"]')];
      return els.filter((el) => {
        const c = getComputedStyle(el).color;
        const m = c.match(/[\d.]+/g)?.map(Number) ?? [];
        // the dim start state is the line colour at 0.22 alpha
        return m.length === 4 && m[3] < 0.5;
      }).length;
    });
    expect(dim, 'the quote spine is still dimmed for a reduced-motion visitor').toBe(0);
  });

  test('the process bar reads as filled', async ({ page }) => {
    const fill = page.locator('[class*="barFill"]').first();
    const scale = await fill.evaluate((el) => {
      const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
      return m.a;
    });
    expect(scale, 'the bar is stuck empty under reduced motion').toBeGreaterThan(0.1);
  });
});
