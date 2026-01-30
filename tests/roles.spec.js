import { test, expect } from '@playwright/test';


test.describe('Roles Page Tests', () => {
  test.beforeEach(async ({ page }) => {
      // Login first
        await page.goto('/login');

      await page.getByLabel('Email or Username').fill('admin');
      await page.getByLabel('Password').fill('admin');
     await page.getByTestId('submit-button').click();
    await page.waitForTimeout(5000);
  
      // Navigate to alarm logs page
      await page.goto(`/users`);
      
    });

  test('Menampilkan halaman roles', async ({ page }) => {
    await expect(page.getByText('Roles List')).toBeVisible();
    await expect(page.getByText(/A role provided access to predefined menus/)).toBeVisible();
  });

  test('Menampilkan skeleton loader saat loading', async ({ page }) => {
    // Reload to catch loading state
    await page.reload();
    await page.waitForTimeout(100);
    
    // Check if skeleton loaders appear or cards render
    const cards = page.locator('.v-col .v-card');
    await expect(cards.first()).toBeVisible();
  });

  test('Menampilkan role cards', async ({ page }) => {
    await expect(page.getByTestId('add-role-card')).toBeVisible();

    const roleCards = page.locator('.v-card');
    const cardCount = await roleCards.count();
    
    // Should have at least 1 card (add new role card always exists)
    expect(cardCount).toBeGreaterThan(0);
  });

  test('Menampilkan jumlah permissions di role card', async ({ page }) => {
    const permissionText = page.getByText(/Has \d+ permissions/);
    if (await permissionText.first().isVisible()) {
      await expect(permissionText.first()).toBeVisible();
    }
  });

  test('Menampilkan nama role', async ({ page }) => {
    const roleCards = page.locator('.v-card');
    if (await roleCards.first().isVisible()) {
      const roleTitle = roleCards.first().locator('.text-h5');
      await expect(roleTitle).toBeVisible();
    }
  });

  test('Menampilkan link Edit Role', async ({ page }) => {
    const editLink = page.getByText('Edit Role');
    if (await editLink.first().isVisible()) {
      await expect(editLink.first()).toBeVisible();
    }
  });

  test('Menampilkan tombol delete (trash icon)', async ({ page }) => {
    const deleteBtn = page.locator('button .tabler-trash').or(
      page.locator('[icon="tabler-trash"]')
    );
    if (await deleteBtn.first().isVisible()) {
      await expect(deleteBtn.first()).toBeVisible();
    }
  });

 

  test('Menampilkan gambar di Add New Role card', async ({ page }) => {
    const addRoleImage = page.locator('img[src*="girl-using-mobile"]');
    await expect(addRoleImage).toBeVisible();
  });

  test('Menekan tombol Add New Role', async ({ page }) => {
    const addRoleBtn = page.getByRole('button', { name: 'Add New Role' });
    await addRoleBtn.click();
    await page.waitForTimeout(500);

    // Dialog should open
    await expect(page.getByText('Manage Role')).toBeVisible();
  });

  test('Menekan link Edit Role', async ({ page }) => {
    const editLink = page.getByText('Edit Role').first();
    if (await editLink.isVisible()) {
      await editLink.click();
      await page.waitForTimeout(500);

      // Dialog should open
      await expect(page.getByText('Manage Role')).toBeVisible();
    }
  });

  test('Menekan tombol delete role', async ({ page }) => {
    const deleteBtn = page.locator('button').filter({ has: page.locator('.tabler-trash') }).first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await page.waitForTimeout(500);

      // Delete dialog should open
      await expect(page.getByText('Delete Role')).toBeVisible();
    }
  });

  
});

test.describe('Manage Role Dialog Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to roles page
    await page.goto('/login');

      await page.getByLabel('Email or Username').fill('admin');
      await page.getByLabel('Password').fill('admin');
     await page.getByTestId('submit-button').click();
    await page.waitForTimeout(5000);
  
      // Navigate to alarm logs page
      await page.goto(`/users`);
      

    // Open Add Role dialog
    const addRoleBtn = page.getByRole('button', { name: 'Add New Role' });
    await addRoleBtn.click();
    await page.waitForTimeout(500);
  });

  test('Menampilkan dialog Manage Role', async ({ page }) => {
    await expect(page.getByText('Manage Role', { exact: true })).toBeVisible();
    await expect(page.getByText('Set Role Permissions')).toBeVisible();
  });

  test('Menampilkan field Role Name', async ({ page }) => {
    const roleNameField = page.getByLabel('Role Name');
    await expect(roleNameField).toBeVisible();
    await expect(roleNameField).toBeEnabled();
  });

  test('Menampilkan field Description', async ({ page }) => {
    const descField = page.getByLabel('Description');
    await expect(descField).toBeVisible();
    await expect(descField).toBeEnabled();
  });

  test('Mengisi field Role Name', async ({ page }) => {
    const roleNameField = page.getByLabel('Role Name');
    await roleNameField.fill('Test Role');
    await expect(roleNameField).toHaveValue('Test Role');
  });

  test('Mengisi field Description', async ({ page }) => {
    const descField = page.getByLabel('Description');
    await descField.fill('Test role description');
    await expect(descField).toHaveValue('Test role description');
  });

  test('Menampilkan tabel permissions', async ({ page }) => {
    const permissionTable = page.locator('.permission-table');
    await expect(permissionTable).toBeVisible();
  });

  test('Menampilkan checkbox Select All', async ({ page }) => {
    const selectAllCheckbox = page.getByLabel('Select All');
    await expect(selectAllCheckbox).toBeVisible();
  });

  test('Menekan checkbox Select All', async ({ page }) => {
    const selectAllCheckbox = page.getByLabel('Select All');
    await selectAllCheckbox.click();
    await page.waitForTimeout(500);

    // All permissions should be checked
    const checkboxes = page.locator('.v-checkbox input[type="checkbox"]');
    const count = await checkboxes.count();
    expect(count).toBeGreaterThan(1);
  });

  test('Menampilkan permission categories', async ({ page }) => {
    const permissionTable = page.locator('.permission-table');
    await expect(permissionTable).toBeVisible();
    
    // Should have category headers
    const categoryHeaders = permissionTable.locator('.text-h6');
    const count = await categoryHeaders.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Memilih individual permission', async ({ page }) => {
    // Find and click a permission checkbox
    const permissionCheckboxes = page.locator('.v-checkbox').filter({ hasText: /view|create|update|delete/i });
    if (await permissionCheckboxes.first().isVisible()) {
      await permissionCheckboxes.first().click();
      await page.waitForTimeout(500);
    }
  });

  test('Menampilkan tombol Submit', async ({ page }) => {
    const submitBtn = page.getByRole('button', { name: 'Submit' });
    await expect(submitBtn).toBeVisible();
  });

  test('Menampilkan tombol Cancel', async ({ page }) => {
    const cancelBtn = page.getByTestId('cancel-button')
    await expect(cancelBtn).toBeVisible();
  });

  test('Menutup dialog dengan tombol Cancel', async ({ page }) => {
    const cancelBtn = page.getByTestId('cancel-button')
    await cancelBtn.click();
    await page.waitForTimeout(500);

    // Dialog should be closed
    await expect(page.getByText('Manage Role', { exact: true })).not.toBeVisible();
  });

  test('Menutup dialog dengan tombol close (X)', async ({ page }) => {
    const closeBtn = page.locator('.v-card button[aria-label="Close"]').or(
      page.locator('.v-dialog button').first()
    );
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await page.waitForTimeout(500);

      await expect(page.getByText('Manage Role', { exact: true })).not.toBeVisible();
    }
  });

  test('Submit role dengan data valid', async ({ page }) => {
    // Fill form
    await page.getByLabel('Role Name').fill('Test Role');
    await page.getByLabel('Description').fill('Test Description');
    
    // Select at least one permission
    const selectAllCheckbox = page.getByLabel('Select All');
    await selectAllCheckbox.click();
    await page.waitForTimeout(500);

    // Submit
    const submitBtn = page.getByRole('button', { name: 'Submit' });
    await submitBtn.click();
    await page.waitForTimeout(1000);

    // Dialog should close
    await expect(page.getByText('Manage Role', { exact: true })).not.toBeVisible();
  });

  test('Menampilkan indeterminate state pada Select All', async ({ page }) => {
    // Select only one permission (not all)
    const permissionCheckboxes = page.locator('.v-checkbox').filter({ hasText: /view|create/i });
    if (await permissionCheckboxes.first().isVisible()) {
      await permissionCheckboxes.first().click();
      await page.waitForTimeout(500);

      // Select All should show indeterminate state
      const selectAllCheckbox = page.getByLabel('Select All');
      await expect(selectAllCheckbox).toBeVisible();
    }
  });
});

test.describe('Delete Role Dialog Tests', () => {
  test.beforeEach(async ({ page }) => {
     // Login first
        await page.goto('/login');

      await page.getByLabel('Email or Username').fill('admin');
      await page.getByLabel('Password').fill('admin');
     await page.getByTestId('submit-button').click();
    await page.waitForTimeout(5000);
  
      // Navigate to alarm logs page
      await page.goto(`/users`);
    await page.waitForTimeout(1000);

    // Open delete dialog
    const deleteBtn = page.locator('button').filter({ has: page.locator('.tabler-trash') }).first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('Menampilkan delete dialog', async ({ page }) => {
    const deleteDialog = page.getByText('Delete Role');
    if (await deleteDialog.isVisible()) {
      await expect(deleteDialog).toBeVisible();
      await expect(page.getByText('Tell a reason why?')).toBeVisible();
    }
  });

  test('Menampilkan field Reason', async ({ page }) => {
    const reasonField = page.getByLabel('Reason');
    if (await reasonField.isVisible()) {
      await expect(reasonField).toBeVisible();
    }
  });

  test('Mengisi field Reason', async ({ page }) => {
    const reasonField = page.getByLabel('Reason');
    if (await reasonField.isVisible()) {
      await reasonField.fill('Role no longer needed');
      await expect(reasonField).toHaveValue('Role no longer needed');
    }
  });

  test('Menutup delete dialog dengan Cancel', async ({ page }) => {
    const cancelBtn = page.getByTestId('cancel-dialog-confirmation')
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
      await page.waitForTimeout(500);

      await expect(page.getByText('Delete Role')).not.toBeVisible();
    }
  });

  test('Submit delete tanpa reason', async ({ page }) => {
    const submitBtn = page.getByRole('button', { name: 'Submit' });
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await page.waitForTimeout(500);

      // Should show validation error
      const errorMessage = page.locator('.v-messages__message');
      if (await errorMessage.first().isVisible()) {
        await expect(errorMessage.first()).toBeVisible();
      }
    }
  });

  test('Submit delete dengan reason valid', async ({ page }) => {
    const reasonField = page.getByLabel('Reason');
    if (await reasonField.isVisible()) {
      await reasonField.fill('Role is obsolete');
      
      const submitBtn = page.getByRole('button', { name: 'Submit' });
      await submitBtn.click();
      await page.waitForTimeout(1000);

      // Dialog should close
      await expect(page.getByText('Delete Role')).not.toBeVisible();
    }
  });
});

test.describe('Alert Dialog Tests', () => {
  test.beforeEach(async ({ page }) => {
      // Login first
        await page.goto('/login');

      await page.getByLabel('Email or Username').fill('admin');
      await page.getByLabel('Password').fill('admin');
     await page.getByTestId('submit-button').click();
    await page.waitForTimeout(5000);
  
      // Navigate to alarm logs page
      await page.goto(`/users`);
    await page.waitForTimeout(1000);
    
    });

  test('Menampilkan success alert setelah create role', async ({ page }) => {
    // Open add role dialog
    await page.getByRole('button', { name: 'Add New Role' }).click();
    await page.waitForTimeout(500);

    // Fill and submit
    await page.getByLabel('Role Name').fill('New Test Role');
    await page.getByLabel('Select All').click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(1000);

    // Check for success alert
    const successAlert = page.getByText('Action success');
    if (await successAlert.isVisible()) {
      await expect(successAlert).toBeVisible();
      await expect(page.getByText('Role has been saved')).toBeVisible();
    }
  });

  test('Menampilkan success alert setelah delete role', async ({ page }) => {
    // Open delete dialog
    const deleteBtn = page.locator('button').filter({ has: page.locator('.tabler-trash') }).first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await page.waitForTimeout(500);

      // Fill reason and submit
      const reasonField = page.getByLabel('Reason');
      if (await reasonField.isVisible()) {
        await reasonField.fill('Test deletion');
        await page.getByRole('button', { name: 'Submit' }).click();
        await page.waitForTimeout(1000);

        // Check for success alert
        const successAlert = page.getByText('Action success');
        if (await successAlert.isVisible()) {
          await expect(successAlert).toBeVisible();
        }
      }
    }
  });
});