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
  }

  async waitForLatestEmail(inboxId: string, timeout = 30_000) {
    return this.mailslurp.waitForLatestEmail(inboxId, timeout);
  }

  async getEmails(inboxId: string) {
    return this.mailslurp.getEmails(inboxId);
  }

  async deleteInbox(inboxId: string) {
    return this.mailslurp.deleteInbox(inboxId);
  }

  /**
   * Creates a new inbox for the email client.
   * @param {CreateInboxDto} options - The options for creating the inbox.
   * @returns {Promise<InboxDto>} The created inbox.
   */
  async createInbox(options: CreateInboxDto = {}): Promise<InboxDto> {
    const enhancedOptions = {
      ...options,
      useShortAddress: true,
      inboxType: CreateInboxDtoInboxTypeEnum.HTTP_INBOX,
      tags: ['automated-e2e-test'],
    };
    const inbox = await this.mailslurp.createInboxWithOptions(enhancedOptions);
    this.createdInboxes.push(inbox);
    return inbox;
  }

  /**
   * Cleans up all created inboxes.
   * @returns {Promise<void>} A promise that resolves when all inboxes are deleted.
   */
  async cleanupInboxes(): Promise<void> {
    for (const inbox of this.createdInboxes) {
      try {
        await this.mailslurp.deleteInbox(inbox.id);
        logger.message(`Deleted inbox: ${inbox.emailAddress}`, 'success');
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        logger.message(
          `Failed to delete inbox: ${inbox.emailAddress}. Error: ${errorMessage}`,
          'error',
        );
      }
    }
    this.createdInboxes = [];
  }

  getClient(): MailSlurp {
    return this.mailslurp;
  }
}
