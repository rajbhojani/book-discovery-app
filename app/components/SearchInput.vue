<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
  placeholder?: string
  autofocus?: boolean
  large?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [value: string]
  'submit': [value: string]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)
const localValue = ref(props.modelValue || '')

watch(() => props.modelValue, (val) => {
  localValue.value = val || ''
})

function onInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  localValue.value = value
  emit('update:modelValue', value)
  emit('search', value)
}

function onSubmit() {
  emit('submit', localValue.value)
}

function clear() {
  localValue.value = ''
  emit('update:modelValue', '')
  emit('search', '')
  inputRef.value?.focus()
}

onMounted(() => {
  if (props.autofocus) {
    nextTick(() => inputRef.value?.focus())
  }
})
</script>

<template>
  <form
    class="relative w-full"
    @submit.prevent="onSubmit"
  >
    <!-- Search icon -->
    <div
      class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200"
      :class="isFocused ? 'text-amber-accent' : 'text-(--color-text-muted)'"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        :class="large ? 'w-5 h-5' : 'w-4 h-4'"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    </div>

    <!-- Input -->
    <input
      :id="large ? 'search-input-hero' : 'search-input'"
      ref="inputRef"
      type="search"
      :value="localValue"
      :placeholder="placeholder || 'Search books by title or author...'"
      autocomplete="off"
      :class="[
        'w-full bg-(--color-surface-card) text-(--color-text-primary) placeholder-(--color-text-muted) border border-(--color-border-subtle) rounded-(--radius-full) outline-none transition-all duration-300',
        large
          ? 'pl-12 pr-12 py-4 text-lg'
          : 'pl-10 pr-10 py-2.5 text-sm',
        isFocused
          ? 'border-amber-accent shadow-[0_0_0_3px_rgba(230,162,60,0.15)]'
          : 'hover:border-(--color-border-hover)',
      ]"
      @input="onInput"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />

    <!-- Clear button -->
    <Transition name="fade">
      <button
        v-if="localValue.length > 0"
        type="button"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors duration-200 cursor-pointer"
        aria-label="Clear search"
        @click="clear"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          :class="large ? 'w-5 h-5' : 'w-4 h-4'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </svg>
      </button>
    </Transition>
  </form>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Hide the native search clear button */
input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
}
</style>
