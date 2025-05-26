import { EmailClient } from '../email/emailClient';
import { extractConfirmationLink } from '../email/emailExtractor';
import { AccountApiClient } from '../api/accountApiClient';

export async function verifyUserEmail({
  emailClient,
  accountApi,
  inboxId,
  timeout = 30000,
}: {
  emailClient: EmailClient;
  accountApi: AccountApiClient;
  inboxId: string;
  timeout?: number;
}): Promise<void> {
  const email = await emailClient.waitForLatestEmail(inboxId, timeout);
  if (!email?.body) throw new Error('Confirmation email not received');

  const link = extractConfirmationLink(email.body);
  if (!link) throw new Error('No confirmation link found in email');

  const token = link.split('/').pop();
  if (!token) throw new Error('No token found in confirmation link');

  await accountApi.confirmAccount(token);
}
