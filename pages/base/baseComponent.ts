import { Page } from '@playwright/test';

import { expect } from '@playwright/test';
import { ReadinessCheck } from './types';

export abstract class BaseComponent {
  constructor(protected readonly page: Page) {}

  abstract getReadinessChecks(): ReadinessCheck[];

  async waitUntilReady(): Promise<void> {
    for (const check of this.getReadinessChecks()) {
      if ('check' in check) {
        const passed = await check.check();
        expect(passed, `Component check failed: ${check.description}`).toBeTruthy();
      } else {
        await check.assertion();
      }
    }
  }
}
