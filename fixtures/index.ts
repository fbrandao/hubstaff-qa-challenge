import { test as base } from '@playwright/test';
import { test as pageFixtures } from './pageFixtures';
import { test as utilsFixtures } from './utilsFixtures';
import { test as emailFixtures } from './emailFixtures';
import { mergeTests } from '@playwright/test';

export const test = mergeTests(base, pageFixtures, utilsFixtures, emailFixtures);
