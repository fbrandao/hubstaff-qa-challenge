import { Page } from '@playwright/test';
import { config } from '../utils/config';

export class LandingPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto(config.app.baseUrl!);
  }
}
