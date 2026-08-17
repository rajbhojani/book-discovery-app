import type { Book } from '#shared/types/book'
import { normalizeVolume } from '#shared/types/book'
import type { GoogleBooksVolume } from '#shared/types/book'

/**
 * Composable to fetch a single book's detail from the server proxy.
 */
export function useBookDetail(id: string | Ref<string>) {
  const bookId = toRef(id)

  const { data: rawData, pending, error, refresh } = useFetch<GoogleBooksVolume>(
    () => `/api/books/${bookId.value}`,
    {
      key: `book-detail-${bookId.value}`,
      watch: [bookId],
    }
  )

  const book = computed<Book | null>(() => {
    if (!rawData.value) return null
    return normalizeVolume(rawData.value)
  })

  return {
    book,
    pending,
    error,
    refresh,
  }
}
