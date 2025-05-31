import { Page, Locator, expect } from '@playwright/test';
import { BaseComponent } from '../../base/baseComponent';
import { ReadinessCheck } from '../../base/types';

export class HeroForm extends BaseComponent {
  private emailInput: Locator;
  private createAccountBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByTestId('home_enter_email');
    this.createAccountBtn = page.getByTestId('create_account');
  }

  /**
   * Returns the readiness checks for the hero form.
   * @returns {ReadinessCheck[]} The readiness checks for the hero form.
   */
  getReadinessChecks(): ReadinessCheck[] {
    return [
      {
        description: 'Email input is visible',
        type: 'assertion',
        assertion: () => expect(this.page.getByTestId('home_enter_email')).toBeVisible(),
      },
      {
        description: 'Create Account button is visible',
        type: 'assertion',
        assertion: () => expect(this.page.getByTestId('create_account')).toBeVisible(),
      },
    ];
  }

  /**
   * Fills the email input with the given email.
   * @param {string} email - The email to fill in the input.
   */
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  /**
   * Submits the hero form.
   */
  async submit() {
    await this.createAccountBtn.click();
  }
}
