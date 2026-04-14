import { defineConfig } from '@playwright/test';
import { ENV } from './config/env';
import dotenv from 'dotenv';

dotenv.config({ override: true });

export default defineConfig({
  testDir: './tests',

  // ✅ Global timeout (VERY IMPORTANT)
  timeout: 60000,

  // ✅ Limit parallel execution (fix for timeout issue)
  workers: 2, // try 1 if still unstable

  // ✅ Retry flaky tests
  retries: 4,

  use: {
    baseURL: ENV.baseUrl,
    headless: true,

    // ❌ Avoid maximize (causes instability in headless)
    viewport: { width: 1920, height: 1080 },

    launchOptions: {
      args: ['--window-size=1920,1080']
    },

    // ✅ Stability helpers
    actionTimeout: 15000,
    navigationTimeout: 30000,

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // ✅ Ignore HTTPS issues if any
    ignoreHTTPSErrors: true,
  },

  reporter: [
    ['./reporters/customReporter.ts'],
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['list']
  ],
});