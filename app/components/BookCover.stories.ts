import type { Meta, StoryObj } from '@storybook/vue3'
import BookCover from './BookCover.vue'

const meta: Meta<typeof BookCover> = {
  title: 'Components/BookCover',
  component: BookCover,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the cover',
    },
    title: {
      control: 'text',
      description: 'Book title — used for alt text and fallback display',
    },
  },
  decorators: [
    () => ({
      template: '<div style="padding: 20px;"><story /></div>',
    }),
  ],
}

export default meta
type Story = StoryObj<typeof BookCover>

/** Default cover with a real Google Books image */
export const Default: Story = {
  args: {
    title: 'Dune',
    size: 'md',
    imageLinks: {
      thumbnail: 'https://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      smallThumbnail: 'https://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
    },
  },
}

/** No image available — shows a gradient fallback with title */
export const NoImage: Story = {
  args: {
    title: 'A Book Without a Cover',
    size: 'md',
    imageLinks: undefined,
  },
}

/** Small size variant */
export const Small: Story = {
  args: {
    title: 'Small Book',
    size: 'sm',
    imageLinks: {
      thumbnail: 'https://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    },
  },
}

/** Large size variant */
export const Large: Story = {
  args: {
    title: 'Large Book',
    size: 'lg',
    imageLinks: {
      thumbnail: 'https://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    },
  },
}

/** Broken image URL — should gracefully fall back to gradient */
export const BrokenImage: Story = {
  args: {
    title: 'Broken Image Book',
    size: 'md',
    imageLinks: {
      thumbnail: 'https://invalid-url-that-will-fail.com/cover.jpg',
    },
  },
}
