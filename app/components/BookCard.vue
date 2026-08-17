<script setup lang="ts">
import { computed } from 'vue'
import type { Book } from '#shared/types/book'
import BookCover from './BookCover.vue'
import { useShortlist } from '~/composables/useShortlist'

const props = defineProps<{
  book: Book
}>()

const { isShortlisted, toggleShortlist } = useShortlist()

const shortlisted = computed(() => isShortlisted(props.book.id))

function onToggleShortlist(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  toggleShortlist(props.book)
}
</script>

<template>
  <NuxtLink
    :to="`/book/${book.id}`"
    class="group block no-underline"
  >
    <article
      :id="`book-card-${book.id}`"
      class="relative bg-(--color-surface-card) rounded-(--radius-lg) overflow-hidden shadow-(--shadow-card) transition-all duration-300 hover:shadow-(--shadow-card-hover) hover:-translate-y-1 border border-(--color-border-subtle)"
    >
      <!-- Cover -->
      <div class="relative aspect-[2/3] overflow-hidden">
        <BookCover
          :image-links="book.imageLinks"
          :title="book.title"
          size="md"
          class="!w-full !h-full !rounded-none"
        />

        <!-- Shortlist button overlay -->
        <button
          :id="`shortlist-btn-${book.id}`"
          type="button"
          class="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
          :class="[
            shortlisted
              ? 'bg-amber-accent text-white shadow-lg scale-100'
              : 'bg-black/30 text-white/80 hover:bg-black/50 hover:text-white opacity-0 group-hover:opacity-100',
          ]"
          :aria-label="shortlisted ? 'Remove from shortlist' : 'Add to shortlist'"
          @click="onToggleShortlist"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            viewBox="0 0 24 24"
            :fill="shortlisted ? 'currentColor' : 'none'"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      <!-- Info -->
      <div class="p-3 space-y-1">
        <h3
          class="text-sm font-semibold text-(--color-text-primary) leading-tight line-clamp-2 group-hover:text-amber-accent transition-colors duration-200"
        >
          {{ book.title }}
        </h3>
        <p
          v-if="book.authors.length > 0"
          class="text-xs text-(--color-text-secondary) line-clamp-1"
        >
          {{ book.authors.join(', ') }}
        </p>
        <p
          v-if="book.publishYear"
          class="text-xs text-(--color-text-muted)"
        >
          {{ book.publishYear }}
        </p>
      </div>
    </article>
  </NuxtLink>
</template>
