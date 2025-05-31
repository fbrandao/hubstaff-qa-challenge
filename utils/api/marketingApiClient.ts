import { BaseApiClient } from './baseApiClient';
import { config } from '../config';
import { AxiosResponse } from 'axios';
import { SignupPayload } from './types';

/**
 * API client for the marketing API.
 */
export class MarketingApiClient extends BaseApiClient {
  protected sessionEndpoint = config.api.marketing.sessionEndpoint;

  constructor() {
    if (!config.api.marketing.baseUrl) {
      throw new Error('MARKETING_API_BASE is not configured in the environment.');
    }
    super(config.api.marketing.baseUrl);
  }

  /**
   * Fetches the CSRF token from the session endpoint.
   * @returns {Promise<string>} The CSRF token.
   */
  protected async fetchCsrfToken(): Promise<string> {
    if (this.csrfToken) return this.csrfToken;

    const response = await this.request(this.sessionEndpoint, { method: 'GET' });
    const token = response.data?.csrf?.token;
    if (!token) throw new Error('CSRF token not found in session data');
    this.csrfToken = token;
    return token;
  }

  /**
   * Signs up a new user.
   * @param {SignupPayload} payload - The payload for the signup request.
   * @returns {Promise<AxiosResponse>} The response from the signup request.
   */
  async signUp(payload: SignupPayload): Promise<AxiosResponse> {
    const formData = new FormData();
    formData.append('utf8', '✓');
    formData.append('hubstaff[product]', payload.product || 'hubstaff');
    formData.append('user[first_name]', payload.firstName);
    formData.append('user[last_name]', payload.lastName);
    formData.append('user[email]', payload.email);
    formData.append('user[password]', payload.password);
    formData.append('user[password_confirmation]', payload.password);
    formData.append('user[terms]', '1');

    if (payload.timeZone) formData.append('user[time_zone]', payload.timeZone);
    if (payload.customAnonymousId)
      formData.append('hubstaff[custom_anonymous_id]', payload.customAnonymousId);

    return this.request('/signup', {
      method: 'POST',
      data: formData,
    });
  }
}
