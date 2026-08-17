<script setup lang="ts">
const { isDark, toggle: toggleDarkMode } = useDarkMode()
const { count } = useShortlist()

const emit = defineEmits<{
  'toggle-drawer': []
}>()

const route = useRoute()
const isHome = computed(() => route.path === '/')
</script>

<template>
  <header
    class="glass fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8"
  >
    <!-- Logo -->
    <NuxtLink
      to="/"
      class="flex items-center gap-2 no-underline group"
    >
      <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-accent to-teal-accent flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
      </div>
      <span class="font-serif text-xl font-bold text-(--color-text-primary) tracking-tight">
        Shelf
      </span>
    </NuxtLink>

    <!-- Right actions -->
    <div class="flex items-center gap-2">
      <!-- Dark mode toggle -->
      <button
        id="dark-mode-toggle"
        type="button"
        class="relative w-9 h-9 rounded-full flex items-center justify-center text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-surface-secondary) transition-all duration-200 cursor-pointer"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggleDarkMode"
      >
        <!-- Sun icon -->
        <svg
          v-if="isDark"
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
        <!-- Moon icon -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </button>

      <!-- Shortlist button -->
      <button
        id="shortlist-toggle"
        type="button"
        class="relative w-9 h-9 rounded-full flex items-center justify-center text-(--color-text-secondary) hover:text-amber-accent hover:bg-(--color-surface-secondary) transition-all duration-200 cursor-pointer"
        aria-label="Open shortlist"
        @click="emit('toggle-drawer')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          viewBox="0 0 24 24"
          :fill="count > 0 ? 'currentColor' : 'none'"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        <!-- Count badge -->
        <Transition name="badge">
          <span
            v-if="count > 0"
            class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-amber-accent text-white text-[10px] font-bold flex items-center justify-center px-1 leading-none"
          >
            {{ count > 99 ? '99+' : count }}
          </span>
        </Transition>
      </button>
    </div>
  </header>
</template>

<style scoped>
.badge-enter-active,
.badge-leave-active {
  transition: transform 0.2s var(--ease-out-expo), opacity 0.2s ease;
}
.badge-enter-from,
.badge-leave-to {
  transform: scale(0);
  opacity: 0;
}
</style>
