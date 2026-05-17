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
    <div class="wiki-side-toc__head">
      <span class="wiki-side-toc__label">
        <ListTree :size="18" aria-hidden="true" />
        目录
      </span>
      <button type="button" class="wiki-side-toc__toggle" :aria-expanded="isOpen" @click="isOpen = !isOpen">
        收起
      </button>
    </div>

    <ol class="wiki-side-toc__list" :class="{ 'is-open': isOpen }">
      <li
        v-for="link in links"
        :key="link.id"
        class="wiki-side-toc__item"
        :style="{ '--toc-indent': `${Math.max((link.depth || 2) - 2, 0) * 14}px` }"
      >
        <a :href="`#${link.id}`" :class="{ 'is-active': activeId === link.id }">
          <span class="wiki-side-toc__text">{{ link.text }}</span>
        </a>
      </li>
    </ol>
  </aside>
</template>

<style scoped>
.wiki-side-toc {
  position: sticky;
  top: 24px;
  align-self: start;
  display: grid;
  gap: 12px;
  padding: 14px;
  max-height: calc(100vh - 48px);
  overflow: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-12);
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
}

.wiki-side-toc__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.wiki-side-toc__label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-fg);
  font-weight: 800;
}

.wiki-side-toc__toggle {
  display: none;
  color: var(--color-text-weak);
  font-size: 0.86rem;
  font-weight: 700;
}

.wiki-side-toc__list {
  display: grid;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.wiki-side-toc__item {
  --toc-indent: 0px;
}

.wiki-side-toc__list a {
  display: block;
  padding: 8px 10px 8px calc(10px + var(--toc-indent));
  border: 1px solid transparent;
  border-radius: var(--radius-8);
  color: var(--color-text-weak);
  text-decoration: none;
  font-size: 0.9rem;
  line-height: 1.35;
  transition: all 0.18s ease;
}

.wiki-side-toc__list a:hover,
.wiki-side-toc__list a.is-active {
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  border-color: color-mix(in srgb, var(--color-primary) 26%, transparent);
}

.wiki-side-toc__text {
  min-width: 0;
  overflow-wrap: anywhere;
}

@media (max-width: 980px) {
  .wiki-side-toc {
    position: static;
  }

  .wiki-side-toc__list {
    display: none;
  }

  .wiki-side-toc__list.is-open {
    display: grid;
  }
  .wiki-side-toc__toggle {
    display: inline-flex;
  }
}
</style>
