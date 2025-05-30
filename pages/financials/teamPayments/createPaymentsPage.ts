import { expect, Page } from '@playwright/test';
import { BasePage } from '../../base/basePage';
import { PaymentModal } from './modals/paymentModal';
import { ReadinessCheck } from '../../base/types';
export class CreatePaymentsPage extends BasePage {
  protected readonly baseUrl = '/team_payments';

  constructor(page: Page) {
    super(page, 'app');
  }

  // Page title and settings
  readonly pageTitle = this.page.locator('h2.page-heading');
  readonly settingsLink = this.page.locator('a.settings-link');

  // Modal
  readonly paymentModal = new PaymentModal(this.page);

  // Tabs
  readonly tabs = {
    payForHours: this.page.getByRole('link', { name: 'Pay for hours' }),
    approvedTimesheets: this.page.getByRole('link', { name: 'Approved timesheets' }),
    oneTimeAmount: this.page.getByRole('link', { name: 'One-time amount' }),
  };

  readonly noteInput = this.page.getByRole('textbox', { name: 'Enter a note about the payment' });
  readonly amountInput = this.page.getByRole('spinbutton', { name: 'Amount per member*' });

  readonly membersSelect = this.page.getByRole('textbox', { name: 'Select members' });
  readonly toastMessage = this.page.locator('.jGrowl-message');

  // Table elements
  readonly createPaymentsTable = this.page.locator('.create-payments-table');
  readonly selectAllCheckbox = this.page.locator('#select_all');
  readonly selectedCount = this.page.locator('#selected-count');
  readonly createPaymentButton = this.page.getByRole('link', { name: 'Create payment' });

  getReadinessChecks(): ReadinessCheck[] {
    return [
      {
        type: 'assertion' as const,
        description: 'Team payments page is loaded and visible',
        assertion: async () => {
          await expect(this.pageTitle).toBeVisible();
        },
      },
      {
        type: 'assertion' as const,
        description: 'Team payments table is visible',
        assertion: async () => {
          await expect(this.createPaymentsTable).toBeVisible();
        },
      },
      {
        type: 'assertion' as const,
        description: 'Team payments tabs are visible',
        assertion: async () => {
          await expect(this.tabs.payForHours).toBeVisible();
          await expect(this.tabs.approvedTimesheets).toBeVisible();
          await expect(this.tabs.oneTimeAmount).toBeVisible();
        },
      },
    ];
  }

  async openCreatePaymentModal() {
    await this.waitForActionAndApiResponses({
      page: this.page,
      requests: [
        {
          method: 'POST',
          url: /organizations\/\d+\/team_payments\/new\.dialog/,
        },
      ],
      action: () => this.createPaymentButton.click(),
    });
  }

  async switchTab(tab: 'payForHours' | 'approvedTimesheets' | 'oneTimeAmount') {
    await this.tabs[tab].click();
  }

  async selectMemberByName(memberName?: string) {
    await this.membersSelect.click();

    if (memberName) {
      await this.membersSelect.fill(memberName);
      await this.page.getByRole('treeitem', { name: memberName }).first().click();
    } else {
      await this.page.getByRole('treeitem').first().click();
    }

    // Click on the page title to close the dropdown
    await this.pageTitle.click();
  }

  /**
   * Validates that a row exists in the payments table with the given values.
   * All arguments are required and must match exactly (except hours, which can be a regex).
   */
  async expectPaymentRow({
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
    const memberCell = this.createPaymentsTable.getByRole('cell', { name: member }).first();
    const row = memberCell.locator('..'); // direct parent row <tr>
    const cells = row.locator('td');

    const [memberText, rateTypeText, hoursText, statusText, amountText] = await Promise.all(
      [0, 1, 2, 3, 4].map(i =>
        cells
          .nth(i)
          .textContent()
          .then(t => t?.trim() || ''),
      ),
    );

    expect(memberText).toBe(member);
    expect(this.matches(rateTypeText, rateType)).toBeTruthy();
    expect(this.matches(hoursText, hours)).toBeTruthy();
    expect(this.matches(statusText, status)).toBeTruthy();
    expect(this.matches(amountText, amount)).toBeTruthy();
  }

  private matches(value: string, expected: string | RegExp): boolean {
    return typeof expected === 'string' ? value.includes(expected) : expected.test(value);
  }
}
