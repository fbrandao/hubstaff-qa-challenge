import { defineConfig, devices } from '@playwright/test';
import { config } from './utils/config';
import { isCI } from './utils/env';
import os from 'os';
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  /* The global test directory */
  testDir: './tests',
  timeout: isCI ? 180000 : 60000,
  expect: {
    timeout: 10000,
  },

  /* Run tests in files in parallel */
  fullyParallel: true,

  workers: 5,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!isCI,

  /* Retry on CI only */
  retries: isCI ? 1 : 0,

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
            outputFile: 'reports/e2e/ctrf.json',
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
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'on',
  },
  /* Global setup and teardown */
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',

  /* Define separate projects */
  projects: [
    {
      name: 'E2E - Chrome',
      testMatch: /e2e\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
    {
      name: 'E2E - Firefox',
      testMatch: /e2e\/.*\.spec\.ts/,
      use: { ...devices['Desktop Firefox'], channel: 'firefox' },
    },
    {
      name: 'E2E - Safari',
      testMatch: /e2e\/.*\.spec\.ts/,
      use: { ...devices['Desktop Safari'], channel: 'webkit' },
    },
  ],
});
