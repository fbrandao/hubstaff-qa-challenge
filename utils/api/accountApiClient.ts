import { BaseApiClient } from './baseApiClient';
import { config } from '../config';
import { EmailClient } from '../email/emailClient';
import { extractConfirmationLink } from '../email/emailExtractor';
import { AxiosResponse } from 'axios';

export class AccountApiClient extends BaseApiClient {
  protected sessionEndpoint = config.api.marketing.sessionEndpoint;

  constructor() {
    if (!config.api.account.baseUrl) {
      throw new Error('ACCOUNT_API_BASE is not configured in the environment.');
    }
    super(config.api.account.baseUrl);
  }

  async confirmAccount(token: string): Promise<AxiosResponse> {
    return this.request(`/confirm_account/${token}`, {
      method: 'GET',
    });
  }

  async confirmAccountFromEmail({
    emailClient,
    inboxId,
    timeout = 30000,
  }: {
    emailClient: EmailClient;
    inboxId: string;
    timeout?: number;
  }): Promise<AxiosResponse> {
    const email = await emailClient.waitForLatestEmail(inboxId, timeout);
    if (!email?.body) throw new Error('❌ No confirmation email received');
    const confirmationLink = extractConfirmationLink(email.body);
    if (!confirmationLink) throw new Error('❌ No confirmation link found in email');
    const token = confirmationLink.split('/').pop();
    if (!token) throw new Error('❌ Token extraction failed from confirmation link');
    return await this.confirmAccount(token);
  }
}
