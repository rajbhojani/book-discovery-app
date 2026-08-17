<script setup lang="ts">
const drawerOpen = ref(false)

function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value
}

// Close drawer on route change
const route = useRoute()
watch(() => route.fullPath, () => {
  drawerOpen.value = false
})
</script>

<template>
  <div class="min-h-screen bg-(--color-surface-primary) text-(--color-text-primary) transition-colors duration-300">
    <AppHeader @toggle-drawer="toggleDrawer" />
    <main class="pt-16">
      <slot />
    </main>
    <ShortlistDrawer :open="drawerOpen" @close="drawerOpen = false" />
  </div>
</template>
