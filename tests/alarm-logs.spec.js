import { test, expect } from '@playwright/test';


test.describe('Alarm Logs Page Tests', () => {
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
    await page.goto(`/alarm-logs`);
    await page.waitForTimeout(1000);
  });

  test('Menampilkan halaman alarm logs', async ({ page }) => {
    // Verify page title
    await expect(page.getByText('All Alarm Logs')).toBeVisible();
    await expect(page.getByText('Review and view alarm logs in system')).toBeVisible();
  });

  test('Menampilkan data table alarm logs', async ({ page }) => {
    // Verify table is visible
    const table = page.locator('.v-data-table');
    await expect(table).toBeVisible();
  });

  test('Mengubah items per page', async ({ page }) => {
    const itemsPerPageSelect = page.locator('.v-select').first();
    await itemsPerPageSelect.click();
    
    // Select different option (e.g., 25)
    await page.getByRole('option', { name: '25' }).click();
    await page.waitForTimeout(1000);
  });

  test('Mencari data dengan search', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search something...');
    await searchInput.fill('machine');
    await page.waitForTimeout(1000);
  });

  test('Menghapus search query', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search something...');
    await searchInput.fill('test');
    await page.waitForTimeout(500);
    
    // Click clear button
    const clearButton = page.locator('.v-field__clearable i');
    await clearButton.click();
    await page.waitForTimeout(500);
  });

  test('Expand row untuk melihat note', async ({ page }) => {
    // Click first row to expand
    const firstRow = page.locator('tbody tr').first();
    await firstRow.click();
    await page.waitForTimeout(500);

    // Verify note section is visible
    await expect(page.getByText('Note', { exact: true })).toBeVisible();
  });

  test('Menekan tombol Acknowledged', async ({ page }) => {
    // Find and click acknowledged button (green check icon)
    const acknowledgedButton =page.getByTestId('resolve-button').first();
    
    if (await acknowledgedButton.isVisible()) {
      await acknowledgedButton.click();
      await page.waitForTimeout(500);

      // Verify dialog is shown
      await expect(  page.getByRole('heading', { name: 'Acknowledged Issue' })).toBeVisible();
    }
  });

  test('Membuka dialog acknowledged', async ({ page }) => {
    const acknowledgedButton = page.getByTestId('resolve-button').first();
    
      await acknowledgedButton.click();
      await page.waitForTimeout(500);

      // Verify dialog elements
      await expect(  page.getByRole('heading', { name: 'Acknowledged Issue' })).toBeVisible();
      await expect(page.getByText('Please provide a note before acknowledged issue')).toBeVisible();
      await expect(page.getByLabel('Note')).toBeVisible();
  });

  test('Menutup dialog acknowledged dengan tombol cancel', async ({ page }) => {
    const acknowledgedButton =page.getByTestId('resolve-button').first();
    
      await acknowledgedButton.click();
      await page.waitForTimeout(500);

      // Click cancel button
      await page.getByRole('button', { name: 'Cancel' }).click();
      await page.waitForTimeout(500);

      // Dialog should be closed
      await expect(  page.getByRole('heading', { name: 'Acknowledged Issue' })).not.toBeVisible();
  });

  test('Menutup dialog acknowledged dengan tombol close', async ({ page }) => {
    const acknowledgedButton =page.getByTestId('resolve-button').first();
    
      await acknowledgedButton.click();
      await page.waitForTimeout(500);

      // Click close button (X)
      const closeButton = page.getByTestId('cancel-dialog-confirmation')
      await closeButton.click();
      await page.waitForTimeout(500);

      // Dialog should be closed
      await expect(  page.getByRole('heading', { name: 'Acknowledged Issue' })).not.toBeVisible();
  });

  test('Submit acknowledged tanpa mengisi note', async ({ page }) => {
    const acknowledgedButton =page.getByTestId('resolve-button').first();
    
      await acknowledgedButton.click();
      await page.waitForTimeout(500);

      // Click submit without filling note
      await page.getByRole('button', { name: 'Submit' }).click();
      await page.waitForTimeout(500);
      await page.pause()

      // Should show validation error
      const errorMessage = page.locator('.v-messages__message');
      await expect(errorMessage).toHaveText('Note is a required field')
      await expect(errorMessage.first()).toBeVisible();
  });

  test('Submit acknowledged dengan note yang valid', async ({ page }) => {
    const acknowledgedButton =page.getByTestId('resolve-button').first();
    
      await acknowledgedButton.click();
      await page.waitForTimeout(500);

      // Fill note
      await page.getByLabel('Note').fill('Issue has been resolved and tested');
      
      // Click submit
      await page.getByRole('button', { name: 'Submit' }).click();
      await page.waitForTimeout(1000);

      // Dialog should be closed after success
      await expect(  page.getByRole('heading', { name: 'Acknowledged Issue' })).not.toBeVisible();
  });

  test('Navigasi pagination ke halaman berikutnya', async ({ page }) => {
    // Click next page button
    const nextButton =   page.locator('.v-pagination__next')
    
    
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('Navigasi pagination ke halaman sebelumnya', async ({ page }) => {
    // Go to next page first
    const nextButton =   page.locator('.v-pagination__next')
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForTimeout(1000);
    }

        const prevButton =   page.locator('.v-pagination__prev')

    
    if (await prevButton.isEnabled()) {
      await prevButton.click();
      await page.waitForTimeout(1000);
    }
  });
});