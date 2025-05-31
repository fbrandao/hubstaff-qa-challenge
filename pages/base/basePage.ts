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
  protected abstract baseUrl: string;

  /**
   * Returns an array of readiness checks that determine if the component is ready for interaction.
   * @returns {ReadinessCheck[]} An array of readiness checks.
   */
  abstract getReadinessChecks(): ReadinessCheck[];

  /**
   * Returns the context of the page.
   * @returns {BrowserContext} The context of the page.
   */
  get context() {
    return this.page.context();
  }

  /**
   * Returns the current URL of the page.
   * @returns {string} The current URL of the page.
   */
  get currentUrl(): string {
    return this.page.url();
  }

  /**
   * Navigates to the page.
   * @returns {Promise<void>} A promise that resolves when the page is navigated to.
   */
  async goto(): Promise<void> {
    const base = getBaseUrl(this.baseUrlType);
    const fullUrl = buildUrl(base, this.baseUrl);
    await this.page.goto(fullUrl, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Waits until all readiness checks pass for this component. Throws if any check fails.
   * @throws {Error} If any check fails.
   * @returns {Promise<void>} A promise that resolves when all checks pass.
   */
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

  /**
   * Waits for API responses triggered by an action.
   * @param {Object} options - The options for the API response.
   * @param {Page} options.page - The page to wait for the API response on.
   * @param {ApiRequest[]} options.requests - The requests to wait for.
   * @param {() => Promise<void>} options.action - The action to perform.
   * @returns {Promise<Response[]>} A promise that resolves when the API responses are received.
   * @example
   * await this.waitForActionAndApiResponses({
   *   page: this.page,
   *   requests: [{ method: 'GET', url: /\/organizations\/\d+\/team_payments/ }],
   *   action: () => this.page.getByRole('button', { name: 'Create payment' }).click(),
   * });
   */
  async waitForActionAndApiResponses(options: {
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
