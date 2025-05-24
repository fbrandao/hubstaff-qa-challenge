import dotenv from 'dotenv';
import { config } from './utils/config';
import path from 'path';
import { request } from '@playwright/test';
import { logger } from './utils/logger';
import { healthChecks, runHealthChecks } from './utils/healthCheck';
import { ACCOUNT_API_URL, BASE_URL, MARKETING_API_URL } from './utils/config';
import { isCI } from './utils/env';

if (!isCI) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

logger.message(`MAILSLURP_API_KEY: ${config.mailSlurp.apiKey}`, 'info');

async function globalSetup() {
  const apiRequest = await request.newContext();
  logger.header('Global Setup');
  logger.message('Running pre-test health checks...');

  healthChecks
    .add({ name: 'Hubstaff Base URL', url: BASE_URL })
    .add({
      name: 'Marketing API Session',
      url: MARKETING_API_URL,
    })
    .add({
      name: 'Account API Login',
      url: ACCOUNT_API_URL,
    });

  try {
    await runHealthChecks(apiRequest);
  } catch {
    logger.message(
      'Health checks failed. Please ensure all required services are running.',
      'error',
    );
    throw new Error(
      'Required services are not available. Please check the logs above for details.',
    );
  }
}

export default globalSetup;
