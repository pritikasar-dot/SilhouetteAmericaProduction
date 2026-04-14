import { test, expect } from '@playwright/test';

test('Register New User ', async ({ page }, testInfo) => {

  await page.goto('https://www.silhouetteamerica.com/');

  // Cookie
  const agreeBtn = page.getByRole('button', { name: /i agree/i });
  if (await agreeBtn.isVisible()) {
    await agreeBtn.click();
  }

  // Open login/register popup
  const userMenu = page.getByLabel("open user's link popup").first();
  await expect(userMenu).toBeVisible({ timeout: 10000 });
  await userMenu.click();

  const registerLink = page.getByRole('link', { name: /user register/i });
  await expect(registerLink).toBeVisible({ timeout: 10000 });
  await registerLink.click();

  // Wait for form
  await expect(page.getByRole('textbox', { name: /first name/i })).toBeVisible();

  // ✅ Unique email
  const email = `test+${Date.now()}@gmail.com`;

  // Fill form
  await page.getByRole('textbox', { name: /first name/i }).fill('Test');
  await page.getByRole('textbox', { name: /last name/i }).fill('Magneto');
  await page.getByRole('textbox', { name: /dob/i }).fill('11/15/1995');
  await page.keyboard.press('Tab');

  await page.locator('#register-gender').selectOption('2');
  await page.getByRole('textbox', { name: 'Email*' }).fill(email);
  await page.getByRole('textbox', { name: /mobile/i }).fill('7894561301');
  await page.getByRole('textbox', { name: /password/i }).fill('Priti@123');

  await page.getByRole('checkbox', { name: /terms/i }).check();
  await page.getByRole('checkbox', { name: /marketing/i }).check();

  // Submit
  await page.getByRole('button', { name: /create an account/i }).click();

  await expect(page.locator('body')).toContainText(/registration successful/i, {
    timeout: 10000
  });

  // ✅ Attach email to test result
  await testInfo.attach('registeredEmail', {
    body: email,
    contentType: 'text/plain'
  });

});