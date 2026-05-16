<script setup lang="ts">
import WikiDocHeader from '~/components/wiki/WikiDocHeader.vue'
import WikiSideToc from '~/components/wiki/WikiSideToc.vue'
import type { ContentEntry } from '~/utils/content'

type TocLink = {
  id: string
  text: string
  depth?: number
  children?: TocLink[]
}

type WikiDoc = ContentEntry & {
  body?: {
    toc?: {
      links?: TocLink[]
    }
  }
}

const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
const path = `/wiki/${slug}`

const { data: page } = await useAsyncData(`wiki-${path}`, () => {
  return queryCollection('wiki').path(path).first() as Promise<WikiDoc | null>
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Wiki not found' })
}

const tocLinks = computed(() => {
  const flatten = (links: TocLink[]): TocLink[] =>
    links.flatMap((link) => [link, ...flatten(link.children || [])])

  return flatten(page.value?.body?.toc?.links || [])
})
</script>

<template>
  <div v-if="page" class="wiki-detail-layout">
    <article class="content-detail">
      <WikiDocHeader :doc="page" :path="path" />
      <ContentRenderer :value="page" class="content-detail__body" />
    </article>

    <aside class="wiki-detail-layout__toc">
      <WikiSideToc :links="tocLinks" />
    </aside>
  </div>
</template>

<style scoped>
.wiki-detail-layout {
  width: min(1180px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 860px) minmax(220px, 280px);
  gap: var(--space-32);
  align-items: start;
}

.content-detail {
  display: grid;
  gap: var(--space-32);
}

.content-detail__body {
  color: var(--color-fg);
}

@media (max-width: 980px) {
  .wiki-detail-layout {
    grid-template-columns: 1fr;
  }

  .wiki-detail-layout__toc {
    order: -1;
  }
}
</style>
