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
    baseURL: "/documentation/",
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
    strategy: "prefix_except_default",
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
  },
});
