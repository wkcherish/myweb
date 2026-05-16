<script setup lang="ts">
import { BookOpen, ChevronRight } from 'lucide-vue-next'

interface KnowledgeItem {
  title: string
  description: string
  path: string
  source: 'blog' | 'wiki' | 'todo'
}

defineProps<{
  items: KnowledgeItem[]
}>()

const sourceMeta: Record<KnowledgeItem['source'], { label: string; class: string }> = {
  blog: { label: '博客', class: 'is-blog' },
  wiki: { label: 'Wiki', class: 'is-wiki' },
  todo: { label: '规划', class: 'is-todo' },
}
</script>

<template>
  <div v-if="items.length > 0" class="ai-context">
    <p class="ai-context__label">
      <BookOpen :size="12" aria-hidden="true" />
      <span>本地知识库</span>
    </p>
    <div class="ai-context__list">
      <NuxtLink
        v-for="(item, index) in items"
        :key="index"
        :to="item.path"
        class="ai-context__item"
      >
        <span class="ai-context__source" :class="sourceMeta[item.source].class">
          {{ sourceMeta[item.source].label }}
        </span>
        <span class="ai-context__title">{{ item.title }}</span>
        <ChevronRight :size="12" class="ai-context__arrow" aria-hidden="true" />
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.ai-context {
  padding: 0 var(--space-12) var(--space-6);
}

.ai-context__label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  margin: 0 0 var(--space-6) var(--space-2);
  color: var(--color-text-weak);
  font-size: 0.7rem;
  font-weight: 600;
}

.ai-context__list {
  display: grid;
  gap: 2px;
}

.ai-context__item {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  padding: var(--space-6) var(--space-8);
  border-radius: var(--radius-8);
  color: var(--color-fg);
  font-size: 0.78rem;
  text-decoration: none;
  transition: background 120ms;
}

.ai-context__item:hover {
  background: color-mix(in srgb, var(--color-border) 30%, transparent);
}

.ai-context__source {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 0.64rem;
  font-weight: 600;
  flex-shrink: 0;
}

.ai-context__source.is-blog {
  background: color-mix(in srgb, var(--color-primary) 14%, transparent);
  color: var(--color-primary);
}

.ai-context__source.is-wiki {
  background: color-mix(in srgb, #10b981 14%, transparent);
  color: #0d9488;
}

.ai-context__source.is-todo {
  background: color-mix(in srgb, #f59e0b 14%, transparent);
  color: #d97706;
}

.ai-context__title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ai-context__arrow {
  color: var(--color-text-weak);
  flex-shrink: 0;
}
</style>
