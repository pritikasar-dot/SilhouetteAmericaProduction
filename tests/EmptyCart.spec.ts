import { test, expect } from '@playwright/test';

test('Empty cart flow (robust)', async ({ page }) => {

  await page.goto('https://www.silhouetteamerica.com/');

  // ✅ Loader handler
  const waitForLoader = async () => {
    const loader = page.locator('.loading-mask');
    try {
      if (await loader.count() > 0) {
        await loader.first().waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
      }
    } catch {}
  };

  // 🔐 Login
  await page.getByRole('button', { name: 'I agree' }).click();
  await page.getByLabel("open user's link popup").first().click();
  await page.getByRole('link', { name: 'user login' }).click();

  await page.locator('#username').fill('priti.kasar@magnetoitsolutions.com');
  await page.locator('#popup-password').fill('Priti@123');
  await page.getByRole('button', { name: /sign in/i }).click();

  await waitForLoader();

  // 🔥 IMPORTANT: Reload after login (fixes session/cart sync)
  await page.reload();
  await waitForLoader();

  // 🛒 Go to cart
  await page.goto('https://www.silhouetteamerica.com/checkout/cart/');
  await waitForLoader();

  // ✅ Wait for cart to stabilize (either items OR empty message)
  const cartItems = page.locator('.cart.item');
const emptyMessage = page.locator('.cart-empty');

  await Promise.race([
    cartItems.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {}),
    emptyMessage.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
  ]);

  // 🔁 Retry once if Magento didn’t sync properly
 if ((await cartItems.count()) === 0 && !(await emptyMessage.isVisible())) {
  console.log('Cart not stable → retrying...');
  await page.reload();
  await waitForLoader();
}

  // 🔥 FINAL LOGIC
  if (await cartItems.count() > 0) {
    console.log('Products found → removing all');

    const removeButtons = page.locator('.action.action-delete');

while (await removeButtons.count() > 0) {
  const firstRemove = removeButtons.first();

  await firstRemove.scrollIntoViewIfNeeded();

  await firstRemove.click({ force: true });

  // Wait for Magento loader
  await page.waitForSelector('.loading-mask', { state: 'visible', timeout: 5000 }).catch(() => {});
  await page.waitForSelector('.loading-mask', { state: 'hidden', timeout: 10000 }).catch(() => {});

  // Optional small buffer (Magento flaky UI)
  await page.waitForTimeout(1000);
}

  } else {
    console.log('Cart already empty');
  }

  // ✅ Final validation
  await expect(emptyMessage).toBeVisible();
});