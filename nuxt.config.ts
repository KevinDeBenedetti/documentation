import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_SITE_URL,
      isAdmin: process.env.NUXT_ADMIN === "true" || false,
    },
  },
  // site: {
  //   name: 'Documentation',
  //   url: process.env.NUXT_SITE_URL || 'http://localhost:3000',
  // },
  app: {
    // baseURL is set via NUXT_SITE_URL environment variable for production
    // In development, it defaults to '/'
    baseURL: process.env.NUXT_SITE_URL ? new URL(process.env.NUXT_SITE_URL).pathname : "/",
    head: {
      title: "Documentation",
      meta: [{ name: "description", content: "Documentation site" }],
      link: [{ rel: "icon", type: "image/x-icon", href: "favicon.ico" }],
    },
  },
  robots: { robotsTxt: false },
  modules: [
    "@nuxtjs/i18n",
    "@nuxt/content",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/ui",
  ],
  i18n: {
    baseUrl: process.env.NUXT_SITE_URL || "http://localhost:3000",
    defaultLocale: "fr",
    strategy: "prefix",
    rootRedirect: "/fr",
    locales: [
      {
        code: "en",
        name: "English",
      },
      {
        code: "fr",
        name: "Français",
      },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },
});
