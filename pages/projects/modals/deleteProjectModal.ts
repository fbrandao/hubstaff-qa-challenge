import { Page, expect } from '@playwright/test';
import { BaseComponent } from '../../base/baseComponent';
import { ReadinessCheck } from '../../base/types';

export class DeleteProjectModal extends BaseComponent {
  constructor(page: Page) {
    super(page);
  }

  readonly modal = this.page.locator('#delete-project-modal');
  readonly understandCheckbox = this.modal.getByText('I understand and wish to');
  readonly deleteButton = this.page.locator('#delete-button');

  getReadinessChecks(): ReadinessCheck[] {
    return [
      {
        description: 'Project modal is visible',
        type: 'assertion',
        assertion: async () => await expect(this.modal).toBeVisible(),
      },
      {
        description: 'Delete button is visible',
        type: 'assertion',
        assertion: async () => await expect(this.deleteButton).toBeVisible(),
      },
    ];
  }

  async confirmDelete() {
    await expect(this.modal).toBeVisible();
    await this.understandCheckbox.click();
    await this.deleteButton.click();
  }
}
