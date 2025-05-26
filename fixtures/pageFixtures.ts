import { test as base, Page } from '@playwright/test';
import { LandingPage } from '../pages/landing/landingPage';
import { SignUpPage } from '../pages/signup/signUpPage';
import { WelcomePage } from '../pages/welcome/welcome';
import { ConfirmationPage } from '../pages/confirmation/confirmationPage';

type PageFixtures = {
  landingPage: LandingPage;
  signUpPage: SignUpPage;
  welcomePage: WelcomePage;
  confirmationPage: ConfirmationPage;
};

export const test = base.extend<PageFixtures>({
  landingPage: async ({ page }: { page: Page }, use: (page: LandingPage) => Promise<void>) => {
    const pageObj = new LandingPage(page);
    await use(pageObj);
  },

  signUpPage: async ({ page }: { page: Page }, use: (page: SignUpPage) => Promise<void>) => {
    const pageObj = new SignUpPage(page);
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
});
