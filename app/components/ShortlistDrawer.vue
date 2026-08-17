<script setup lang="ts">
import type { Book } from '#shared/types/book'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { shortlist, removeFromShortlist, count } = useShortlist()

function onRemove(id: string) {
  removeFromShortlist(id)
}
</script>

<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <Transition name="backdrop">
      <div
        v-if="open"
        class="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
        @click="emit('close')"
      />
    </Transition>

    <!-- Drawer -->
    <Transition name="drawer">
      <aside
        v-if="open"
        id="shortlist-drawer"
        class="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-sm bg-(--color-surface-elevated) shadow-(--shadow-drawer) flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-(--color-border-subtle)">
          <div>
            <h2 class="text-lg font-semibold text-(--color-text-primary)">Your Shortlist</h2>
            <p class="text-xs text-(--color-text-muted)">{{ count }} {{ count === 1 ? 'book' : 'books' }} saved</p>
          </div>
          <button
            type="button"
            class="w-8 h-8 rounded-full flex items-center justify-center text-(--color-text-muted) hover:text-(--color-text-primary) hover:bg-(--color-surface-secondary) transition-colors duration-200 cursor-pointer"
            aria-label="Close shortlist"
            @click="emit('close')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <!-- List -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <TransitionGroup name="list">
            <div
              v-for="book in shortlist"
              :key="book.id"
              class="flex items-start gap-3 p-3 rounded-(--radius-md) bg-(--color-surface-card) border border-(--color-border-subtle) hover:border-(--color-border-hover) transition-all duration-200"
            >
              <!-- Cover -->
              <NuxtLink :to="`/book/${book.id}`" @click="emit('close')">
                <BookCover
                  :image-links="book.imageLinks"
                  :title="book.title"
                  size="sm"
                  class="!w-12 !h-18"
                />
              </NuxtLink>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <NuxtLink
                  :to="`/book/${book.id}`"
                  class="text-sm font-medium text-(--color-text-primary) hover:text-amber-accent transition-colors duration-200 line-clamp-2 no-underline"
                  @click="emit('close')"
                >
                  {{ book.title }}
                </NuxtLink>
                <p v-if="book.authors.length" class="text-xs text-(--color-text-muted) mt-0.5 line-clamp-1">
                  {{ book.authors.join(', ') }}
                </p>
              </div>

              <!-- Remove button -->
              <button
                type="button"
                class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-(--color-text-muted) hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 cursor-pointer"
                :aria-label="`Remove ${book.title} from shortlist`"
                @click="onRemove(book.id)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>
            </div>
          </TransitionGroup>

          <!-- Empty state -->
          <div
            v-if="count === 0"
            class="flex flex-col items-center justify-center py-16 text-center"
          >
            <div class="w-16 h-16 rounded-full bg-(--color-surface-secondary) flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-(--color-text-muted)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-(--color-text-secondary) mb-1">No books saved yet</h3>
            <p class="text-xs text-(--color-text-muted) max-w-48">
              Click the bookmark icon on any book to save it here
            </p>
          </div>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Backdrop */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}
.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

/* Drawer slide */
.drawer-enter-active {
  transition: transform 0.35s var(--ease-out-expo);
}
.drawer-leave-active {
  transition: transform 0.25s ease-in;
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}

/* List items */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s var(--ease-out-expo);
}
.list-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.list-move {
  transition: transform 0.3s var(--ease-out-expo);
}
</style>
