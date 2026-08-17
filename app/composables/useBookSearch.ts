import type { Book } from '#shared/types/book'
import { normalizeVolume } from '#shared/types/book'
import type { GoogleBooksSearchResponse } from '#shared/types/book'

/**
 * Composable for searching books via the server proxy.
 * Provides debounced search, pagination, and normalized results.
 */
export function useBookSearch() {
  const searchQuery = ref('')
  const results = ref<Book[]>([])
  const totalItems = ref(0)
  const pending = ref(false)
  const error = ref<string | null>(null)
  const startIndex = ref(0)
  const maxResults = 20
  const hasMore = computed(() => startIndex.value + maxResults < totalItems.value)
  const hasSearched = ref(false)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  async function search(query: string, append = false) {
    if (!query.trim()) {
      results.value = []
      totalItems.value = 0
      hasSearched.value = false
      return
    }

    pending.value = true
    error.value = null

    try {
      const data = await $fetch<GoogleBooksSearchResponse>('/api/books/search', {
        query: {
          q: query,
          startIndex: append ? startIndex.value : 0,
          maxResults,
        },
      })

      const normalized = (data.items ?? []).map(normalizeVolume)

      if (append) {
        results.value = [...results.value, ...normalized]
      } else {
        results.value = normalized
        startIndex.value = 0
      }

      totalItems.value = data.totalItems ?? 0
      hasSearched.value = true
    } catch (e: any) {
      error.value = e?.data?.statusMessage || e?.message || 'Something went wrong'
      if (!append) {
        results.value = []
        totalItems.value = 0
      }
    } finally {
      pending.value = false
    }
  }

  function debouncedSearch(query: string) {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => search(query), 300)
  }

  function loadMore() {
    startIndex.value += maxResults
    search(searchQuery.value, true)
  }

  function onSearch(query: string) {
    searchQuery.value = query
    debouncedSearch(query)
  }

  function onSearchImmediate(query: string) {
    searchQuery.value = query
    if (debounceTimer) clearTimeout(debounceTimer)
    search(query)
  }

  return {
    searchQuery,
    results,
    totalItems,
    pending,
    error,
    hasMore,
    hasSearched,
    onSearch,
    onSearchImmediate,
    loadMore,
  }
}
