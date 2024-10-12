import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://KevinDeBenedetti.github.io',
  base: '/documentation',
  integrations: [starlight({
    title: 'RunesDoc',
    social: {
      github: 'https://github.com/KevinDeBenedetti',
      linkedin: 'https://www.linkedin.com/in/kevindebenedetti'
    },
    sidebar: [
    {
      label: 'Accueil',
      link: '/home/'
    },
    {
      label: 'Frameworks',
      items: [
        { label: 'Vue', autogenerate: { directory: 'vue' }, collapsed: true },
        { label: 'Nuxt', autogenerate: { directory: 'nuxt' }, collapsed: true },
        { label: 'Symfony', autogenerate: { directory: 'symfony' }, collapsed: true },
        { label: 'Fast API', autogenerate: { directory: 'fast-api' }, collapsed: true },
        { label: 'Django', autogenerate: { directory: 'django' }, collapsed: true },
      ]
    },
    {
      label: 'Langages',
      items: [
        { label: 'PHP', autogenerate: { directory: 'php' }, collapsed: true },

      ]
    },
    {
      label: 'CI / CD',
      items: [
        { label: 'GitHub', autogenerate: { directory: 'github' }, collapsed: true},
        { label: 'Docker', autogenerate: { directory: 'docker' }, collapsed: true },
        { label: 'Hébergement', autogenerate: { directory: 'hosting' }, collapsed: true },

      ]
    },
    {
      label: 'CMS',
      items: [
        { label: 'WordPress', autogenerate: { directory: 'wordpress' }, collapsed: true},
      ]
    },
    {
      label: 'Systèmes d\'exploitation',
      items: [
        { label: 'Mac OS',  autogenerate: { directory: 'macos' }, collapsed: true },
        { label: 'Debian', autogenerate: { directory: 'debian' }, collapsed: true },
        { label: 'Ubuntu', autogenerate: { directory: 'ubuntu' }, collapsed: true },
      ]
    }],
    defaultLocale: 'root',
    locales: {
      root: {
        label: 'Français',
        lang: 'fr-FR'
      },
      en: {
        label: 'English',
        lang: 'en-EN'
      }
    }
  })]
});