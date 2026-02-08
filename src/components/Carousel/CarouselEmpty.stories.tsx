import type { Meta, StoryObj } from '@storybook/react-vite';
import CarouselEmpty from './CarouselEmpty';

const meta = {
  title: 'Components/Carousel/States/Empty',
  component: CarouselEmpty,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CarouselEmpty>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default empty state with generic message. */
export const Default: Story = {};

/** Custom message for filtered/search results. */
export const NoSearchResults: Story = {
  args: {
    message: 'No movies match your search. Try different keywords.',
  },
};

/** Custom message for category with no content. */
export const EmptyCategory: Story = {
  args: {
    message: 'This category has no movies yet. New titles are added weekly.',
  },
};
