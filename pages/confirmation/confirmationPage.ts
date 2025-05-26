import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../base/basePage';
import { ReadinessCheck } from '../base/types';

export class ConfirmationPage extends BasePage {
  readonly title: Locator;
  readonly subtitle: Locator;
  readonly resendButton: Locator;
  readonly backToSignInLink: Locator;
  protected url = '/confirmation_sent';

  constructor(page: Page) {
    super(page);
    this.title = this.page.getByRole('heading', { name: 'Verify your email' });
    this.subtitle = this.page.locator('.subtitle');
    this.resendButton = this.page.getByRole('button', { name: 'Resend it' });
    this.backToSignInLink = this.page.getByRole('link', { name: 'Back to sign in' });
  }

  getReadinessChecks(): ReadinessCheck[] {
    return [
      {
        description: 'Confirmation title is visible',
        type: 'assertion',
        assertion: () => expect(this.title).toBeVisible(),
      },
      {
        description: 'Resend button is visible',
        type: 'assertion',
        assertion: () => expect(this.resendButton).toBeVisible(),
      },
      {
        description: 'Back to sign in link is visible',
        type: 'assertion',
        assertion: () => expect(this.backToSignInLink).toBeVisible(),
      },
    ];
  }
}
