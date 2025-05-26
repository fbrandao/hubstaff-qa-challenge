import { expect, Page } from '@playwright/test';
import { ReadinessCheck } from './types';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}
  protected abstract url: string;
  protected abstract getReadinessChecks(): ReadinessCheck[];

  get context() {
    return this.page.context();
  }

  get currentUrl() {
    return this.page.url();
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async waitUntilReady(): Promise<void> {
    const checks = this.getReadinessChecks();

    for (const check of checks) {
      const { description } = check;

      try {
        if (check.type === 'check') {
          const passed = await check.check();
          expect(passed, `Readiness check failed: ${description}`).toBeTruthy();
        } else {
          await check.assertion();
        }
      } catch (err) {
        throw new Error(`Readiness check failed: ${description}\n${(err as Error).message}`);
      }
    }
  }
}
