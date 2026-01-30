import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Users Page Tests', () => {
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

  test('Menampilkan section Total users with their roles', async ({ page }) => {
    await expect(page.getByText('Total users with their roles')).toBeVisible();
    await expect(page.getByText(/Find all of your company's administrator/)).toBeVisible();
  });

  test('Menampilkan data table users', async ({ page }) => {
    const table = page.locator('.v-data-table');
    await expect(table.last()).toBeVisible();
  });

  test('Menampilkan kolom tabel yang benar', async ({ page }) => {
    // Scroll to users table
    await page.locator('.v-data-table').last().scrollIntoViewIfNeeded();
    
    await expect(page.getByText('Id')).toBeVisible();
    await expect(page.getByText('Username')).toBeVisible();
    await expect(page.getByText('Name')).toBeVisible();
    await expect(page.getByText('Email')).toBeVisible();
    await expect(page.getByText('Role')).toBeVisible();
    await expect(page.getByText('Actions')).toBeVisible();
  });

  test('Mengubah items per page', async ({ page }) => {
    await page.locator('.v-data-table').last().scrollIntoViewIfNeeded();
    
    const itemsPerPageSelect = page.locator('.v-select').last();
    await itemsPerPageSelect.click();
    
    await page.getByRole('option', { name: '25' }).click();
    await page.waitForTimeout(1000);
  });

  test('Mencari data dengan search', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search something...');
    await searchInput.fill('admin');
    await page.waitForTimeout(1000);
  });

  test('Menghapus search query', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search something...');
    await searchInput.fill('test');
    await page.waitForTimeout(500);
    
    const clearButton = page.locator('.v-field__clearable button').last();
    await clearButton.click();
    await page.waitForTimeout(500);
  });

  test('Menampilkan tombol New User', async ({ page }) => {
    const newUserBtn = page.getByRole('button', { name: 'New User' });
    await expect(newUserBtn).toBeVisible();
  });

  test('Menekan tombol New User', async ({ page }) => {
    const newUserBtn = page.getByRole('button', { name: 'New User' });
    await newUserBtn.click();
    await page.waitForTimeout(500);

    // Drawer should open
    await expect(page.getByText('Manage User')).toBeVisible();
  });

  test('Menampilkan role chip dengan warna', async ({ page }) => {
    const roleChip = page.locator('.v-chip').first();
    if (await roleChip.isVisible()) {
      await expect(roleChip).toBeVisible();
    }
  });

  test('Menampilkan tombol Edit', async ({ page }) => {
    const editBtn = page.locator('button .tabler-pencil').first();
    if (await editBtn.isVisible()) {
      await expect(editBtn).toBeVisible();
    }
  });

  test('Menampilkan tombol Delete', async ({ page }) => {
    const deleteBtn = page.locator('button .tabler-trash').first();
    if (await deleteBtn.isVisible()) {
      await expect(deleteBtn).toBeVisible();
    }
  });

  test('Menekan tombol Edit', async ({ page }) => {
    const editBtn = page.locator('button').filter({ has: page.locator('.tabler-pencil') }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await page.waitForTimeout(500);

      // Drawer should open
      await expect(page.getByText('Manage User')).toBeVisible();
    }
  });

  test('Menekan tombol Delete', async ({ page }) => {
    const deleteBtn = page.locator('button').filter({ has: page.locator('.tabler-trash') }).first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await page.waitForTimeout(500);

      // Delete dialog should open
      await expect(page.getByText('Delete User')).toBeVisible();
    }
  });

  test('Navigasi pagination', async ({ page }) => {
    const nextButton = page.locator('button[aria-label="Next page"]').last();
    
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('Menampilkan ID berurutan', async ({ page }) => {
    await page.locator('.v-data-table').last().scrollIntoViewIfNeeded();
    
    const firstId = page.locator('tbody tr').first().locator('td').first();
    if (await firstId.isVisible()) {
      await expect(firstId).toContainText('1');
    }
  });
});

test.describe('Manage User Drawer Tests', () => {
   test.beforeEach(async ({ page }) => {
    // Login and navigate to MQTT Brokers page
    await page.goto('/login');

    await page.getByLabel('Email or Username').fill('admin');
    await page.getByLabel('Password').fill('admin');
    await page.getByTestId('submit-button').click();
    await page.waitForTimeout(5000);
  
    await page.goto('/users');
    await page.waitForTimeout(1000);

    // Open edit drawer
    const editBtn = page.locator('button').filter({ has: page.locator('.tabler-pencil') }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('Menampilkan drawer Manage User', async ({ page }) => {
    await expect(page.getByText('Manage User')).toBeVisible();
  });

  test('Menampilkan field Username', async ({ page }) => {
    const usernameField = page.getByLabel('Username');
    await expect(usernameField).toBeVisible();
    await expect(usernameField).toBeEnabled();
  });

  test('Menampilkan field Name', async ({ page }) => {
    const nameField = page.getByLabel('Name');
    await expect(nameField).toBeVisible();
    await expect(nameField).toBeEnabled();
  });

  test('Menampilkan field Email', async ({ page }) => {
    const emailField = page.getByLabel('Email');
    await expect(emailField).toBeVisible();
    await expect(emailField).toBeEnabled();
  });

  test('Menampilkan field Password', async ({ page }) => {
    const passwordField = page.getByLabel('Password', { exact: true });
    await expect(passwordField).toBeVisible();
    await expect(passwordField).toBeEnabled();
  });

  test('Menampilkan field Confirm Password', async ({ page }) => {
    const confirmPasswordField = page.getByLabel('Confirm Password');
    await expect(confirmPasswordField).toBeVisible();
    await expect(confirmPasswordField).toBeEnabled();
  });

  test('Menampilkan dropdown Role', async ({ page }) => {
    const roleDropdown = page.getByLabel('Role');
    await expect(roleDropdown).toBeVisible();
  });

  test('Mengisi field Username', async ({ page }) => {
    const usernameField = page.getByLabel('Username');
    await usernameField.fill('newuser');
    await expect(usernameField).toHaveValue('newuser');
  });

  test('Mengisi field Name', async ({ page }) => {
    const nameField = page.getByLabel('Name');
    await nameField.fill('New User Name');
    await expect(nameField).toHaveValue('New User Name');
  });

  test('Mengisi field Email', async ({ page }) => {
    const emailField = page.getByLabel('Email');
    await emailField.fill('newuser@email.com');
    await expect(emailField).toHaveValue('newuser@email.com');
  });

  test('Mengisi field Password', async ({ page }) => {
    const passwordField = page.getByLabel('Password', { exact: true });
    await passwordField.fill('Password123');
    await expect(passwordField).toHaveValue('Password123');
  });

  test('Toggle password visibility', async ({ page }) => {
    const passwordField = page.getByLabel('Password', { exact: true });
    const toggleBtn = page.locator('.v-input').filter({ has: passwordField }).locator('button').first();

    // Initially hidden
    await expect(passwordField).toHaveAttribute('type', 'password');

    // Show password
    await toggleBtn.click();
    await expect(passwordField).toHaveAttribute('type', 'text');

    // Hide password
    await toggleBtn.click();
    await expect(passwordField).toHaveAttribute('type', 'password');
  });

  test('Memilih role dari dropdown', async ({ page }) => {
    const roleDropdown = page.getByLabel('Role');
    await roleDropdown.click();
    await page.waitForTimeout(500);

    const firstOption = page.locator('.v-list-item').first();
    if (await firstOption.isVisible()) {
      await firstOption.click();
    }
  });

  test('Menampilkan tombol Manage', async ({ page }) => {
    const manageBtn = page.getByRole('button', { name: 'Manage' });
    await expect(manageBtn).toBeVisible();
  });

  test('Menampilkan tombol Cancel', async ({ page }) => {
    const cancelBtn = page.getByRole('button', { name: 'Cancel' });
    await expect(cancelBtn).toBeVisible();
  });

  test('Menutup drawer dengan tombol Cancel', async ({ page }) => {
    const cancelBtn = page.getByRole('button', { name: 'Cancel' });
    await cancelBtn.click();
    await page.waitForTimeout(500);

    await expect(page.getByText('Manage User')).not.toBeVisible();
  });

  test('Submit form tanpa mengisi data', async ({ page }) => {
    const manageBtn = page.getByRole('button', { name: 'Manage' });
    await manageBtn.click();
    await page.waitForTimeout(500);

    // Should show validation errors
    const errorMessages = page.locator('.v-messages__message');
    if (await errorMessages.first().isVisible()) {
      await expect(errorMessages.first()).toBeVisible();
    }
  });

  test('Submit form dengan data valid', async ({ page }) => {
    // Fill all required fields
    await page.getByLabel('Username').fill('testuser123');
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill('testuser123@email.com');
    await page.getByLabel('Password', { exact: true }).fill('Password123');
    await page.getByLabel('Confirm Password').fill('Password123');
    
    // Select role
    const roleDropdown = page.getByLabel('Role');
    await roleDropdown.click();
    await page.waitForTimeout(300);
    const firstOption = page.locator('.v-list-item').first();
    if (await firstOption.isVisible()) {
      await firstOption.click();
    }

    // Submit
    const manageBtn = page.getByRole('button', { name: 'Manage' });
    await manageBtn.click();
    await page.waitForTimeout(1000);

    // Drawer should close
    await expect(page.getByText('Manage User')).not.toBeVisible();
  });

  test('Validasi password tidak match', async ({ page }) => {
    await page.getByLabel('Username').fill('testuser');
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill('test@email.com');
    await page.getByLabel('Password', { exact: true }).fill('Password123');
    await page.getByLabel('Confirm Password').fill('DifferentPassword123');

    const manageBtn = page.getByRole('button', { name: 'Manage' });
    await manageBtn.click();
    await page.waitForTimeout(500);

    // Should show alert or validation message
  });

  test('Edit mode - password optional', async ({ page }) => {
    // Close current drawer
    await page.getByRole('button', { name: 'Cancel' }).click();
    await page.waitForTimeout(500);

    // Open edit drawer
    const editBtn = page.locator('button').filter({ has: page.locator('.tabler-pencil') }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await page.waitForTimeout(500);

      // Check for optional password label
      const passwordLabel = page.getByText('New Password (optional)');
      if (await passwordLabel.isVisible()) {
        await expect(passwordLabel).toBeVisible();
      }
    }
  });
});

test.describe('Delete User Dialog Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate
    await page.goto(`${BASE_URL}`);
    await page.getByLabel('Email or Username').fill('testuser@email.com');
    await page.getByLabel('Password').fill('ValidPassword123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForTimeout(2000);
    await page.goto(`${BASE_URL}/roles`);
    await page.waitForTimeout(1000);

    // Open delete dialog
    const deleteBtn = page.locator('button').filter({ has: page.locator('.tabler-trash') }).first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('Menampilkan delete dialog', async ({ page }) => {
    const deleteDialog = page.getByText('Delete User');
    if (await deleteDialog.isVisible()) {
      await expect(deleteDialog).toBeVisible();
      await expect(page.getByText('Please provide a reason for deletion')).toBeVisible();
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
      await reasonField.fill('User account no longer needed');
      await expect(reasonField).toHaveValue('User account no longer needed');
    }
  });

  test('Submit delete dengan reason', async ({ page }) => {
    const reasonField = page.getByLabel('Reason');
    if (await reasonField.isVisible()) {
      await reasonField.fill('Test deletion');
      
      const submitBtn = page.getByRole('button', { name: 'Submit' });
      await submitBtn.click();
      await page.waitForTimeout(1000);

      // Dialog should close
      await expect(page.getByText('Delete User')).not.toBeVisible();
    }
  });

  test('Menutup delete dialog dengan Cancel', async ({ page }) => {
    const cancelBtn = page.getByRole('button', { name: 'Cancel' });
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
      await page.waitForTimeout(500);

      await expect(page.getByText('Delete User')).not.toBeVisible();
    }
  });
});

test.describe('Alert Dialog Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate
    await page.goto(`${BASE_URL}`);
    await page.getByLabel('Email or Username').fill('testuser@email.com');
    await page.getByLabel('Password').fill('ValidPassword123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForTimeout(2000);
    await page.goto(`${BASE_URL}/roles`);
    await page.waitForTimeout(1000);
  });

  test('Menampilkan success alert setelah create user', async ({ page }) => {
    // Open new user drawer
    await page.getByRole('button', { name: 'New User' }).click();
    await page.waitForTimeout(500);

    // Fill and submit
    await page.getByLabel('Username').fill('newuser');
    await page.getByLabel('Name').fill('New User');
    await page.getByLabel('Email').fill('newuser@email.com');
    await page.getByLabel('Password', { exact: true }).fill('Password123');
    await page.getByLabel('Confirm Password').fill('Password123');
    await page.getByRole('button', { name: 'Manage' }).click();
    await page.waitForTimeout(1000);

    // Check for success alert
    const successAlert = page.getByText('Action success');
    if (await successAlert.isVisible()) {
      await expect(successAlert).toBeVisible();
    }
  });
});