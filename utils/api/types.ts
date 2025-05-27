import { BrowserContext } from '@playwright/test';

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  timeZone?: string;
  product?: string;
  customAnonymousId?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  context: BrowserContext;
  domain?: string;
}

export interface LoginAndSaveStorageStatePayload {
  email: string;
  password: string;
  stateFilePath: string;
}
