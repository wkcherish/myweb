<script setup lang="ts">
import VisitCount from '~/components/content/VisitCount.vue'
import BasePanel from '~/components/ui/BasePanel.vue'
import BaseTag from '~/components/ui/BaseTag.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import ErrorState from '~/components/ui/ErrorState.vue'
import type { ContentEntry } from '~/utils/content'

const { data: docsResult } = await useAsyncData('wiki-list', async () => {
  try {
    const entries = (await queryCollection('wiki').all()) as ContentEntry[]

    return toContentResult(sortEntriesByDate(filterPublishedEntries(entries), ['updatedAt', 'date']))
  } catch (error) {
    return toContentResult<ContentEntry>([], error)
  }
})
</script>

<template>
  <section class="content-page">
    <BasePanel tone="floating">
      <BaseTag tone="accent">Wiki</BaseTag>
      <h1 class="content-page__title">知识库</h1>
      <p class="content-page__desc">
        Wiki 内容从 <code>content/wiki/</code> 目录中的 Markdown 文件读取。
      </p>
    </BasePanel>

    <BasePanel v-if="docsResult?.error">
      <ErrorState title="Wiki 读取失败" :description="docsResult.error" />
    </BasePanel>

    <div v-else-if="docsResult?.data.length" class="wiki-grid">
      <NuxtLink v-for="doc in docsResult.data" :key="doc.path" class="wiki-card" :to="doc.path || '/wiki'">
        <div class="wiki-card__meta">
          <span>{{ readContentString(doc, 'category') || 'Wiki' }}</span>
          <time>{{ formatContentDate(getContentDate(doc, ['updatedAt', 'date'])) }}</time>
          <VisitCount :path="doc.path" />
        </div>
        <h2>{{ readContentString(doc, 'title') || '未命名 Wiki' }}</h2>
        <p>{{ readContentString(doc, 'description') || '暂无摘要。' }}</p>
      </NuxtLink>
    </div>

    <BasePanel v-else-if="docsResult?.isEmpty">
      <EmptyState title="暂无 Wiki 文档" description="请在本地 content/wiki/ 添加 Markdown 后重新预览。" />
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

.wiki-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-12);
}

.wiki-card {
  min-height: 178px;
  padding: var(--space-24);
  display: grid;
  align-content: space-between;
  gap: var(--space-16);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--color-surface) 88%, var(--color-bg));
  color: var(--color-fg);
  text-decoration: none;
  transition:
    background-color var(--motion-180) ease,
    border-color var(--motion-180) ease,
    transform var(--motion-180) ease;
}

.wiki-card:hover {
  border-color: color-mix(in srgb, var(--color-primary) 40%, var(--color-border));
  background: color-mix(in srgb, var(--color-primary) 8%, var(--color-surface));
  transform: translateY(-2px);
}

.wiki-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-12);
  color: var(--color-text-weak);
  font-size: 0.82rem;
  font-weight: 800;
}

.wiki-card h2 {
  font-size: 1.24rem;
}

@media (max-width: 700px) {
  .wiki-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 701px) and (max-width: 980px) {
  .wiki-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
