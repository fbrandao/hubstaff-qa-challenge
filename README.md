# Hubstaff QA Automation Challenge

This project is an end-to-end (E2E) test automation framework built with Playwright for testing the Hubstaff application. The framework follows the Page Object Model (POM) pattern and implements best practices for test automation.

## 🏗️ Architecture

### Project Structure
```
├── tests/
│   └── e2e/                 # E2E test specifications
├── pages/                   # Page Object Models
│   ├── base/               # Base page classes
│   ├── common/             # Shared components
│   ├── landing/            # Landing page
│   ├── signin/             # Sign in page
│   ├── signup/             # Sign up page
│   └── ...                 # Other page objects
├── fixtures/               # Test fixtures and test data
├── utils/                  # Utility functions and helpers
├── storage/               # Storage state management
└── reports/               # Test execution reports
```

### Key Components

1. **Page Object Model (POM)**
   - Each page is represented by a class that encapsulates its elements and actions
   - Base page class provides common functionality
   - Components are modularized for reusability

   Base page and component strategy:
   ```typescript
   // Base component with common functionality
   class BaseComponent {
     constructor(protected page: Page, protected root: Locator) {}
     
     // Common form actions
     protected async fillInput(testId: string, value: string) {
       await this.page.getByTestId(testId).fill(value);
     }
     
     protected async clickButton(testId: string) {
       await this.page.getByTestId(testId).click();
     }
   }

   // Reusable form component
   class SignInForm extends BaseComponent {
     private readonly emailInput = this.page.getByTestId('email-input');
     private readonly passwordInput = this.page.getByTestId('password-input');
     private readonly submitButton = this.page.getByTestId('submit-button');

     async login(email: string, password: string) {
       await this.fillInput('email-input', email);
       await this.fillInput('password-input', password);
       await this.clickButton('submit-button');
     }
   }

   // Base page with component support
   class BasePage {
     constructor(protected page: Page) {}
     signInForm = new SignInForm(this.page, this.page.locator('form'));
     
     async login(email: string, password: string) {
       await this.signInForm.login(email, password);
     }
   }
   ```

   - Extensive page readiness verification system
     - Custom `toBeReady()` matcher for comprehensive page state validation
     - Checks for critical elements, loading states, and error conditions
     - Ensures stable test execution by waiting for proper page initialization

   Custom matcher with readiness checks:
   ```typescript
   // Custom matcher that uses readiness checks
   expect.extend({
     async toBeReady(received: BasePage | BaseComponent) {
       try {
         await received.waitUntilReady();
         return {
           pass: true,
           message: () => 'Expected page/component not to be ready, but it was.',
         };
       } catch (error) {
         return {
           pass: false,
           message: () => `Readiness check failed: ${error.message}`,
         };
       }
     },
   });

   // Usage in tests
   await expect(someCustomPage).toBeReady();
   ```

2. **Test Structure**
   - Tests are organized by feature/functionality
   - Each test file focuses on a specific area (auth, projects, payments)
   - Uses Playwright's test fixtures for dependency injection
   - Custom fixtures for:
     - Test user management
     - API client initialization
     - Page object instantiation
     - Email client setup
     - Storage state handling

3. **Configuration**
   - Environment-specific configurations
   - CI/CD pipeline integration
   - Cross-browser testing support

## 🧪 Testing Strategy

### Test Categories
1. **Authentication Tests**
   - User registration
   - Email confirmation
   - Login functionality
   - Session management

2. **Project Management Tests**
   - Project creation
   - Project settings
   - Team management

3. **Financial Tests**
   - Payment processing
   - Team payments
   - Financial reporting

### Test Implementation
- Uses Playwright's built-in test runner
- Implements step-by-step test scenarios
- Includes proper assertions and validations
- Handles asynchronous operations
- Manages test data and state

### Advanced Features

1. **Email Testing with MailSlurp**
   - Integration with MailSlurp for email testing
   - Dynamic email inbox creation for each test
   - Email content verification and link extraction
   - Automatic email cleanup after tests
   - Support for email confirmation flows

2. **API Integration**
   - Direct API calls for test data setup
   - User account creation via API
   - Session management and authentication
   - Test data cleanup
   - API-based state verification

3. **Custom Matchers**
   - Extended Playwright's expect functionality
   - Custom matchers for common assertions
   - Enhanced error messages
   - Type-safe matcher definitions
   - Reusable across test suite

4. **Page Readiness System**
   - Comprehensive page state verification
   - Checks for:
     - Critical UI elements
     - Loading states
     - Error conditions
     - Network requests
     - DOM stability
   - Configurable timeout and retry mechanisms
   - Automatic screenshot capture on failure

## 🛠️ Technical Stack

- **Framework**: Playwright
- **Language**: TypeScript
- **Package Manager**: npm
- **Testing**: Playwright Test Runner
- **Code Quality**: ESLint, Prettier
- **Reporting**: HTML, JSON, JUnit reports
- **Email Testing**: MailSlurp
- **API Testing**: Axios with cookie support

## 🚀 Getting Started

1. **Installation**
   ```bash
   npm install
   ```

2. **Running Tests**
   ```bash
   # Run all tests
   npm test

   # Run tests with UI
   npm run test:ui

   # Generate test code
   npm run codegen
   ```

3. **Code Quality**
   ```bash
   # Lint code
   npm run lint

   # Format code
   npm run format
   ```

## 📊 Reporting

The framework generates multiple report formats:
- HTML reports for detailed test results
- JSON reports for CI integration
- JUnit reports for test results
- CTRF (Common Test Results Format) for standardized reporting

## 🔄 CI/CD Integration

The framework is configured for CI environments with:
- Parallel test execution
- Retry mechanisms for flaky tests
- Environment-specific configurations
- GitHub Actions integration

## 🎯 Best Practices

1. **Code Organization**
   - Clear separation of concerns
   - Modular and reusable components
   - Consistent naming conventions

2. **Test Design**
   - Independent test cases
   - Proper test isolation
   - Meaningful test descriptions
   - Step-by-step test structure

3. **Maintenance**
   - Regular dependency updates
   - Code quality checks
   - Documentation updates

## 📝 License

This project is licensed under the ISC License.

## 🐳 Docker Support

The project includes Docker support for running tests in a containerized environment. This ensures consistent test execution across different environments.

### Building the Docker Image

```bash
docker build -t hubstaff-qa .
```

### Running Tests in Docker

1. **Run all tests in all browsers**
   ```bash
   docker run hubstaff-qa
   ```

2. **Run tests in specific browser**
   ```bash
   docker run -e BROWSER=Chrome hubstaff-qa
   ```

### Environment Variables

- `BROWSER`: Browser to run tests in
  - `all` (default): Run in all configured browsers
  - `Chrome`: Run only in Chrome

### Volume Mounting

To persist test results and reports:

```bash
docker run -v $(pwd)/reports:/app/reports hubstaff-qa
```
