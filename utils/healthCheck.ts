import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger } from './logger';

export interface HealthCheck {
  name: string;
  url: string;
  validate?: (response: APIResponse) => boolean;
}

/**
 * Registry for managing health checks.
 */
export class HealthCheckRegistry {
  private checks: HealthCheck[] = [];

  add(check: HealthCheck) {
    this.checks.push(check);
    return this;
  }

  remove(name: string) {
    this.checks = this.checks.filter(check => check.name !== name);
    return this;
  }

  getChecks() {
    return this.checks;
  }
}

export const healthChecks = new HealthCheckRegistry();

/**
 * Runs health checks for the application.
 * @param {APIRequestContext} request - The request context to use for the health checks.
 * @returns {Promise<void>} A promise that resolves when all health checks are complete.
 */
export async function runHealthChecks(request: APIRequestContext) {
  logger.header('Health Checks');

  for (const check of healthChecks.getChecks()) {
    try {
      logger.message(`Checking ${check.name}...`);
      const response = await request.get(check.url);

      if (!response.ok()) {
        logger.message(
          `${check.name} is not responding properly. Status: ${response.status()}`,
          'error',
        );
        throw new Error(`${check.name} is not responding properly. Status: ${response.status()}`);
      }

      if (check.validate) {
        const isValid = check.validate(response);
        if (!isValid) {
          logger.message(`${check.name} validation failed`, 'error');
          throw new Error(`${check.name} validation failed`);
        }
      }

      logger.message(`${check.name} is healthy!`, 'success');
    } catch (error) {
      logger.message(`${check.name} health check failed: ${error}`, 'error');
      throw error;
    }
  }

  logger.separator();
}
