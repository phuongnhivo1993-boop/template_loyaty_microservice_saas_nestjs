describe('Registration Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should navigate to the registration screen', async () => {
    await element(by.text("Don't have an account? Register")).tap();

    await expect(element(by.text('Create Account'))).toBeVisible();
    await expect(element(by.text('Join our loyalty program'))).toBeVisible();
  });

  it('should show all registration form fields', async () => {
    await element(by.text("Don't have an account? Register")).tap();

    await expect(element(by.text('Full Name *'))).toBeVisible();
    await expect(element(by.text('Email *'))).toBeVisible();
    await expect(element(by.text('Phone'))).toBeVisible();
    await expect(element(by.text('Tenant Domain *'))).toBeVisible();
  });

  it('should show error when submitting empty registration form', async () => {
    await element(by.text("Don't have an account? Register")).tap();

    await element(by.text('Register')).atIndex(0).tap();
    await expect(element(by.text('Please fill in all required fields'))).toBeVisible();
  });

  it('should fill in registration form fields', async () => {
    await element(by.text("Don't have an account? Register")).tap();

    await element(by.text('Full Name *')).typeText('John Doe');
    await element(by.text('Email *')).typeText('john@example.com');
    await element(by.text('Phone')).typeText('+84123456789');
    await element(by.text('Tenant Domain *')).typeText('sunshine.loyalty.vn');
  });

  it('should navigate back to login from registration', async () => {
    await element(by.text("Don't have an account? Register")).tap();

    await element(by.text('Already have an account? Login')).tap();
    await expect(element(by.text('Loyalty Platform'))).toBeVisible();
  });
});
