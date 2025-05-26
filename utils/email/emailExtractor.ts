import { config } from '../config';

/**
 * Extracts the confirmation link from a raw email HTML, using the configured account base URL.
 * @param emailHtml Raw HTML content of the email.
 * @returns Confirmation link if found, or null.
 */
export function extractConfirmationLink(emailHtml: string): string | null {
  if (!config.api.account.baseUrl) {
    throw new Error('Account API base URL is not configured');
  }
  const expectedHostname = new URL(config.api.account.baseUrl).hostname;
  const regex = new RegExp(`https://${expectedHostname}/confirm_account/[\\w-]+`);
  const match = emailHtml.match(regex);
  return match?.[0] ?? null;
}
