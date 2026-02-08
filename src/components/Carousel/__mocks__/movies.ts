import type { ContentItem } from '../../../types/api';

export const mockMovies: ContentItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  type: 'movie',
  title: `Movie ${i + 1}`,
  year: 2020 + i,
  duration_in_seconds: 5400 + i * 600,
  synopsis: `Synopsis for Movie ${i + 1}. A captivating story that unfolds in unexpected ways.`,
  images: {
    artwork_portrait: `https://picsum.photos/seed/${i + 1}/240/360`,
    artwork_landscape: null,
    screenshot_landscape: null,
    screenshot_portrait: null,
    transparent_logo: null,
  },
}));
