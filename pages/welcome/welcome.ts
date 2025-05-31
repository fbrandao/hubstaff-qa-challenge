import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../base/basePage';
import { ReadinessCheck } from '../base/types';

export class WelcomePage extends BasePage {
  readonly title: Locator;
  readonly descriptionText: Locator;
  readonly emailMention: Locator;
  readonly createOrganizationButton: Locator;
  readonly tryDifferentEmailButton: Locator;
  readonly requestAccessButton: Locator;
  protected baseUrl = '/welcome';

  constructor(page: Page) {
    super(page);
    this.title = this.page.getByRole('heading', { name: 'Welcome to Hubstaff!' });
    this.descriptionText = this.page.locator('.form .text').first();
    this.emailMention = this.page.locator('.form .text b').nth(1);
    this.createOrganizationButton = this.page.getByRole('link', { name: 'Create organization' });
    this.tryDifferentEmailButton = this.page.getByRole('link', { name: 'Try a different email' });
    this.requestAccessButton = this.page.getByRole('link', { name: 'Request access to join' });
  }

  /**
   * Returns the readiness checks for the welcome page.
   * @returns {ReadinessCheck[]} The readiness checks for the welcome page.
   */
  getReadinessChecks(): ReadinessCheck[] {
    return [
      {
        description: 'Welcome title should be visible',
        type: 'assertion',
        assertion: () => expect(this.title).toBeVisible(),
      },
      {
        description: 'Description test is visible',
        type: 'assertion',
        assertion: () => expect(this.descriptionText).toBeVisible(),
      },
      {
        description: 'Email mention',
        type: 'assertion',
        assertion: () => expect(this.emailMention).toBeVisible(),
      },
      {
        description: 'Create organization button is visible',
        type: 'assertion',
        assertion: () => expect(this.createOrganizationButton).toBeVisible(),
      },
    ];
  }
}
