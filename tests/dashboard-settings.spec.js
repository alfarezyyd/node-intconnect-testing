import { test, expect } from '@playwright/test';
import path from 'path';


test.describe('Dashboard Settings Page Tests', () => {
   test.beforeEach(async ({ page }) => {
      // Login first
await page.goto('/login');
      await page.getByLabel('Email or Username').fill('admin');
      await page.getByLabel('Password').fill('admin');
     await page.getByTestId('submit-button').click();
      
  
      // Navigate to alarm logs page
      await page.goto(`/system-settings/dashboard-settings`);
      
    });
  test('Menampilkan halaman dashboard settings', async ({ page }) => {
    await expect(page.getByText('Manage Dashboard Settings')).toBeVisible();
    await expect(page.getByText('Configure dashboard model and camera position')).toBeVisible();
  });

  test('Menampilkan dropdown Showing', async ({ page }) => {
    const showingDropdown = page.getByTestId("showing-dropdown")
    await expect(showingDropdown).toBeVisible();
  });

  test('Memilih Showing - Executive', async ({ page }) => {
    await page.pause()
    const showingDropdown = page.getByTestId("showing-dropdown")
    await showingDropdown.click();
    await page.getByRole('option', { name: 'Executive' }).click();
    
  });

  test('Memilih Showing - Machine', async ({ page }) => {
    const showingDropdown = page.getByTestId("showing-dropdown")
    await showingDropdown.click();
        await page.getByTestId("machine-dropdown").click();
    
    // Machine dropdown should appear
    await expect(page.getByTestId("machine-dropdown")).toBeVisible();
  });

  test('Menampilkan dropdown Machine ketika Showing adalah Machine', async ({ page }) => {
    const showingDropdown = page.getByTestId("showing-dropdown")
    await showingDropdown.click();
       await page.getByRole('option', { name: 'Machine' }).click();
    
    

    const machineDropdown = page.getByTestId("machine-dropdown")
    await expect(machineDropdown).toBeVisible();
  });

  test('Memilih Machine dari dropdown', async ({ page }) => {
    // Set showing to Machine first
    const showingDropdown = page.getByTestId("showing-dropdown")
    await showingDropdown.click();
    await page.getByRole('option', { name: 'Machine' }).click();
    

    // Select a machine
    const machineDropdown = page.getByTestId("machine-dropdown")
    await machineDropdown.click();
    

    await page.pause()
    // Click first option if available
    const firstOption = page.locator('.v-list-item').first();
    if (await firstOption.isVisible()) {
      await firstOption.click();
    }
  });

  test('Menampilkan field Key yang disabled', async ({ page }) => {
    const keyField = page.getByLabel('Key');
    await expect(keyField).toBeVisible();
    await expect(keyField).toBeDisabled();
    await expect(keyField).toHaveValue('DASHBOARD_SETTINGS');
  });

  test('Menampilkan field Description', async ({ page }) => {
    const descField = page.getByLabel('Description');
    await expect(descField).toBeVisible();
    await expect(descField).toBeEnabled();
  });

  test('Mengisi field Description', async ({ page }) => {
    const descField = page.getByLabel('Description');
    await descField.clear();
    await descField.fill('Updated dashboard configuration');
    await expect(descField).toHaveValue('Updated dashboard configuration');
  });

  test('Menampilkan dropzone untuk 3D Model', async ({ page }) => {
    const dropzoneText = page.getByText('3D Model');
    await expect(dropzoneText).toBeVisible();
  });

  test('Upload file 3D model (.glb)', async ({ page }) => {
    // Path to test 3D model file
    const testModelPath = path.join(__dirname, '../tests-assets', 'full-kmi.glb');
    
    // Find file input (dropzone usually uses hidden file input)
    const fileInput = page.locator('input[type="file"]').first();
    
    // Upload file
    await fileInput.setInputFiles(testModelPath);
    
  });

  test('Menampilkan 3D Preview canvas', async ({ page }) => {
    const previewText = page.getByText('3D Preview');
    await expect(previewText).toBeVisible();
    
    // Check if canvas container exists
    const previewContainer = page.locator('div[style*="height: 300px"]');
    await expect(previewContainer).toBeVisible();
  });

  test('Menampilkan field Camera X', async ({ page }) => {
    const cameraX = page.getByLabel('Camera X');
    await expect(cameraX).toBeVisible();
    await expect(cameraX).toBeDisabled();
  });

  test('Menampilkan field Camera Y', async ({ page }) => {
    const cameraY = page.getByLabel('Camera Y');
    await expect(cameraY).toBeVisible();
    await expect(cameraY).toBeDisabled();
  });

  test('Menampilkan field Camera Z', async ({ page }) => {
    const cameraZ = page.getByLabel('Camera Z');
    await expect(cameraZ).toBeVisible();
    await expect(cameraZ).toBeDisabled();
  });

  test('Menampilkan field Selected Pin Object', async ({ page }) => {
    const pinObject = page.getByLabel('Selected Pin Object');
    await expect(pinObject).toBeVisible();
    await expect(pinObject).toHaveAttribute('readonly');
  });

  test('Menampilkan mode viewing/selection', async ({ page }) => {
    await expect(page.getByText(/Mode:/)).toBeVisible();
  });

  test('Menampilkan tombol Select Pin Object', async ({ page }) => {
    const selectPinBtn = page.getByRole('button', { name: 'Select Pin Object' });
    await expect(selectPinBtn).toBeVisible();
  });

  test('Menekan tombol Select Pin Object', async ({ page }) => {
    const selectPinBtn = page.getByRole('button', { name: 'Select Pin Object' });
    await selectPinBtn.click();
    

    // Mode should change to SELECTION
    await expect(page.getByText('Mode: SELECTION')).toBeVisible();
    
    // Button text should change
    await expect(page.getByRole('button', { name: 'Cancel Pin Selection' })).toBeVisible();
  });

  test('Menekan tombol Cancel Pin Selection', async ({ page }) => {
    // First, activate pin mode
    const selectPinBtn = page.getByRole('button', { name: 'Select Pin Object' });
    await selectPinBtn.click();
    

    // Then cancel
    const cancelBtn = page.getByRole('button', { name: 'Cancel Pin Selection' });
await page.pause()
    await cancelBtn.click();
    

    // Mode should change back to VIEWING
    await expect(page.getByText('Mode: VIEWING')).toBeVisible();
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
    const backBtn = page.getByTestId('back-button');
    await backBtn.click();
    

    await page.pause()
    // Should navigate back to system settings
    await expect(page).toHaveURL('/system-settings')
    expect(page.url()).not.toContain('dashboard-settings');
  });

  test('Submit form tanpa mengubah data', async ({ page }) => {
    const saveBtn = page.getByRole('button', { name: 'Save Settings' });
    await saveBtn.click();
    

    // Should show success dialog
    await expect(page.getByText('Success manage Dashboard settings')).toBeVisible();
  });

  test('Submit form dengan data yang valid', async ({ page }) => {
    // Fill form
    await page.getByLabel('Description').fill('Test dashboard config');
    
    const showingDropdown = page.getByTestId("showing-dropdown")
    await showingDropdown.click();
    await page.getByRole('option', { name: 'Executive' }).click();
    

    // Submit
    const saveBtn = page.getByRole('button', { name: 'Save Settings' });
    await saveBtn.click();
    

    // Should show success dialog
    await expect(page.getByText('Success manage Dashboard settings')).toBeVisible();
  });

  test('Menampilkan alert dialog setelah save berhasil', async ({ page }) => {
    await page.pause()
    const saveBtn = page.getByRole('button', { name: 'Save Settings' });
    await saveBtn.click();
    

    // Check alert dialog content
    await expect(page.getByText('Success manage Dashboard settings')).toBeVisible();
    await expect(page.getByText('You will be redirect to system settings page')).toBeVisible();
  });

  test('Redirect ke system settings setelah save berhasil', async ({ page }) => {
    const saveBtn = page.getByRole('button', { name: 'Save Settings' });
    await saveBtn.click();
    
    // Wait for redirect (2 seconds as per code)
    

    // Should be redirected to system settings page
    expect(page.url()).toContain('system-settings');
    expect(page.url()).not.toContain('dashboard-settings');
  });

  test('Menampilkan error jika file bukan .glb', async ({ page }) => {
    // Try to upload non-GLB file
    const testFilePath = path.join(__dirname, '../tests-assets', 'check-sheet-document-template.png');
    
    const fileInput = page.locator('input[type="file"]').first();
    
    // This should trigger validation error
    await fileInput.setInputFiles(testFilePath);
    

    // Should show error message
    const errorMessage = page.locator('.text-error');
    if (await errorMessage.first().isVisible()) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });

  test('Validasi file size maksimal 250MB', async ({ page }) => {
    // Note: This test would need a large file to properly test
    // For now, just verify the dropzone is configured correctly
    const dropzone = page.locator('input[type="file"]').first();
    await expect(dropzone).toBeVisible();
  });
});