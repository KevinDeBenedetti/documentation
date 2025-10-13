import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const contentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional()
  })
})

export default defineContentConfig({
  collections: {
    content_en: defineCollection({
      type: 'page',
      source: 'en/**/*.md',
      schema: contentSchema
    }),

    content_fr: defineCollection({
      type: 'page',
      source: 'fr/**/*.md',
      schema: contentSchema
    })
  }
})
