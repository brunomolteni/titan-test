import { test, expect } from '@playwright/test';

const stories = [
  { id: 'components-carousel--default', name: 'Carousel Default' },
  { id: 'components-carousel--focused-at-third', name: 'Carousel Focused Third' },
  { id: 'components-carouselitem--default', name: 'CarouselItem Default' },
  { id: 'components-carouselitem--focused', name: 'CarouselItem Focused' },
];

for (const story of stories) {
  test(`visual: ${story.name}`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
    // Wait for content to render
    await page.waitForLoadState('networkidle');
    // Give animations time to settle
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot(`${story.id}.png`, {
      maxDiffPixelRatio: 0.01,
    });
  });
}
