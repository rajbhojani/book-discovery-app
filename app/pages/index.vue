<script setup lang="ts">
useHead({
  title: 'Shelf — Discover Your Next Read',
})

const { searchQuery, results, totalItems, pending, error, hasMore, hasSearched, onSearch, onSearchImmediate, loadMore } = useBookSearch()

const showResults = computed(() => hasSearched.value || pending.value)
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)]">
    <!-- Hero Section -->
    <section
      :class="[
        'flex flex-col items-center justify-center px-4 transition-all duration-500',
        showResults ? 'pt-8 pb-6' : 'pt-24 sm:pt-32 pb-16',
      ]"
    >
      <!-- Branding -->
      <Transition name="hero">
        <div
          v-if="!showResults"
          class="text-center mb-8"
        >
          <h1 class="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-(--color-text-primary) mb-4 tracking-tight">
            Shelf
          </h1>
          <p class="text-lg sm:text-xl text-(--color-text-secondary) max-w-md mx-auto leading-relaxed">
            Discover your next great read. Search millions of books and build your personal shortlist.
          </p>
        </div>
      </Transition>

      <!-- Search -->
      <div class="w-full max-w-2xl mx-auto">
        <SearchInput
          :model-value="searchQuery"
          :large="!showResults"
          :autofocus="true"
          placeholder="Search by title, author, or ISBN..."
          @search="onSearch"
          @submit="onSearchImmediate"
        />
      </div>

      <!-- Result count -->
      <Transition name="fade-slide">
        <p
          v-if="hasSearched && !pending && totalItems > 0"
          class="text-sm text-(--color-text-muted) mt-3"
        >
          Found {{ totalItems.toLocaleString() }} {{ totalItems === 1 ? 'result' : 'results' }}
        </p>
      </Transition>
    </section>

    <!-- Results Section -->
    <Transition name="fade-slide">
      <section
        v-if="showResults"
        class="px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto"
      >
        <!-- Error -->
        <div
          v-if="error"
          class="flex flex-col items-center justify-center py-16 text-center"
        >
          <div class="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-(--color-text-secondary) mb-1">Something went wrong</h3>
          <p class="text-sm text-(--color-text-muted) mb-4">{{ error }}</p>
          <button
            type="button"
            class="px-6 py-2 rounded-full bg-amber-accent text-white text-sm font-medium hover:bg-amber-hover transition-colors duration-200 cursor-pointer"
            @click="onSearchImmediate(searchQuery)"
          >
            Try again
          </button>
        </div>

        <!-- Grid -->
        <BookGrid
          v-else
          :books="results"
          :loading="pending && results.length === 0"
        />

        <!-- Loading more indicator -->
        <div
          v-if="pending && results.length > 0"
          class="flex justify-center py-8"
        >
          <div class="flex items-center gap-2 text-sm text-(--color-text-muted)">
            <svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading more...
          </div>
        </div>

        <!-- Load more button -->
        <div
          v-if="hasMore && !pending"
          class="flex justify-center pt-8"
        >
          <button
            id="load-more-btn"
            type="button"
            class="px-8 py-3 rounded-full border border-(--color-border-subtle) text-(--color-text-secondary) text-sm font-medium hover:border-amber-accent hover:text-amber-accent transition-all duration-200 cursor-pointer"
            @click="loadMore"
          >
            Load more results
          </button>
        </div>
      </section>
    </Transition>
  </div>
</template>

<style scoped>
.hero-leave-active {
  transition: all 0.4s var(--ease-out-expo);
}
.hero-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
  max-height: 0;
  margin-bottom: 0;
  overflow: hidden;
}

.fade-slide-enter-active {
  transition: all 0.4s var(--ease-out-expo);
}
.fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.fade-slide-leave-to {
  opacity: 0;
}
</style>
