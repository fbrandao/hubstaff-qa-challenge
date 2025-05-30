import { Page, Locator, expect } from '@playwright/test';
import { BaseComponent } from '../../base/baseComponent';
import { ReadinessCheck } from '../../base/types';

export class Header extends BaseComponent {
  readonly trialButton: Locator;
  readonly productsButton: Locator;
  readonly solutionsButton: Locator;
  readonly resourcesButton: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    super(page);
    this.trialButton = page.getByRole('link', { name: 'Free 14-day trial' });
    this.productsButton = page.getByRole('button', { name: 'Toggle product dropdown' });
    this.solutionsButton = page.getByRole('button', { name: 'Toggle solutions dropdown' });
    this.resourcesButton = page.getByRole('link', { name: 'Toggle resources dropdown' });
    this.signInButton = page.getByTestId('sign_in_button');
  }

  async clickFreeTrial() {
    await this.trialButton.click();
  }

  getReadinessChecks(): ReadinessCheck[] {
    return [
      {
        description: 'Hero form email input is visible',
        type: 'assertion',
        assertion: () => expect(this.page.getByTestId('home_enter_email')).toBeVisible(),
      },
    ];
  }
}
