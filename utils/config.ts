import { getEnvVar } from './env';

export const config = {
  app: {
    name: 'Hubstaff QA Challenge',
    baseUrl: getEnvVar('BASE_URL'),
  },
  api: {
    marketing: {
      base: getEnvVar('MARKETING_API_BASE'),
      sessionEndpoint: '/api/session',
    },
    account: {
      base: getEnvVar('ACCOUNT_API_BASE'),
      loginEndpoint: '/login',
    },
  },
  mailSlurp: {
    apiKey: getEnvVar('MAILSLURP_API_KEY'),
  },
};

export const buildUrl = (base: string | undefined, path: string): string => {
  if (base === undefined) {
    throw new TypeError('Base URL argument cannot be undefined. Check your config.');
  }
  if (typeof base !== 'string' || typeof path !== 'string') {
    throw new TypeError('Both base and path arguments must be strings.');
  }

  const normalizedBase = base.replace(/\/+$/, ''); // Remove trailing slashes
  const normalizedPath = path.replace(/^\/+/, ''); // Remove leading slashes

  return `${normalizedBase}/${normalizedPath}`;
};
export const BASE_URL = config.app.baseUrl!;

export const MARKETING_API_URL = buildUrl(
  config.api.marketing.base,
  config.api.marketing.sessionEndpoint,
);
export const ACCOUNT_API_URL = buildUrl(config.api.account.base, config.api.account.loginEndpoint);
