import { test, expect } from '@playwright/test';
import { exec } from 'node:child_process';
import { execPath } from 'node:process';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Pengujian Prekondisi Halaman Login', () => {

test('Menekan tombol Login', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Login', { exact: false }).click();
  await expect(page).toHaveURL('/login')
  });
})

test.describe('Pengujian Halaman Login', () => {
 test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByText('Login', { exact: false }).click();
  await expect(page).toHaveURL('/login')
});
  
  test('Menekan tombol login dengan semua field kosong', async ({ page }) => {
     await page.getByTestId('submit-button').click();

    await expect(page.getByTestId('user-identifier-error')).toHaveText('User Identifier is a required field')
    await expect(page.getByTestId('password-error')).toHaveText('Password is a required field')
  });

  test('Mengosongkan field "Username or Email"', async ({ page }) => {
    const emailInput = page.getByLabel('Email or Username');
    const passwordInput = page.getByLabel('Password');
    passwordInput.fill('password123')
    // Fill then clear
    await emailInput.fill('testuser@email.com');
    await emailInput.clear();
     await page.getByTestId('submit-button').click();



    await expect(page.getByTestId('user-identifier-error')).toHaveText('User Identifier is a required field')
    await expect(emailInput).toHaveValue('');
  });

  test('Mengosongkan field "Password"', async ({ page }) => {
    const emailInput = page.getByLabel('Email or Username');
    const passwordInput = page.getByLabel('Password');

    await emailInput.fill('testuser@email.com');
    
    // Fill then clear
    await passwordInput.fill('password123');
    await passwordInput.clear();
    await expect(passwordInput).toHaveValue('');


        await page.getByTestId('submit-button').click();

    await expect(page.getByTestId('password-error')).toHaveText('Password is a required field')
  });

  test('Menekan tombol unhide pada field "Password"', async ({ page }) => {
    const passwordInput = page.getByLabel('Password');
    
    const toggleButton = page.locator('.v-field__append-inner i').first();

    // Password should be hidden by default
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click unhide button
    await toggleButton.click();
    
    // Password should now be visible
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('Menekan tombol hide pada field "Password"', async ({ page }) => {
    const passwordInput = page.getByLabel('Password');
    const toggleButton = page.locator('.v-field__append-inner i').first();

    // Click to show password first
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click hide button
    await toggleButton.click();
    
    // Password should be hidden again
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('Mengisi form login dengan kredensial yang tidak valid', async ({ page }) => {
    const emailInput = page.getByLabel('Email or Username');
    const passwordInput = page.getByLabel('Password');
    

    // Fill with invalid credentials
    await emailInput.fill('invaliduser@email.com');
    await passwordInput.fill('WrongPassword123');
  
      await page.getByTestId('submit-button').click();


    await page.waitForTimeout(1000);

    // Check for error alert
    const errorAlert = page.locator('.v-alert .v-alert__content');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toHaveText('User credentials invalid')
  });

  test('Mengisi form login dengan kredensial yang valid', async ({ page }) => {
    const emailInput = page.getByLabel('Email or Username');
    const passwordInput = page.getByLabel('Password');
    

    // Fill with valid credentials
    await emailInput.fill('admin');
    await passwordInput.fill('admin');
    await   await page.getByTestId('submit-button').click();

    
    // Verify redirected away from login page
await expect(page).not.toHaveURL(/\/login/);
  });

  test('Menekan tombol profile', async ({ page }) => {
    // First, login with valid credentials
    const emailInput = page.getByLabel('Email or Username');
    const passwordInput = page.getByLabel('Password');
    

    await emailInput.fill('admin');
    await passwordInput.fill('admin');
      await page.getByTestId('submit-button').click();

    // Verify redirected away from login page
await expect(page).not.toHaveURL(/\/login/);

    // Click profile button
    const profileButton = page.locator('[data-testid="profile-button"]').or(
      page.getByRole('button', { name: /profile/i })
    );
    
    await profileButton.click();
    await page.waitForTimeout(500);
  });
});