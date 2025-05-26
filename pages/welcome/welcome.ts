import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/basePage';
import { ReadinessCheck } from '../base/types';

export class WelcomePage extends BasePage {
  readonly title: Locator;
  readonly descriptionText: Locator;
  readonly emailMention: Locator;
  readonly createOrganizationButton: Locator;
  readonly tryDifferentEmailButton: Locator;
  readonly requestAccessButton: Locator;
  protected url = '/welcome';

  constructor(page: Page) {
    super(page);
    this.title = this.page.getByRole('heading', { name: 'Welcome to Hubstaff!' });
    this.descriptionText = this.page.locator('.form .text').first();
    this.emailMention = this.page.locator('.form .text b').nth(1);
    this.createOrganizationButton = this.page.getByRole('link', { name: 'Create organization' });
    this.tryDifferentEmailButton = this.page.getByRole('link', { name: 'Try a different email' });
    this.requestAccessButton = this.page.getByRole('link', { name: 'Request access to join' });
  }

  protected getReadinessChecks(): ReadinessCheck[] {
    return [];
  }
}
