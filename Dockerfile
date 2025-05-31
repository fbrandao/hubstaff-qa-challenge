FROM mcr.microsoft.com/playwright:v1.52.0-jammy

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Set environment variables
ENV CI=true
ENV BROWSER=all

# Create reports directories for both unit and E2E tests
RUN mkdir -p reports/e2e reports/unit

# Create a shell script to run tests
RUN echo '#!/bin/bash\n\
if [ "$TEST_TYPE" = "unit" ]; then\n\
  npx playwright test --project="Unit Tests"\n\
elif [ "$TEST_TYPE" = "e2e" ]; then\n\
  if [ "$BROWSER" = "all" ]; then\n\
    npx playwright test --project="E2E Tests"\n\
  else\n\
    npx playwright test --project="E2E - $BROWSER"\n\
  fi\n\
else\n\
  # Run both unit and E2E tests\n\
  npx playwright test --project="Unit Tests" && npx playwright test --project="E2E Tests"\n\
fi' > /app/run-tests.sh && chmod +x /app/run-tests.sh

# Set the entrypoint to our shell script
ENTRYPOINT ["/app/run-tests.sh"] 