<script setup lang="ts">
import BaseTag from '~/components/ui/BaseTag.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import type { ContentEntry } from '~/utils/content'

defineProps<{
  docs: ContentEntry[]
}>()
</script>

<template>
  <div v-if="docs.length" class="wiki-doc-list">
    <NuxtLink v-for="doc in docs" :key="doc.path" class="wiki-doc-list__item" :to="doc.path || '/wiki'">
      <div class="wiki-doc-list__meta">
        <BaseTag tone="accent">{{ readContentString(doc, 'category') || 'Wiki' }}</BaseTag>
        <time>{{ formatContentDate(getContentDate(doc, ['date', 'updatedAt'])) }}</time>
      </div>
      <h2>{{ readContentString(doc, 'title') || '未命名 Wiki' }}</h2>
      <p>{{ readContentString(doc, 'description') || '暂无摘要。' }}</p>
      <div v-if="readContentTags(doc).length" class="wiki-doc-list__tags">
        <BaseTag v-for="tag in readContentTags(doc)" :key="tag" tone="accent">
          {{ tag }}
        </BaseTag>
      </div>
    </NuxtLink>
  </div>

  <EmptyState
    v-else
    title="没有匹配的 Wiki"
    description="调整搜索或分类后再看。内容仍来自本地 Markdown。"
  />
</template>

<style scoped>
.wiki-doc-list {
  display: grid;
  gap: var(--space-12);
}

.wiki-doc-list__item {
  display: grid;
  gap: var(--space-10, 10px);
  padding: var(--space-20, 20px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--color-surface) 92%, var(--color-bg));
  color: var(--color-fg);
  text-decoration: none;
}

.wiki-doc-list__item:hover {
  border-color: color-mix(in srgb, var(--color-primary) 36%, var(--color-border));
}

.wiki-doc-list__meta,
.wiki-doc-list__tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
}

.wiki-doc-list__meta {
  justify-content: space-between;
}

.wiki-doc-list__item h2 {
  font-size: 1.16rem;
}
</style>
