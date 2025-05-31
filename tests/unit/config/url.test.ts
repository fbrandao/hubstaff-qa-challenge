import { test, expect } from '@playwright/test';
import { buildUrl, getBaseUrl } from '../../../utils/config';
import * as configModule from '../../../utils/config';

test.describe('URL Utilities', () => {
  test.describe('buildUrl', () => {
    test('combines base and path correctly', () => {
      expect(buildUrl('https://example.com', 'api/v1')).toBe('https://example.com/api/v1');
      expect(buildUrl('https://example.com/', '/api/v1')).toBe('https://example.com/api/v1');
      expect(buildUrl('https://example.com', '')).toBe('https://example.com/');
    });

    test('throws on invalid inputs', () => {
      expect(() => buildUrl('', 'path')).toThrow('Base URL argument cannot be undefined');
      expect(() => buildUrl(undefined as any, 'path')).toThrow(
        'Base URL argument cannot be undefined',
      );
    });
  });

  test.describe('getBaseUrl', () => {
    const originalConfig = { ...configModule.config };

    test.beforeEach(() => {
      // Mock the config object
      configModule.config.app.appBaseUrl = 'https://app.test';
      configModule.config.app.marketingBaseUrl = 'https://marketing.test';
    });

    test.afterEach(() => {
      // Restore original config
      configModule.config.app.appBaseUrl = originalConfig.app.appBaseUrl;
      configModule.config.app.marketingBaseUrl = originalConfig.app.marketingBaseUrl;
    });

    test('returns correct URL type', () => {
      expect(getBaseUrl('app')).toBe('https://app.test');
      expect(getBaseUrl('marketing')).toBe('https://marketing.test');
      expect(getBaseUrl()).toBe('https://marketing.test'); // default value
    });
  });
});
