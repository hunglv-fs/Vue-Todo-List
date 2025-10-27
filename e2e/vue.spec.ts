import { test, expect } from '@playwright/test';

test.describe('Vue 3 App E2E Tests', () => {
  test('visits home page and displays welcome content', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('Welcome to Vue 3 + Vite');
    await expect(page.locator('text=A modern Vue.js application')).toBeVisible();
  });

  test('navigates between pages using header links', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to About page
    await page.click('text=About');
    await expect(page).toHaveURL('/about');
    
    // Navigate to Todos page
    await page.click('text=Todos');
    await expect(page).toHaveURL('/todos');
    
    // Navigate back to Home
    await page.click('text=Home');
    await expect(page).toHaveURL('/');
  });

  test('adds and manages todos', async ({ page }) => {
    await page.goto('/todos');
    
    // Wait for page to load
    await expect(page.locator('h2:has-text("Todo List")')).toBeVisible();
    
    // Add a new todo
    await page.fill('input[placeholder="Add a new todo..."]', 'Test todo item');
    await page.click('button:has-text("Add")');
    
    // Go to last page where new todo appears
    await page.click('button:has-text("Next"):visible');
    await page.click('button:has-text("Next"):visible');
    await page.click('button:has-text("Next"):visible');
    
    // Find and verify the new todo
    await expect(page.getByText('Test todo item')).toBeVisible();
    
    // Toggle completion
    const todoRow = page.locator('div').filter({ hasText: 'Test todo item' });
    await todoRow.locator('input[type="checkbox"]').click();
    await expect(todoRow.getByText('Test todo item')).toHaveClass(/line-through/);
  });

  test('exports completed todos to CSV', async ({ page }) => {
    await page.goto('/todos');
    
    // Add and complete a todo
    await page.fill('input[placeholder="Add a new todo..."]', 'Export test todo');
    await page.click('button:has-text("Add")');
    await page.click('input[type="checkbox"]');
    
    // Export CSV
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid="export-csv"]');
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toMatch(/selected-todos-.*\.csv/);
  });

  test('uses bulk actions for todos', async ({ page }) => {
    await page.goto('/todos');
    
    // Add multiple todos
    await page.fill('input[placeholder="Add a new todo..."]', 'Todo 1');
    await page.click('button:has-text("Add")');
    await page.fill('input[placeholder="Add a new todo..."]', 'Todo 2');
    await page.click('button:has-text("Add")');
    
    // Select all todos
    await page.click('button:has-text("Select All")');
    
    // Verify todos are selected (completed)
    const checkboxes = page.locator('input[type="checkbox"]');
    await expect(checkboxes.first()).toBeChecked();
    await expect(checkboxes.nth(1)).toBeChecked();
    
    // Deselect all
    await page.click('button:has-text("Deselect All")');
    await expect(checkboxes.first()).not.toBeChecked();
  });
})
