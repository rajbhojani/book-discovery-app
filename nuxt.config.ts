// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  runtimeConfig: {
    // Private — only available on the server at runtime.
    // Default to empty string so Nitro does not inline the build-time secret into the bundle.
    googleBooksApiKey: '',
  },

  app: {
    head: {
      title: 'Shelf — Discover Your Next Read',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Shelf is a beautiful book discovery app. Search millions of books, explore details, and build your personal reading shortlist.' },
        { name: 'theme-color', content: '#1a1a2e' },
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
})
