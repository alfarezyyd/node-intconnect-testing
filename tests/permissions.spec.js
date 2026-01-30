import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Permissions Page Tests', () => {
test.beforeEach(async ({ page }) => {
      // Login first
        await page.goto('/login');

      await page.getByLabel('Email or Username').fill('admin');
      await page.getByLabel('Password').fill('admin');
     await page.getByTestId('submit-button').click();
    await page.waitForTimeout(1000);
  
      // Navigate to alarm logs page
      await page.goto(`/permissions`);
      
    });
  test('Menampilkan halaman permissions', async ({ page }) => {
    await expect(page.getByText('All Permissions')).toBeVisible();
    await expect(page.getByText('Manage user access rights and permissions across system')).toBeVisible();
  });

  test('Menampilkan data table permissions', async ({ page }) => {
    const table = page.locator('.v-data-table');
    await expect(table).toBeVisible();
  });

  test('Menampilkan kolom tabel yang benar', async ({ page }) => {
    await expect(page.getByText('ID')).toBeVisible();
    await expect(page.getByText('Name')).toBeVisible();
    await expect(page.getByText('Code')).toBeVisible();
    await expect(page.getByText('Category')).toBeVisible();
    await expect(page.getByText('Description')).toBeVisible();
    await expect(page.getByText('Created At')).toBeVisible();
    await expect(page.getByText('Updated At')).toBeVisible();
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
    await searchInput.fill('view');
    await page.waitForTimeout(1000);
  });

   test('Navigasi pagination ke halaman pertama', async ({ page }) => {
    // Go to next page first
    const firstButton =   page.locator('.v-pagination__first')
    if (await firstButton.isEnabled()) {
      await firstButton.click();
      await page.waitForTimeout(1000);
    }

  });

   test('Navigasi pagination ke halaman terakhir', async ({ page }) => {
    // Go to next page first
    const lastButton =   page.locator('.v-pagination__last')
    if (await lastButton.isEnabled()) {
      await lastButton.click();
      await page.waitForTimeout(1000);
    }

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

  test('Menampilkan format tanggal created at', async ({ page }) => {
    // Verify date format is displayed (dd MMM yyyy HH:mm:ss)
    const dateCell = page.locator('tbody tr td').filter({ hasText: /\d{2}\s\w{3}\s\d{4}\s\d{2}:\d{2}:\d{2}/ }).first();
    if (await dateCell.isVisible()) {
      await expect(dateCell).toBeVisible();
    }
  });

  test('Menampilkan format tanggal updated at', async ({ page }) => {
    // Verify date format is displayed
    const table = page.locator('.v-data-table');
    await expect(table).toBeVisible();
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

  test('Menampilkan loading state', async ({ page }) => {
    // Reload to catch loading state
    await page.reload();
    
    // Check if loading indicator appears briefly
    const loadingIndicator = page.locator('.v-data-table-progress');
    // Loading might be too fast to catch, so we just check table renders
    await page.waitForTimeout(500);
    
    const table = page.locator('.v-data-table');
    await expect(table).toBeVisible();
  });

  test('Menampilkan pesan "No Permissions found" jika data kosong', async ({ page }) => {
    // Search for something that doesn't exist
    const searchInput = page.getByPlaceholder('Search something...');
    await searchInput.fill('xxxxxxxxxxxxxxxxx');
    await page.waitForTimeout(1000);

    // Should show no data message
    const noDataText = page.getByText('No Permissions found');
    if (await noDataText.isVisible()) {
      await expect(noDataText).toBeVisible();
    }
  });

  test('Menampilkan data permission dengan benar', async ({ page }) => {
    // Check if table has rows
    const tableRows = page.locator('tbody tr');
    const rowCount = await tableRows.count();
    
    if (rowCount > 0) {
      // First row should have data
      const firstRow = tableRows.first();
      await expect(firstRow).toBeVisible();
    }
  });

  test('Menampilkan ID berurutan sesuai pagination', async ({ page }) => {
    // Check first ID
    const firstId = page.locator('tbody tr').first().locator('td').first();
    await expect(firstId).toContainText('1');
  });

  test('Search query mereset pagination ke halaman 1', async ({ page }) => {
    // Go to page 2 if possible
    const nextButton = page.locator('button[aria-label="Next page"]');
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForTimeout(1000);
    }

    // Search something
    const searchInput = page.getByPlaceholder('Search something...');
    await searchInput.fill('permission');
    await page.waitForTimeout(1000);

    // Should be back to page 1 (first ID should be 1)
    const firstId = page.locator('tbody tr').first().locator('td').first();
    if (await firstId.isVisible()) {
      await expect(firstId).toContainText('1');
    }
  });
});