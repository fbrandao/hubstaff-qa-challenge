import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../base/basePage';

export class PaymentSummaryPage extends BasePage {
  protected readonly url = '/organizations/:orgId/team_payments/:paymentId';

  constructor(page: Page) {
    super(page, 'app');
  }

  // Main summary table
  readonly table = this.page.locator('.table.has-actions');
  readonly summaryRows = this.table.locator('tbody tr');

  protected getReadinessChecks() {
    return [
      {
        type: 'assertion' as const,
        description: 'Payment summary page is loaded and visible',
        assertion: async () => {
          await expect(this.table).toBeVisible();
        },
      },
      {
        type: 'assertion' as const,
        description: 'Payment summary table is visible',
        assertion: async () => {
          await expect(this.table).toBeVisible();
        },
      },
    ];
  }

  private async getCellText(cells: Locator, index: number): Promise<string> {
    return (await cells.nth(index).textContent())?.trim() || '';
  }

  private matches(actual: string, expected: string | RegExp): boolean {
    return typeof expected === 'string' ? actual.includes(expected) : expected.test(actual);
  }

  // Utility: Validate a summary row
  async expectSummaryRow({
    member,
    rateType,
    hours,
    status,
    amount,
  }: {
    member: string;
    rateType: string | RegExp;
    hours: string | RegExp;
    status: string | RegExp;
    amount: string | RegExp;
  }) {
    const memberCell = this.table.getByRole('cell', { name: member }).first();
    const row = memberCell.locator('..'); // move to <tr> — direct parent
    const cells = row.locator('td');

    const [memberText, rateTypeText, hoursText, statusText, amountText] = await Promise.all(
      [0, 1, 2, 3, 4].map(i => this.getCellText(cells, i)),
    );

    expect(memberText).toBe(member);
    expect(this.matches(rateTypeText, rateType)).toBeTruthy();
    expect(this.matches(hoursText, hours)).toBeTruthy();
    expect(this.matches(statusText, status)).toBeTruthy();
    expect(this.matches(amountText, amount)).toBeTruthy();
  }
}
