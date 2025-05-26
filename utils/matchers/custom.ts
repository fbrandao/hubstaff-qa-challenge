/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BasePage } from '../../pages/base/basePage';
import type { BaseComponent } from '../../pages/base/baseComponent';

export const customMatchers = {
  async toBeReady(received: BasePage | BaseComponent) {
    try {
      await received.waitUntilReady();
      return {
        pass: true,
        message: () => 'Expected page/component not to be ready, but it was.',
      };
    } catch (error: any) {
      return {
        pass: false,
        message: () =>
          `Expected page/component to be ready, but readiness check failed:\n${error?.message ?? error}`,
      };
    }
  },
};

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toBeReady(): Promise<R>;
    }
  }
}
