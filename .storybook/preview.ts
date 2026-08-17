import type { Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3'
import { defineComponent, h, ref } from 'vue'
import '../app/assets/css/main.css'

// Global NuxtLink component mockup for Storybook
const NuxtLinkStub = defineComponent({
  name: 'NuxtLink',
  props: {
    to: {
      type: [String, Object],
      required: true,
    },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'a',
        {
          href: typeof props.to === 'string' ? props.to : '#',
          style: { textDecoration: 'none' },
        },
        slots.default ? slots.default() : []
      )
  },
})

// Setup global component stubs and Nuxt composable fallbacks
setup((app) => {
  app.component('NuxtLink', NuxtLinkStub)
})

// Polyfill global useState for Storybook context
const globalState: Record<string, any> = {}
if (typeof (globalThis as any).useState === 'undefined') {
  ;(globalThis as any).useState = (key: string, init: () => any) => {
    if (!globalState[key]) {
      globalState[key] = ref(init ? init() : undefined)
    }
    return globalState[key]
  }
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#faf8f5' },
        { name: 'dark', value: '#0f0f1a' },
      ],
    },
  },
}

export default preview
