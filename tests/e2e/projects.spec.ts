import { test, expect } from '../../fixtures';
import { storageStatePaths } from '../../utils/auth/config';

test.use({ storageState: storageStatePaths.owner });

test.describe('Projects Management Scenarios', () => {
  test.beforeEach(async ({ projectsPage }) => {
    await projectsPage.open();
    await expect(projectsPage).toBeReady();
  });

  test('Owner can add/create a new project', async ({ projectsPage }) => {
    await projectsPage.clickAddProject();
    await expect(projectsPage.newProjectModal).toBeReady();
    await projectsPage.createProject('Test Project');
  });
});
