import { Page } from '@playwright/test';
import { BasePage } from '../base/basePage';
import { SignUpForm } from './components/signUpForm';

export class SignUpPage extends BasePage {
  readonly signUpForm: SignUpForm;
  protected baseUrl = '/signup';

  constructor(page: Page) {
    super(page);
    this.signUpForm = new SignUpForm(page);
  }

  /**
   * Returns the readiness checks for the signup form.
   * @returns {ReadinessCheck[]} The readiness checks for the signup form.
   */
  getReadinessChecks() {
    return this.signUpForm.getReadinessChecks();
  }

  /**
   * Opens the signup page.
   */
  async open() {
    await this.goto();
    await this.waitUntilReady();
  }

  /**
   * Completes the signup process.
   * @param {Object} data - The data to complete the signup process with.
   * @param {string} data.firstName - The first name to complete the signup process with.
   * @param {string} data.lastName - The last name to complete the signup process with.
   * @param {string} data.email - The email to complete the signup process with.
   * @param {string} data.password - The password to complete the signup process with.
   */
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
