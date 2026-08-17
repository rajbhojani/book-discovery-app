<template>
  <div class="space-y-4">
    <div
      v-for="i in 10"
      :key="i"
      class="bg-(--color-surface-card) rounded-(--radius-lg) overflow-hidden border border-(--color-border-subtle)"
    >
      <div class="aspect-[2/3] skeleton" />
      <div class="p-3 space-y-2">
        <div class="h-4 skeleton w-3/4" />
        <div class="h-3 skeleton w-1/2" />
        <div class="h-3 skeleton w-1/4" />
      </div>
    </div>
  </div>
</template>
