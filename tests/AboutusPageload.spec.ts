import { test, expect } from '@playwright/test';

test.describe('About Us Page - Stable Tests', () => {

  test.beforeEach(async ({ page }) => {

    await page.goto('https://www.silhouetteamerica.com/');

    const agreeBtn = page.getByRole('button', { name: /i agree/i });
    if (await agreeBtn.isVisible()) {
      await agreeBtn.click();
    }

    await page.getByRole('button', { name: /resources/i }).click();
    await page.getByRole('link', { name: /about us/i }).click();

    // ✅ Stable wait
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('h1');
  });

  test('Validate CMS page load time', async ({ page }) => {

    const loadTime = await page.evaluate(() => {
      const timing = performance.timing;
      return (timing.loadEventEnd - timing.navigationStart) / 1000;
    });

    console.log('Page Load Time:', loadTime);

    expect(loadTime).toBeLessThan(5);
  });

});