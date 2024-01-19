import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://KevinDeBenedetti.github.io',
	base: '/documentation',
	integrations: [
		starlight({
			title: 'NornsCodingGuide',
			social: {
				github: 'https://github.com/KevinDeBenedetti',
				linkedin: 'https://www.linkedin.com/in/kevindebenedetti'
			},
			sidebar: [
/*				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', link: '/guides/example/' },
					],
				},*/
				{
					label: 'Vue',
					autogenerate: { directory: 'vue' },
					collapsed: true
				},
				{
					label: 'Nuxt',
					autogenerate: { directory: 'nuxt' },
					collapsed: true
				},
				{
					label: 'Symfony',
					autogenerate: { directory: 'symfony' },
					collapsed: true
				},
				{
					label: 'Mac OS',
					autogenerate: { directory: 'macos' },
					collapsed: true
				}
			],
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
		}),
	],
});
