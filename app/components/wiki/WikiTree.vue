<script setup lang="ts">
import { FolderTree } from 'lucide-vue-next'
import BaseTag from '~/components/ui/BaseTag.vue'
import type { ContentEntry } from '~/utils/content'

type WikiGroup = {
  category: string
  items: ContentEntry[]
}

defineProps<{
  groups: WikiGroup[]
  activeCategory: string
}>()

const emit = defineEmits<{
  select: [value: string]
}>()
</script>

<template>
  <aside class="wiki-tree" aria-label="Wiki 分类">
    <div class="wiki-tree__head">
      <FolderTree :size="18" aria-hidden="true" />
      <strong>目录树</strong>
    </div>

    <button
      type="button"
      class="wiki-tree__item"
      :class="{ 'is-active': !activeCategory }"
      @click="emit('select', '')"
    >
      <span>全部文档</span>
      <BaseTag>{{ groups.reduce((sum, group) => sum + group.items.length, 0) }}</BaseTag>
    </button>

    <button
      v-for="group in groups"
      :key="group.category"
      type="button"
      class="wiki-tree__item"
      :class="{ 'is-active': activeCategory === group.category }"
      @click="emit('select', group.category)"
    >
      <span>{{ group.category }}</span>
      <BaseTag>{{ group.items.length }}</BaseTag>
    </button>

    <p class="wiki-tree__hint">点击分类可快速定位文档。</p>
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
