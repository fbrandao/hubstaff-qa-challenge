import { test as base } from '@playwright/test';
import { logger } from '../utils/logger';

type UtilsFixtures = {
  logger: typeof logger;
};

export const test = base.extend<UtilsFixtures>({
  logger: async ({}, use) => {
    await use(logger);
  },
});
