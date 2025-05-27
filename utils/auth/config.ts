import path from 'path';
import { fixedUsers } from './users';

const AUTH_DIR = path.resolve(process.cwd(), 'storage', '.auth');

const normalizeEmail = (email: string) => email.replace(/[@.]/g, '_') + '.json';

export const getStoragePathForEmail = (email: string) => path.join(AUTH_DIR, normalizeEmail(email));

export const users = fixedUsers;

export const storageStatePaths = Object.fromEntries(
  users.map(user => [user.role, getStoragePathForEmail(user.email)]),
);
