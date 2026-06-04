describe('Smoke Test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should launch the app and show the login screen', async () => {
    await expect(element(by.text('Loyalty Platform'))).toBeVisible();
    await expect(element(by.text('Member App'))).toBeVisible();
  });

  it('should show email and password inputs', async () => {
    await expect(element(by.text('Email'))).toBeVisible();
    await expect(element(by.text('Password'))).toBeVisible();
  });

  it('should show the Login button', async () => {
    await expect(element(by.text('Login'))).toBeVisible();
  });

  it('should show the Forgot Password link', async () => {
    await expect(element(by.text('Forgot Password?'))).toBeVisible();
  });

  it('should show the Register link', async () => {
    await expect(element(by.text("Don't have an account? Register"))).toBeVisible();
  });
});
