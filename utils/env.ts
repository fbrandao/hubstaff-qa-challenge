import dotenv from 'dotenv';
import path from 'path';

// Environment detection
const NODE_ENV = process.env.NODE_ENV;
const CI = process.env.CI === 'true';

export const isCI = CI;
export const isTest = NODE_ENV === 'test';
export const isProduction = NODE_ENV === 'production';
export const isLocal = !isCI && !isProduction && !isTest;

export const environment = isLocal
  ? 'local'
  : isCI
    ? 'ci'
    : isTest
      ? 'test'
      : isProduction
        ? 'production'
        : 'local';

// Load .env only in local
if (isLocal) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

/**
 * Retrieves an environment variable with optional error handling.
 * @param {string} key - The name of the environment variable to retrieve.
 * @param {boolean} required - Whether the variable is required.
 * @returns {string} The value of the environment variable.
 */
export function getEnvVar(key: string, required = true): string {
  const val = process.env[key];
  if (!val && required) throw new Error(`❌ Missing required env var: ${key}`);
  return val!;
}
