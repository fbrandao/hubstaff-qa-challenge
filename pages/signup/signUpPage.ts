import { Page } from '@playwright/test';
import { BasePage } from '../base/basePage';
import { SignUpForm } from './sections/signUpForm';

export class SignUpPage extends BasePage {
  readonly signUpForm: SignUpForm;
  protected url = '/signup';

  constructor(page: Page) {
    super(page);
    this.signUpForm = new SignUpForm(page);
  }

  getReadinessChecks() {
    return this.signUpForm.getReadinessChecks();
  }

  async open() {
    await this.goto();
    await this.waitUntilReady();
  }

  async completeSignup(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    await this.signUpForm.fillForm(data);
    await this.signUpForm.submit();
  }
}
