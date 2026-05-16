<script setup lang="ts">
import BasePanel from '~/components/ui/BasePanel.vue'
import BaseTag from '~/components/ui/BaseTag.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import ErrorState from '~/components/ui/ErrorState.vue'
import type { ContentEntry } from '~/utils/content'

const { data: postsResult } = await useAsyncData('blog-list', async () => {
  try {
    const entries = (await queryCollection('blog').all()) as ContentEntry[]

    return toContentResult(sortEntriesByDate(filterPublishedEntries(entries), ['date', 'publishedAt']))
  } catch (error) {
    return toContentResult<ContentEntry>([], error)
  }
})
</script>

<template>
  <section class="content-page">
    <BasePanel tone="floating">
      <BaseTag>Blog</BaseTag>
      <h1 class="content-page__title">博客文章</h1>
      <p class="content-page__desc">
        博客内容从 <code>content/blog/</code> 目录中的 Markdown 文件读取。
      </p>
    </BasePanel>

    <BasePanel v-if="postsResult?.error">
      <ErrorState title="文章读取失败" :description="postsResult.error" />
    </BasePanel>

    <div v-else-if="postsResult?.data.length" class="blog-list">
      <NuxtLink v-for="post in postsResult.data" :key="post.path" class="blog-card" :to="post.path || '/blog'">
        <div class="doc-card__meta">
          <time>{{ formatContentDate(getContentDate(post, ['date', 'publishedAt'])) }}</time>
          <span>{{ readContentString(post, 'category') || '未分类' }}</span>
          <ContentVisitCount :path="post.path" />
        </div>
        <h2>{{ readContentString(post, 'title') || '未命名文章' }}</h2>
        <p>{{ readContentString(post, 'description') || '暂无摘要。' }}</p>
      </NuxtLink>
    </div>

    <BasePanel v-else-if="postsResult?.isEmpty">
      <EmptyState title="还没有文章" description="请在本地 content/blog/ 添加 Markdown 后重新预览。" />
    </BasePanel>
  </section>
</template>

<style scoped>
.content-page {
  display: grid;
  gap: var(--space-16);
}

.content-page__title {
  margin-top: var(--space-12);
  font-size: clamp(1.7rem, 4vw, 2.3rem);
}

.content-page__desc {
  margin-top: var(--space-12);
}

.blog-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-12);
}

.blog-card {
  min-height: 178px;
  padding: var(--space-24);
  display: grid;
  align-content: space-between;
  gap: var(--space-8);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--color-surface) 88%, var(--color-bg));
  color: var(--color-fg);
  text-decoration: none;
  box-shadow: var(--shadow-soft);
  transition:
    border-color var(--motion-180) ease,
    transform var(--motion-180) ease;
}

.blog-card:hover {
  border-color: color-mix(in srgb, var(--color-accent) 42%, var(--color-border));
  transform: translateY(-2px);
}

.doc-card__meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-8);
}

.blog-card time {
  color: var(--color-accent);
  font-size: 0.84rem;
  font-weight: 800;
}

.blog-card h2 {
  font-size: 1.22rem;
}

@media (max-width: 700px) {
  .blog-list {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 701px) and (max-width: 980px) {
  .blog-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
