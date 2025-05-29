import { test, expect } from '../../fixtures';
import { storageStatePaths } from '../../utils/auth/config';

test.use({ storageState: storageStatePaths.owner });

const paymentTestData = {
  member: 'Willa Sauer',
  amount: '10.00',
  note: 'Test bonus payment',
  rateType: /Bonus|One time/,
  hours: /0:00(:00)?/,
  status: /Pending/,
  summaryAmount: '$10.00',
};

test.describe('Team Payments - One-time Amount', () => {
  test.beforeEach(async ({ createPaymentsPage }) => {
    await createPaymentsPage.goto();
    await expect(createPaymentsPage).toBeReady();
  });

  test('should create a one-time bonus payment', async ({
    createPaymentsPage,
    paymentSummaryPage,
  }) => {
    await test.step('Switch to One-time Amount tab', async () => {
      await createPaymentsPage.switchTab('oneTimeAmount');
      expect(createPaymentsPage.currentUrl).toContain('team_payments/bonus');
    });

    await test.step('Select a member', async () => {
      await createPaymentsPage.selectMemberByName();
    });

    await test.step('Enter amount', async () => {
      await createPaymentsPage.amountInput.pressSequentially(paymentTestData.amount);
      expect(await createPaymentsPage.amountInput.inputValue()).toBe(paymentTestData.amount);
    });

    await test.step('Enter a note', async () => {
      await createPaymentsPage.noteInput.fill(paymentTestData.note);
      expect(await createPaymentsPage.noteInput.inputValue()).toBe(paymentTestData.note);
    });

    await test.step('Open and submit Create Payment modal', async () => {
      await createPaymentsPage.openCreatePaymentModal();
      await expect(createPaymentsPage.paymentModal).toBeReady();
      await createPaymentsPage.paymentModal.createPaymentButton.click();
      await expect(
        createPaymentsPage.toastMessage.filter({ hasText: 'Marked as paid' }),
      ).toBeVisible();
      await createPaymentsPage.paymentModal.close();
    });

    await test.step('Validate payment summary row', async () => {
      await expect(paymentSummaryPage).toBeReady();
      await paymentSummaryPage.expectSummaryRow({
        member: paymentTestData.member,
        rateType: paymentTestData.rateType,
        hours: paymentTestData.hours,
        status: paymentTestData.status,
        amount: paymentTestData.summaryAmount,
      });
    });
  });
});
