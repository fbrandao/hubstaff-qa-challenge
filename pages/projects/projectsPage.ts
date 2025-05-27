import { Page, expect } from '@playwright/test';
import { BasePage } from '../base/basePage';
import { ReadinessCheck } from '../base/types';
import { NewProjectModal } from './sections/newProjectModal';

export class ProjectsPage extends BasePage {
  protected url = '/projects';

  constructor(page: Page) {
    super(page, 'app');
  }

  readonly addProjectButton = this.page.getByText('Add project');
  readonly heading = this.page.getByRole('heading', { name: 'Projects' });
  readonly newProjectModal = new NewProjectModal(this.page);

  protected getReadinessChecks(): ReadinessCheck[] {
    return [
      {
        description: 'Projects heading is visible',
        type: 'assertion',
        assertion: async () => expect(this.heading).toBeVisible(),
      },
      {
        description: '"Add project" button is visible',
        type: 'assertion',
        assertion: async () => expect(this.addProjectButton).toBeVisible(),
      },
      {
        description: 'Projects table is visible',
        type: 'assertion',
        assertion: async () => expect(this.page.getByRole('table')).toBeVisible(),
      },
      {
        description: 'Projects active tab is visible',
        type: 'assertion',
        assertion: async () =>
          expect(this.page.getByRole('link', { name: /Active/ })).toBeVisible(),
      },
      {
        description: 'Page URL contains status=active',
        type: 'assertion',
        assertion: async () => expect(this.page).toHaveURL(/status=active/),
      },
    ];
  }

  async open() {
    await this.goto();
  }

  async clickAddProject() {
    await this.waitForApiResponseWithAction({
      page: this.page,
      method: 'GET',
      url: /projects/,
      action: () => this.addProjectButton.click(),
    });
  }

  async createProject(name: string) {
    await this.newProjectModal.fillForm(name);
    await this.newProjectModal.save();
  }
}
