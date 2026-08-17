import type { StorybookConfig } from '@storybook/vue3-vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: ['../app/components/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  async viteFinal(config) {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...config.resolve.alias,
      '#shared': path.resolve(__dirname, '../shared'),
      '~': path.resolve(__dirname, '../app'),
      '@': path.resolve(__dirname, '../app'),
    }
    config.plugins = config.plugins || []
    config.plugins.push(vue(), tailwindcss())
    return config
  },
}

export default config
