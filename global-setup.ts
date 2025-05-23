import { request } from '@playwright/test';
import { log } from './utils/logger';
import { runHealthChecks } from './utils/health-checks';

async function globalSetup() {
  const apiRequest = await request.newContext();
  log.header('Global Setup');
  log.message('Running pre-test health checks...');

  try {
    await runHealthChecks(apiRequest);
  } catch {
    log.message('Health checks failed. Please ensure all required services are running.', 'error');
    throw new Error(
      'Required services are not available. Please check the logs above for details.',
    );
  }
}

export default globalSetup;
