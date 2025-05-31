import { test, expect } from '@playwright/test';
import { HealthCheckRegistry, type HealthCheck } from '../../../utils/healthCheck';
import { APIResponse } from '@playwright/test';

test.describe('Health Check Registry', () => {
  let registry: HealthCheckRegistry;

  test.beforeEach(() => {
    registry = new HealthCheckRegistry();
  });

  test('adds and retrieves health checks', () => {
    const check: HealthCheck = {
      name: 'Test Check',
      url: 'https://test.com',
    };

    registry.add(check);
    const checks = registry.getChecks();
    expect(checks).toHaveLength(1);
    expect(checks[0]).toEqual(check);
  });

  test('removes health checks by name', () => {
    const check1: HealthCheck = { name: 'Check 1', url: 'https://test1.com' };
    const check2: HealthCheck = { name: 'Check 2', url: 'https://test2.com' };

    registry.add(check1).add(check2);
    expect(registry.getChecks()).toHaveLength(2);

    registry.remove('Check 1');
    const remainingChecks = registry.getChecks();
    expect(remainingChecks).toHaveLength(1);
    expect(remainingChecks[0]).toEqual(check2);
  });

  test('supports custom validation functions', () => {
    const check: HealthCheck = {
      name: 'Custom Validation',
      url: 'https://test.com',
      validate: (response: APIResponse) =>
        response.status() === 200 && response.headers()['content-type']?.includes('json'),
    };

    registry.add(check);
    const checks = registry.getChecks();
    expect(checks[0].validate).toBeDefined();
  });
});
