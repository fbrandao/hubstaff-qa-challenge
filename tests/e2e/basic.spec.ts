import { test, expect } from '@playwright/test';

test('should load the main website and display key elements', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Hubstaff/);
  await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
  await expect(page.getByTestId('create_account')).toBeVisible();
});
