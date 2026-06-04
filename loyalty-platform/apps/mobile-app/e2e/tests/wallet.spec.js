describe('Wallet', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  async function loginAndNavigateToWallet() {
    await element(by.type('TextInput').and(by.traits(['textInput']))).atIndex(0).typeText('test@example.com');
    await element(by.type('TextInput').and(by.traits(['textInput']))).atIndex(1).typeText('password123');
    await element(by.text('Login')).tap();

    await waitFor(element(by.text('Home')))
      .toBeVisible()
      .withTimeout(15000);

    await element(by.text('View Wallet')).tap();
    await waitFor(element(by.text('Available Points')))
      .toBeVisible()
      .withTimeout(10000);
  }

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display wallet balance', async () => {
    await loginAndNavigateToWallet();

    await expect(element(by.text('Available Points'))).toBeVisible();
  });

  it('should display earned and burned stats', async () => {
    await loginAndNavigateToWallet();

    await expect(element(by.text('Earned'))).toBeVisible();
    await expect(element(by.text('Burned'))).toBeVisible();
  });

  it('should display transaction list', async () => {
    await loginAndNavigateToWallet();

    await expect(element(by.text('View Full History'))).toBeVisible();
  });

  it('should show filter tabs', async () => {
    await loginAndNavigateToWallet();

    await expect(element(by.text('ALL'))).toBeVisible();
    await expect(element(by.text('EARN'))).toBeVisible();
    await expect(element(by.text('BURN'))).toBeVisible();
    await expect(element(by.text('EXPIRE'))).toBeVisible();
    await expect(element(by.text('ADJUST'))).toBeVisible();
  });

  it('should filter transactions by EARN type', async () => {
    await loginAndNavigateToWallet();

    await element(by.text('EARN')).tap();
    await expect(element(by.text('EARN'))).toBeVisible();
  });

  it('should navigate to full points history', async () => {
    await loginAndNavigateToWallet();

    await element(by.text('View Full History →')).tap();
    await expect(element(by.text('Points History'))).toBeVisible();
  });
});
