import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/basePage';
import { ReadinessCheck } from '../base/types';
import { LoginForm } from './components/loginForm';

export class SignInPage extends BasePage {
  readonly logo: Locator;
  readonly loginForm: LoginForm;
  protected baseUrl = '/login';

  constructor(page: Page) {
    super(page);
    this.loginForm = new LoginForm(this.page);
    this.logo = this.page.getByRole('link', { name: 'Hubstaff online time tracking' });
  }

  /**
   * Returns the readiness checks for the signin page.
   * @returns {ReadinessCheck[]} The readiness checks for the signin page.
   */
  getReadinessChecks(): ReadinessCheck[] {
    return [
      {
        description: 'Login Form is ready',
        type: 'assertion',
        assertion: () => this.loginForm.waitUntilReady(),
      },
    ];
  }

  /**
   * Logs in with the given email and password.
   * @param {string} email - The email to log in with.
   * @param {string} password - The password to log in with.
   */
  async login(email: string, password: string): Promise<void> {
    await this.loginForm.fill(email, password);
    await this.loginForm.submit();
  }
}
