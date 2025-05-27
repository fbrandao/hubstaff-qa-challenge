import { BaseApiClient } from './baseApiClient';
import { config } from '../config';
import { EmailClient } from '../email/emailClient';
import { extractConfirmationLink } from '../email/emailExtractor';
import { AxiosResponse } from 'axios';
import { request } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { LoginAndSaveStorageStatePayload } from './types';

export class AccountApiClient extends BaseApiClient {
  constructor() {
    if (!config.api.account.baseUrl) {
      throw new Error('ACCOUNT_API_BASE is not configured in the environment.');
    }
    super(config.api.account.baseUrl);
  }

  protected async fetchCsrfToken(): Promise<string> {
    if (this.csrfToken) return this.csrfToken;

    const response = await this.api.get('/login');
    const html = response.data;

    // Try login form input first (most expected case)
    let token = html.match(
      /<input[^>]+name=["']authenticity_token["'][^>]+value=["']([^"']+)["']/,
    )?.[1];

    // If not found, try fallback to meta tag (when already logged in)
    if (!token) {
      token = html.match(/<meta[^>]+name=["']csrf-token["'][^>]+content=["']([^"']+)["']/)?.[1];
    }

    if (!token) {
      throw new Error('❌ CSRF token not found in login or fallback meta tag');
    }

    this.csrfToken = token;
    return token;
  }

  /**
   * Logs in with a valid user and saves storage state to disk.
   */
  async loginAndSaveStorageState({
    email,
    password,
    stateFilePath,
  }: LoginAndSaveStorageStatePayload) {
    const apiContext = await request.newContext();
    const loginPage = await apiContext.get(`${this.baseUrl}/login`);
    const html = await loginPage.text();

    const csrf = html.match(/name=["']authenticity_token["'][^>]*value=["']([^"']+)["']/)?.[1];
    if (!csrf) throw new Error('❌ Could not extract authenticity_token from login page');

    const form = new URLSearchParams({
      authenticity_token: csrf,
      'user[email]': email,
      'user[password]': password,
      fingerprint: 'dummy',
      button: '',
    });

    const loginResponse = await apiContext.post(`${this.baseUrl}/login`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: form.toString(),
    });

    if (!loginResponse.ok() && loginResponse.status() !== 302) {
      throw new Error(
        `Login failed for ${email}: ${loginResponse.status()} ${loginResponse.statusText()}`,
      );
    }

    // Save to storage
    fs.mkdirSync(path.dirname(stateFilePath), { recursive: true });
    await apiContext.storageState({ path: stateFilePath });
  }

  async confirmAccount(token: string): Promise<AxiosResponse> {
    return this.request(`/confirm_account/${token}`, {
      method: 'GET',
    });
  }

  async confirmAccountFromEmail({
    emailClient,
    inboxId,
    timeout = 30000,
  }: {
    emailClient: EmailClient;
    inboxId: string;
    timeout?: number;
  }): Promise<AxiosResponse> {
    const email = await emailClient.waitForLatestEmail(inboxId, timeout);
    if (!email?.body) throw new Error('❌ No confirmation email received');
    const confirmationLink = extractConfirmationLink(email.body);
    if (!confirmationLink) throw new Error('❌ No confirmation link found in email');
    const token = confirmationLink.split('/').pop();
    if (!token) throw new Error('❌ Token extraction failed from confirmation link');
    return await this.confirmAccount(token);
  }
}
