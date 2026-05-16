<script setup lang="ts">
import BlogFilterBar from '~/components/blog/BlogFilterBar.vue'
import BlogList from '~/components/blog/BlogList.vue'
import BasePanel from '~/components/ui/BasePanel.vue'
import BaseTag from '~/components/ui/BaseTag.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import ErrorState from '~/components/ui/ErrorState.vue'
import type { ContentEntry } from '~/utils/content'

const search = ref('')
const activeCategory = ref('')
const activeTag = ref('')
const activeArchive = ref('')

const { data: postsResult } = await useAsyncData('blog-list', async () => {
  try {
    const entries = (await queryCollection('blog').all()) as ContentEntry[]

    return toContentResult(sortEntriesByDate(filterPublishedEntries(entries), ['date', 'publishedAt']))
  } catch (error) {
    return toContentResult<ContentEntry>([], error)
  }
})

const posts = computed(() => postsResult.value?.data || [])

const categories = computed(() =>
  [...new Set(posts.value.map((post) => readContentString(post, 'category')).filter(Boolean))].sort(),
)

const tags = computed(() => [...new Set(posts.value.flatMap((post) => readContentTags(post)))].sort())

const archives = computed(() =>
  [
    ...new Set(
      posts.value
        .map((post) => getContentDate(post, ['date', 'publishedAt']).slice(0, 7))
        .filter(Boolean),
    ),
  ].sort((a, b) => b.localeCompare(a)),
)

const filteredPosts = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return posts.value.filter((post) => {
    const title = readContentString(post, 'title').toLowerCase()
    const description = readContentString(post, 'description').toLowerCase()
    const category = readContentString(post, 'category')
    const postTags = readContentTags(post)
    const archive = getContentDate(post, ['date', 'publishedAt']).slice(0, 7)

    return (
      (!keyword || title.includes(keyword) || description.includes(keyword)) &&
      (!activeCategory.value || category === activeCategory.value) &&
      (!activeTag.value || postTags.includes(activeTag.value)) &&
      (!activeArchive.value || archive === activeArchive.value)
    )
  })
})

const resetFilters = () => {
  search.value = ''
  activeCategory.value = ''
  activeTag.value = ''
  activeArchive.value = ''
}
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

    <template v-else-if="posts.length">
      <BlogFilterBar
        :search="search"
        :category="activeCategory"
        :tag="activeTag"
        :categories="categories"
        :tags="tags"
        :archives="archives"
        :active-archive="activeArchive"
        @update:search="search = $event"
        @update:category="activeCategory = $event"
        @update:tag="activeTag = $event"
        @update:archive="activeArchive = $event"
        @reset="resetFilters"
      />

      <BlogList :posts="filteredPosts" />
    </template>

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

</style>
