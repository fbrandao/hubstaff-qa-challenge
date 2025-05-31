import { getEnvVar } from './env';

interface Config {
  app: {
    name: string;
    baseUrl: string;
    appBaseUrl: string;
    marketingBaseUrl: string;
  };
  api: {
    marketing: {
      baseUrl: string;
      sessionEndpoint: string;
    };
    account: {
      baseUrl: string;
      loginEndpoint: string;
    };
  };
  mailSlurp: {
    apiKey: string;
  };
}
/**
 * Configuration object for the application.
 * @type {Config}
 */
export const config: Config = {
  app: {
    name: 'Hubstaff QA Challenge',
    baseUrl: getEnvVar('BASE_URL'),
    appBaseUrl: getEnvVar('APP_BASE_URL'),
    marketingBaseUrl: getEnvVar('MARKETING_BASE_URL'),
  },
  api: {
    marketing: {
      baseUrl: getEnvVar('MARKETING_API_BASE'),
      sessionEndpoint: '/api/session',
    },
    account: {
      baseUrl: getEnvVar('ACCOUNT_API_BASE'),
      loginEndpoint: '/login',
    },
  },
  mailSlurp: {
    apiKey: getEnvVar('MAILSLURP_API_KEY'),
  },
};

/**
 * Type representing the type of base URL to use.
 * @type {('marketing' | 'app')}
 */
export type BaseUrlType = 'marketing' | 'app';

/**
 * Returns the base URL for the given type.
 * @param {BaseUrlType} type - The type of base URL to get.
 * @returns {string} The base URL for the given type.
 */
export function getBaseUrl(type: BaseUrlType = 'marketing'): string {
  if (type === 'app') return config.app.appBaseUrl!;
  return config.app.marketingBaseUrl!;
}

/**
 * Builds a URL by combining a base URL and a path.
 * @param {string} base - The base URL.
 * @param {string} path - The path to add to the base URL.
 * @returns {string} The combined URL.
 */
export function buildUrl(base: string, path: string): string {
  if (!base) throw new TypeError('Base URL argument cannot be undefined. Check your config.');
  if (typeof base !== 'string' || typeof path !== 'string') {
    throw new TypeError('Both base and path arguments must be strings.');
  }
  const normalizedBase = base.replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');
  return `${normalizedBase}/${normalizedPath}`;
}
export const BASE_URL = config.app.baseUrl!;

export const MARKETING_API_URL = buildUrl(
  config.api.marketing.baseUrl!,
  config.api.marketing.sessionEndpoint,
);
export const ACCOUNT_API_URL = buildUrl(
  config.api.account.baseUrl!,
  config.api.account.loginEndpoint,
);
