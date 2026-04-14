import { test, expect } from '@playwright/test';

test('Invalid Search term', async ({ page }) => {
  await page.goto('https://www.silhouetteamerica.com/');
  await page.getByRole('button', { name: 'I agree' }).click();
  await page.getByText('Search Search suggestions').click();
  await page.getByRole('combobox', { name: 'Search' }).fill('randomtest123');
  await page.getByRole('combobox', { name: 'Search' }).press('Enter');
// ✅ Assertion instead of click
  await expect(
    page.getByText("We're sorry, no results found")
  ).toBeVisible();});