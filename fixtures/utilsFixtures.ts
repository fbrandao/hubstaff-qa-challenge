import { test as base } from '@playwright/test';
import { logger } from '../utils/logger';
import { faker } from '@faker-js/faker';
import { EmailClient } from '../utils/email/emailClient';
import { MarketingApiClient } from '../utils/api/marketingApiClient';
import { AccountApiClient } from '../utils/api/accountApiClient';

export type UtilsFixtures = {
  logger: typeof logger;
  testUser: { firstName: string; lastName: string; email: string; password: string };
  emailClient: EmailClient;
  marketingApi: MarketingApiClient;
  accountApi: AccountApiClient;
};

export const test = base.extend<UtilsFixtures>({
  logger: async ({}, use) => {
    await use(logger);
  },
  testUser: async ({}, use) => {
    const user = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: faker.internet.password({ length: 12 }),
      email: '',
    };
    await use(user);
  },
});
