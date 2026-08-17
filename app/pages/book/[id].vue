<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string

const { book, pending, error } = useBookDetail(id)
const { isShortlisted, toggleShortlist } = useShortlist()

const shortlisted = computed(() => book.value ? isShortlisted(book.value.id) : false)

// Dynamic SEO
useHead({
  title: computed(() => book.value ? `${book.value.title} — Shelf` : 'Loading... — Shelf'),
  meta: [
    {
      name: 'description',
      content: computed(() => {
        if (!book.value?.description) return 'Book details on Shelf'
        // Strip HTML and truncate
        const text = book.value.description.replace(/<[^>]*>/g, '')
        return text.length > 160 ? text.slice(0, 157) + '...' : text
      }),
    },
  ],
})

function onToggleShortlist() {
  if (book.value) {
    toggleShortlist(book.value)
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)]">
    <!-- Loading -->
    <BookDetailSkeleton v-if="pending && !book" />

    <!-- Error -->
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center py-24 text-center px-4"
    >
      <div class="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-(--color-text-secondary) mb-2">Book not found</h2>
      <p class="text-sm text-(--color-text-muted) mb-6">We couldn't load this book. It may have been removed.</p>
      <NuxtLink
        to="/"
        class="px-6 py-2.5 rounded-full bg-amber-accent text-white text-sm font-medium hover:bg-amber-hover transition-colors duration-200 no-underline"
      >
        Back to search
      </NuxtLink>
    </div>

    <!-- Book detail -->
    <article
      v-else-if="book"
      class="animate-(--animate-fade-in)"
    >
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <!-- Back link -->
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-1.5 text-sm text-(--color-text-muted) hover:text-amber-accent transition-colors duration-200 mb-8 no-underline group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back to search
        </NuxtLink>

        <div class="flex flex-col md:flex-row gap-8 lg:gap-12">
          <!-- Cover -->
          <div class="flex-shrink-0 mx-auto md:mx-0">
            <BookCover
              :image-links="book.imageLinks"
              :title="book.title"
              size="lg"
              class="shadow-(--shadow-elevated)"
            />
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <!-- Title -->
            <h1 class="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-(--color-text-primary) leading-tight">
              {{ book.title }}
            </h1>
            <p
              v-if="book.subtitle"
              class="text-lg text-(--color-text-secondary) mt-1"
            >
              {{ book.subtitle }}
            </p>

            <!-- Authors -->
            <p
              v-if="book.authors.length > 0"
              class="text-base text-(--color-text-secondary) mt-3"
            >
              by <span class="font-medium text-(--color-text-primary)">{{ book.authors.join(', ') }}</span>
            </p>

            <!-- Metadata pills -->
            <div class="flex flex-wrap gap-2 mt-4">
              <span
                v-if="book.publishYear"
                class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-(--color-surface-secondary) text-(--color-text-secondary) border border-(--color-border-subtle)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                {{ book.publishYear }}
              </span>
              <span
                v-if="book.pageCount"
                class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-(--color-surface-secondary) text-(--color-text-secondary) border border-(--color-border-subtle)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                </svg>
                {{ book.pageCount }} pages
              </span>
              <span
                v-if="book.publisher"
                class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-(--color-surface-secondary) text-(--color-text-secondary) border border-(--color-border-subtle)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                  <path d="M9 22v-4h6v4" />
                  <path d="M8 6h.01" />
                  <path d="M16 6h.01" />
                  <path d="M12 6h.01" />
                  <path d="M12 10h.01" />
                  <path d="M12 14h.01" />
                  <path d="M16 10h.01" />
                  <path d="M16 14h.01" />
                  <path d="M8 10h.01" />
                  <path d="M8 14h.01" />
                </svg>
                {{ book.publisher }}
              </span>
            </div>

            <!-- Categories -->
            <div
              v-if="book.categories.length > 0"
              class="flex flex-wrap gap-2 mt-3"
            >
              <span
                v-for="category in book.categories"
                :key="category"
                class="px-3 py-1 rounded-full text-xs font-medium bg-teal-accent/10 text-teal-accent border border-teal-accent/20"
              >
                {{ category }}
              </span>
            </div>

            <!-- Shortlist CTA -->
            <button
              id="detail-shortlist-btn"
              type="button"
              :class="[
                'mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer',
                shortlisted
                  ? 'bg-amber-accent text-white hover:bg-amber-hover'
                  : 'bg-(--color-surface-secondary) text-(--color-text-primary) border border-(--color-border-subtle) hover:border-amber-accent hover:text-amber-accent',
              ]"
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
              {{ shortlisted ? 'Saved to shortlist' : 'Add to shortlist' }}
            </button>

            <!-- Description -->
            <div
              v-if="book.description"
              class="mt-8 pt-8 border-t border-(--color-border-subtle)"
            >
              <h2 class="text-sm font-semibold text-(--color-text-muted) uppercase tracking-wider mb-3">
                About this book
              </h2>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div
                class="text-sm sm:text-base text-(--color-text-secondary) leading-relaxed prose prose-sm max-w-none [&_p]:mb-3 [&_b]:text-(--color-text-primary) [&_i]:text-(--color-text-secondary) [&_br]:hidden"
                v-html="book.description"
              />
            </div>

            <!-- Rating -->
            <div
              v-if="book.averageRating"
              class="mt-6 flex items-center gap-2"
            >
              <div class="flex items-center gap-0.5">
                <svg
                  v-for="i in 5"
                  :key="i"
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4"
                  :class="i <= Math.round(book.averageRating!) ? 'text-amber-accent' : 'text-(--color-border-subtle)'"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <span class="text-sm text-(--color-text-muted)">
                {{ book.averageRating }}<span v-if="book.ratingsCount"> · {{ book.ratingsCount.toLocaleString() }} {{ book.ratingsCount === 1 ? 'rating' : 'ratings' }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>
