import { Page } from '@playwright/test';

import { expect } from '@playwright/test';
import { ReadinessCheck } from './types';

export abstract class BaseComponent {
  constructor(protected readonly page: Page) {}

  /**
   * Returns an array of readiness checks that determine if the component is ready for interaction.
   */
  abstract getReadinessChecks(): ReadinessCheck[];

  /**
   * Waits until all readiness checks pass for this component. Throws if any check fails.
   */
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
