import { test, expect } from '../../fixtures';
import { storageStatePaths } from '../../utils/auth/config';


test.use({ storageState: storageStatePaths.owner });

test.describe('Projects Management Scenarios', () => {
  test.beforeEach(async ({ projectsPage }) => {
    await projectsPage.open();
    await expect(projectsPage).toBeReady();
    await projectsPage.cleanupTestProjects();
  });

  test('Owner can add/create a new project', async ({ projectsPage }) => {
    let projectName: string;

    await test.step('Generate unique project name', async () => {
      projectName = await projectsPage.generateUniqueProjectName('Hubstaff QA E2E Project');
    });

    await test.step('Open new project modal', async () => {
      await projectsPage.clickAddProject();
      await expect(projectsPage.newProjectModal).toBeReady();
    });

    await test.step('Create new project', async () => {
      await projectsPage.createProject(projectName);
    });

    await test.step('Verify project was created', async () => {
      expect(await projectsPage.getProjectNames()).toContain(projectName);
      await expect(projectsPage.toastMessage.filter({ hasText: 'Project created' })).toBeVisible();
    });
  });
});
