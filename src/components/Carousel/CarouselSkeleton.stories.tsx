import type { Meta, StoryObj } from '@storybook/react-vite';
import CarouselSkeleton from './CarouselSkeleton';

const meta = {
  title: 'Components/Carousel/States/Loading',
  component: CarouselSkeleton,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CarouselSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default shimmer skeleton with 8 placeholder items. */
export const Default: Story = {};

/** Fewer placeholders — e.g. when expecting a small dataset. */
export const FewPlaceholders: Story = {
  args: { count: 3 },
};

/** Many placeholders — e.g. when expecting a large dataset. */
export const ManyPlaceholders: Story = {
  args: { count: 20 },
};
