import { test, expect } from '@playwright/test';
import { extractConfirmationLink } from '../../../utils/email/emailExtractor';
import * as configModule from '../../../utils/config';

test.describe('Email Extractor', () => {
  const originalConfig = { ...configModule.config };

  test.beforeEach(() => {
    configModule.config.api.account.baseUrl = 'https://account.test.com';
  });

  test.afterEach(() => {
    configModule.config.api.account.baseUrl = originalConfig.api.account.baseUrl;
  });

  test('extracts confirmation link from email HTML', () => {
    const emailHtml = `
      <html>
        <body>
          <a href="https://account.test.com/confirm_account/abc123">Confirm your account</a>
        </body>
      </html>
    `;
    expect(extractConfirmationLink(emailHtml)).toBe(
      'https://account.test.com/confirm_account/abc123',
    );
  });

  test('returns null when no confirmation link is found', () => {
    const emailHtml = '<html><body>No confirmation link here</body></html>';
    expect(extractConfirmationLink(emailHtml)).toBeNull();
  });

  test('throws error when account API base URL is not configured', () => {
    configModule.config.api.account.baseUrl = '';
    expect(() => extractConfirmationLink('any html')).toThrow(
      'Account API base URL is not configured',
    );
  });
});
