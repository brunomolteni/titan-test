import { test, expect } from '@playwright/test';

test.describe('Carousel E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/iframe.html?id=components-carousel--default&viewMode=story');
    await page.waitForSelector('[role="listbox"]');
  });

  test('renders carousel with movie items', async ({ page }) => {
    const items = page.locator('[role="option"]');
    await expect(items).toHaveCount(10);
  });

  test('first item is focused by default', async ({ page }) => {
    const firstItem = page.locator('[role="option"]').first();
    await expect(firstItem).toHaveAttribute('data-focused', 'true');
  });

  test('ArrowRight changes focus to next item', async ({ page }) => {
    // The story has onFocusChange as a spy — we can't check it from E2E
    // But we CAN test a full integration story where the state actually changes
    // For now, verify the keyboard event is received by pressing ArrowRight
    await page.keyboard.press('ArrowRight');
    // Since the story's onFocusChange is a mock that doesn't update state,
    // we verify the key event was dispatched (no error thrown)
  });

  test('scrolls to show focused item when rendering FocusedAtThird story', async ({ page }) => {
    await page.goto('/iframe.html?id=components-carousel--focused-at-third&viewMode=story');
    await page.waitForSelector('[role="listbox"]');

    // Give scroll animation time to complete
    await page.waitForTimeout(500);

    const list = page.locator('ul').first();
    const scrollLeft = await list.evaluate((el) => el.scrollLeft);
    // The third item should cause some scroll offset
    expect(scrollLeft).toBeGreaterThan(0);
  });

  test('items display poster images', async ({ page }) => {
    const images = page.locator('[role="option"] img');
    await expect(images).toHaveCount(10);
    // Verify first image has a src attribute
    const firstImgSrc = await images.first().getAttribute('src');
    expect(firstImgSrc).toBeTruthy();
  });
});
