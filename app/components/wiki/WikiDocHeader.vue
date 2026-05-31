<script setup lang="ts">
import VisitCount from '~/components/content/VisitCount.vue'
import BaseTag from '~/components/ui/BaseTag.vue'
import WikiBreadcrumb from '~/components/wiki/WikiBreadcrumb.vue'
import type { ContentEntry } from '~/utils/content'

defineProps<{
  doc: ContentEntry
  path: string
  titleOverride?: string
  descriptionOverride?: string
}>()
</script>

<template>
  <header class="wiki-doc-header">
    <WikiBreadcrumb :category="readContentString(doc, 'category')" :title="titleOverride || readContentString(doc, 'title')" />

    <div class="wiki-doc-header__meta">
      <time>{{ formatContentDate(getContentDateFromPath(path)) }}</time>
      <BaseTag tone="accent">{{ readContentString(doc, 'category') || 'Wiki' }}</BaseTag>
      <VisitCount :path="path" />
    </div>

    <h1>{{ titleOverride || readContentString(doc, 'title') || '未命名 Wiki' }}</h1>
    <p v-if="descriptionOverride || readContentString(doc, 'description')">
      {{ descriptionOverride || readContentString(doc, 'description') }}
    </p>

    <div v-if="readContentTags(doc).length" class="wiki-doc-header__tags">
      <BaseTag v-for="tag in readContentTags(doc)" :key="tag" tone="accent">
        {{ tag }}
      </BaseTag>
    </div>
  </header>
</template>

<style scoped>
.wiki-doc-header {
  display: grid;
  gap: var(--space-10, 10px);
  padding: clamp(1rem, 1.6vw, 1.25rem);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-12);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 8%, transparent), transparent 46%),
    var(--color-surface);
  box-shadow: var(--shadow-soft);
}

.wiki-doc-header__meta,
.wiki-doc-header__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.wiki-doc-header__meta {
  color: var(--color-text-weak);
  font-size: 0.9rem;
  font-weight: 700;
}

.wiki-doc-header h1 {
  max-width: 18ch;
  font-size: clamp(1.9rem, 3.6vw, 3rem);
  overflow-wrap: anywhere;
}

.wiki-doc-header p {
  max-width: 68ch;
}
</style>
