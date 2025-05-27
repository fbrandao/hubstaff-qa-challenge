import { Page } from '@playwright/test';
import { BasePage } from '../base/basePage';
import { HeroForm } from './sections/heroForm';
import { FeatureTabs } from './sections/featureTabs';
import { Header } from './sections/header';
import { ReadinessCheck } from '../base/types';

export class LandingPage extends BasePage {
  readonly header: Header;
  readonly heroForm: HeroForm;
  readonly featureTabs: FeatureTabs;
  protected url = '';

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.heroForm = new HeroForm(page);
    this.featureTabs = new FeatureTabs(page);
  }

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

  async open() {
    await this.goto();
    await this.waitUntilReady();
  }

  async clickSignInBtn() {
    await this.header.signInButton.click();
  }
}
