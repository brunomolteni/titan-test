import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import CarouselError from './CarouselError';

const meta = {
  title: 'Components/Carousel/States/Error',
  component: CarouselError,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CarouselError>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Network error with retry button. */
export const NetworkError: Story = {
  args: {
    error: new Error('Network request failed. Please check your connection.'),
    onRetry: fn(),
  },
};

/** API error (e.g. 500) with retry button. */
export const ServerError: Story = {
  args: {
    error: new Error('Failed to fetch movies (500)'),
    onRetry: fn(),
  },
};

/** Timeout error with retry button. */
export const TimeoutError: Story = {
  args: {
    error: new Error('Request timed out. The server took too long to respond.'),
    onRetry: fn(),
  },
};

/** Error without retry — no button rendered. */
export const NoRetry: Story = {
  args: {
    error: new Error('This content is not available in your region.'),
  },
};
