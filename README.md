# 🧪 Hubstaff QA Automation Challenge

[![CI](https://github.com/fbrandao/hubstaff-qa-challenge/actions/workflows/playwright.yml/badge.svg)](https://github.com/fbrandao/hubstaff-qa-challenge/actions/workflows/playwright.yml)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)
[![Made with Playwright](https://img.shields.io/badge/tested%20with-Playwright-45ba63.svg?logo=playwright)](https://playwright.dev/)

A modern end-to-end (E2E) test automation framework built with **Playwright + TypeScript**, using the **Page Object Model (POM)** design pattern to validate Hubstaff’s core flows with scalability, reliability, and maintainability in mind.

---

## 📁 Project Structure

```
├── tests/e2e/               # E2E test specifications
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

Example usage:

```ts
class SignInForm extends BaseComponent {
  async login(email: string, password: string) {
    await this.fillInput('email-input', email);
    await this.fillInput('password-input', password);
    await this.clickButton('submit-button');
  }
}

class BasePage {
  signInForm = new SignInForm(this.page, this.page.locator('form'));
  async login(email: string, password: string) {
    await this.signInForm.login(email, password);
  }
}
```

### ✅ Readiness System

Ensures components are ready before interaction:

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

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup `.env` File

Create a `.env` in the root with:

```
BASE_URL=https://hubstaff.com
APP_BASE_URL=https://app.hubstaff.com
MARKETING_API_BASE=https://api.marketing.hubstaff.com
ACCOUNT_API_BASE=https://account.hubstaff.com
APP_API_BASE=https://app.hubstaff.com
MAILSLURP_API_KEY=your-api-key
```

> 🔑 Register and retrieve your API key from [MailSlurp](https://mailslurp.com)

### 3. Run Tests

```bash
npm test            # Run all tests
npm run test:ui     # Interactive UI mode
npm run codegen     # Open codegen tool
```

---

## 🧹 Code Quality

```bash
npm run lint         # Lint check
npm run format       # Format with Prettier
```

---

## 📊 Test Reports

After test runs, reports are saved in `reports/e2e/`:

- `index.html`: HTML summary
- `results.json`: JSON for CI parsing
- `results.xml`: JUnit format
- `ctrf.json`: Common Test Results Format

---

## 🐳 Docker Support

Run tests in a consistent Dockerized environment.

### 🔨 Build Image

```bash
docker build -t hubstaff-qa .
```

### ▶ Run Tests

```bash
docker run --env-file .env hubstaff-qa
```

### 📦 Volume Mount (optional)

To retain test results:

```bash
docker run --env-file .env -v $(pwd)/reports:/app/reports hubstaff-qa
```

### 🔁 Run with a Specific Browser

```bash
docker run --env-file .env -e BROWSER=Chrome hubstaff-qa
```

---

## 🔁 CI/CD Integration

Includes GitHub Actions config with:

- ✅ Parallel browser tests
- ✅ Retry logic
- ✅ Report publishing
- ✅ CTRF and GitHub issue reporting

---

## 🎯 Best Practices

- 🧱 Page Object Model for reusability
- 🔒 Isolated, atomic test cases
- 🚦 Custom readiness matchers for stability
- ♻️ Clean state management
- ✨ Clear naming and file structure

---

## 📝 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
