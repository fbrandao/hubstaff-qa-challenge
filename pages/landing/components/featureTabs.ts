import { Page, Locator, expect } from '@playwright/test';
import { ReadinessCheck } from '../../base/types';
import { BaseComponent } from '../../base/baseComponent';

export class FeatureTabs extends BaseComponent {
  private readonly tabs: { name: string; locator: Locator }[];

  constructor(page: Page) {
    super(page);
    this.tabs = [
      {
        name: 'Global time tracking',
        locator: this.page.getByRole('tab', { name: 'Global time tracking' }),
      },
      {
        name: 'Productivity data',
        locator: this.page.getByRole('tab', { name: 'Productivity data' }),
      },
      {
        name: 'Flexible payroll',
        locator: this.page.getByRole('tab', { name: 'Flexible payroll' }),
      },
      {
        name: 'Attendance management',
        locator: this.page.getByRole('tab', { name: 'Attendance management' }),
      },
      {
        name: 'Project cost and budgeting',
        locator: this.page.getByRole('tab', { name: 'Project cost and budgeting' }),
      },
    ];
  }

  /**
   * Clicks the tab with the given name.
   * @param {string} name - The name of the tab to click.
   */
  async clickTabByName(name: string) {
    const tab = this.tabs.find(t => t.name.toLowerCase() === name.toLowerCase());
    if (tab) {
      await tab.locator.click();
    } else {
      throw new Error(`Tab with name ${name} not found`);
    }
  }

  /**
   * Returns the readiness checks for the feature tabs.
   * @returns {ReadinessCheck[]} The readiness checks for the feature tabs.
   */
  getReadinessChecks(): ReadinessCheck[] {
    return [
      {
        description: 'First feature tab is visible',
        type: 'assertion',
        assertion: () =>
          expect(this.page.getByRole('tab', { name: /Global time tracking/i })).toBeVisible(),
      },
    ];
  }
}
