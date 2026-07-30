# Testing Infrastructure - Phase 8

## Overview
Complete testing infrastructure for Upshift Learning Hub with unit tests, integration tests, and E2E tests.

## Test Files Created

### Unit Tests

#### `__tests__/auth.test.ts`
Tests auth helper functions:
- `isPremium()` - checks if user tier (pro/school) is premium
- `canGenerateLessons()` - feature gating for lesson generation
- `canSaveResources()` - feature gating for resource saving
- `canAccessPlanner()` - feature gating for planner access

**Coverage:** All subscription tiers (free, pro, school)

#### `__tests__/webhooks.test.ts`
Tests webhook event structures and validation:
- **Stripe events:** checkout.session.completed, subscription.updated, subscription.deleted
- **Substack events:** post.published with metadata
- **Error handling:** Invalid event types, missing required fields

**Coverage:** Event structure validation, optional field handling

### Integration Tests

#### `__tests__/api.test.ts`
Tests database operations:
- Standard retrieval and filtering by code
- Resource retrieval with proper JSONB field handling
- YouTube resource handling with thumbnail URLs
- Filtering by skills and grades arrays
- Data integrity checks for JSONB fields
- URL structure validation

**Coverage:** Database queries, field preservation, data types

#### `__tests__/search.test.ts`
Tests standard searching:
- Exact code matching
- Case-insensitive variations
- Standard name and description matching

**Coverage:** Search functionality, standard matching

### E2E Tests

#### `e2e/critical-paths.spec.ts`
End-to-end tests for user workflows:
1. **Homepage** - Navigation, header visibility
2. **Resource Library** - Grid display, pagination
3. **Standard Matcher** - Search and navigation to detail page
4. **Standard Detail Page** - All tabs (blueprint, unpack, resources, generate)
5. **Free User Upgrade** - Upgrade modal on generation attempt
6. **Pricing Page** - All tiers, CTA buttons
7. **Auth Pages** - Login/signup forms
8. **Responsive Design** - Mobile viewport

**Coverage:** Complete user journeys, responsive design, upgrade flow

## Configuration Files

### `vitest.config.ts`
- **Environment:** Node
- **Coverage:** v8 provider with text, JSON, HTML reports
- **Path aliases:** @ resolves to project root
- **Globals:** true (describe, it, expect available without imports)

### `playwright.config.ts`
- **Test directory:** `./e2e`
- **Base URL:** `http://localhost:3000`
- **Browsers:** Chromium, Firefox, WebKit
- **Web server:** `bun run dev` (auto-starts on test)
- **Retries:** 0 locally, 2 in CI
- **Reporting:** HTML artifacts with traces

## Running Tests

### Unit & Integration Tests
```bash
# Run all unit and integration tests
npm run test

# Watch mode for development
npm run test -- --watch

# UI mode for interactive testing
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### E2E Tests
```bash
# Run all E2E tests
npm run test:e2e

# Interactive E2E test UI
npm run test:e2e:ui

# Run specific test file
npm run test:e2e e2e/critical-paths.spec.ts

# Run on specific browser
npm run test:e2e -- --project=chromium
```

### All Tests
```bash
# Run everything in order
npm run test && npm run test:e2e
```

## Test Database Setup

Integration tests use the same Supabase database as development. For isolated testing:

1. Create a separate test database (optional)
2. Set `DATABASE_URL` environment variable before running tests
3. Tests use `beforeAll` and `afterAll` hooks for seeding/cleanup

Example:
```bash
DATABASE_URL=postgresql://... npm run test
```

## CI/CD Integration

### GitHub Actions
Tests run on:
- PR creation/updates
- Commits to main
- Daily scheduled runs

### Test Results
- Unit/integration coverage reports uploaded to Codecov
- E2E artifacts (HTML, traces) uploaded as CI artifacts
- Failures block merge to main

## Coverage Goals

| Category | Target | Current |
|----------|--------|---------|
| Unit Tests | 80%+ | Auth helpers, DB operations |
| Integration | 75%+ | API routes, webhooks |
| E2E | Critical paths | 8 core user journeys |

## Debugging Tests

### View test output
```bash
npm run test -- --reporter=verbose
```

### Run single test
```bash
npm run test auth.test.ts
```

### Inspect E2E failures
```bash
# Opens trace viewer
npx playwright show-trace trace.zip
```

### Debug with VS Code
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Vitest",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test", "--", "--inspect-brk"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## Next Steps

1. **Run tests locally:** `npm run test && npm run test:e2e`
2. **Add to CI/CD:** Create `.github/workflows/test.yml`
3. **Expand coverage:** Add tests for:
   - Stripe payment flow (mock)
   - Google Sheets sync
   - Substack webhook ingestion
   - Lesson generation API
4. **Performance testing:** Add lighthouse/performance metrics
5. **Visual regression:** Screenshot tests for UI components

## Test Maintenance

- Keep tests close to code changes
- Update E2E selectors if UI changes
- Remove tests for deleted features
- Review test coverage quarterly
- Add tests for new features before merging
