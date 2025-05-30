import { test, expect } from '../../fixtures';
import { setCookieConsent } from '../../utils/cookies/cookieConsent';
import { extractConfirmationLink } from '../../utils/email/emailExtractor';

let inboxId: string;

test.describe('Authentication Scenarios', () => {
  test.beforeEach(async ({ landingPage, signUpPage, emailClient, testUser }) => {
    await setCookieConsent(landingPage.context);
    await setCookieConsent(signUpPage.context);

    const inbox = await emailClient.createInbox({ prefix: 'e2e-automation' });
    testUser.email = inbox.emailAddress;
    inboxId = inbox.id;
    //await landingPage.open();
  });

  test('User can sign up for a 14-day trial and confirm email', async ({
    landingPage,
    signUpPage,
    confirmationPage,
    welcomePage,
    emailClient,
    page,
    testUser,
  }) => {
    await test.step('Navigate to signup page', async () => {
      await landingPage.header.clickFreeTrial();
      await expect(signUpPage).toBeReady();
    });

    await test.step('Fill signup form and submit', async () => {
      await signUpPage.signUpForm.fillForm(testUser);
      await signUpPage.signUpForm.submit();

      await expect(confirmationPage).toBeReady();
      await expect(confirmationPage.subtitle).toContainText(testUser.email);
    });

    const emailContent = await test.step('Wait for confirmation email', async () => {
      const email = await emailClient.waitForLatestEmail(inboxId, 10000);
      expect(email).toBeTruthy();
      expect(email.body).toContain('Confirm account');
      expect(email.body).toContain(testUser.firstName);
      return email;
    });

    const confirmationLink = await test.step('Extract confirmation link from email', async () => {
      const link = extractConfirmationLink(emailContent.body!);
      expect(link).toBeTruthy();
      return link!;
    });

    await test.step('Follow confirmation link and verify activation', async () => {
      await page.goto(confirmationLink, { waitUntil: 'domcontentloaded' });
      await expect(welcomePage.title).toBeVisible();
      await expect(welcomePage.createOrganizationButton).toBeVisible();
      await expect(welcomePage.tryDifferentEmailButton).toBeVisible();
      await expect(welcomePage.requestAccessButton).toBeVisible();
    });
  });

  test('User can sign in with a verified account', async ({
    emailClient,
    marketingApi,
    accountApi,
    testUser,
    landingPage,
    signInPage,
    welcomePage,
  }) => {
    await test.step('Sign up user via API', async () => {
      const response = await marketingApi.signUp(testUser);
      expect(response.status).toBeGreaterThanOrEqual(200);
    });

    await test.step('Confirm user email via API', async () => {
      await accountApi.confirmAccountFromEmail({
        emailClient,
        inboxId,
        timeout: 10000,
      });
    });

    await test.step('Navigate to Login Page', async () => {
      await landingPage.clickSignInBtn();
      await expect(signInPage).toBeReady();
    });

    await test.step('Fill and submit login form', async () => {
      await signInPage.login(testUser.email, testUser.password);
    });

    await test.step('Verify welcome screen', async () => {
      await expect(welcomePage).toBeReady();
    });
  });
});
