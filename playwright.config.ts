import { defineConfig, devices } from '@playwright/test';
import { config } from './utils/config';
import { isCI } from './utils/env';
import os from 'os';
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  /* The global test directory */
  testDir: './tests/e2e/',
  timeout: 60000,
  expect: {
    timeout: 10000,
  },

  /* Run tests in files in parallel */
  fullyParallel: true,

  workers: 5,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: isCI
    ? [
        ['html', { outputFolder: `./reports/e2e` }],
        ['line'],
        ['junit', { outputFile: `./reports/e2e/results.xml` }],
        ['json', { outputFile: `./reports/e2e/results.json` }],
        ['github'],
        [
          'playwright-ctrf-json-reporter',
          {
            outputFile: `./reports/e2e/ctrf.json`,
            appName: config.app.name,
            appVersion: '1.0.0',
            osPlatform: os.platform(),
            osRelease: os.release(),
            osVersion: os.version(),
            buildName: 'Hubstaff E2E Build',
            buildNumber: '100',
            testEnvironment: 'production',
          },
        ],
      ]
    : [['html', { outputFolder: `./reports/e2e` }], ['line']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: config.app.baseUrl,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
    video: 'on',
    screenshot: 'on',
  },
  /* Global setup and teardown */
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',

  /* Define separate projects */
  projects: [
    /* 🔹 E2E TESTS (Desktop Browsers) */
    {
      name: 'E2E - Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
});
