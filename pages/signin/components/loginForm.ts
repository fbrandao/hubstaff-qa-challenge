import { Locator, Page, expect } from '@playwright/test';
import { BaseComponent } from '../../base/baseComponent';
import { ReadinessCheck } from '../../base/types';

export class LoginForm extends BaseComponent {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly getStartedLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = this.page.getByRole('textbox', { name: 'Work email *' });
    this.passwordInput = this.page.getByRole('textbox', { name: 'Password *' });
    this.signInButton = this.page.getByRole('button', { name: 'Sign in' });
    this.forgotPasswordLink = this.page.getByRole('link', { name: 'Forgot your password?' });
    this.getStartedLink = this.page.getByRole('link', { name: 'Get started' });
  }

  getReadinessChecks(): ReadinessCheck[] {
    return [
      {
        description: 'Email input is visible',
        type: 'assertion',
        assertion: () => expect(this.emailInput).toBeVisible(),
      },
      {
        description: 'Password input is visible',
        type: 'assertion',
        assertion: () => expect(this.passwordInput).toBeVisible(),
      },
      {
        description: 'Sign in button is visible',
        type: 'assertion',
        assertion: () => expect(this.signInButton).toBeVisible(),
      },
    ];
  }

  async fill(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.signInButton.click();
  }
}
