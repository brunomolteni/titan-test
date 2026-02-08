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

  test('scrolls to show focused item when rendering FocusedAtThird story', async ({ page }) => {
    await page.goto('/iframe.html?id=components-carousel--focused-at-third&viewMode=story');
    await page.waitForSelector('[role="listbox"]');

    // Carousel uses translateX for scrolling (not native scrollLeft).
    // Target the carousel's <ul> inside [role="listbox"], not a Storybook wrapper <ul>.
    const list = page.locator('[role="listbox"] ul');
    await expect(async () => {
      const transform = await list.evaluate((el) => el.style.transform);
      expect(transform).toMatch(/translateX\(-\d+/);
    }).toPass({ timeout: 2000 });
  });

  test('items display poster images', async ({ page }) => {
    const images = page.locator('[role="option"] img');
    await expect(images).toHaveCount(10);
    // Verify first image has a src attribute
    const firstImgSrc = await images.first().getAttribute('src');
    expect(firstImgSrc).toBeTruthy();
  });
});
