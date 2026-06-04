describe('Navigation', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  async function login() {
    await element(by.type('TextInput').and(by.traits(['textInput']))).atIndex(0).typeText('test@example.com');
    await element(by.type('TextInput').and(by.traits(['textInput']))).atIndex(1).typeText('password123');
    await element(by.text('Login')).tap();
    await waitFor(element(by.text('Home')))
      .toBeVisible()
      .withTimeout(15000);
  }

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show all bottom tab items after login', async () => {
    await login();

    await expect(element(by.text('Home'))).toBeVisible();
    await expect(element(by.text('Rewards'))).toBeVisible();
    await expect(element(by.text('Orders'))).toBeVisible();
    await expect(element(by.text('Profile'))).toBeVisible();
  });

  it('should navigate to Rewards tab', async () => {
    await login();

    await element(by.text('Rewards')).tap();
    await expect(element(by.text('Rewards'))).toBeVisible();
  });

  it('should navigate to Orders tab', async () => {
    await login();

    await element(by.text('Orders')).tap();
    await expect(element(by.text('Orders'))).toBeVisible();
  });

  it('should navigate to Profile tab', async () => {
    await login();

    await element(by.text('Profile')).tap();
    await expect(element(by.text('Profile'))).toBeVisible();
  });

  it('should navigate back to Home tab', async () => {
    await login();

    await element(by.text('Rewards')).tap();
    await element(by.text('Home')).tap();
    await expect(element(by.text('Home'))).toBeVisible();
  });
});
