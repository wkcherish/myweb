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
  <NuxtLink class="blog-list-item card-stagger" :to="post.path || '/blog'">
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
      <div v-if="readContentTags(post).length" class="blog-list-item__tags">
        <BaseTag v-for="tag in readContentTags(post)" :key="tag" tone="accent">
          {{ tag }}
        </BaseTag>
      </div>
      <VisitCount :path="post.path" variant="pair" />
    </div>
  </NuxtLink>
</template>

<style scoped>
.blog-list-item {
  --card-accent: var(--color-accent);
  position: relative;
  min-height: 190px;
  display: grid;
  gap: var(--space-16);
  padding: var(--space-24);
  border: 1px solid color-mix(in srgb, var(--color-border) 88%, transparent);
  border-radius: var(--radius-12);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 96%, transparent), color-mix(in srgb, var(--color-surface) 88%, var(--color-bg)));
  color: var(--color-fg);
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(18, 24, 38, 0.04);
  transition:
    border-color var(--motion-180) ease,
    transform var(--motion-240) cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow var(--motion-240) ease;
}

.blog-list-item:hover {
  border-color: color-mix(in srgb, var(--card-accent) 36%, var(--color-border));
  transform: translateY(-4px);
  box-shadow:
    0 12px 32px rgba(18, 24, 38, 0.08),
    0 0 0 1px color-mix(in srgb, var(--card-accent) 12%, transparent);
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
  font-weight: 800;
  line-height: 1.35;
  transition: color var(--motion-180) ease;
}

.blog-list-item:hover h2 {
  color: var(--card-accent);
}

.blog-list-item p {
  max-width: 68ch;
  line-height: 1.66;
}

.blog-list-item__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
  min-width: 0;
}

.blog-list-item__foot :deep(.visit-count-pair) {
  flex: 0 0 auto;
  margin-left: auto;
}

@media (max-width: 560px) {
  .blog-list-item__foot {
    justify-content: flex-start;
  }

  .blog-list-item__foot :deep(.visit-count-pair) {
    margin-left: 0;
  }
}
</style>
