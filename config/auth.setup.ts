import { chromium } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

(async () => {
  const browser = await chromium.launch({ headless: false });

  const context = await browser.newContext({
    httpCredentials: {
      username: process.env.AUTH_USER!,
      password: process.env.AUTH_PASS!
    }
  });

  const page = await context.newPage();
  await page.goto(process.env.BASE_URL!);

  // Save session
  await context.storageState({ path: 'storage/auth.json' });

  await browser.close();
})();