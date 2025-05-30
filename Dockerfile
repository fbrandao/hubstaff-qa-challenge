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

# Create reports directory
RUN mkdir -p reports/e2e

# Run tests based on browser selection
ENTRYPOINT ["/bin/bash", "-c", "if [ \"$BROWSER\" = \"all\" ]; then npx playwright test; else npx playwright test --project=\"E2E - $BROWSER\"; fi"] 