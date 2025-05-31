import { getEnvVar } from '../env';

/**
 * Fixed users for testing. These are loaded from the environment variables.
 * @type {Array<{role: string, email: string, password: string}>}
 */
export const fixedUsers = [
  {
    role: 'owner',
    email: getEnvVar('TEST_USER_EMAIL'),
    password: getEnvVar('TEST_USER_PASSWORD'),
  },
] as const;
