# E2E Tests with Detox

End-to-end tests for the Loyalty Platform mobile app using [Detox](https://wix.github.io/Detox/).

## Prerequisites

1. **Detox CLI** (global):
   ```bash
   npm install -g detox-cli
   ```

2. **iOS** (macOS only):
   - Xcode 14+
   - iOS Simulator (iPhone 14 or similar)

3. **Android**:
   - Android Studio
   - Android SDK 30+
   - Emulator AVD named `Pixel_3a_API_30` (or update `.detoxrc.json`)

4. **App dependencies**:
   ```bash
   npm install
   ```

## Mock Server

A mock Express server is provided to simulate API responses during E2E testing.

### Start the mock server:

```bash
npm run detox:mock-server
```

The server runs on `http://localhost:3001` and serves the routes defined in `e2e/mock-server/routes.json`.

### Adding mock routes:

Edit `e2e/mock-server/routes.json` and restart the mock server. Each route entry requires:
- `method`: HTTP method (GET, POST, etc.)
- `response`: JSON response body
- `statusCode`: HTTP status code
- `delay` (optional): Response delay in milliseconds

## Building the App

Tests run against a compiled app binary. Build the app before running tests.

### iOS:

```bash
npm run detox:build:ios
```

### Android:

```bash
npm run detox:build:android
```

## Running Tests

### iOS:

```bash
npm run detox:test:ios
```

### Android:

```bash
npm run detox:test:android
```

### Run a specific test file:

```bash
detox test -c ios.sim.debug e2e/tests/auth.spec.js
```

### Run with mock server:

Start the mock server in a separate terminal, then run tests:

```bash
# Terminal 1
npm run detox:mock-server

# Terminal 2
npm run detox:test:ios
```

## Test Structure

```
e2e/
├── jest.config.js           # Jest configuration for Detox
├── README.md                # This file
├── firstTest.spec.js        # Simple smoke test (no auth required)
├── tests/                   # Test specs directory
│   ├── auth.spec.js         # Authentication flow tests
│   ├── navigation.spec.js   # Bottom tab navigation tests
│   ├── register.spec.js     # Registration flow tests
│   └── wallet.spec.js       # Wallet / points screen tests
└── mock-server/             # Mock API server
    ├── package.json
    ├── mock-server.js       # Express server
    └── routes.json          # Route definitions
```

## Writing New Tests

1. Create a new `.spec.js` file in `e2e/tests/`
2. Follow the Detox [API reference](https://wix.github.io/Detox/docs/api/test-lifecycle)
3. Use `device.launchApp()` or `device.reloadReactNative()` in lifecycle hooks
4. Use `waitFor().toBeVisible().withTimeout()` for async navigation

### Best Practices:

- Reset state with `device.reloadReactNative()` in `beforeEach` when needed
- Use `device.launchApp({ newInstance: true })` for fresh starts
- Prefer text matchers (`by.text()`) over internal testIDs for maintainability
- Keep tests independent — each spec should start from a known state
- Add delays sparingly; prefer `waitFor` with timeouts

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `detox: command not found` | Install globally: `npm install -g detox-cli` |
| Build fails on iOS | Ensure Xcode workspace/scheme names match `.detoxrc.json` |
| Tests time out | Increase `testTimeout` in `jest.config.js` or ensure mock server is running |
| Element not found | Use `waitFor` with `withTimeout()`, or check screen text matches |
| Multiple elements match | Use `.atIndex(n)` or more specific matchers |
| Android emulator not found | Create AVD named `Pixel_3a_API_30` in Android Studio |
| App stuck on splash | Mock server may not be running; start it with `npm run detox:mock-server` |
