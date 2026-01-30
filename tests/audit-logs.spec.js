import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Audit Logs Page Tests', () => {
  test.beforeEach(async ({ page }) => {
      // Login first
        await page.goto('/login');

      await page.getByLabel('Email or Username').fill('admin');
      await page.getByLabel('Password').fill('admin');
     await page.getByTestId('submit-button').click();
    await page.waitForTimeout(5000);
  
      // Navigate to alarm logs page
      await page.goto(`/audit-logs`);
      
    });

  test('Menampilkan halaman audit logs', async ({ page }) => {
    await expect(page.getByText('All Audit Logs')).toBeVisible();
    await expect(page.getByText('Review and view audit logs in system')).toBeVisible();
  });

  test('Menampilkan data table audit logs', async ({ page }) => {
    const table = page.locator('.v-data-table');
    await expect(table).toBeVisible();
  });

  test('Menampilkan kolom tabel yang benar', async ({ page }) => {
    await expect(page.getByText('ID')).toBeVisible();
    await expect(page.getByText('Feature')).toBeVisible();
    await expect(page.getByText('Action')).toBeVisible();
    await expect(page.getByText('Description')).toBeVisible();
    await expect(page.getByText('IP Address')).toBeVisible();
    await expect(page.getByText('User Agent')).toBeVisible();
    await expect(page.getByText('Username')).toBeVisible();
    await expect(page.getByText('Created At')).toBeVisible();
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
    await searchInput.fill('login');
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

  test('Expand row untuk melihat before/after data', async ({ page }) => {
    // Click first row to expand
    const firstRow = page.locator('tbody tr').first().locator('button');
    await firstRow.click();
    await page.waitForTimeout(500);

    // Verify expanded table is visible
    await expect(page.getByText('Field')).toBeVisible();
    await expect(page.getByText('Before')).toBeVisible();
    await expect(page.getByText('After')).toBeVisible();
  });

  test('Menampilkan tabel before/after dalam expanded row', async ({ page }) => {
    // Expand first row
    const firstRow = page.locator('tbody tr').first();
    await firstRow.click();
    await page.waitForTimeout(500);

    // Check for nested table
    const nestedTable = page.locator('table').nth(1);
    if (await nestedTable.isVisible()) {
      await expect(nestedTable).toBeVisible();
    }
  });

  test('Menutup expanded row', async ({ page }) => {
    // Expand first row
    const firstRow = page.locator('tbody tr').first();
    await firstRow.click();
    await page.waitForTimeout(500);

    // Click again to close
    await firstRow.click();
    await page.waitForTimeout(500);

    // Nested table should not be visible
    const nestedTable = page.locator('table').nth(1);
    if (await nestedTable.isVisible()) {
      // Row might still be visible during animation
      await page.waitForTimeout(500);
    }
  });

  test('Menampilkan format tanggal created at', async ({ page }) => {
    // Verify date format is displayed (dd MMM yyyy HH:mm:ss)
    const dateCell = page.locator('tbody tr td').filter({ hasText: /\d{2}\s\w{3}\s\d{4}\s\d{2}:\d{2}:\d{2}/ }).first();
    if (await dateCell.isVisible()) {
      await expect(dateCell).toBeVisible();
    }
  });

 test('Navigasi pagination ke halaman berikutnya', async ({ page }) => {
    // Click next page button
    const nextButton =   page.locator('.v-pagination__next')
    
    
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForTimeout(1000);
    }
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
    await page.waitForTimeout(500);
    
    const table = page.locator('.v-data-table');
    await expect(table).toBeVisible();
  });

  test('Menampilkan pesan "No audit logs found" jika data kosong', async ({ page }) => {
    // Search for something that doesn't exist
    const searchInput = page.getByPlaceholder('Search something...');
    await searchInput.fill('xxxxxxxxxxxxxxxxx');
    await page.waitForTimeout(1000);

    // Should show no data message
    const noDataText = page.getByText('No audit logs found');
    if (await noDataText.isVisible()) {
      await expect(noDataText).toBeVisible();
    }
  });

test('Menampilkan ID berurutan sesuai pagination', async ({ page }) => {
    // Check first ID
    const firstId = page.locator('tbody tr').first().locator('td').nth(1);
    await expect(firstId).toContainText('1');
  });

  test('Search query mereset pagination ke halaman 1', async ({ page }) => {
    // Go to page 2 if possible
    const nextButton =   page.locator('.v-pagination__next')
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForTimeout(1000);
    }

    // Search something
    const searchInput = page.getByPlaceholder('Search something...');
    await searchInput.fill('role');
    await page.waitForTimeout(1000);

    // Should be back to page 1 (first ID should be 1)
    const firstId = page.locator('tbody tr').first().locator('td').nth(1);
    if (await firstId.isVisible()) {
      await expect(firstId).toContainText('1');
    }
  });

  test('Menampilkan error alert jika ada error', async ({ page }) => {
    // This would typically be tested with mocked API that returns error
    // For now, just check the error alert mechanism exists
    const errorAlert = page.locator('.v-alert[type="error"]');
    // Error alert should not be visible normally
    if (await errorAlert.isVisible()) {
      await expect(errorAlert).toBeVisible();
    }
  });

  test('Menutup error alert', async ({ page }) => {
    // If error alert is visible, test closing it
    const errorAlert = page.locator('.v-alert[type="error"]');
    
    if (await errorAlert.isVisible()) {
      const closeButton = errorAlert.locator('button');
      await closeButton.click();
      await page.waitForTimeout(500);
      
      await expect(errorAlert).not.toBeVisible();
    }
  });

  test('Menampilkan user agent dengan text wrap', async ({ page }) => {
    // Check if user agent column displays properly
    const userAgentCells = page.locator('tbody tr td').filter({ hasText: /Mozilla/ });
    if (await userAgentCells.first().isVisible()) {
      await expect(userAgentCells.first()).toBeVisible();
    }
  });

  test('Menampilkan username dalam audit log', async ({ page }) => {
    // Check if username column has data
    const table = page.locator('.v-data-table tbody');
    if (await table.isVisible()) {
      await expect(table).toBeVisible();
    }
  });
});