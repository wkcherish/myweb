<script setup lang="ts">
import BaseTag from '~/components/ui/BaseTag.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import type { ContentEntry } from '~/utils/content'

type WikiGroup = {
  path: string
  title: string
  items: ContentEntry[]
  primary: ContentEntry
}

defineProps<{
  groups: WikiGroup[]
}>()
</script>

<template>
  <div v-if="groups.length" class="wiki-doc-list">
    <article v-for="group in groups" :key="group.path || group.primary.path" class="wiki-doc-list__item">
      <NuxtLink class="wiki-doc-list__main" :to="getWikiRoutePath(group.primary)">
        <div class="wiki-doc-list__meta">
          <time>{{ formatContentDate(getContentDate(group.primary, ['date', 'updatedAt'])) }}</time>
        </div>
        <h2>{{ group.title }}</h2>
        <p>{{ readContentString(group.primary, 'description') || '暂无摘要。' }}</p>
      </NuxtLink>

      <div v-if="readContentTags(group.primary).length" class="wiki-doc-list__tags">
        <BaseTag v-for="tag in readContentTags(group.primary)" :key="tag" tone="accent">
          {{ tag }}
        </BaseTag>
      </div>
    </article>
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
  gap: var(--space-10, 10px);
}

.wiki-doc-list__item {
  display: grid;
  gap: var(--space-8);
  padding: 16px 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--color-surface) 92%, var(--color-bg));
  color: var(--color-fg);
  text-decoration: none;
}

.wiki-doc-list__item:hover {
  border-color: color-mix(in srgb, var(--color-primary) 36%, var(--color-border));
}

.wiki-doc-list__main {
  display: grid;
  gap: var(--space-8);
  color: inherit;
  text-decoration: none;
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
  color: var(--color-text-weak);
  font-size: 0.86rem;
  font-weight: 700;
}

.wiki-doc-list__item h2 {
  font-size: 1.16rem;
}
</style>
