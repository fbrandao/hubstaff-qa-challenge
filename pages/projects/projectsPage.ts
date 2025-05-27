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
  readonly projectNameElements = this.page.locator('.project-name');
  readonly toastMessage = this.page.locator('.jGrowl-message');

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

  /** Navigates to the projects page */
  async open() {
    await this.goto();
  }

  /** Opens the new project modal and waits for the projects list to refresh */
  async clickAddProject() {
    await this.waitForApiResponseWithAction({
      page: this.page,
      requests: [{ method: 'GET', url: /projects/ }],
      action: () => this.addProjectButton.click(),
    });
  }

  /** Creates a new project with the given name and waits for the list to refresh */
  async createProject(name: string) {
    await this.newProjectModal.fillForm(name);
    await this.waitForApiResponseWithAction({
      page: this.page,
      requests: [
        { method: 'POST', url: /projects\.json/ },
        {
          method: 'GET',
          url: /projects\.json\?page=&search=&status=active&hs_tasks_synced=&v2=true/,
        },
      ],
      action: () => this.newProjectModal.save(),
    });
  }

  /** Returns all project names from the current list */
  async getProjectNames(): Promise<string[]> {
    return this.projectNameElements.allInnerTexts();
  }

  /** Generates a unique project name based on the provided base name */
  async generateUniqueProjectName(baseName = 'E2E Project'): Promise<string> {
    const trimmedBase = baseName.trim().slice(0, 100);
    if (!trimmedBase) {
      throw new Error('Base name cannot be empty or whitespace only');
    }

    const existingNames = await this.getProjectNames();
    let candidate = trimmedBase;
    let suffix = 1;

    while (existingNames.includes(candidate)) {
      const suffixStr = ` ${suffix}`;
      const truncated = trimmedBase.slice(0, 100 - suffixStr.length);
      candidate = `${truncated}${suffixStr}`;
      suffix++;
    }

    return candidate;
  }

  /** Deletes a project with the given name */
  async deleteProject(name: string) {
    // Find the project row using the table structure and exact name match
    const projectRow = this.page.locator('table.table tbody tr', {
      has: this.page.locator(`.project-name:text-is("${name}")`)
    }).first();
    
    // Click the actions dropdown in this specific row
    await projectRow.locator('.table-actions-dropdown .dropdown-toggle').click();
    
    // Click the delete option in the teleported dropdown menu and wait for the delete dialog
    await this.waitForApiResponseWithAction({
      page: this.page,
      requests: [{ method: 'GET', url: /\/projects\/\d+\/delete_dialog\.dialog/ }],
      action: () => this.page.locator('#teleport-target').getByRole('link', { name: 'Delete project' }).click()
    });
    
    // Wait for the modal to be visible
    const modal = this.page.locator('#delete-project-modal');
    await expect(modal).toBeVisible();
    
    // Check the "I understand" checkbox
    await this.page.locator('#delete-project-modal').getByText('I understand and wish to').click();
    
    // Click the delete button in the modal
    await this.waitForApiResponseWithAction({
      page: this.page,
      requests: [
        { method: 'POST', url: /\/projects\/\d+$/ },
        { method: 'GET', url: /\/organizations\/\d+\/projects/ }
      ],
      action: () => this.page.locator('#delete-button').click()
    });
  }

  /** Cleans up test projects by deleting any that match the test pattern */
  async cleanupTestProjects() {    
    const projectNames = await this.getProjectNames();
    
    if (projectNames.length > 0) {
      for (const name of projectNames) {      
        await this.deleteProject(name);
      }
    }

    expect(await this.getProjectNames()).toHaveLength(0);
  }
}
