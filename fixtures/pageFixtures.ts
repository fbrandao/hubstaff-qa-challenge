import { test as base, Page } from '@playwright/test';
import { LandingPage } from '../pages/landing.page';

type PageFixtures = {
  landingPage: LandingPage;
};

export const test = base.extend<PageFixtures>({
  landingPage: async ({ page }: { page: Page }, use: (page: LandingPage) => Promise<void>) => {
    const pageObj = new LandingPage(page);
    await use(pageObj);
  },
});
