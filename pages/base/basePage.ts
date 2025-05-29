import { expect, Page, test } from '@playwright/test';
import { Response } from 'playwright-core';
import { ReadinessCheck } from './types';
import { buildUrl, BaseUrlType, getBaseUrl } from '../../utils/config';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiRequest {
  method: HttpMethod;
  url: string | RegExp;
}

export abstract class BasePage {
  constructor(
    protected readonly page: Page,
    protected readonly baseUrlType: BaseUrlType = 'marketing', // default to marketing
  ) {}
  protected abstract url: string;
  protected abstract getReadinessChecks(): ReadinessCheck[];

  get context() {
    return this.page.context();
  }

  get currentUrl() {
    return this.page.url();
  }

  async goto() {
    const base = getBaseUrl(this.baseUrlType);
    const fullUrl = buildUrl(base, this.url);
    await this.page.goto(fullUrl, { waitUntil: 'domcontentloaded' });
  }

  async waitUntilReady(): Promise<void> {
    await test.step('Wait until page is ready', async () => {
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
    });
  }

  async waitForApiResponseWithAction(options: {
    page: Page;
    requests: ApiRequest[];
    action: () => Promise<void>;
  }): Promise<Response[]> {
    const { page, requests, action } = options;

    const responsePromises = requests.map(request =>
      page.waitForResponse(resp => {
        const matchesUrl =
          typeof request.url === 'string'
            ? resp.url().includes(request.url)
            : request.url.test(resp.url());
        return matchesUrl && resp.request().method().toUpperCase() === request.method.toUpperCase();
      }),
    );

    const [responses] = await Promise.all([Promise.all(responsePromises), action()]);

    return responses;
  }
}
