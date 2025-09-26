import type { FullConfig } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';

/**
 * Global setup for CI: pre-populate storageState with consent/localStorage flags
 * to neutralize Silktide overlay so it won't intercept pointer events.
 *
 * This runs only on CI to avoid altering local dev behavior.
 */
export default async function globalSetup(_config: FullConfig) {
  if (!process.env.CI) return;

  const origin = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:8080';

  // Storage state structure as Playwright expects.
  // Only localStorage entries are added; no cookies.
  const storageState = {
    cookies: [] as any[],
    origins: [
      {
        origin,
        localStorage: [
          { name: 'silktideCookieChoice_necessary', value: 'true' },
          { name: 'silktideCookieChoice_analytics', value: 'true' },
          { name: 'silktideCookieChoice_marketing', value: 'true' },
          // Common fallbacks some consent libs use
          { name: 'cookieconsent_status', value: 'allow' },
          { name: 'cookie_consent_accepted', value: 'true' },
        ],
      },
    ],
  };

const outPath = resolve(process.cwd(), 'tests', 'storageState.ci.json');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(storageState, null, 2), 'utf-8');
}