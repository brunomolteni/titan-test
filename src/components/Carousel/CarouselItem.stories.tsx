import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from '@storybook/test';
import CarouselItem from './CarouselItem';
import type { ContentItem } from '../../types/api';

const mockMovie: ContentItem = {
  id: 1,
  type: 'movie',
  title: 'Test Movie',
  year: 2024,
  duration_in_seconds: 7200,
  synopsis: 'A test movie',
  images: {
    artwork_portrait: 'https://picsum.photos/seed/1/240/360',
    artwork_landscape: null,
    screenshot_landscape: null,
    screenshot_portrait: null,
    transparent_logo: null,
  },
};

const meta = {
  title: 'Components/CarouselItem',
  component: CarouselItem,
  args: {
    movie: mockMovie,
    isFocused: false,
    onSelect: fn(),
  },
  decorators: [
    (Story) => (
      <ul style={{ listStyle: 'none', display: 'flex', padding: 0 }}>
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<typeof CarouselItem>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default unfocused state
export const Default: Story = {};

// Focused state with scale + focus ring
export const Focused: Story = {
  args: {
    isFocused: true,
  },
};

// Click interaction test
export const ClickSelect: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const item = canvas.getByRole('option');
    await userEvent.click(item);
    expect(args.onSelect).toHaveBeenCalledWith(mockMovie);
  },
};

// Enter key interaction test
export const EnterKeySelect: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const item = canvas.getByRole('option');
    item.focus();
    await userEvent.keyboard('{Enter}');
    expect(args.onSelect).toHaveBeenCalledWith(mockMovie);
  },
};
