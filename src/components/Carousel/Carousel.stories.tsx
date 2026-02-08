import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from '@storybook/test';
import Carousel from './Carousel';
import { mockMovies } from './__mocks__/movies';
import type { ContentItem } from '../../types/api';

const meta = {
  title: 'Components/Carousel',
  component: Carousel,
  args: {
    movies: mockMovies,
    focusedMovie: 0,
    onFocusChange: fn(),
    onSelect: fn(),
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default ──────────────────────────────────────────

/** Standard render with 10 movies. */
export const Default: Story = {};

// ─── Navigation ───────────────────────────────────────

/** Press ArrowRight → onFocusChange(1). */
export const NavigateRight: Story = {
  play: async ({ args }) => {
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => {
      expect(args.onFocusChange).toHaveBeenCalledWith(1);
    });
  },
};

/** Press ArrowLeft at index 0 → onFocusChange(-1). */
export const NavigateLeftBoundary: Story = {
  args: { focusedMovie: 0 },
  play: async ({ args }) => {
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => {
      expect(args.onFocusChange).toHaveBeenCalledWith(-1);
    });
  },
};

/** Focus starts on the third item. */
export const FocusedAtThird: Story = {
  args: { focusedMovie: 2 },
};

// ─── Edge cases ───────────────────────────────────────

/** Empty array: Carousel renders nothing. */
export const Empty: Story = {
  args: { movies: [] },
};

/** Single item: only one card, no scrolling possible. */
export const SingleItem: Story = {
  args: {
    movies: mockMovies.slice(0, 1),
    focusedMovie: 0,
  },
};

/** Two items: minimal scrollable list. */
export const TwoItems: Story = {
  args: {
    movies: mockMovies.slice(0, 2),
    focusedMovie: 0,
  },
};

/** Three items: small list, still navigable. */
export const FewItems: Story = {
  args: {
    movies: mockMovies.slice(0, 3),
    focusedMovie: 0,
  },
};

const generateManyMovies = (count: number): ContentItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    type: 'movie',
    title: `Movie ${i + 1}`,
    year: 2020 + (i % 6),
    duration_in_seconds: 5400 + i * 60,
    synopsis: `Synopsis for Movie ${i + 1}.`,
    images: {
      artwork_portrait: `https://picsum.photos/seed/m${i + 1}/240/360`,
      artwork_landscape: null,
      screenshot_landscape: null,
      screenshot_portrait: null,
      transparent_logo: null,
    },
  }));

/** 50 items: stress test for long lists. */
export const ManyItems: Story = {
  args: {
    movies: generateManyMovies(50),
    focusedMovie: 0,
  },
};

/** 50 items focused on item 25: scroll midway through a long list. */
export const ManyItemsFocusedMiddle: Story = {
  args: {
    movies: generateManyMovies(50),
    focusedMovie: 25,
  },
};

/** Items with missing images: verifies placeholder fallback. */
export const MissingImages: Story = {
  args: {
    movies: mockMovies.map((m) => ({
      ...m,
      images: { ...m.images, artwork_portrait: null },
    })),
    focusedMovie: 0,
  },
};

/** Items with broken image URLs: verifies onError fallback. */
export const BrokenImages: Story = {
  args: {
    movies: mockMovies.map((m) => ({
      ...m,
      images: {
        ...m.images,
        artwork_portrait: 'https://invalid.broken/404.jpg',
      },
    })),
    focusedMovie: 0,
  },
};

/** Focus on last item: verifies end-of-list behavior. */
export const FocusedAtLast: Story = {
  args: {
    focusedMovie: mockMovies.length - 1,
  },
};
