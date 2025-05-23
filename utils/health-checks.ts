import { APIRequestContext, APIResponse } from '@playwright/test';
import { log } from './logger';

export interface HealthCheck {
  name: string;
  url: string;
  validate?: (response: APIResponse) => boolean;
}

class HealthCheckRegistry {
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

export async function runHealthChecks(request: APIRequestContext) {
  log.header('Health Checks');

  for (const check of healthChecks.getChecks()) {
    try {
      log.message(`Checking ${check.name}...`);
      const response = await request.get(check.url);

      if (!response.ok()) {
        log.message(
          `${check.name} is not responding properly. Status: ${response.status()}`,
          'error',
        );
        throw new Error(`${check.name} is not responding properly. Status: ${response.status()}`);
      }

      if (check.validate) {
        const isValid = check.validate(response);
        if (!isValid) {
          log.message(`${check.name} validation failed`, 'error');
          throw new Error(`${check.name} validation failed`);
        }
      }

      log.message(`${check.name} is healthy!`, 'success');
    } catch (error) {
      log.message(`${check.name} health check failed: ${error}`, 'error');
      throw error;
    }
  }

  log.separator();
}
