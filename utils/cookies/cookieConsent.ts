import { BrowserContext } from '@playwright/test';

export async function setCookieConsent(context: BrowserContext) {
  const timestamp = Date.now();
  const region = 'pt';

  const cookie = {
    name: 'CookieConsent',
    value: encodeURIComponent(
      JSON.stringify({
        stamp: generateStamp(),
        necessary: true,
        preferences: true,
        statistics: true,
        marketing: true,
        method: 'explicit',
        ver: 1,
        utc: timestamp,
        region: region,
      }),
    ),
    domain: 'hubstaff.com',
    path: '/',
    httpOnly: false,
    secure: true,
    sameSite: 'Lax' as const,
  };

  await context.addCookies([cookie]);
}

function generateStamp(): string {
  const random = Math.random().toString(36).substring(2, 15);
  const random2 = Math.random().toString(36).substring(2, 15);
  return `${random}${random2}`;
}
