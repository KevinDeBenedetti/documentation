import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      isAdmin: process.env.NUXT_ADMIN === 'true' || false,
    },
  },
  site: {
    name: 'Documentation',
  },
  app: {
    baseURL: '/documentation/',
  },
  robots: { robotsTxt: false },
  modules: [
    '@nuxtjs/i18n',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
  ],
  i18n: {
    defaultLocale: 'fr',
    locales: [{
      code: 'en',
      name: 'English',
    }, {
      code: 'fr',
      name: 'Français',
    }],
  },
})