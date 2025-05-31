import { test as base, Page } from '@playwright/test';
import { LandingPage } from '../pages/landing/landingPage';
import { SignUpPage } from '../pages/signup/signUpPage';
import { WelcomePage } from '../pages/welcome/welcome';
import { ConfirmationPage } from '../pages/confirmation/confirmationPage';
import { SignInPage } from '../pages/signin/signInPage';
import { ProjectsPage } from '../pages/projects/projectsPage';
import { CreatePaymentsPage } from '../pages/financials/teamPayments/createPaymentsPage';
import { PaymentSummaryPage } from '../pages/financials/teamPayments/paymentSummaryPage';
import { setCookieConsent } from '../utils/cookies/cookieConsent';

type PageFixtures = {
  landingPage: LandingPage;
  signInPage: SignInPage;
  signUpPage: SignUpPage;
  welcomePage: WelcomePage;
  confirmationPage: ConfirmationPage;
  projectsPage: ProjectsPage;
  createPaymentsPage: CreatePaymentsPage;
  paymentSummaryPage: PaymentSummaryPage;
};

export const test = base.extend<PageFixtures>({
  landingPage: async ({ page }: { page: Page }, use: (page: LandingPage) => Promise<void>) => {
    const pageObj = new LandingPage(page);
    await setCookieConsent(pageObj.context);
    await use(pageObj);
  },

  signInPage: async ({ page }: { page: Page }, use: (page: SignInPage) => Promise<void>) => {
    const pageObj = new SignInPage(page);
    await setCookieConsent(pageObj.context);
    await use(pageObj);
  },

  signUpPage: async ({ page }: { page: Page }, use: (page: SignUpPage) => Promise<void>) => {
    const pageObj = new SignUpPage(page);
    await setCookieConsent(pageObj.context);
    await use(pageObj);
  },

  confirmationPage: async (
    { page }: { page: Page },
    use: (page: ConfirmationPage) => Promise<void>,
  ) => {
    const pageObj = new ConfirmationPage(page);
    await use(pageObj);
  },

  welcomePage: async ({ page }: { page: Page }, use: (page: WelcomePage) => Promise<void>) => {
    const pageObj = new WelcomePage(page);
    await use(pageObj);
  },

  projectsPage: async ({ page }: { page: Page }, use: (page: ProjectsPage) => Promise<void>) => {
    const pageObj = new ProjectsPage(page);
    await use(pageObj);
  },

  createPaymentsPage: async (
    { page }: { page: Page },
    use: (page: CreatePaymentsPage) => Promise<void>,
  ) => {
    const pageObj = new CreatePaymentsPage(page);
    await use(pageObj);
  },

  paymentSummaryPage: async (
    { page }: { page: Page },
    use: (page: PaymentSummaryPage) => Promise<void>,
  ) => {
    const pageObj = new PaymentSummaryPage(page);
    await use(pageObj);
  },
});
