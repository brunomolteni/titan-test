import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from '@storybook/test';
import Carousel from './Carousel';
import { mockMovies } from './__mocks__/movies';

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

// Basic render
export const Default: Story = {};

// Test ArrowRight navigation
export const NavigateRight: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    // Press right arrow key
    await userEvent.keyboard('{ArrowRight}');
    // Assert callback was called with index 1
    await waitFor(() => {
      expect(args.onFocusChange).toHaveBeenCalledWith(1);
    });
  },
};

// Test ArrowLeft at boundary (index 0)
export const NavigateLeftBoundary: Story = {
  args: {
    focusedMovie: 0,
  },
  play: async ({ args }) => {
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => {
      expect(args.onFocusChange).toHaveBeenCalledWith(-1);
    });
  },
};

// Render with focus on third item
export const FocusedAtThird: Story = {
  args: {
    focusedMovie: 2,
  },
};
