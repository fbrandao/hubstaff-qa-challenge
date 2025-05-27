import type { BrowserContext } from '@playwright/test';
import type { Cookie } from 'tough-cookie';

export async function injectCookiesIntoContext(
  cookies: Cookie[],
  context: BrowserContext,
  domain: string,
): Promise<void> {
  const playwrightCookies = cookies.map(cookie => ({
    name: cookie.key,
    value: cookie.value,
    domain: cookie.domain?.replace(/^\./, '') || domain,
    path: cookie.path || '/',
    expires: cookie.expires instanceof Date ? Math.floor(cookie.expires.getTime() / 1000) : -1,
    httpOnly: cookie.httpOnly,
    secure: cookie.secure,
    sameSite:
      cookie.sameSite === 'strict'
        ? ('Strict' as const)
        : cookie.sameSite === 'lax'
          ? ('Lax' as const)
          : ('None' as const),
  }));

  await context.addCookies(playwrightCookies);
}
