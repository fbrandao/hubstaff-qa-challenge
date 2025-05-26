import { test, expect } from '../../fixtures';
import { faker } from '@faker-js/faker';
import { setCookieConsent } from '../../utils/cookies/cookieConsent';
import { extractConfirmationLink } from '../../utils/email/emailExtractor';

test.describe('Authentication', () => {
  test.beforeEach(async ({ landingPage, signUpPage }) => {
    await setCookieConsent(landingPage.context);
    await setCookieConsent(signUpPage.context);
  });

  test('User can sign up for a 14-day trial and confirm email', async ({
    landingPage,
    signUpPage,
    confirmationPage,
    welcomePage,
    emailClient,
    page,
  }) => {
    const testData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: faker.internet.password({ length: 10 }),
    };

    const inbox = await test.step('Create test email inbox', async () => {
      const inbox = await emailClient.createInbox({ prefix: 'signup-test' });
      return inbox;
    });

    await test.step('Navigate to signup page', async () => {
      await landingPage.open();
      await landingPage.header.clickFreeTrial();
      await signUpPage.waitUntilReady();
    });

    await test.step('Fill signup form and submit', async () => {
      await signUpPage.signUpForm.fillForm({
        firstName: testData.firstName,
        lastName: testData.lastName,
        email: inbox.emailAddress,
        password: testData.password,
      });
      await signUpPage.signUpForm.submit();
      await expect(confirmationPage.title).toBeVisible();
      await expect(confirmationPage.subtitle).toContainText(inbox.emailAddress);
    });

    const emailContent = await test.step('Wait for confirmation email', async () => {
      const email = await emailClient.waitForLatestEmail(inbox.id, 10000);
      expect(email).toBeTruthy();
      expect(email.body).toContain('Confirm account');
      expect(email.body).toContain(testData.firstName);
      return email;
    });

    const confirmationLink = await test.step('Extract confirmation link from email', async () => {
      const link = extractConfirmationLink(emailContent.body!);
      expect(link).toBeTruthy();
      return link!;
    });

    await test.step('Follow confirmation link and verify activation', async () => {
      await page.goto(confirmationLink);
      await expect(welcomePage.title).toBeVisible();
      await expect(welcomePage.createOrganizationButton).toBeVisible();
      await expect(welcomePage.tryDifferentEmailButton).toBeVisible();
      await expect(welcomePage.requestAccessButton).toBeVisible();
    });
  });
});
