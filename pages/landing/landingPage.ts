import { Page } from '@playwright/test';
import { BasePage } from '../base/basePage';
import { HeroForm } from './components/heroForm';
import { FeatureTabs } from './components/featureTabs';
import { Header } from './components/header';
import { ReadinessCheck } from '../base/types';

export class LandingPage extends BasePage {
  readonly header: Header;
  readonly heroForm: HeroForm;
  readonly featureTabs: FeatureTabs;
  protected baseUrl = '';

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.heroForm = new HeroForm(page);
    this.featureTabs = new FeatureTabs(page);
  }

  /**
   * Returns the readiness checks for the landing page.
   * @returns {ReadinessCheck[]} The readiness checks for the landing page.
   */
  getReadinessChecks(): ReadinessCheck[] {
    return [
      {
        description: 'Header is ready',
        type: 'assertion',
        assertion: () => this.header.waitUntilReady(),
      },
      {
        description: 'Hero form is ready',
        type: 'assertion',
        assertion: () => this.heroForm.waitUntilReady(),
      },
      {
        description: 'Feature tabs are ready',
        type: 'assertion',
        assertion: () => this.featureTabs.waitUntilReady(),
      },
    ];
  }

  /**
   * Opens the landing page.
   */
  async open() {
    await this.goto();
    await this.waitUntilReady();
  }

  /**
   * Clicks the sign in button in the header.
   */
  async clickSignInBtn() {
    await this.header.signInButton.click();
  }
}
