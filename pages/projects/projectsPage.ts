import { Page, expect, test } from '@playwright/test';
import { BasePage } from '../base/basePage';
import { ReadinessCheck } from '../base/types';
import { NewProjectModal } from './modals/newProjectModal';
import { DeleteProjectModal } from './modals/deleteProjectModal';
import { faker } from '@faker-js/faker';

export class ProjectsPage extends BasePage {
  protected baseUrl = '/projects';
  private readonly browserPrefix: string;

  constructor(page: Page) {
    super(page, 'app');
    this.browserPrefix = `[${test.info().project.name}]`;
  }

  readonly addProjectButton = this.page.getByText('Add project');
  readonly heading = this.page.getByRole('heading', { name: 'Projects', exact: true });
  readonly newProjectModal = new NewProjectModal(this.page);
  readonly deleteProjectModal = new DeleteProjectModal(this.page);
  readonly projectNameElements = this.page.locator('.project-name');
  readonly toastMessage = this.page.locator('.jGrowl-message');

  /**
   * Returns the readiness checks for the projects page.
   * @returns {ReadinessCheck[]} The readiness checks for the projects page.
   */
  getReadinessChecks(): ReadinessCheck[] {
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

  /**
   * Opens the new project modal and waits for the projects list to refresh
   */
  async clickAddProject() {
    await this.waitForActionAndApiResponses({
      page: this.page,
      requests: [{ method: 'GET', url: /projects/ }],
      action: () => this.addProjectButton.click(),
    });
  }

  /**
   * Creates a new project with the given name and waits for the list to refresh
   * @param {string} name - The name of the project to create.
   */
  async createProject(name: string) {
    await this.newProjectModal.fillForm(name);
    await this.waitForActionAndApiResponses({
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

  /**
   * Returns all project names from the current list
   * @returns {string[]} The names of the projects in the current list.
   */
  async getProjectNames(): Promise<string[]> {
    return this.projectNameElements.allInnerTexts();
  }

  /**
   * Generates a unique project name using the provided base name.
   * @param {string} baseName - A guaranteed-unique base name (e.g., includes test title + browser).
   * @returns {string} The fully qualified project name.
   */
  async generateUniqueProjectName(baseName?: string): Promise<string> {
    const trimmedBase = (baseName || faker.company.name())
      .trim()
      .slice(0, 100 - this.browserPrefix.length - 1); // -1 for space
    if (!trimmedBase) {
      throw new Error('Base name cannot be empty or whitespace only');
    }

    return `${this.browserPrefix} ${trimmedBase}`;
  }

  /**
   * Deletes a project with the given name
   * @param {string} name - The name of the project to delete.
   */
  async deleteProject(name: string) {
    // Find the project row using the table structure and exact name match
    const projectRow = this.page
      .locator('table.table tbody tr', {
        has: this.page.locator(`.project-name:text-is("${name}")`),
      })
      .first();

    await projectRow.locator('.table-actions-dropdown .dropdown-toggle').click();
    await this.waitForActionAndApiResponses({
      page: this.page,
      requests: [{ method: 'GET', url: /\/projects\/\d+\/delete_dialog\.dialog/ }],
      action: () =>
        this.page.locator('#teleport-target').getByRole('link', { name: 'Delete project' }).click(),
    });

    await expect(this.deleteProjectModal).toBeReady();

    await this.waitForActionAndApiResponses({
      page: this.page,
      requests: [
        { method: 'POST', url: /\/projects\/\d+$/ },
        { method: 'GET', url: /\/organizations\/\d+\/projects/ },
      ],
      action: () => this.deleteProjectModal.confirmDelete(),
    });
  }

  /**
   * Cleans up test projects by deleting any that match the current browser's test pattern
   */
  async cleanupTestProjects() {
    const projectNames = await this.getProjectNames();
    const browserProjects = projectNames.filter(name => name.startsWith(this.browserPrefix));

    if (browserProjects.length > 0) {
      for (const name of browserProjects) {
        await this.deleteProject(name);
      }
    }

    const remainingProjects = await this.getProjectNames();
    const remainingBrowserProjects = remainingProjects.filter(name =>
      name.startsWith(this.browserPrefix),
    );
    expect(remainingBrowserProjects).toHaveLength(0);
  }
}
