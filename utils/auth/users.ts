import { getEnvVar } from '../env';

export const fixedUsers = [
  {
    role: 'owner',
    email: getEnvVar('TEST_USER_EMAIL'),
    password: getEnvVar('TEST_USER_PASSWORD'),
  },
] as const;
