<script setup lang="ts">
import { ArrowLeft, CalendarDays } from 'lucide-vue-next'

import VisitCount from '~/components/content/VisitCount.vue'
import BaseTag from '~/components/ui/BaseTag.vue'
import type { ContentEntry } from '~/utils/content'

defineProps<{
  article: ContentEntry
  path: string
}>()
</script>

<template>
  <header class="article-header">
    <div class="article-header__topline">
      <NuxtLink class="article-header__back" to="/blog">
        <ArrowLeft :size="18" aria-hidden="true" />
        Blog
      </NuxtLink>

      <div class="article-header__meta">
        <span>
          <CalendarDays :size="17" aria-hidden="true" />
          <time>{{ formatContentDate(getContentDateFromPath(path)) }}</time>
        </span>
        <BaseTag>{{ readContentString(article, 'category') || '未分类' }}</BaseTag>
        <VisitCount :path="path" />
      </div>
    </div>

    <h1>{{ readContentString(article, 'title') || '未命名文章' }}</h1>
    <p v-if="readContentString(article, 'description')">
      {{ readContentString(article, 'description') }}
    </p>

    <div v-if="readContentTags(article).length" class="article-header__tags">
      <BaseTag v-for="tag in readContentTags(article)" :key="tag" tone="accent">
        {{ tag }}
      </BaseTag>
    </div>
  </header>
</template>

<style scoped>
.article-header {
  display: grid;
  gap: var(--space-12);
  padding: clamp(1rem, 2vw, 1.4rem);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-12);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 8%, transparent), transparent 44%),
    var(--color-surface);
  box-shadow: var(--shadow-soft);
}

.article-header__topline {
  display: grid;
  gap: var(--space-8);
}

.article-header__back {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  font-weight: 800;
  text-decoration: none;
}

.article-header__meta,
.article-header__meta span,
.article-header__tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
}

.article-header__meta {
  color: var(--color-text-weak);
  font-size: 0.9rem;
  font-weight: 700;
}

.article-header h1 {
  max-width: 18ch;
  font-size: clamp(2rem, 5vw, 3.8rem);
  overflow-wrap: anywhere;
}

.article-header p {
  max-width: 68ch;
  font-size: 1rem;
}
</style>
