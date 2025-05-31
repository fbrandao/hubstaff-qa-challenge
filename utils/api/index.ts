import { MarketingApiClient } from './marketingApiClient';
import { AccountApiClient } from './accountApiClient';

/**
 * Returns an API client for the given type.
 * @param {string} type - The type of API client to return.
 * @returns {MarketingApiClient | AccountApiClient} The API client for the given type.
 */
export const getApiClient = {
  marketing: () => new MarketingApiClient(),
  account: () => new AccountApiClient(),
};
