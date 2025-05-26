import { MarketingApiClient } from './marketingApiClient';
import { AccountApiClient } from './accountApiClient';

export const getApiClient = {
  marketing: () => new MarketingApiClient(),
  account: () => new AccountApiClient(),
};
