<script setup lang="ts">
import { ListTree } from 'lucide-vue-next'

export type ArticleTocLink = {
  id: string
  text: string
  depth?: number
  children?: ArticleTocLink[]
}

const props = defineProps<{
  links: ArticleTocLink[]
}>()

const isOpen = ref(false)
const activeId = ref('')

const flatLinks = computed(() => {
  const flatten = (links: ArticleTocLink[]): ArticleTocLink[] =>
    links.flatMap((link) => [link, ...flatten(link.children || [])])

  return flatten(props.links)
})

const updateActiveId = () => {
  if (!import.meta.client) {
    return
  }

  const headings = flatLinks.value
    .map((link) => document.getElementById(link.id))
    .filter((heading): heading is HTMLElement => Boolean(heading))

  const active = [...headings].reverse().find((heading) => heading.getBoundingClientRect().top <= 120)
  activeId.value = active?.id || headings[0]?.id || ''
}

onMounted(() => {
  updateActiveId()
  window.addEventListener('scroll', updateActiveId, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActiveId)
})
</script>

<template>
  <nav v-if="links.length" class="article-toc" aria-label="文章目录">
    <button type="button" class="article-toc__toggle" @click="isOpen = !isOpen">
      <ListTree :size="18" aria-hidden="true" />
      目录
    </button>

    <ol class="article-toc__list" :class="{ 'is-open': isOpen }">
      <li v-for="link in flatLinks" :key="link.id" :style="{ '--toc-indent': `${Math.max((link.depth || 2) - 2, 0) * 12}px` }">
        <a :href="`#${link.id}`" :class="{ 'is-active': activeId === link.id }">
          {{ link.text }}
        </a>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.article-toc {
  position: sticky;
  top: 96px;
  align-self: start;
  display: grid;
  gap: var(--space-8);
  padding: var(--space-16);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--color-surface) 92%, var(--color-bg));
}

.article-toc__toggle {
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-fg);
  font-weight: 800;
}

.article-toc__list {
  display: grid;
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.article-toc__list a {
  display: block;
  padding: var(--space-4) var(--space-8) var(--space-4) calc(var(--space-8) + var(--toc-indent));
  border-radius: var(--radius-4);
  color: var(--color-text-weak);
  text-decoration: none;
  font-size: 0.9rem;
}

.article-toc__list a:hover,
.article-toc__list a.is-active {
  color: var(--color-fg);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
}

@media (max-width: 980px) {
  .article-toc {
    position: static;
  }

  .article-toc__list {
    display: none;
  }

  .article-toc__list.is-open {
    display: grid;
  }
}

@media (min-width: 981px) {
  .article-toc__toggle {
    pointer-events: none;
  }
}
</style>
