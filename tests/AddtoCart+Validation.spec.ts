import { test, expect } from '@playwright/test';

test('Add first bundle product to cart', async ({ page }) => {
  await page.goto('https://www.silhouetteamerica.com/'); // add your URL

  // Accept cookies
  await page.getByRole('button', { name: 'I agree' }).click();

  // Search for bundle
  const searchBox = page.getByRole('combobox', { name: 'Search' });
  await searchBox.click();
  await searchBox.fill('bundle');
  await searchBox.press('Enter');

  // Click on bundle link (if needed)
  await page.getByRole('link', { name: 'bundle', exact: true }).click();

  // Wait for products to load
  await page.waitForSelector('.kuAddtocart');

  // Click FIRST product's Add to Cart
  await page.locator('.kuAddtocart a.saaddtocart').first().click();

  // Optional assertion (example)
  // await expect(page.locator('text=added to cart')).toBeVisible();
});