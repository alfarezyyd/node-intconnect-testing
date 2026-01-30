import { test, expect } from '@playwright/test';


test.describe('System Settings Page Tests', () => {
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
    await page.goto(`/system-settings`);
    await page.waitForTimeout(1000);
  });

  test('Menampilkan halaman system settings', async ({ page }) => {
    // Verify page header is visible
    await expect(page.getByText('Digital Twin | PT. Kalbe Morinaga Indonesia')).toBeVisible();
  });

  test('Menampilkan header background image', async ({ page }) => {
    const headerImage = page.locator('.v-img').first();
    await expect(headerImage).toBeVisible();
  });

  test('Menampilkan informasi lokasi', async ({ page }) => {
    await expect(page.getByText(/Jl. Raya Kawasan Industri Indotaisei/)).toBeVisible();
  });

  test('Menampilkan informasi tanggal development', async ({ page }) => {
    await expect(page.getByText(/Development Initiated in/)).toBeVisible();
  });

  test('Menampilkan card Dashboard Settings', async ({ page }) => {
    await expect(page.getByText('Dashboard Settings')).toBeVisible();
    await expect(page.getByText('Centralized control for dashboard configuration and customization.')).toBeVisible();
  });

  test('Menampilkan card Listener Settings', async ({ page }) => {
    await expect(page.getByText('Listener Settings')).toBeVisible();
    await expect(page.getByText('Configure and manage listener parameters for real-time data processing.')).toBeVisible();
  });

  test('Menampilkan tombol Manage di Dashboard Settings', async ({ page }) => {
    const dashboardManageBtn = page.locator('a[href*="dashboard-settings"]').getByText('Manage');
    await expect(dashboardManageBtn).toBeVisible();
  });

  test('Menampilkan tombol Manage di Listener Settings', async ({ page }) => {
    const listenerManageBtn = page.locator('a[href*="listener-settings"]').getByText('Manage');
    await expect(listenerManageBtn).toBeVisible();
  });

  test('Menekan tombol Manage di Dashboard Settings', async ({ page }) => {
    const dashboardManageBtn = page.locator('a[href*="dashboard-settings"]').getByText('Manage');
    await dashboardManageBtn.click();
    await page.waitForTimeout(1000);

    // Verify navigation
  await expect(page).toHaveURL('system-settings/dashboard-settings')
  });

  test('Menekan tombol Manage di Listener Settings', async ({ page }) => {
    const listenerManageBtn = page.locator('a[href*="listener-settings"]').getByText('Manage');
    await listenerManageBtn.click();
    await page.waitForTimeout(1000);

    // Verify navigation
  await expect(page).toHaveURL('system-settings/dashboard-settings')
  });

  test('Menampilkan icon map pin', async ({ page }) => {
    const mapIcon = page.locator('.tabler-map-pin').or(page.locator('[class*="mdi-map-marker"]'));
    await expect(mapIcon.first()).toBeVisible();
  });

  test('Menampilkan icon calendar', async ({ page }) => {
    const calendarIcon = page.locator('.tabler-calendar').or(page.locator('[class*="mdi-calendar"]'));
    await expect(calendarIcon.first()).toBeVisible();
  });

  test('Menampilkan gambar di card Dashboard Settings', async ({ page }) => {
    const dashboardCardImage = page.getByTestId('dashboard-settings-img')
    await expect(dashboardCardImage).toBeVisible();
  });

  test('Menampilkan gambar di card Listener Settings', async ({ page }) => {
    const listenerCardImage = page.getByTestId('listener-settings-img')
    await expect(listenerCardImage).toBeVisible();
  });
});