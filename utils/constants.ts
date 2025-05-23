export const BASE_URL = 'https://hubstaff.com/';
export const APP_NAME = 'Hubstaff QA Challenge';
export const isCI = process.env.CI === 'true';

export const API_URLS = {
  marketing: {
    base: 'https://api.marketing.hubstaff.com',
    session: '/api/session',
  },
  account: {
    base: 'https://account.hubstaff.com',
    login: '/login',
  },
} as const;

export const buildUrl = (base: string, path: string) => `${base}${path}`;

export const MARKETING_API_URL = buildUrl(API_URLS.marketing.base, API_URLS.marketing.session);
export const ACCOUNT_API_URL = buildUrl(API_URLS.account.base, API_URLS.account.login);

import { healthChecks } from './health-checks';

healthChecks
  .add({ name: 'Main Website', url: BASE_URL })
  .add({ name: 'Marketing API', url: MARKETING_API_URL })
  .add({ name: 'Account API', url: ACCOUNT_API_URL });
