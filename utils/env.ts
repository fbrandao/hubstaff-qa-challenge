import dotenv from 'dotenv';
import path from 'path';

export const isCI = process.env.CI === 'true';
export const isLocal =
  !isCI && process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test';
export const isTest = process.env.NODE_ENV === 'test';
export const isProduction = process.env.NODE_ENV === 'production';

export const environment = isLocal
  ? 'local'
  : isCI
    ? 'ci'
    : isTest
      ? 'test'
      : isProduction
        ? 'production'
        : 'local';

if (isLocal) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

export function getEnvVar(key: string, required = true): string | undefined {
  const val = process.env[key];
  if (!val && required) throw new Error(`❌ Missing required env var: ${key}`);
  return val;
}
