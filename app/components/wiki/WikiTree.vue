<script setup lang="ts">
import { FolderTree } from 'lucide-vue-next'
import type { ContentEntry } from '~/utils/content'

type WikiGroup = {
  path: string
  title: string
  items: ContentEntry[]
  primary: ContentEntry
}

type WikiCategory = {
  title: string
  items: WikiGroup[]
}

defineProps<{
  groups: WikiCategory[]
  activeCategory: string
}>()

const emit = defineEmits<{
  select: [value: string]
}>()
</script>

<template>
  <aside class="wiki-tree" aria-label="Wiki 笔记目录">
    <div class="wiki-tree__head">
      <FolderTree :size="18" aria-hidden="true" />
      <strong>笔记目录</strong>
    </div>

    <button
      type="button"
      class="wiki-tree__item"
      :class="{ 'is-active': !activeCategory }"
      @click="emit('select', '')"
    >
      <span>全部笔记</span>
    </button>

    <button
      v-for="group in groups"
      :key="group.title"
      type="button"
      class="wiki-tree__item"
      :class="{ 'is-active': activeCategory === group.title }"
      @click="emit('select', group.title)"
    >
      <span>{{ group.title }}</span>
    </button>

    <p class="wiki-tree__hint">点击分类可筛选笔记。</p>
  </aside>
</template>

<style scoped>
.wiki-tree {
  display: grid;
  gap: var(--space-8);
  padding: var(--space-16);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--color-surface) 92%, var(--color-bg));
}

.wiki-tree__head {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-fg);
}

.wiki-tree__item {
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  padding: 0 var(--space-10, 10px);
  border-radius: var(--radius-8);
  color: var(--color-text-weak);
  background: transparent;
  text-align: left;
}

.wiki-tree__item:hover,
.wiki-tree__item.is-active {
  color: var(--color-fg);
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
}

.wiki-tree__hint {
  color: var(--color-text-weak);
  font-size: 0.84rem;
}
</style>
