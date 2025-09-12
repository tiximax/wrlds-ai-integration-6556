# E2E Tests with Playwright

This directory contains end-to-end tests using Playwright.

## Test Scripts

- `npm run test:e2e` - Run all Playwright tests headlessly
- `npm run test:e2e:headed` - Run tests with browser UI visible
- `npm run test:e2e:ui` - Run tests with Playwright's interactive UI

## Test Files

- `debug-cart.spec.ts` - Debug tests for cart structure and functionality
- `debug-console.spec.ts` - Debug tests for console errors and cart state
- `enhanced-cart.spec.ts` - Complete cart functionality tests
- `working-cart.spec.ts` - Focused working cart tests

## Running Tests

### Prerequisites
1. Install Playwright browsers: `npx playwright install`
2. Start dev server: `npm run dev` (runs on http://localhost:3000)

### Commands
```bash
# List all tests
npm run test:e2e -- --list

# Run specific test file
npm run test:e2e -- tests/working-cart.spec.ts

# Run tests on specific browser
npm run test:e2e -- --project=chromium

# Run tests with debug
npm run test:e2e:headed

# Interactive mode
npm run test:e2e:ui
```

## Separation from Unit Tests

These Playwright tests are kept separate from Vitest unit tests:
- Unit tests: `npm test` (runs only Vitest)
- E2E tests: `npm run test:e2e` (runs only Playwright)

This prevents conflicts between the two test frameworks.
