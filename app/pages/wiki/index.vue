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
  path: string
  title: string
  items: ContentEntry[]
  primary: ContentEntry
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
    const groupPath = getContentGroupPath(doc)
    grouped.set(groupPath, [...(grouped.get(groupPath) || []), doc])
  }

  return [...grouped.entries()]
    .map(([path, items]) => {
      const sortedItems = sortWikiChapterEntries(items)
      const primary = sortedItems.find((item) => isIndexEntry(item)) || sortedItems[0]
      if (!primary) {
        throw new Error(`Wiki group has no primary entry: ${path}`)
      }

      return {
        path,
        title: readContentString(primary, 'title') || '未命名 Wiki',
        items: sortedItems,
        primary,
      }
    })
    .sort((a, b) => a.title.localeCompare(b.title, 'zh-Hans-CN'))
})

const categories = computed(() => {
  const grouped = new Map<string, WikiGroup[]>()

  for (const group of groups.value) {
    const category = readContentString(group.primary, 'category') || '未分类'
    grouped.set(category, [...(grouped.get(category) || []), group])
  }

  return [...grouped.entries()]
    .map(([title, items]) => ({ title, items }))
    .sort((a, b) => {
      if (a.title === '未分类') return 1
      if (b.title === '未分类') return -1

      return a.title.localeCompare(b.title, 'zh-Hans-CN')
    })
})

const filteredGroups = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return groups.value
    .filter((group) => {
      const searchable = group.items
        .map((doc) => {
          return [
            readContentString(doc, 'title'),
            readContentString(doc, 'description'),
            readContentString(doc, 'category'),
            readContentTags(doc).join(' '),
          ].join(' ')
        })
        .join(' ')
        .toLowerCase()

      const category = readContentString(group.primary, 'category') || '未分类'

      return (!keyword || searchable.includes(keyword)) && (!activeCategory.value || category === activeCategory.value)
    })
    .map((group) => group)
})
</script>

<template>
  <section class="content-page">
    <BasePanel tone="floating">
      <BaseTag tone="accent">Wiki</BaseTag>
      <h1 class="content-page__title">知识库</h1>
    </BasePanel>

    <BasePanel v-if="docsResult?.error">
      <ErrorState title="Wiki 读取失败" :description="docsResult.error" />
    </BasePanel>

    <div v-else-if="docs.length" class="wiki-layout">
      <WikiTree :groups="categories" :active-category="activeCategory" @select="activeCategory = $event" />

      <div class="wiki-layout__main">
        <WikiSearch v-model="search" />
        <WikiDocList :groups="filteredGroups" />
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
