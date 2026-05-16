<script setup lang="ts">
import { CalendarDays } from 'lucide-vue-next'

import VisitCount from '~/components/content/VisitCount.vue'
import BaseTag from '~/components/ui/BaseTag.vue'
import type { ContentEntry } from '~/utils/content'

defineProps<{
  post: ContentEntry
}>()
</script>

<template>
  <NuxtLink class="blog-list-item" :to="post.path || '/blog'">
    <div class="blog-list-item__meta">
      <span class="blog-list-item__date">
        <CalendarDays :size="16" aria-hidden="true" />
        <time>{{ formatContentDate(getContentDate(post, ['date', 'publishedAt'])) }}</time>
      </span>
      <BaseTag>{{ readContentString(post, 'category') || '未分类' }}</BaseTag>
    </div>

    <div class="blog-list-item__body">
      <h2>{{ readContentString(post, 'title') || '未命名文章' }}</h2>
      <p>{{ readContentString(post, 'description') || '暂无摘要。' }}</p>
    </div>

    <div class="blog-list-item__foot">
      <div class="blog-list-item__tags">
        <BaseTag v-for="tag in readContentTags(post)" :key="tag" tone="accent">
          {{ tag }}
        </BaseTag>
      </div>
      <VisitCount :path="post.path" />
    </div>
  </NuxtLink>
</template>

<style scoped>
.blog-list-item {
  min-height: 190px;
  display: grid;
  gap: var(--space-16);
  padding: var(--space-24);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--color-surface) 90%, var(--color-bg));
  color: var(--color-fg);
  text-decoration: none;
  box-shadow: var(--shadow-soft);
  transition:
    border-color var(--motion-180) ease,
    background-color var(--motion-180) ease;
}

.blog-list-item:hover {
  border-color: color-mix(in srgb, var(--color-accent) 42%, var(--color-border));
  background: color-mix(in srgb, var(--color-accent) 7%, var(--color-surface));
}

.blog-list-item__meta,
.blog-list-item__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
}

.blog-list-item__date {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  color: var(--color-accent);
  font-size: 0.84rem;
  font-weight: 800;
}

.blog-list-item__body {
  display: grid;
  gap: var(--space-8);
}

.blog-list-item h2 {
  font-size: clamp(1.18rem, 2vw, 1.42rem);
}

.blog-list-item p {
  max-width: 68ch;
}

.blog-list-item__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
}
</style>
