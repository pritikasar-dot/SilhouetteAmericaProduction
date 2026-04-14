import { test, expect } from '@playwright/test';

test('Valid Search Result', async ({ page }) => {
  await page.goto('https://www.silhouetteamerica.com/');
  await page.getByRole('button', { name: 'I agree' }).click();
  await page.getByRole('combobox', { name: 'Search' }).click();
  await page.getByRole('combobox', { name: 'Search' }).fill('cameo');
  await page.getByRole('combobox', { name: 'Search' }).press('Enter');
  await page.getByRole('link', { name: 'cameo', exact: true }).click();
  // Wait for product listing to load
  await page.waitForLoadState('networkidle');

  // Capture all product titles (adjust selector if needed)
  const productTitles = await page.locator('h2, h3, a').allTextContents();

  console.log('Products found:', productTitles);

  // Validate at least one product contains "cameo"
  const hasCameoProduct = productTitles.some(title =>
    title.toLowerCase().includes('cameo')
  );

  // Assertion
  expect(hasCameoProduct).toBeTruthy();
});