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

  protected getReadinessChecks(): ReadinessCheck[] {
    return [
      {
        description: 'Login Form is ready',
        type: 'assertion',
        assertion: () => this.loginForm.waitUntilReady(),
      },
    ];
  }

  async login(email: string, password: string): Promise<void> {
    await this.loginForm.fill(email, password);
    await this.loginForm.submit();
  }
}
