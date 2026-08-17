import type { Meta, StoryObj } from '@storybook/vue3'
import BookCard from './BookCard.vue'
import type { Book } from '#shared/types/book'

const mockBook: Book = {
  id: 'dune-1',
  title: 'Dune',
  subtitle: 'Book One in the Dune Chronicles',
  authors: ['Frank Herbert'],
  publisher: 'Ace Books',
  publishedDate: '1965-08-01',
  publishYear: '1965',
  description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.',
  pageCount: 688,
  categories: ['Science Fiction', 'Fantasy'],
  averageRating: 4.5,
  ratingsCount: 12345,
  imageLinks: {
    thumbnail: 'https://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    smallThumbnail: 'https://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
  },
  language: 'en',
}

const meta: Meta<typeof BookCard> = {
  title: 'Components/BookCard',
  component: BookCard,
  tags: ['autodocs'],
  argTypes: {
    book: {
      description: 'The book data to display',
    },
  },
  decorators: [
    () => ({
      template: '<div style="max-width: 220px; padding: 20px;"><story /></div>',
    }),
  ],
}

export default meta
type Story = StoryObj<typeof BookCard>

/** Default book card with all fields populated */
export const Default: Story = {
  args: {
    book: mockBook,
  },
}

/** A book with no cover image — shows the gradient fallback */
export const NoCover: Story = {
  args: {
    book: {
      ...mockBook,
      id: 'no-cover',
      imageLinks: undefined,
    },
  },
}

/** A book with a very long title and multiple authors */
export const LongTitle: Story = {
  args: {
    book: {
      ...mockBook,
      id: 'long-title',
      title: 'The Extraordinarily Long and Comprehensive Guide to Everything You Never Wanted to Know',
      authors: ['Author One', 'Author Two', 'Author Three', 'Author Four'],
    },
  },
}

/** A book with minimal data — only title and ID */
export const MinimalData: Story = {
  args: {
    book: {
      id: 'minimal',
      title: 'Minimal Book',
      authors: [],
      categories: [],
    },
  },
}
