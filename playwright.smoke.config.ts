import { defineConfig, devices } from '@playwright/test';

// Local smoke run: tag environment as dev
process.env.PLAYWRIGHT_ENV = 'dev';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
  },
  // Only run a fast, stable subset
  testMatch: [
    'tests/working-cart.spec.ts',
    'tests/checkout.smoke.spec.ts',
  ],
});
