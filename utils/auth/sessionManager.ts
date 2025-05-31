import { AccountApiClient } from '../api/accountApiClient';
import { logger } from '../logger';
import { getStoragePathForEmail, users } from './config';

/**
 * Creates storage states for all users.
 * @returns {Promise<void>} A promise that resolves when all storage states are created.
 */
export async function createStorageStates() {
  const accountApi = new AccountApiClient();

  for (const user of users) {
    try {
      const stateFilePath = getStoragePathForEmail(user.email);
      await accountApi.loginAndSaveStorageState({
        email: user.email,
        password: user.password,
        stateFilePath,
      });
      logger.message(`Created storage for ${user.role} → ${user.email}`, 'success');
    } catch (err) {
      logger.message(`❌ Failed to save session for ${user.role}: ${err}`, 'error');
    }
  }
}
