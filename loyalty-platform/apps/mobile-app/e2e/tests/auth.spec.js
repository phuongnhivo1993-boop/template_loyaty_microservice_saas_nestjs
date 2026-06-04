describe('Auth Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should login with valid credentials and see the home screen', async () => {
    await element(by.text('Login')).tap();

    await expect(element(by.text('Email'))).toBeVisible();

    await element(by.type('TextInput').and(by.traits(['textInput']))).atIndex(0).typeText('test@example.com');
    await element(by.type('TextInput').and(by.traits(['textInput']))).atIndex(1).typeText('password123');

    await element(by.text('Login')).tap();

    await waitFor(element(by.text('Home')))
      .toBeVisible()
      .withTimeout(15000);

    await expect(element(by.text('Home'))).toBeVisible();
  });

  it('should show error on empty credentials', async () => {
    await element(by.text('Login')).tap();

    await expect(element(by.text('Please enter email and password'))).toBeVisible();
  });

  it('should navigate to Forgot Password screen', async () => {
    await element(by.text('Forgot Password?')).atIndex(0).tap();

    await expect(element(by.text('Forgot Password'))).toBeVisible();
  });

  it('should navigate back to login from Forgot Password', async () => {
    await element(by.text('Forgot Password?')).atIndex(0).tap();

    await element(by.text('Loyalty Platform')).tap();

    await expect(element(by.text('Login'))).toBeVisible();
  });
});
