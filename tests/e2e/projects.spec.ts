import { test, expect } from '../../fixtures';
import { storageStatePaths } from '../../utils/auth/config';

test.use({ storageState: storageStatePaths.owner });

test.describe('Projects Management Scenarios', () => {
  let projectName: string;

  test.beforeEach(async ({ projectsPage }, testInfo) => {
    await test.step('Generate a unique project name per test', async () => {
      // Include project name, test title, and browser name
      const base = `${testInfo.project.name}-${testInfo.title.replace(/\W+/g, '-')}`;
      projectName = await projectsPage.generateUniqueProjectName(base);
    });

    await test.step('Navigate to projects page', async () => {
      await projectsPage.open();
      await expect(projectsPage).toBeReady();
    });

    await test.step('Ensure test-specific project is deleted if it already exists', async () => {
      const names = await projectsPage.getProjectNames();
      if (names.includes(projectName)) {
        await projectsPage.deleteProject(projectName);
      }
    });
  });

  test('Owner can add/create a new project', async ({ projectsPage }) => {
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

  test('Owner can delete a project', async ({ projectsPage }) => {
    await test.step('Create a test project to delete', async () => {
      await projectsPage.clickAddProject();
      await expect(projectsPage.newProjectModal).toBeReady();
      await projectsPage.createProject(projectName);
      expect(await projectsPage.getProjectNames()).toContain(projectName);
    });

    await test.step('Delete the project', async () => {
      await projectsPage.deleteProject(projectName);
    });

    await test.step('Verify project was deleted', async () => {
      expect(await projectsPage.getProjectNames()).not.toContain(projectName);
      await expect(projectsPage.toastMessage.filter({ hasText: 'Deleted project' })).toBeVisible();
    });
  });
});
