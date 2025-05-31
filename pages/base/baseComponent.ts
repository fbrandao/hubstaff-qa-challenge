import { Page } from '@playwright/test';

import { expect } from '@playwright/test';
import { ReadinessCheck } from './types';

export abstract class BaseComponent {
  constructor(protected readonly page: Page) {}

  /**
   * Returns an array of readiness checks that determine if the component is ready for interaction.
   * @returns {ReadinessCheck[]} An array of readiness checks.
   */
  abstract getReadinessChecks(): ReadinessCheck[];

  /**
   * Waits until all readiness checks pass for this component. Throws if any check fails.
   * @throws {Error} If any check fails.
   * @returns {Promise<void>} A promise that resolves when all checks pass.
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
