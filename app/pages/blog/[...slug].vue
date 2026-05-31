<script setup lang="ts">
import ArticleHeader from '~/components/blog/ArticleHeader.vue'
import ArticleToc from '~/components/blog/ArticleToc.vue'
import ReadingProgress from '~/components/blog/ReadingProgress.vue'
import type { ArticleTocLink } from '~/components/blog/ArticleToc.vue'
import type { ContentEntry } from '~/utils/content'

type BlogArticle = ContentEntry & {
  body?: {
    toc?: {
      links?: ArticleTocLink[]
    }
  }
}

const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
const path = `/blog/${slug}`

const { data: page } = await useAsyncData(`blog-${path}`, () => {
  return queryCollection('blog').path(path).first() as Promise<BlogArticle | null>
})

const { data: posts } = await useAsyncData('blog-detail-surroundings', async () => {
  const entries = (await queryCollection('blog').all()) as ContentEntry[]

  return sortEntriesByDate(filterPublishedEntries(entries), ['date', 'publishedAt'])
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Blog not found' })
}

const tocLinks = computed(() => page.value?.body?.toc?.links || [])
const hasToc = computed(() => tocLinks.value.length > 0)

const currentIndex = computed(() => posts.value?.findIndex((post) => post.path === path) ?? -1)
const newerPost = computed(() => (currentIndex.value > 0 ? posts.value?.[currentIndex.value - 1] : null))
const olderPost = computed(() =>
  posts.value && currentIndex.value >= 0 && currentIndex.value < posts.value.length - 1
    ? posts.value[currentIndex.value + 1]
    : null,
)
</script>

<template>
  <ClientOnly>
    <ReadingProgress />
  </ClientOnly>

  <div v-if="page" class="article-layout" :class="{ 'article-layout--no-toc': !hasToc }">
    <aside v-if="hasToc" class="article-layout__toc">
      <ArticleToc :links="tocLinks" />
    </aside>

    <article class="content-detail">
      <ArticleHeader :article="page" :path="path" />
      <ContentRenderer :value="page" class="content-detail__body" />

      <nav class="article-nav" aria-label="相邻文章">
        <NuxtLink v-if="newerPost" :to="newerPost.path || '/blog'" class="article-nav__item">
          <span>上一篇</span>
          <strong>{{ readContentString(newerPost, 'title') || '未命名文章' }}</strong>
        </NuxtLink>
        <span v-else class="article-nav__item is-empty">已经是最新一篇</span>

        <NuxtLink v-if="olderPost" :to="olderPost.path || '/blog'" class="article-nav__item is-next">
          <span>下一篇</span>
          <strong>{{ readContentString(olderPost, 'title') || '未命名文章' }}</strong>
        </NuxtLink>
        <span v-else class="article-nav__item is-empty is-next">已经是最后一篇</span>
      </nav>
    </article>
  </div>
</template>

<style scoped>
.article-layout {
  width: min(1180px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 820px);
  gap: var(--space-32);
  align-items: start;
  justify-content: center;
}

.article-layout--no-toc {
  grid-template-columns: minmax(0, 820px);
}

.content-detail {
  display: grid;
  gap: var(--space-24);
}

.content-detail__body {
  padding: clamp(1rem, 2vw, 1.4rem);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-12);
  background: var(--color-surface);
  color: var(--color-fg);
  box-shadow: var(--shadow-soft);
}

.article-nav {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-12);
  padding-top: var(--space-16);
  border-top: 1px solid var(--color-border);
}

.article-nav__item {
  min-height: 88px;
  display: grid;
  align-content: center;
  gap: var(--space-4);
  padding: var(--space-16);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-12);
  background: var(--color-surface);
  color: var(--color-fg);
  text-decoration: none;
  box-shadow: var(--shadow-soft);
  transition:
    border-color var(--motion-180) ease,
    transform var(--motion-180) ease;
}

.article-nav__item:hover {
  border-color: color-mix(in srgb, var(--color-primary) 36%, var(--color-border));
  transform: translateY(-2px);
}

.article-nav__item span {
  color: var(--color-text-weak);
  font-size: 0.84rem;
  font-weight: 700;
}

.article-nav__item strong {
  overflow-wrap: anywhere;
}

.article-nav__item.is-next {
  text-align: right;
}

.article-nav__item.is-empty {
  color: var(--color-text-weak);
}

@media (max-width: 980px) {
  .article-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .article-nav {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-8);
    padding-top: var(--space-12);
  }

  .article-nav__item {
    min-height: 62px;
    padding: 10px 12px;
    border-radius: var(--radius-8);
    box-shadow: none;
  }

  .article-nav__item span {
    font-size: 0.74rem;
  }

  .article-nav__item strong {
    display: -webkit-box;
    overflow: hidden;
    font-size: 0.88rem;
    line-height: 1.25;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .article-nav__item.is-empty {
    place-content: center;
    text-align: center;
  }

  .article-nav__item.is-next {
    text-align: right;
  }
}
</style>
