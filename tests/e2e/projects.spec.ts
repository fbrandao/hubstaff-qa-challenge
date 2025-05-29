import { test, expect } from '../../fixtures';
import { storageStatePaths } from '../../utils/auth/config';

test.use({ storageState: storageStatePaths.owner });

test.describe('Projects Management Scenarios', () => {
  test.beforeEach(async ({ projectsPage }) => {
    await test.step('Navigate to projects page', async () => {
      await projectsPage.open();
      await expect(projectsPage).toBeReady();
    });

    await test.step('Clean up any existing test projects', async () => {
      await projectsPage.cleanupTestProjects();
    });

    await test.step('Verify projects list is empty', async () => {
      expect(await projectsPage.getProjectNames()).toHaveLength(0);
    });
  });

  test('Owner can add/create a new project', async ({ projectsPage }) => {
    let projectName: string;

    await test.step('Generate unique project name', async () => {
      projectName = await projectsPage.generateUniqueProjectName();
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

  test('Owner can delete a project', async ({ projectsPage }) => {
    let projectName: string;

    await test.step('Create a test project to delete', async () => {
      projectName = await projectsPage.generateUniqueProjectName();
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
