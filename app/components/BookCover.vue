<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ImageLinks } from '#shared/types/book'
import { getCoverUrl } from '#shared/types/book'

const props = defineProps<{
  imageLinks?: ImageLinks
  title: string
  size?: 'sm' | 'md' | 'lg'
}>()

const sizeToPreference: Record<string, 'small' | 'medium' | 'large'> = {
  sm: 'small',
  md: 'medium',
  lg: 'large',
}

const sizeClasses: Record<string, string> = {
  sm: 'w-24 h-36',
  md: 'w-32 h-48',
  lg: 'w-48 h-72',
}

const coverUrl = computed(() => getCoverUrl(props.imageLinks, sizeToPreference[props.size || 'md']))
const imageLoaded = ref(false)
const imageError = ref(false)

function onLoad() {
  imageLoaded.value = true
}

function onError() {
  imageError.value = true
}

// Generate a deterministic gradient from the title
const gradientColors = computed(() => {
  let hash = 0
  for (let i = 0; i < props.title.length; i++) {
    hash = props.title.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue1 = Math.abs(hash % 360)
  const hue2 = (hue1 + 40) % 360
  return {
    from: `hsl(${hue1}, 45%, 35%)`,
    to: `hsl(${hue2}, 55%, 25%)`,
  }
})
</script>

<template>
  <div
    :class="[
      'relative overflow-hidden rounded-(--radius-md) flex-shrink-0',
      sizeClasses[size || 'md'],
    ]"
  >
    <!-- Actual cover image -->
    <img
      v-if="coverUrl && !imageError"
      :src="coverUrl"
      :alt="`Cover of ${title}`"
      :class="[
        'w-full h-full object-cover transition-opacity duration-500',
        imageLoaded ? 'opacity-100' : 'opacity-0',
      ]"
      loading="lazy"
      @load="onLoad"
      @error="onError"
    />

    <!-- Fallback gradient with title -->
    <div
      v-if="!coverUrl || imageError || !imageLoaded"
      :class="[
        'absolute inset-0 flex flex-col items-center justify-center p-3 text-center',
        coverUrl && !imageError ? 'opacity-100' : '',
      ]"
      :style="{
        background: `linear-gradient(135deg, ${gradientColors.from}, ${gradientColors.to})`,
      }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6 text-white/40 mb-2"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      </svg>
      <span class="text-white/70 text-xs font-medium leading-tight line-clamp-3">
        {{ title }}
      </span>
    </div>
  </div>
</template>
