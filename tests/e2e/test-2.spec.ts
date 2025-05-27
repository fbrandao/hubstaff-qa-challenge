import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://account.hubstaff.com/login');
  await page.getByRole('textbox', { name: 'Work email *' }).click();
  await page.getByRole('textbox', { name: 'Work email *' }).fill('e2e-cH5U9ttkOwLl@mailslurp.biz');
  await page.getByRole('textbox', { name: 'Password *' }).click();
  await page.getByRole('textbox', { name: 'Password *' }).fill('sZuV8CUHHEeE');
  await page.getByRole('button', { name: 'Sign in' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Open' }).click();
  const page1 = await page1Promise;
  await page1.getByRole('menuitem', { name: 'library_add_check Project' }).click();
  await page1.getByText('Add projectAdd new project to').click();
  await page1.getByRole('textbox', { name: 'Add project names separated' }).click();
  await page1.getByRole('textbox', { name: 'Add project names separated' }).press('CapsLock');
  await page1.getByRole('textbox', { name: 'Add project names separated' }).fill('S');
  await page1.getByRole('textbox', { name: 'Add project names separated' }).press('CapsLock');
  await page1.getByRole('textbox', { name: 'Add project names separated' }).fill('Some proejct masidasydaisduasiudaisd');
  await page1.getByRole('button', { name: 'Save' }).click();
  await page1.getByRole('cell', { name: 'S Some proejct' }).click();
  await page1.goto('https://app.hubstaff.com/organizations/671402/projects?status=active');
  await page1.locator('div').filter({ hasText: /^SSome proejct masidasydaisduasiudaisd$/ }).click();
  await page1.getByRole('link', { name: 'S Some proejct' }).click();
  await page1.goto('https://app.hubstaff.com/organizations/671402/projects?status=active');
  await page1.getByRole('cell', { name: 'S Some proejct' }).click();
});