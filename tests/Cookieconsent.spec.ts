import { test, expect } from '@playwright/test';

test('Cookie Consent', async ({ page }) => {
  await page.goto('https://www.silhouetteamerica.com/');
  await page.getByRole('button', { name: 'I agree' }).click();
});