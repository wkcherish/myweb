<script setup lang="ts">
import WikiDocList from '~/components/wiki/WikiDocList.vue'
import WikiSearch from '~/components/wiki/WikiSearch.vue'
import WikiTree from '~/components/wiki/WikiTree.vue'
import BasePanel from '~/components/ui/BasePanel.vue'
import BaseTag from '~/components/ui/BaseTag.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import ErrorState from '~/components/ui/ErrorState.vue'
import type { ContentEntry } from '~/utils/content'

type WikiGroup = {
  category: string
  items: ContentEntry[]
}

const search = ref('')
const activeCategory = ref('')

const { data: docsResult } = await useAsyncData('wiki-list', async () => {
  try {
    const entries = (await queryCollection('wiki').all()) as ContentEntry[]

    return toContentResult(sortEntriesByDate(filterPublishedEntries(entries), ['updatedAt', 'date']))
  } catch (error) {
    return toContentResult<ContentEntry>([], error)
  }
})

const docs = computed(() => docsResult.value?.data || [])

const groups = computed<WikiGroup[]>(() => {
  const grouped = new Map<string, ContentEntry[]>()

  for (const doc of docs.value) {
    const category = readContentString(doc, 'category') || 'Wiki'
    grouped.set(category, [...(grouped.get(category) || []), doc])
  }

  return [...grouped.entries()]
    .map(([category, items]) => ({ category, items }))
    .sort((a, b) => a.category.localeCompare(b.category))
})

const filteredDocs = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return docs.value.filter((doc) => {
    const title = readContentString(doc, 'title').toLowerCase()
    const description = readContentString(doc, 'description').toLowerCase()
    const category = readContentString(doc, 'category') || 'Wiki'
    const tags = readContentTags(doc).join(' ').toLowerCase()

    return (
      (!keyword || title.includes(keyword) || description.includes(keyword) || tags.includes(keyword)) &&
      (!activeCategory.value || category === activeCategory.value)
    )
  })
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

    <div v-else-if="docs.length" class="wiki-layout">
      <WikiTree :groups="groups" :active-category="activeCategory" @select="activeCategory = $event" />

      <div class="wiki-layout__main">
        <WikiSearch v-model="search" />
        <WikiDocList :docs="filteredDocs" />
      </div>
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

.wiki-layout {
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  gap: var(--space-16);
  align-items: start;
}

.wiki-layout__main {
  display: grid;
  gap: var(--space-12);
}

@media (max-width: 860px) {
  .wiki-layout {
    grid-template-columns: 1fr;
  }
}
</style>
