<script setup lang="ts">
import BasePanel from '~/components/ui/BasePanel.vue'
import BaseTag from '~/components/ui/BaseTag.vue'
import EmptyState from '~/components/ui/EmptyState.vue'

type BlogEntry = {
  path?: string
  title?: string
  description?: string
  date?: string
  publishedAt?: string
  meta?: Record<string, unknown>
}

const readString = (entry: BlogEntry, key: string) => {
  const directValue = entry[key as keyof BlogEntry]
  const metaValue = entry.meta?.[key]
  const value = directValue || metaValue

  return typeof value === 'string' ? value : ''
}

const getDate = (entry: BlogEntry) => readString(entry, 'date') || readString(entry, 'publishedAt')

const formatDate = (date: string) => {
  const parsed = date ? new Date(date) : null

  return parsed && !Number.isNaN(parsed.getTime())
    ? new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(parsed)
    : '未标注日期'
}

const { data: posts } = await useAsyncData('blog-list', async () => {
  const entries = (await queryCollection('blog').all()) as BlogEntry[]

  return entries
    .filter((entry) => !(entry.path || '').toLowerCase().endsWith('/readme'))
    .sort((a, b) => (new Date(getDate(b)).getTime() || 0) - (new Date(getDate(a)).getTime() || 0))
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

    <div v-if="posts?.length" class="blog-list">
      <NuxtLink v-for="post in posts" :key="post.path" class="blog-card" :to="post.path || '/blog'">
        <div class="doc-card__meta">
          <time>{{ formatDate(getDate(post)) }}</time>
          <ContentVisitCount :path="post.path" />
        </div>
        <h2>{{ readString(post, 'title') || '未命名文章' }}</h2>
        <p>{{ readString(post, 'description') || '暂无摘要。' }}</p>
      </NuxtLink>
    </div>

    <BasePanel v-else>
      <EmptyState title="还没有文章" description="请在本地 content/blog/ 新增 Markdown。" />
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
