<script setup lang="ts">
import VisitCount from '~/components/content/VisitCount.vue'
import BaseTag from '~/components/ui/BaseTag.vue'
import WikiSideToc from '~/components/wiki/WikiSideToc.vue'
import type { ContentEntry } from '~/utils/content'

type TocLink = {
  id: string
  text: string
  depth?: number
  children?: TocLink[]
}

type TodoDoc = ContentEntry & {
  body?: {
    toc?: {
      links?: TocLink[]
    }
  }
}

const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
const path = `/todo/${slug}`
const noteDate = computed(() => formatContentDate(getContentDateFromPath(path)))

const { data: page } = await useAsyncData(`todo-${path}`, () => {
  return queryCollection('todo').path(path).first() as Promise<TodoDoc | null>
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Todo not found' })
}

const status = computed(() => (readContentString(page.value || {}, 'status') || 'planned') as 'planned' | 'in-progress' | 'done' | 'paused')
const priority = computed(() => (readContentString(page.value || {}, 'priority') || 'medium') as 'high' | 'medium' | 'low')
const targetDate = computed(() => readContentString(page.value || {}, 'targetDate'))
const tocLinks = computed(() => {
  const flatten = (links: TocLink[]): TocLink[] =>
    links.flatMap((link) => [link, ...flatten(link.children || [])])

  return flatten(page.value?.body?.toc?.links || [])
})
const hasToc = computed(() => tocLinks.value.length > 0)
</script>

<template>
  <div class="todo-detail-layout" :class="{ 'todo-detail-layout--no-toc': !hasToc }">
    <aside v-if="hasToc" class="todo-detail-layout__toc">
      <WikiSideToc :links="tocLinks" />
    </aside>

    <article class="content-detail">
      <header class="todo-header">
        <div class="todo-header__topline">
          <NuxtLink to="/todo">Todo</NuxtLink>
          <VisitCount :path="path" increment />
        </div>
        <h1>{{ page?.title }}</h1>
        <p v-if="page?.description" class="todo-header__description">{{ page.description }}</p>
        <div class="todo-header__meta">
          <time>{{ noteDate }}</time>
          <BaseTag kind="status" :tone="status">{{ status }}</BaseTag>
          <BaseTag kind="priority" :tone="priority">{{ priority }}</BaseTag>
          <span v-if="targetDate">目标 {{ formatContentDate(targetDate) }}</span>
        </div>
      </header>
      <ContentRenderer v-if="page" :value="page" class="content-detail__body" />
    </article>
  </div>
</template>

<style scoped>
.todo-detail-layout {
  width: min(1180px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 820px);
  gap: var(--space-32);
  align-items: start;
}

.todo-detail-layout--no-toc {
  grid-template-columns: minmax(0, 820px);
}

.content-detail {
  width: 100%;
  display: grid;
  gap: var(--space-24);
}

.todo-header {
  display: grid;
  gap: var(--space-12);
  padding: clamp(1rem, 2vw, 1.4rem);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-12);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 7%, transparent), transparent 46%),
    var(--color-surface);
  box-shadow: var(--shadow-soft);
}

.todo-header__topline {
  display: flex;
  justify-content: space-between;
  gap: var(--space-12);
  align-items: center;
}

.todo-header a {
  width: fit-content;
  font-weight: 800;
}

.todo-header h1 {
  max-width: 18ch;
  font-size: clamp(2rem, 4.4vw, 3.3rem);
  overflow-wrap: anywhere;
}

.todo-header__description {
  max-width: 68ch;
}

.todo-header__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
  align-items: center;
  color: var(--color-text-weak);
  font-size: 0.9rem;
  font-weight: 700;
}

.content-detail__body {
  padding: clamp(1rem, 2vw, 1.4rem);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-12);
  background: var(--color-surface);
  color: var(--color-fg);
  box-shadow: var(--shadow-soft);
}

@media (max-width: 980px) {
  .todo-detail-layout {
    grid-template-columns: 1fr;
  }
}
</style>
