export default defineNuxtConfig({
  site: {
    name: 'Documentation',
  },
  app: {
    baseURL: '/documentation/',
  },
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