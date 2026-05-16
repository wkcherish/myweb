<script setup lang="ts">
import BlogListItem from '~/components/blog/BlogListItem.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import type { ContentEntry } from '~/utils/content'

defineProps<{
  posts: ContentEntry[]
}>()
</script>

<template>
  <div v-if="posts.length" class="blog-list">
    <BlogListItem v-for="post in posts" :key="post.path" :post="post" />
  </div>

  <EmptyState
    v-else
    title="没有匹配的文章"
    description="调整搜索词、分类或标签后再看。内容仍来自本地 Markdown。"
  />
</template>

<style scoped>
.blog-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-12);
}

@media (max-width: 860px) {
  .blog-list {
    grid-template-columns: 1fr;
  }
}
</style>
