import path from 'path';
import { fixedUsers } from './users';

const AUTH_DIR = path.resolve(process.cwd(), 'storage', '.auth');

const normalizeEmail = (email: string) => email.replace(/[@.]/g, '_') + '.json';

/**
 * Generates a storage path for a given email address.
 * @param {string} email - The email address to generate a storage path for.
 * @returns {string} The storage path for the given email address.
 */
export const getStoragePathForEmail = (email: string) => path.join(AUTH_DIR, normalizeEmail(email));

export const users = fixedUsers;

/**
 * Generates storage state paths for all users.
 * @returns {Record<string, string>} An object mapping user roles to their storage paths.
 */
export const storageStatePaths = Object.fromEntries(
  users.map(user => [user.role, getStoragePathForEmail(user.email)]),
);
