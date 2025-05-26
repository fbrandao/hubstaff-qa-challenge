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
    for (const check of this.getReadinessChecks()) {
      if ('check' in check) {
        const passed = await check.check();
        expect(passed, `Page readiness check failed: ${check.description}`).toBeTruthy();
      } else {
        await check.assertion();
      }
    }
  }
}
