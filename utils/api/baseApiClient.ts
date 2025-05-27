import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar, Cookie } from 'tough-cookie';
import { BrowserContext } from '@playwright/test';
import { logger } from '../logger';

export abstract class BaseApiClient {
  protected readonly baseUrl: string;
  protected readonly api: AxiosInstance;
  protected readonly cookieJar: CookieJar;
  protected csrfToken: string | null = null;

  protected abstract fetchCsrfToken(): Promise<string>;

  protected constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.cookieJar = new CookieJar();
    this.api = wrapper(axios.create({ baseURL: baseUrl, jar: this.cookieJar }));
  }

  async getCookies(domain: string) {
    return this.cookieJar.getCookies(`https://${domain}`);
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
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 'N/A';
      const errorData = axiosError.response?.data || axiosError.message;
      logger.message(
        `❌ Request failed: ${method} ${this.baseUrl}${endpoint} Status: ${status} Error: ${JSON.stringify(errorData)}`,
        'error',
      );
      throw error;
    }
  }
  protected async injectCookiesIntoContext(
    cookies: Cookie[],
    context: BrowserContext,
    targetDomain: string,
  ) {
    await context.addCookies(
      cookies.map(c => ({
        name: c.key,
        value: c.value,
        domain: (c.domain || targetDomain).replace(/^\./, ''),
        path: c.path || '/',
        expires: c.expires instanceof Date ? c.expires.getTime() / 1000 : -1,
        httpOnly: c.httpOnly,
        secure: c.secure,
        sameSite: c.sameSite === 'strict' ? 'Strict' : c.sameSite === 'lax' ? 'Lax' : 'None',
      })),
    );
  }
}
