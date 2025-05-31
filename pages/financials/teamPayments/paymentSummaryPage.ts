import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../base/basePage';

export class PaymentSummaryPage extends BasePage {
  protected readonly baseUrl = '/organizations/:orgId/team_payments/:paymentId';

  constructor(page: Page) {
    super(page, 'app');
  }

  /**
   * The main summary table.
   */
  readonly table = this.page.locator('.table.has-actions');
  readonly summaryRows = this.table.locator('tbody tr');

  /**
   * Returns the readiness checks for the payment summary page.
   * @returns {ReadinessCheck[]} The readiness checks for the payment summary page.
   */
  getReadinessChecks() {
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

  /**
   * Returns the text of the cell at the given index.
   * @param {Locator} cells - The cells to get the text from.
   * @param {number} index - The index of the cell to get the text from.
   * @returns {Promise<string>} The text of the cell at the given index.
   */
  private async getCellText(cells: Locator, index: number): Promise<string> {
    return (await cells.nth(index).textContent())?.trim() || '';
  }

  /**
   * Checks if the actual string matches the expected string or regular expression.
   * @param {string} actual - The actual string to check.
   * @param {string | RegExp} expected - The expected string or regular expression.
   * @returns {boolean} True if the actual string matches the expected string or regular expression, false otherwise.
   */
  private matches(actual: string, expected: string | RegExp): boolean {
    return typeof expected === 'string' ? actual.includes(expected) : expected.test(actual);
  }

  /**
   * Validates a summary row.
   * @param {Object} data - The data to validate the summary row with.
   * @param {string} data.member - The member of the summary row.
   * @param {string | RegExp} data.rateType - The rate type of the summary row.
   * @param {string | RegExp} data.hours - The hours of the summary row.
   * @param {string | RegExp} data.status - The status of the summary row.
   * @param {string | RegExp} data.amount - The amount of the summary row.
   */
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
