import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { logger } from '../logger';

export abstract class BaseApiClient {
  protected readonly baseUrl: string;
  protected readonly api: AxiosInstance;
  protected readonly cookieJar: CookieJar;
  private csrfToken: string | null = null;
  protected abstract sessionEndpoint: string;

  protected constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.cookieJar = new CookieJar();
    this.api = wrapper(axios.create({ baseURL: baseUrl, jar: this.cookieJar }));
  }

  protected async fetchCsrfToken(): Promise<string> {
    if (this.csrfToken) {
      return this.csrfToken!;
    }
    try {
      const response = await this.api.get(this.sessionEndpoint);
      const sessionData = response.data;
      if (sessionData?.csrf?.token) {
        this.csrfToken = sessionData.csrf.token;
        return sessionData.csrf.token;
      } else {
        throw new Error('CSRF token not found in session data.');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch CSRF token: ${errorMessage}`);
    }
  }

  protected async request(endpoint: string, config: AxiosRequestConfig): Promise<AxiosResponse> {
    const method = config.method?.toUpperCase() || 'GET';

    if (method !== 'GET' && method !== 'HEAD') {
      const csrfToken = await this.fetchCsrfToken();
      config.headers = {
        ...config.headers,
        'X-CSRF-Token': csrfToken,
      };
    }

    try {
      const response = await this.api.request({ url: endpoint, ...config });
      return response;
    } catch (error: any) {
      // Axios errors have a response property with status and data
      const status = error.response?.status || 'N/A';
      const errorData = error.response?.data || error.message;
      logger.message(
        `❌ Request failed: ${method} ${this.baseUrl}${endpoint} Status: ${status} Error: ${JSON.stringify(errorData)}`,
        'error',
      );
      throw error;
    }
  }
}
