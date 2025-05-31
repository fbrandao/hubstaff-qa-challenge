import { BrowserContext } from '@playwright/test';

/**
 * Payload for the signup request.
 */
export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  timeZone?: string;
  product?: string;
  customAnonymousId?: string;
}

/**
 * Payload for the login request.
 */
export interface LoginPayload {
  email: string;
  password: string;
  context: BrowserContext;
  domain?: string;
}

/**
 * Payload for the login and save storage state request.
 */
export interface LoginAndSaveStorageStatePayload {
  email: string;
  password: string;
  stateFilePath: string;
}
