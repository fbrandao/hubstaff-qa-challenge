import { defineConfig } from '@playwright/test';
import { isCI } from './utils/env';

export default defineConfig({
  testDir: './tests/unit',
  timeout: 60000,
  fullyParallel: true,
  workers: 5,
  forbidOnly: false,
  retries: 1,
  reporter: isCI
    ? [
        ['list'],
        ['json', { outputFile: 'reports/unit/results.json' }],
        ['junit', { outputFile: 'reports/unit/results.xml' }],
        ['html', { outputFolder: 'reports/unit/html', open: 'never' }],
      ]
    : [
        ['list'],
        ['html', { outputFolder: 'reports/unit/html' }],
        ['json', { outputFile: 'reports/unit/results.json' }],
      ],
  projects: [
    {
      name: 'Unit Tests',
      testMatch: /.*\.test\.ts/,
    },
  ],
});
