# 🧪 Hubstaff QA Automation Challenge

[![CI](https://github.com/fbrandao/hubstaff-qa-challenge/actions/workflows/playwright.yml/badge.svg)](https://github.com/fbrandao/hubstaff-qa-challenge/actions/workflows/playwright.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)
[![Made with Playwright](https://img.shields.io/badge/tested%20with-Playwright-45ba63.svg?logo=playwright)](https://playwright.dev/)

A modern end-to-end (E2E) test automation framework built with **Playwright + TypeScript**, using the **Page Object Model (POM)** design pattern to validate Hubstaff's core flows with scalability, reliability, and maintainability in mind.

---

## 📁 Project Structure

```
├── tests/e2e/               # E2E test specifications
├── tests/unit/              # Unit test files
├── pages/                  # Page Object Models
│   ├── base/               # Base page/component classes
│   ├── common/             # Shared components
│   ├── landing/            # Landing page
│   ├── signin/             # Sign-in page
│   ├── signup/             # Sign-up page
│   └── ...                 # Other feature pages
├── fixtures/               # Custom test fixtures and test data
├── utils/                  # Environment configs, helpers
├── storage/                # Storage state management
└── reports/                # Test reports and traces
```

---

## 🧱 Architecture & Design

### ✅ Page Object Model (POM)

- Every page is encapsulated in a class
- Shared components are modularized
- Common base classes reduce duplication
- Fixture initialization for faster and cleaner test execution

Example usage:

```ts
// Component
class SignInForm extends BaseComponent {
  readonly emailInput = this.page.getByTestId('email-input');
  readonly passwordInput = this.page.getByTestId('password-input');
  readonly submitButton = this.page.getByTestId('submit-button');

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

// Page
class SignInPage extends BasePage {
  protected baseUrl = '/signin';
  readonly signInForm: SignInForm;

  constructor(page: Page) {
    super(page);
    this.signInForm = new SignInForm(page);
  }
}

// Example
test('should sign in successfully', async ({ page, signInPage }) => {
  await signInPage.goto();
  await signInPage.signInForm.login('user@example.com', 'password123');
  await expect(page).toHaveURL(/dashboard/);
});
```

### ✅ Readiness System

Uses a customer matcher that allows ensuring that components and pages are ready before interaction based on their own readiness checks:

```ts
expect.extend({
  async toBeReady(received: BasePage | BaseComponent) {
    try {
      await received.waitUntilReady();
      return { pass: true, message: () => 'Page is ready.' };
    } catch (e) {
      return { pass: false, message: () => `Readiness failed: ${e.message}` };
    }
  },
});
```

This allows us to do something like:

```ts
// In your test file
test('should load dashboard successfully', async ({ page }) => {
  const dashboard = new DashboardPage(page);

  // Wait for the page to be fully ready before interacting
  await expect(dashboard).toBeReady();

  // Now safe to interact with the page
  await dashboard.clickCreateProject();
  await expect(dashboard.projectList).toBeVisible();
});
```

---

## 🧪 Testing Strategy

### 🔹 Categories

- **Authentication**: Sign up, login, email confirmation
- **Projects**: Creation, update, team assignment
- **Payments**: Bonus creation, summaries, approval flows

### 🔹 Features

- Isolated feature-based tests
- Full use of Playwright fixtures
- Dynamic test data
- Rich assertions & retries

---

## 🔌 Integrations

### ✅ MailSlurp (Email Testing)

- Auto inbox creation per test
- Email link extraction
- Email verification flow support

### ✅ API Utility Layer

- Programmatic user creation
- Session setup & cookie management
- Fast test data setup and teardown

---

## ⚙️ Configuration & Tooling

- **Framework**: Playwright
- **Language**: TypeScript
- **Linter**: ESLint
- **Formatter**: Prettier
- **Reports**: HTML, JSON, JUnit, CTRF
- **Runner**: Playwright Test
- **Env**: `.env` files with `getEnvVar` helper
- **CI/CD**: GitHub Actions + Docker

---

## 🚀 Getting Started

### 1. 📦 Install Dependencies

```
npm install
```

---

### 2. ⚙️ Configure Environment Variables

Create a `.env` file in the **project root** with the following content:

```
BASE_URL=https://hubstaff.com
APP_BASE_URL=https://app.hubstaff.com
MARKETING_API_BASE=https://api.marketing.hubstaff.com
ACCOUNT_API_BASE=https://account.hubstaff.com
APP_API_BASE=https://app.hubstaff.com
MAILSLURP_API_KEY=your-api-key
TEST_USER_EMAIL=your-test-user-email
TEST_USER_PASSWORD=your-test-user-password
```

#### 🔑 Get Your MailSlurp API Key

- Register for a free account at [mailslurp.com](https://mailslurp.com/)
- After logging in, navigate to [your API Key page](https://app.mailslurp.com/account/api)

#### 👤 Test User Account

- Use any valid Hubstaff account credentials
- Alternatively, create a dedicated test account for automation purposes

---

### ⚠️ Important Note

> The `.env` file is **only required for local or Docker runs**.  
> In **CI/CD**, values are securely managed via **GitHub Actions**:

| Type             | Storage Location | Example Variables                                                    |
| ---------------- | ---------------- | -------------------------------------------------------------------- |
| 🔒 Secrets       | GitHub Secrets   | `MAILSLURP_API_KEY`, `TEST_USER_EMAIL`, `TEST_USER_PASSWORD`         |
| 🌍 Env Variables | GitHub Variables | `BASE_URL`, `APP_BASE_URL`, `MARKETING_API_BASE`, `ACCOUNT_API_BASE` |

---

### 3. 📌 Run Tests Locally

```bash
npm test             # Run all tests using default config (E2E)
npm run test:e2e     # Run only E2E tests
npm run test:unit    # Run unit tests
npm run test:ui      # Launch the Playwright UI test runner
```

---

## 🎁 Bonus: Unit Tests Added

Although not part of the original exercise requirements, this project includes a suite of **Playwright-based unit tests** for utility and helper logic. This demonstrates:

- Testing non-UI logic using Playwright as a test runner
- Structured test separation (`tests/unit/` directory)
- Shared CI config and reporting setup
- Bonus coverage of internal utilities (e.g., `getBaseUrl`, `buildUrl`, `healthcheck`)

Run them locally:

```bash
npm run test:unit
```

They are fully integrated into the GitHub Actions pipeline and produce:

- JSON, JUnit, and HTML reports (`/reports/unit`)
- Auto-issue creation on failure (same as E2E)

> 🧪 Example: See `tests/unit/config/url.test.ts` and `tests/unit/email/emailExtractor.test.ts`

---

## 🧹 Code Quality

```bash
npm run lint         # Lint check
npm run format       # Format with Prettier
```

---

## 📊 Test Reports

After test runs, reports are saved in `reports/e2e/` and `reports/unit/`:

- `index.html`: HTML summary
- `results.json`: JSON for CI parsing
- `results.xml`: JUnit format
- `ctrf.json`: Common Test Results Format (E2E only)

> 📝 **Example**: See a real CTRF report in action from our [CI run](https://github.com/fbrandao/hubstaff-qa-challenge/actions/runs/15342886456) with some tests failing (forced failures)

---

## 🐳 Docker Support

Run tests in a consistent Dockerized environment.

### 🔨 Build Image

```bash
docker build -t hubstaff-qa .
```

### ▶ Run Tests

```bash
# Run all tests (both unit and E2E)
docker run --env-file .env hubstaff-qa

# Run only unit tests
docker run --env-file .env -e TEST_TYPE=unit hubstaff-qa

# Run only E2E tests
docker run --env-file .env -e TEST_TYPE=e2e hubstaff-qa

# Run E2E tests with a specific browser
docker run --env-file .env -e TEST_TYPE=e2e -e BROWSER=Chrome hubstaff-qa
```

### 📦 Volume Mount (optional)

To retain test results:

```bash
docker run --env-file .env -v $(pwd)/reports:/app/reports hubstaff-qa
```

### 🔧 Environment Variables

The following environment variables can be passed to the container:

| Variable    | Description                                                            | Default |
| ----------- | ---------------------------------------------------------------------- | ------- |
| `TEST_TYPE` | Type of tests to run (`unit`, `e2e`, or unset for both)                | unset   |
| `BROWSER`   | Browser to use for E2E tests (`Chrome`, `Firefox`, `Safari`, or `all`) | `all`   |
| `CI`        | Whether running in CI environment                                      | `true`  |

---

## 🔁 CI/CD Integration

Includes GitHub Actions config with:

- ✅ Parallel browser tests (Chrome, Firefox, Safari)
- ✅ Unit test run before E2E
- ✅ Retry logic
- ✅ Report publishing
- ✅ CTRF and GitHub issue reporting

### 🌐 Browser Support

The test suite runs all tests across multiple browsers in CI:

- **Chrome** (Chromium)
- **Firefox**
- **Safari** (WebKit)

---

## 📣 CI Failure Auto-Reporting

This project includes automated failure reporting through GitHub Actions.

### 🔁 How It Works

- Whenever **unit or E2E tests fail** on CI (`main` or pull requests), the workflow:
  1. Downloads the report (CTRF for E2E, JSON for unit)
  2. Extracts failed tests and stack traces
  3. Opens a **GitHub Issue** with:
     - Timestamp of failure
     - Commit link
     - Failed test titles
     - Error messages and stack traces
     - Link to the full workflow run

### 🛠 Setup Details

- The issue is created via [`actions/github-script`](https://github.com/actions/github-script)
- Triggered only when the test job fails
- Output format is based on CTRF and JSON

### 📌 Benefits

- Automatic triage visibility
- Immediate feedback loop
- Centralized error tracking
- Reduced manual investigation time

### 📝 Example

Here's an example of an automatically created issue when tests fail:
[Issue #14 - CI Failed: Playwright E2E Tests](https://github.com/fbrandao/hubstaff-qa-challenge/issues/14)

You can find these issues under the **Issues** tab labeled with:

- `CI Failure`
- `Playwright`

---

## 🎯 Best Practices

- 🧱 Page Object Model for reusability
- 🔒 Isolated, atomic test cases
- 🚦 Custom readiness matchers for stability
- ♻️ Clean state management
- ✨ Clear naming and file structure

---

## 🔮 Future Improvements

### 🛠️ API Layer Enhancements

- Expand API client coverage for all endpoints
- Add more test data factories for common scenarios

### 📱 Mobile Testing

- Support responsive and mobile viewport testing
- Add touch event utilities and mobile assertions

### 🧪 Test Coverage

- Add accessibility and performance tests
- Integrate visual regression testing
- Implement API response schema validation

---

## 📝 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
