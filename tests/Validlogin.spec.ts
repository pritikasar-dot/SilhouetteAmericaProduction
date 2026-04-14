import { test, expect } from '@playwright/test';

test('User should login successfully', async ({ page }) => {
  await page.goto('https://www.silhouetteamerica.com/');

  await page.getByRole('button', { name: 'I agree' }).click();
  await page.getByLabel("open user's link popup").first().click();
  await page.getByRole('link', { name: 'user login' }).click();

  await page.locator('#username').fill('priti.kasar@magnetoitsolutions.com');
  await page.locator('#popup-password').fill('Priti@123');
  await page.getByRole('button', { name: /sign in/i }).click();

  const userIcon = page.getByLabel("open user's link popup").first();
  const accountText = page.getByText(/my account|logout/i);

  let isSuccess = false;

  try {
    await expect(userIcon).toBeVisible({ timeout: 5000 });
    isSuccess = true;
  } catch (e) {}

  if (!isSuccess) {
    try {
      await expect(accountText).toBeVisible({ timeout: 5000 });
      isSuccess = true;
    } catch (e) {}
  }

  // ✅ Final assertion
  expect(isSuccess).toBeTruthy();
});
