import { log } from './utils/logger';

async function globalTeardown() {
  log.header('Global Teardown');
  log.message(`Cleanup Done!`, 'success');
  log.separator();
}

export default globalTeardown;
