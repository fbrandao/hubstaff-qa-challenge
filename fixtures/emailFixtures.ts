import { test as base } from '@playwright/test';
import { EmailClient } from '../utils/email/emailClient';

type EmailFixtures = {
  emailClient: EmailClient;
};

export const test = base.extend<EmailFixtures>({
  emailClient: async ({}, use) => {
    const client = new EmailClient();
    await use(client);
    await client.cleanupInboxes();
  },
});
