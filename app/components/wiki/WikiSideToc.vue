<script setup lang="ts">
import { ListTree } from 'lucide-vue-next'

type TocLink = {
  id: string
  text: string
  depth?: number
}

const props = defineProps<{
  links: TocLink[]
}>()

const isOpen = ref(false)
const activeId = ref('')

const updateActive = () => {
  if (!import.meta.client) {
    return
  }

  const headings = props.links
    .map((link) => document.getElementById(link.id))
    .filter((heading): heading is HTMLElement => Boolean(heading))

  const current = [...headings].reverse().find((heading) => heading.getBoundingClientRect().top <= 120)
  activeId.value = current?.id || headings[0]?.id || ''
}

onMounted(() => {
  updateActive()
  window.addEventListener('scroll', updateActive, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActive)
})
</script>

<template>
  <aside class="wiki-side-toc">
    <button type="button" class="wiki-side-toc__toggle" :aria-expanded="isOpen" @click="isOpen = !isOpen">
      <ListTree :size="18" aria-hidden="true" />
      目录
    </button>

    <ol class="wiki-side-toc__list" :class="{ 'is-open': isOpen }">
      <li v-for="link in links" :key="link.id" :style="{ '--toc-indent': `${Math.max((link.depth || 2) - 2, 0) * 12}px` }">
        <a :href="`#${link.id}`" :class="{ 'is-active': activeId === link.id }">
          {{ link.text }}
        </a>
      </li>
    </ol>
  </aside>
</template>

<style scoped>
.wiki-side-toc {
  display: grid;
  gap: var(--space-8);
  padding: var(--space-16);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--color-surface) 92%, var(--color-bg));
}

.wiki-side-toc__toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  min-height: 44px;
  color: var(--color-fg);
  font-weight: 800;
}

.wiki-side-toc__list {
  display: grid;
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.wiki-side-toc__list a {
  display: block;
  padding: var(--space-4) var(--space-8) var(--space-4) calc(var(--space-8) + var(--toc-indent));
  border-radius: var(--radius-4);
  color: var(--color-text-weak);
  text-decoration: none;
  font-size: 0.9rem;
}

.wiki-side-toc__list a:hover,
.wiki-side-toc__list a.is-active {
  color: var(--color-fg);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
}

@media (max-width: 980px) {
  .wiki-side-toc__list {
    display: none;
  }

  .wiki-side-toc__list.is-open {
    display: grid;
  }
}

@media (min-width: 981px) {
  .wiki-side-toc__toggle {
    pointer-events: none;
  }
}
</style>
