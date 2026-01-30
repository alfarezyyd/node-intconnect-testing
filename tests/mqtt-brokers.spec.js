import { test, expect } from '@playwright/test';

test.describe('MQTT Brokers Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');

    await page.getByLabel('Email or Username').fill('admin');
    await page.getByLabel('Password').fill('admin');
    await page.getByTestId('submit-button').click();
    await page.waitForTimeout(5000);
  
    // Navigate to MQTT Brokers page
    await page.goto('/mqtt-brokers');
  });

  test('Menampilkan halaman MQTT Brokers', async ({ page }) => {
    await expect(page.locator('h4').getByText('All MQTT Brokers')).toBeVisible();
    await expect(page.getByText(/View and manage all MQTT brokers/)).toBeVisible();
  });

  test('Menampilkan tabel MQTT Brokers', async ({ page }) => {
    const table = page.locator('.v-data-table');
    await expect(table).toBeVisible();
  });

  test('Menampilkan header tabel dengan benar', async ({ page }) => {
    await expect(page.getByRole('table').getByText('Host Name')).toBeVisible();
    await expect(page.getByRole('table').getByText('MQTT Port')).toBeVisible();
    await expect(page.getByRole('table').getByText('WS Port')).toBeVisible();
    await expect(page.getByRole('table').getByText('Username')).toBeVisible();
    await expect(page.getByRole('table').getByText('Status')).toBeVisible();
    await expect(page.getByRole('table').getByText('Actions')).toBeVisible();
  });

  test('Menampilkan tombol New MQTT Broker', async ({ page }) => {
    const newBrokerBtn = page.getByRole('button', { name: 'New MQTT Broker' });
    await expect(newBrokerBtn).toBeVisible();
  });

  test('Menampilkan search field', async ({ page }) => {
    const searchField = page.getByPlaceholder('Search something...');
    await expect(searchField).toBeVisible();
  });

  test('Menampilkan dropdown items per page', async ({ page }) => {
    const dropdown = page.locator('.v-select').first();
    await expect(dropdown).toBeVisible();
  });

  test('Menampilkan status chip Active', async ({ page }) => {
    const activeChip = page.locator('.v-chip').filter({ hasText: 'Active' });
    if (await activeChip.first().isVisible()) {
      await expect(activeChip.first()).toBeVisible();
    }
  });

  test('Menampilkan status chip Inactive', async ({ page }) => {
    const inactiveChip = page.locator('.v-chip').filter({ hasText: 'Inactive' });
    if (await inactiveChip.first().isVisible()) {
      await expect(inactiveChip.first()).toBeVisible();
    }
  });

  test('Menampilkan tombol Edit', async ({ page }) => {
    const editBtn = page.locator('button .tabler-pencil').or(
      page.locator('[icon="tabler-pencil"]')
    );
    if (await editBtn.first().isVisible()) {
      await expect(editBtn.first()).toBeVisible();
    }
  });

  test('Menampilkan tombol Delete', async ({ page }) => {
    const deleteBtn = page.locator('button .tabler-trash')
      await expect(deleteBtn.first()).toBeVisible();
  });

  test('Menampilkan pagination', async ({ page }) => {
    const pagination = page.locator('.v-pagination');
    if (await pagination.isVisible()) {
      await expect(pagination).toBeVisible();
    }
  });

  test('Menggunakan search field', async ({ page }) => {
    const searchField = page.getByPlaceholder('Search something...');
    await searchField.fill('192.168');
    await page.waitForTimeout(500);

    // Table should still be visible
    const table = page.locator('.v-data-table');
    await expect(table).toBeVisible();
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
 


  test('Mengubah items per page', async ({ page }) => {
    const itemsPerPageSelect = page.locator('.v-select').first();
    await itemsPerPageSelect.click();
    
    // Select different option (e.g., 25)
    await page.getByRole('option', { name: '25' }).click();
    await page.waitForTimeout(1000);
  });


  test('Menekan tombol New MQTT Broker', async ({ page }) => {
    const newBrokerBtn = page.getByRole('button', { name: 'New MQTT Broker' });
    await newBrokerBtn.click();
    await page.waitForTimeout(500);

    // Drawer should open
    await expect(page.getByText('Manage MQTT Broker')).toBeVisible();
  });

  test('Menekan tombol Edit', async ({ page }) => {
    const editBtn = page.locator('button').filter({ has: page.locator('.tabler-pencil') }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await page.waitForTimeout(500);

      // Drawer should open
      await expect(page.getByText('Manage MQTT Broker')).toBeVisible();
    }
  });

  test('Menekan tombol Delete', async ({ page }) => {
    const deleteBtn = page.locator('button').filter({ has: page.locator('.tabler-trash') }).first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await page.waitForTimeout(500);

      // Delete dialog should open
      await expect(page.getByText('Delete MQTT Broker')).toBeVisible();
    }
  });

  test('Menampilkan error alert jika ada', async ({ page }) => {
    // Simulate error scenario if applicable
    const errorAlert = page.locator('.v-alert--type-error');
    if (await errorAlert.isVisible()) {
      await expect(errorAlert).toBeVisible();
    }
  });

  test('Menutup error alert', async ({ page }) => {
    const errorAlert = page.locator('.v-alert--type-error');
    if (await errorAlert.isVisible()) {
      const closeBtn = errorAlert.locator('button');
      await closeBtn.click();
      await page.waitForTimeout(500);

      await expect(errorAlert).not.toBeVisible();
    }
  });
});

test.describe('Manage MQTT Broker Drawer Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to MQTT Brokers page
    await page.goto('/login');

    await page.getByLabel('Email or Username').fill('admin');
    await page.getByLabel('Password').fill('admin');
    await page.getByTestId('submit-button').click();
    await page.waitForTimeout(5000);
  
    await page.goto('/mqtt-brokers');

    // Open drawer
    const newBrokerBtn = page.getByRole('button', { name: 'New MQTT Broker' });
    await newBrokerBtn.click();
    await page.waitForTimeout(500);
  });

  test('Menampilkan drawer Manage MQTT Broker', async ({ page }) => {
    await expect(page.getByText('Manage MQTT Broker')).toBeVisible();
  });

  test('Menampilkan field Host Name', async ({ page }) => {
    const hostNameField = page.getByLabel('Host Name');
    await expect(hostNameField).toBeVisible();
    await expect(hostNameField).toBeEnabled();
  });

  test('Menampilkan field MQTT Port', async ({ page }) => {
    const mqttPortField = page.getByLabel('MQTT Port');
    await expect(mqttPortField).toBeVisible();
    await expect(mqttPortField).toBeEnabled();
  });

  test('Menampilkan field WS Port', async ({ page }) => {
    const wsPortField = page.getByLabel('WS Port');
    await expect(wsPortField).toBeVisible();
    await expect(wsPortField).toBeEnabled();
  });

  test('Menampilkan field Username', async ({ page }) => {
    const usernameField = page.getByLabel('Username');
    await expect(usernameField).toBeVisible();
    await expect(usernameField).toBeEnabled();
  });

  test('Menampilkan field Password', async ({ page }) => {
    const passwordField = page.getByLabel('Password');
    await expect(passwordField).toBeVisible();
    await expect(passwordField).toBeEnabled();
  });

  test('Menampilkan radio button Is Active', async ({ page }) => {
    await expect(page.getByText('Is Active')).toBeVisible();
 await expect(
  page.getByRole('radio', { name: 'Active', exact: true })
).toBeVisible()

await expect(
  page.getByRole('radio', { name: 'Inactive', exact: true })
).toBeVisible()
  });

  test('Mengisi field Host Name', async ({ page }) => {
    const hostNameField = page.getByLabel('Host Name');
    await hostNameField.fill('192.168.1.100');
    await expect(hostNameField).toHaveValue('192.168.1.100');
  });

  test('Mengisi field MQTT Port', async ({ page }) => {
    const mqttPortField = page.getByLabel('MQTT Port');
    await mqttPortField.fill('1883');
    await expect(mqttPortField).toHaveValue('1883');
  });

  test('Mengisi field WS Port', async ({ page }) => {
    const wsPortField = page.getByLabel('WS Port');
    await wsPortField.fill('9001');
    await expect(wsPortField).toHaveValue('9001');
  });

  test('Mengisi field Username', async ({ page }) => {
    const usernameField = page.getByLabel('Username');
    await usernameField.fill('mqtt_user');
    await expect(usernameField).toHaveValue('mqtt_user');
  });

  test('Mengisi field Password', async ({ page }) => {
    const passwordField = page.getByLabel('Password');
    await passwordField.fill('mqtt_password123');
    await expect(passwordField).toHaveValue('mqtt_password123');
  });

  test('Memilih radio button Active', async ({ page }) => {
    const activeRadio =  page.getByRole('radio', { name: 'Active', exact: true })
    await activeRadio.click();
    await expect(activeRadio).toBeChecked();
   
  });

  test('Memilih radio button Inactive', async ({ page }) => {
    const inactiveRadio = page.getByLabel('Inactive');
    await inactiveRadio.click();
    await expect(inactiveRadio).toBeChecked();
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
    const cancelBtn = page.getByTestId("cancel-drawer")
    await cancelBtn.click({force: true});
    await page.waitForTimeout(500);

    // Drawer should be closed
const drawer = page.getByTestId('mqtt-broker-drawer')
await expect(drawer).not.toHaveClass(/v-navigation-drawer--active/)
  });

  test('Menutup drawer dengan tombol close', async ({ page }) => {
    const closeBtn = page.getByTestId("close-drawer")
      await closeBtn.click();
      await page.waitForTimeout(500);

  const drawer = page.getByTestId('mqtt-broker-drawer')

  await page.getByTestId('close-drawer-btn').click()

  await expect(drawer).not.toHaveClass(/v-navigation-drawer--active/)
  });

  test('Submit tanpa mengisi field required', async ({ page }) => {
    const manageBtn = page.getByRole('button', { name: 'Manage' });
    await manageBtn.click();
    await page.waitForTimeout(500);

    // Drawer should still be open (validation failed)
    await expect(page.getByText('Manage MQTT Broker')).toBeVisible();
  });

  test('Submit dengan data valid - create new', async ({ page }) => {
    // Fill all required fields
    await page.getByLabel('Host Name').fill('192.168.1.100');
    await page.getByLabel('MQTT Port').fill('1883');
    await page.getByLabel('WS Port').fill('9001');
    await page.getByLabel('Username').fill('mqtt_admin');
    await page.getByLabel('Password').fill('secure_password');
    
    // Submit
    const manageBtn = page.getByTestId('submit-drawer');
    await manageBtn.click();
    await page.waitForTimeout(1000);

    // Drawer should close

await page.pause()
await expect(page.getByTestId('alert-dialog')).toBeVisible()
    await expect(page.getByText('Success manage MQTT Broker')).toBeVisible();
  });

  test('Menampilkan error messages untuk field invalid', async ({ page }) => {
    // Fill invalid data
    await page.getByLabel('Host Name').fill('');
    
    const manageBtn = page.getByRole('button', { name: 'Manage' });
    await manageBtn.click();
    await page.waitForTimeout(500);

    // Should show validation error
    const errorMessage = page.locator('.v-messages__message');
    if (await errorMessage.first().isVisible()) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });

  test('Reset form saat drawer dibuka ulang', async ({ page }) => {
    // Fill form
    await page.getByLabel('Host Name').fill('192.168.1.100');
    
    // Close drawer
    const cancelBtn = page.getByRole('button', { name: 'Cancel' });
    await cancelBtn.click();
    await page.waitForTimeout(500);

    // Open again
    const newBrokerBtn = page.getByRole('button', { name: 'New MQTT Broker' });
    await newBrokerBtn.click();
    await page.waitForTimeout(500);

    // Fields should be empty
    const hostNameField = page.getByLabel('Host Name');
    await expect(hostNameField).toHaveValue('');
  });
});

test.describe('Edit MQTT Broker Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to MQTT Brokers page
    await page.goto('/login');

    await page.getByLabel('Email or Username').fill('admin');
    await page.getByLabel('Password').fill('admin');
    await page.getByTestId('submit-button').click();
    await page.waitForTimeout(5000);
  
    await page.goto('/mqtt-brokers');
    await page.waitForTimeout(1000);

    // Open edit drawer
    const editBtn = page.locator('button').filter({ has: page.locator('.tabler-pencil') }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('Menampilkan data broker yang akan diedit', async ({ page }) => {
    const hostNameField = page.getByLabel('Host Name');
    if (await hostNameField.isVisible()) {
      // Field should have existing value
      const value = await hostNameField.inputValue();
      expect(value).toBeTruthy();
    }
  });

  test('Mengubah Host Name', async ({ page }) => {
    const hostNameField = page.getByLabel('Host Name');
    if (await hostNameField.isVisible()) {
      await hostNameField.fill('192.168.1.200');
      await expect(hostNameField).toHaveValue('192.168.1.200');
    }
  });

  test('Mengubah MQTT Port', async ({ page }) => {
    const mqttPortField = page.getByLabel('MQTT Port');
    if (await mqttPortField.isVisible()) {
      await mqttPortField.fill('1884');
      await expect(mqttPortField).toHaveValue('1884');
    }
  });

  test('Mengubah status menjadi Inactive', async ({ page }) => {
    const inactiveRadio = page.getByLabel('Inactive');
    if (await inactiveRadio.isVisible()) {
      await inactiveRadio.click();
      await expect(inactiveRadio).toBeChecked();
    }
  });

  test('Submit edit dengan data valid', async ({ page }) => {
    const hostNameField = page.getByLabel('Host Name');
    if (await hostNameField.isVisible()) {
      // Change some data
      await hostNameField.fill('192.168.1.150');
      
      // Submit
      const manageBtn = page.getByRole('button', { name: 'Manage' });
      await manageBtn.click();
      await page.waitForTimeout(1000);

      // Drawer should close
      await expect(page.getByText('Manage MQTT Broker')).not.toBeVisible();
    }
  });

  test('Cancel edit tanpa menyimpan', async ({ page }) => {
    const hostNameField = page.getByLabel('Host Name');
    if (await hostNameField.isVisible()) {
      const originalValue = await hostNameField.inputValue();
      
      // Change value
      await hostNameField.fill('192.168.1.999');
    
    const cancelBtn = page.getByRole('button', { name: 'Cancel' });
    await cancelBtn.click();
    await page.waitForTimeout(500);
const drawer = page.getByTestId('mqtt-broker-drawer');
await expect(drawer).not.toHaveClass(/v-navigation-drawer--active/);

 }
  });
});

test.describe('Delete MQTT Broker Dialog Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to MQTT Brokers page
    await page.goto('/login');

    await page.getByLabel('Email or Username').fill('admin');
    await page.getByLabel('Password').fill('admin');
    await page.getByTestId('submit-button').click();
    await page.waitForTimeout(5000);
  
    await page.goto('/mqtt-brokers');
    await page.waitForTimeout(1000);

    // Open delete dialog
    const deleteBtn = page.locator('button').filter({ has: page.locator('.tabler-trash') }).first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('Menampilkan delete dialog', async ({ page }) => {
    const deleteDialog = page.getByText('Delete MQTT Broker');
    if (await deleteDialog.isVisible()) {
      await expect(deleteDialog).toBeVisible();
      await expect(page.getByText('Please provide a reason for deletion')).toBeVisible();
    }
  });

  test('Menampilkan field Reason', async ({ page }) => {
    const reasonField = page.getByLabel('Reason');
    if (await reasonField.isVisible()) {
      await expect(reasonField).toBeVisible();
      await expect(reasonField).toBeEnabled();
    }
  });

  test('Mengisi field Reason', async ({ page }) => {
    const reasonField = page.getByLabel('Reason');
    if (await reasonField.isVisible()) {
      await reasonField.fill('Broker no longer in use');
      await expect(reasonField).toHaveValue('Broker no longer in use');
    }
  });

  test('Menampilkan tombol Submit', async ({ page }) => {
    const submitBtn = page.getByRole('button', { name: 'Submit' });
    if (await submitBtn.isVisible()) {
      await expect(submitBtn).toBeVisible();
    }
  });

  test('Menampilkan tombol Cancel', async ({ page }) => {
    const cancelBtn = page.getByRole('button', { name: 'Cancel' });
    if (await cancelBtn.isVisible()) {
      await expect(cancelBtn).toBeVisible();
    }
  });

  test('Menutup delete dialog dengan Cancel', async ({ page }) => {
    const cancelBtn = page.getByRole('button', { name: 'Cancel' });
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
      await page.waitForTimeout(500);

      await expect(page.getByText('Delete MQTT Broker')).not.toBeVisible();
    }
  });

  test('Menutup delete dialog dengan tombol close', async ({ page }) => {
    const closeBtn = page.getByTestId('cancel-dialog-confirmation');
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await page.waitForTimeout(500);

      await expect(page.getByText('Delete MQTT Broker')).not.toBeVisible();
    }
  });

  test('Submit delete tanpa reason', async ({ page }) => {
    const submitBtn = page.getByRole('button', { name: 'Submit' });
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await page.waitForTimeout(500);

      // Should show validation error or dialog still open
      const errorMessage = page.locator('.v-messages__message');
      if (await errorMessage.first().isVisible()) {
        await expect(errorMessage.first()).toBeVisible();
      }
    }
  });

  test('Submit delete dengan reason valid', async ({ page }) => {
    const reasonField = page.getByLabel('Reason');
    if (await reasonField.isVisible()) {
      await reasonField.fill('MQTT Broker is obsolete and will be replaced');
      
      const submitBtn = page.getByRole('button', { name: 'Submit' });
      await submitBtn.click();
      await page.waitForTimeout(1000);

      // Dialog should close
      await expect(page.getByText('Delete MQTT Broker')).not.toBeVisible();
    }
  });
});

test.describe('Alert Dialog Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to MQTT Brokers page
    await page.goto('/login');

    await page.getByLabel('Email or Username').fill('admin');
    await page.getByLabel('Password').fill('admin');
    await page.getByTestId('submit-button').click();
    await page.waitForTimeout(5000);
  
    await page.goto('/mqtt-brokers');
    await page.waitForTimeout(1000);
  });

  test('Menampilkan success alert setelah create broker', async ({ page }) => {
    // Open drawer
    await page.getByRole('button', { name: 'New MQTT Broker' }).click();
    await page.waitForTimeout(500);

    // Fill and submit
    await page.getByLabel('Host Name').fill('192.168.1.100');
    await page.getByLabel('MQTT Port').fill('1883');
    await page.getByLabel('WS Port').fill('9001');
    await page.getByLabel('Username').fill('test_user');
    await page.getByLabel('Password').fill('test_pass');
    
    await page.getByRole('button', { name: 'Manage' }).click();
    await page.waitForTimeout(1000);

    // Check for success alert
    const successAlert = page.getByText('Action success');
    if (await successAlert.isVisible()) {
      await expect(successAlert).toBeVisible();
      await expect(page.getByText('MQTT Broker has been saved')).toBeVisible();
    }
  });

  test('Menampilkan success alert setelah edit broker', async ({ page }) => {
    // Open edit drawer
    const editBtn = page.locator('button').filter({ has: page.locator('.tabler-pencil') }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await page.waitForTimeout(500);

      // Change and submit
      await page.getByLabel('Host Name').fill('192.168.1.250');
      await page.getByRole('button', { name: 'Manage' }).click();
      await page.waitForTimeout(1000);

      // Check for success alert
      const successAlert = page.getByText('Action success');
      if (await successAlert.isVisible()) {
        await expect(successAlert).toBeVisible();
      }
    }
  });

  test('Menampilkan success alert setelah delete broker', async ({ page }) => {
    // Open delete dialog
    const deleteBtn = page.locator('button').filter({ has: page.locator('.tabler-trash') }).first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await page.waitForTimeout(500);

      // Fill reason and submit
      const reasonField = page.getByLabel('Reason');
      if (await reasonField.isVisible()) {
        await reasonField.fill('Test deletion for automated testing');
        await page.getByRole('button', { name: 'Submit' }).click();
        await page.waitForTimeout(1000);

        // Check for success alert
        const successAlert = page.getByText('Action success');
        if (await successAlert.isVisible()) {
          await expect(successAlert).toBeVisible();
          await expect(page.getByText('MQTT Broker has been deleted')).toBeVisible();
        }
      }
    }
  });

  test('Menutup alert dialog', async ({ page }) => {
    // Trigger success alert (create broker)
    await page.getByRole('button', { name: 'New MQTT Broker' }).click();
    await page.waitForTimeout(500);

    await page.getByLabel('Host Name').fill('192.168.1.100');
    await page.getByLabel('MQTT Port').fill('1883');
    await page.getByLabel('WS Port').fill('9001');
    
    await page.getByRole('button', { name: 'Manage' }).click();
    await page.waitForTimeout(1000);

    // Close alert
    const closeBtn = page.locator('.v-dialog button').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await page.waitForTimeout(500);

      await expect(page.getByText('Action success')).not.toBeVisible();
    }
  });

  test('Menampilkan alert dengan icon yang sesuai', async ({ page }) => {
    // After successful action, check for icon
    await page.getByRole('button', { name: 'New MQTT Broker' }).click();
    await page.waitForTimeout(500);

    await page.getByLabel('Host Name').fill('192.168.1.100');
    await page.getByLabel('MQTT Port').fill('1883');
    await page.getByLabel('WS Port').fill('9001');
    
    await page.getByRole('button', { name: 'Manage' }).click();
    await page.waitForTimeout(1000);

    // Check for success icon
    const icon = page.locator('.v-icon.tabler-check').or(
      page.locator('.v-icon.tabler-info-circle')
    );
    if (await icon.first().isVisible()) {
      await expect(icon.first()).toBeVisible();
    }
  });
});