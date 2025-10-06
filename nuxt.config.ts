export default defineNuxtConfig({
  site: {
    name: 'Documentation',
  },
  app: {
    baseURL: '/documentation/',
  },

  // nitro: {
  //   prerender: {
  //     routes: ['/'], // Ajoute la route racine
  //     crawlLinks: true, // Parcourt automatiquement tous les liens
  //     failOnError: false,
  //   },
  //   // Configuration pour servir les fichiers statiques correctement
  //   static: true,
  // },
  // ssr: true,
  // router: {
  //   options: {
  //     strict: false,
  //   },
  // },

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
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    locales: [{
      code: 'en',
      name: 'English',
    }, {
      code: 'fr',
      name: 'Français',
    }],
    // detectBrowserLanguage: false
  },
})