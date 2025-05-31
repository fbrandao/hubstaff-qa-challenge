import { Locator, Page, expect } from '@playwright/test';
import { BaseComponent } from '../../base/baseComponent';
import { ReadinessCheck } from '../../base/types';

export class SignUpForm extends BaseComponent {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly termsCheckbox: Locator;
  readonly createAccountButton: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = this.page.getByTestId('first_name');
    this.lastNameInput = this.page.getByTestId('last_name');
    this.emailInput = this.page.getByTestId('email');
    this.passwordInput = this.page.getByTestId('password');
    this.termsCheckbox = this.page.getByTestId('accept_terms');
    this.createAccountButton = this.page.getByTestId('create_my_account');
    this.heading = this.page.locator('.hsds-row__heading', { hasText: 'Boost Productivity' });
  }

  getReadinessChecks(): ReadinessCheck[] {
    return [
      {
        description: 'Signup heading is visible',
        type: 'assertion',
        assertion: () => expect(this.heading).toBeVisible(),
      },
      {
        description: 'First name input is visible',
        type: 'assertion',
        assertion: () => expect(this.firstNameInput).toBeVisible(),
      },
      {
        description: 'Email input is visible',
        type: 'assertion',
        assertion: () => expect(this.emailInput).toBeVisible(),
      },
      {
        description: 'Create account button is visible',
        type: 'assertion',
        assertion: () => expect(this.createAccountButton).toBeVisible(),
      },
    ];
  }

  /**
   * Accepts the terms and conditions.
   */
  async acceptTerms() {
    // We are using force here because because a visual overlay (.hsds-form__checkbox-icon)
    // intercepts pointer events, and Playwright's .check() internally performs a mouse click unless force is used.
    await this.termsCheckbox.check({ force: true });
    await expect(this.termsCheckbox).toBeChecked();
  }

  /**
   * Fills the signup form with the given data.
   * @param {Object} data - The data to fill the form with.
   * @param {string} data.firstName - The first name to fill in the form.
   * @param {string} data.lastName - The last name to fill in the form.
   * @param {string} data.email - The email to fill in the form.
   * @param {string} data.password - The password to fill in the form.
   * @param {boolean} data.acceptTerms - Whether to accept the terms and conditions.
   */
  async fillForm({
    firstName,
    lastName,
    email,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    acceptTerms?: boolean;
  }): Promise<void> {
    await this.firstNameInput.pressSequentially(firstName, { delay: 100 });
    await this.lastNameInput.pressSequentially(lastName);
    await this.emailInput.pressSequentially(email);
    await this.passwordInput.pressSequentially(password);
    await this.acceptTerms();
  }

  async submit(): Promise<void> {
    await this.createAccountButton.click();
  }
}
