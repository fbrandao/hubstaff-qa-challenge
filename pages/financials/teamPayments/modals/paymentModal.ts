import { expect, Page } from '@playwright/test';
import { BaseComponent } from '../../../base/baseComponent';

export class PaymentModal extends BaseComponent {
  constructor(page: Page) {
    super(page);
  }

  // Modal elements
  readonly modal = this.page
    .locator('.modal-dialog', { hasText: 'Payment' })
    .filter({ hasText: 'Create payment' });
  readonly modalTitle = this.page.locator('.modal-title', { hasText: 'Payment' });

  // Action buttons
  readonly cancelButton = this.page.locator('#export_payment').getByText('Not now');
  readonly createPaymentButton = this.page.locator('input[name="commit"]');

  /**
   * Returns the readiness checks for the payment modal.
   * @returns {ReadinessCheck[]} The readiness checks for the payment modal.
   */
  getReadinessChecks() {
    return [
      {
        type: 'assertion' as const,
        description: 'Payment modal is visible',
        assertion: async () => {
          await expect(this.modal).toBeVisible();
          await expect(this.modalTitle).toBeVisible();
          await expect(this.createPaymentButton).toBeVisible();
        },
      },
    ];
  }

  async close() {
    await this.cancelButton.click();
    await expect(this.modal).not.toBeVisible();
  }
}
