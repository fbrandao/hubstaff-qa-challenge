import { logger } from './utils/logger';

async function globalTeardown() {
  logger.header('Global Teardown');
  logger.message(`Cleanup Done!`, 'success');
  logger.separator();
}

export default globalTeardown;
