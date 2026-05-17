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
    <div class="article-toc__head">
      <span class="article-toc__label">
        <ListTree :size="18" aria-hidden="true" />
        目录
      </span>
      <button type="button" class="article-toc__toggle" :aria-expanded="isOpen" @click="isOpen = !isOpen">
        收起
      </button>
    </div>

    <ol class="article-toc__list" :class="{ 'is-open': isOpen }">
      <li
        v-for="(link, index) in flatLinks"
        :key="link.id"
        class="article-toc__item"
        :style="{ '--toc-indent': `${Math.max((link.depth || 2) - 2, 0) * 14}px` }"
      >
        <a :href="`#${link.id}`" :class="{ 'is-active': activeId === link.id }">
          <span class="article-toc__number">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="article-toc__text">{{ link.text }}</span>
        </a>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.article-toc {
  position: sticky;
  top: 24px;
  align-self: start;
  display: grid;
  gap: 12px;
  padding: 14px;
  max-height: calc(100vh - 48px);
  overflow: auto;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
}

.article-toc__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.article-toc__label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-fg);
  font-weight: 800;
}

.article-toc__toggle {
  display: none;
  color: var(--color-text-weak);
  font-size: 0.86rem;
  font-weight: 700;
}

.article-toc__list {
  display: grid;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.article-toc__item {
  --toc-indent: 0px;
}

.article-toc__list a {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: var(--space-8);
  padding: 8px 10px 8px calc(10px + var(--toc-indent));
  border: 1px solid transparent;
  border-radius: var(--radius-6);
  color: var(--color-text-weak);
  text-decoration: none;
  font-size: 0.9rem;
  line-height: 1.35;
  transition: all 0.18s ease;
}

.article-toc__list a:hover,
.article-toc__list a.is-active {
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  border-color: color-mix(in srgb, var(--color-primary) 26%, transparent);
}

.article-toc__text {
  min-width: 0;
  overflow-wrap: anywhere;
}

.article-toc__number {
  color: var(--color-primary);
  font-size: 0.82rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
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
  .article-toc__toggle {
    display: inline-flex;
  }
}
</style>
