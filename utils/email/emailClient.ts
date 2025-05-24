import { MailSlurp, CreateInboxDto, InboxDto, CreateInboxDtoInboxTypeEnum } from 'mailslurp-client';
import { config } from '../config';
import { logger } from '../logger';

export class EmailClient {
  private mailslurp: MailSlurp;
  private createdInboxes: InboxDto[] = [];

  constructor() {
    if (!config.mailSlurp.apiKey) {
      throw new Error('❌ MAILSLURP_API_KEY is missing.');
    }
    this.mailslurp = new MailSlurp({ apiKey: config.mailSlurp.apiKey });
    logger.message('✅ MailSlurp client initialized.', 'info');
  }

  async waitForLatestEmail(inboxId: string, timeout = 30_000) {
    logger.message(`Waiting for latest email in inbox ${inboxId}...`, 'info');
    return this.mailslurp.waitForLatestEmail(inboxId, timeout);
  }

  async getEmails(inboxId: string) {
    return this.mailslurp.getEmails(inboxId);
  }

  async deleteInbox(inboxId: string) {
    return this.mailslurp.deleteInbox(inboxId);
  }

  async createInbox(options: CreateInboxDto = {}): Promise<InboxDto> {
    logger.message('Creating inbox...', 'info');
    const enhancedOptions = {
      ...options,
      useShortAddress: true,
      inboxType: CreateInboxDtoInboxTypeEnum.HTTP_INBOX,
      tags: ['automated-test'],
    };
    logger.message(JSON.stringify(enhancedOptions, null, 2), 'info');

    const inbox = await this.mailslurp.createInboxWithOptions(enhancedOptions);
    this.createdInboxes.push(inbox);
    logger.message(`Inbox created: ${inbox.emailAddress} (ID: ${inbox.id})`, 'success');
    return inbox;
  }

  async cleanupInboxes(): Promise<void> {
    for (const inbox of this.createdInboxes) {
      try {
        await this.mailslurp.deleteInbox(inbox.id);
        logger.message(`Deleted inbox: ${inbox.emailAddress}`, 'success');
      } catch (err: any) {
        logger.message(`Failed to delete inbox: ${inbox.emailAddress}. Error: ${err}`, 'error');
      }
    }
    this.createdInboxes = [];
  }

  getClient(): MailSlurp {
    return this.mailslurp;
  }
}
