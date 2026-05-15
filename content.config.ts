import { defineCollection, defineContentConfig } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
    }),
    wiki: defineCollection({
      type: 'page',
      source: 'wiki/**/*.md',
    }),
    todo: defineCollection({
      type: 'page',
      source: 'todo/**/*.md',
    }),
  },
})
