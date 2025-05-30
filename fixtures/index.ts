import { test as base } from '@playwright/test';
import { test as pageFixtures } from './pageFixtures';
import { test as utilsFixtures } from './utilsFixtures';
import { test as emailFixtures } from './emailFixtures';
import { test as apiFixtures } from './apiFixtures';

import { mergeTests, expect as baseExpect } from '@playwright/test';
import { customMatchers } from '../utils/matchers/custom';

export const test = mergeTests(base, pageFixtures, utilsFixtures, emailFixtures, apiFixtures);

baseExpect.extend(customMatchers);

test.beforeEach(async ({}, testInfo) => {
  testInfo.annotations.push({
    type: 'browser',
    description: testInfo.project.name,
  });
});
export { baseExpect as expect };
