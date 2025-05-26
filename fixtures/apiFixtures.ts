import { test as base } from '@playwright/test';
import { getApiClient } from '../utils/api';

export const test = base.extend<{
  marketingApi: ReturnType<typeof getApiClient.marketing>;
  accountApi: ReturnType<typeof getApiClient.account>;
}>({
  marketingApi: async ({}, use) => {
    const client = getApiClient.marketing();
    await use(client);
  },
  accountApi: async ({}, use) => {
    const client = getApiClient.account();
    await use(client);
  },
});
