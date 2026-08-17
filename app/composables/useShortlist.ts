import { computed, onMounted, watch, ref } from 'vue'
import type { Book } from '#shared/types/book'

const STORAGE_KEY = 'shelf-shortlist'
const MAX_ITEMS = 50

// Shared reactive state for environments where useState is not present (like Storybook)
const fallbackShortlist = ref<Book[]>([])

/**
 * Composable for managing the user's book shortlist.
 * Persists to localStorage so it survives page refresh.
 */
export function useShortlist() {
  const shortlist = typeof useState === 'function'
    ? useState<Book[]>('shortlist', () => [])
    : fallbackShortlist

  // Hydrate from localStorage on client
  if (import.meta.client) {
    onMounted(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          shortlist.value = JSON.parse(stored)
        }
      } catch {
        // Corrupt data — reset
        localStorage.removeItem(STORAGE_KEY)
      }
    })

    // Persist whenever shortlist changes
    watch(
      shortlist,
      (val) => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
        } catch {
          // Storage full — silently fail
        }
      },
      { deep: true }
    )
  }

  function addToShortlist(book: Book) {
    if (shortlist.value.length >= MAX_ITEMS) return
    if (shortlist.value.some((b) => b.id === book.id)) return
    shortlist.value = [book, ...shortlist.value]
  }

  function removeFromShortlist(id: string) {
    shortlist.value = shortlist.value.filter((b) => b.id !== id)
  }

  function isShortlisted(id: string): boolean {
    return shortlist.value.some((b) => b.id === id)
  }

  function toggleShortlist(book: Book) {
    if (isShortlisted(book.id)) {
      removeFromShortlist(book.id)
    } else {
      addToShortlist(book)
    }
  }

  const count = computed(() => shortlist.value.length)

  return {
    shortlist,
    count,
    addToShortlist,
    removeFromShortlist,
    isShortlisted,
    toggleShortlist,
  }
}
