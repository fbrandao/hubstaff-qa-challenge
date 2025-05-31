import { Locator, Page, expect } from '@playwright/test';
import { BaseComponent } from '../../base/baseComponent';
import { ReadinessCheck } from '../../base/types';

export class NewProjectModal extends BaseComponent {
  readonly modal: Locator = this.page.locator('.modal-content').filter({ hasText: 'New project' });
  readonly title: Locator = this.modal.locator('h4.modal-title:has-text("New project")');
  readonly projectNamesTextarea: Locator = this.modal.getByRole('textbox', {
    name: 'Add project names separated',
  });
  readonly saveButton: Locator = this.modal.locator('button.btn-primary:has-text("Save")');
  readonly cancelButton: Locator = this.modal.locator('button.btn-default:has-text("Cancel")');
  readonly tabGeneral: Locator = this.modal.locator('#tab-general');
  readonly tabMembers: Locator = this.modal.locator('#tab-members');
  readonly tabBudget: Locator = this.modal.locator('#tab-budget');
  readonly tabTeams: Locator = this.modal.locator('#tab-teams');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Returns the readiness checks for the new project modal.
   * @returns {ReadinessCheck[]} The readiness checks for the new project modal.
   */
  getReadinessChecks(): ReadinessCheck[] {
    return [
      {
        description: 'Project modal is visible',
        type: 'assertion',
        assertion: async () => await expect(this.modal).toBeVisible(),
      },
      {
        description: 'Project modal title is visible',
        type: 'assertion',
        assertion: async () => await expect(this.title).toBeVisible(),
      },
    ];
  }

  /**
   * Fill the new project modal form.
   * @param data - Object with form fields. Currently supports 'names'.
   */
  async fillForm(projectName: string) {
    await this.projectNamesTextarea.pressSequentially(projectName);
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async expectVisible() {
    await expect(this.modal).toBeVisible();
  }
}
