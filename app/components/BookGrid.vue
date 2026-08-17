<script setup lang="ts">
import type { Book } from '#shared/types/book'

defineProps<{
  books: Book[]
  loading?: boolean
}>()
</script>

<template>
  <div>
    <!-- Loading skeletons -->
    <div
      v-if="loading"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
    >
      <SearchSkeleton />
    </div>

    <!-- Empty state -->
    <div
      v-else-if="books.length === 0"
      class="flex flex-col items-center justify-center py-20 text-center"
    >
      <div class="w-20 h-20 rounded-full bg-(--color-surface-secondary) flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-10 h-10 text-(--color-text-muted)"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-(--color-text-secondary) mb-1">No books found</h3>
      <p class="text-sm text-(--color-text-muted)">Try a different search term</p>
    </div>

    <!-- Book grid -->
    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
    >
      <div
        v-for="(book, index) in books"
        :key="book.id"
        class="animate-(--animate-fade-in)"
        :style="{ animationDelay: `${index * 50}ms` }"
      >
        <BookCard :book="book" />
      </div>
    </div>
  </div>
</template>
