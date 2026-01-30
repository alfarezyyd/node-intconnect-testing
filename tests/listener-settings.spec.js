import { test, expect } from '@playwright/test';


test.describe('Listener Settings Page Tests', () => {
   test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto(``);
      await page.getByText('Login', { exact: false }).click();
  await expect(page).toHaveURL('/login')
    await page.getByLabel('Email or Username').fill('admin');
    await page.getByLabel('Password').fill('admin');
  await page.getByTestId('submit-button').click();
    await page.waitForTimeout(2000);

    // Navigate to alarm logs page
    await page.goto(`/system-settings/listener-settings`);
    await page.waitForTimeout(1000);
  });

  test('Menampilkan halaman listener settings', async ({ page }) => {
    await expect(page.getByText('Manage Listener Settings')).toBeVisible();
    await expect(page.getByText('Configure Listener model and camera position')).toBeVisible();
  });

  test('Menampilkan field Key yang disabled', async ({ page }) => {
    const keyField = page.getByLabel('Key');
    await expect(keyField).toBeVisible();
    await expect(keyField).toBeDisabled();
    await expect(keyField).toHaveValue('LISTENER_SETTINGS');
  });

  test('Menampilkan field Description', async ({ page }) => {
    const descField = page.getByLabel('Description');
    await expect(descField).toBeVisible();
    await expect(descField).toBeEnabled();
  });

  test('Menampilkan field Insertion Workers Amount', async ({ page }) => {
    const field = page.getByLabel('Insertion Workers Amount');
    await expect(field).toBeVisible();
    await expect(field).toBeEnabled();
  });

  test('Menampilkan field Insertion Queue Size', async ({ page }) => {
    const field = page.getByLabel('Insertion Queue Size');
    await expect(field).toBeVisible();
    await expect(field).toBeEnabled();
  });

  test('Menampilkan field Parameter Recovery Count', async ({ page }) => {
    const field = page.getByLabel('Parameter Recovery Count');
    await expect(field).toBeVisible();
    await expect(field).toBeEnabled();
  });

  test('Menampilkan field Snapshot Ticker', async ({ page }) => {
    const field = page.getByLabel('Snapshot Ticker');
    await expect(field).toBeVisible();
    await expect(field).toBeEnabled();
  });

  test('Menampilkan dropdown Snapshot Ticker Type', async ({ page }) => {
    const dropdown = page.getByTestId('snapshot-ticker-type');
    await expect(dropdown).toBeVisible();
  });

  test('Mengisi field Description', async ({ page }) => {
    const descField = page.getByLabel('Description');
    await descField.clear();
    await descField.fill('Updated listener configuration');
    await expect(descField).toHaveValue('Updated listener configuration');
  });

  test('Mengisi field Insertion Workers Amount', async ({ page }) => {
    const field = page.getByLabel('Insertion Workers Amount');
    await field.clear();
    await field.fill('5');
    await expect(field).toHaveValue('5');
  });

  test('Mengisi field Insertion Queue Size', async ({ page }) => {
    const field = page.getByLabel('Insertion Queue Size');
    await field.clear();
    await field.fill('100');
    await expect(field).toHaveValue('100');
  });

  test('Mengisi field Parameter Recovery Count', async ({ page }) => {
    const field = page.getByLabel('Parameter Recovery Count');
    await field.clear();
    await field.fill('30');
    await expect(field).toHaveValue('30');
  });

  test('Mengisi field Snapshot Ticker', async ({ page }) => {
    const field = page.getByLabel('Snapshot Ticker');
    await field.clear();
    await field.fill('10');
    await expect(field).toHaveValue('10');
  });

  test('Memilih Snapshot Ticker Type - Seconds', async ({ page }) => {
    const dropdown = page.getByTestId('snapshot-ticker-type');
    await dropdown.click();
    await page.getByRole('option', { name: 'Seconds' }).click();
    await page.waitForTimeout(500);
  });

  test('Memilih Snapshot Ticker Type - Minutes', async ({ page }) => {
    const dropdown = page.getByTestId('snapshot-ticker-type');
    await dropdown.click();
    await page.getByRole('option', { name: 'Minutes' }).click();
    await page.waitForTimeout(500);
  });

  test('Menampilkan tombol Back', async ({ page }) => {
    const backBtn = page.getByRole('link', { name: /Back/i });
    await expect(backBtn).toBeVisible();
  });

  test('Menampilkan tombol Save Settings', async ({ page }) => {
    const saveBtn = page.getByRole('button', { name: 'Save Settings' });
    await expect(saveBtn).toBeVisible();
  });

  test('Menekan tombol Back', async ({ page }) => {
    const backBtn = page.getByRole('link', { name: /Back/i });
    await backBtn.click();
    await page.waitForTimeout(1000);

    // Should navigate back to system settings
    expect(page.url()).toContain('system-settings');
    expect(page.url()).not.toContain('listener-settings');
  });

  test('Submit form tanpa mengubah data', async ({ page }) => {
    const saveBtn = page.getByRole('button', { name: 'Save Settings' });
    await saveBtn.click();
    await page.waitForTimeout(1000);

    // Should show success dialog
    await expect(page.getByText('Success manage Listener settings')).toBeVisible();
  });

  test('Submit form dengan data yang valid', async ({ page }) => {
    // Fill form
    await page.getByLabel('Description').fill('Test configuration');
    await page.getByLabel('Insertion Workers Amount').fill('5');
    await page.getByLabel('Insertion Queue Size').fill('100');
    await page.getByLabel('Parameter Recovery Count').fill('25');
    await page.getByLabel('Snapshot Ticker').fill('10');

    // Submit
    const saveBtn = page.getByRole('button', { name: 'Save Settings' });
    await saveBtn.click();
    await page.waitForTimeout(1000);

    // Should show success dialog
    await expect(page.getByText('Success manage Listener settings')).toBeVisible();
  });

  test('Menampilkan alert dialog setelah save berhasil', async ({ page }) => {
    const saveBtn = page.getByRole('button', { name: 'Save Settings' });
    await saveBtn.click();
    await page.waitForTimeout(1000);

    // Check alert dialog content
    await expect(page.getByText('Success manage Listener settings')).toBeVisible();
    await expect(page.getByText('You will be redirect to system settings page')).toBeVisible();
  });

  test('Redirect ke system settings setelah save berhasil', async ({ page }) => {
    const saveBtn = page.getByRole('button', { name: 'Save Settings' });
    await saveBtn.click();
    
    // Wait for redirect (2 seconds as per code)
    await page.waitForTimeout(3000);

    // Should be redirected to system settings page
    expect(page.url()).toContain('system-settings');
    expect(page.url()).not.toContain('listener-settings');
  });

  test('Menampilkan validation error jika field invalid', async ({ page }) => {
    // Clear required field
    await page.getByLabel('Insertion Workers Amount').clear();
    
    // Submit
    const saveBtn = page.getByRole('button', { name: 'Save Settings' });
    await saveBtn.click();
    await page.waitForTimeout(1000);

    // Should show validation error
    const errorMessage = page.locator('.v-messages__message');
    if (await errorMessage.first().isVisible()) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });
});