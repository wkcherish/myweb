<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import WikiDocHeader from '~/components/wiki/WikiDocHeader.vue'
import WikiSideToc from '~/components/wiki/WikiSideToc.vue'
import type { ContentEntry } from '~/utils/content'
import { getWikiChapterAliasKeys, getWikiRoutePath, normalizeWikiRouteLookupPath } from '~/utils/wikiPath'

type TocLink = {
  id: string
  text: string
  depth?: number
  children?: TocLink[]
}

type WikiDoc = ContentEntry & {
  body?: {
    toc?: {
      links?: TocLink[]
    }
  }
}

const findByWikiRoutePath = async (lookupPath: string) => {
  const entries = (await queryCollection('wiki').all()) as WikiDoc[]
  const normalizedLookup = normalizeWikiRouteLookupPath(lookupPath).toLowerCase()

  return entries.find((entry) => normalizeWikiRouteLookupPath(getWikiRoutePath(entry)).toLowerCase() === normalizedLookup) || null
}

const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
const path = `/wiki/${slug}`

const { data: page } = await useAsyncData(`wiki-${path}`, async () => {
  const direct = (await queryCollection('wiki').path(path).first()) as WikiDoc | null
  if (direct) return direct

  if (!path.endsWith('/index')) {
    const index = (await queryCollection('wiki').path(`${path}/index`).first()) as WikiDoc | null
    if (index) return index
  }

  const withoutIndex = (await queryCollection('wiki').path(path.replace(/\/index$/i, '')).first()) as WikiDoc | null
  if (withoutIndex) return withoutIndex

  return findByWikiRoutePath(path)
})

const { data: docs } = await useAsyncData('wiki-doc-nav', async () => {
  const entries = (await queryCollection('wiki').all()) as ContentEntry[]
  return sortEntriesByDate(filterPublishedEntries(entries), ['updatedAt', 'date'])
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Wiki not found' })
}

const docCategory = computed(() => readContentString(page.value || {}, 'category') || 'Wiki')
const currentGroupPath = computed(() => getContentGroupPath(page.value || {}))

const docNavItems = computed(() =>
  sortWikiChapterEntries((docs.value || []).filter((doc) => getContentGroupPath(doc) === currentGroupPath.value)),
)
const groupPrimaryDoc = computed(() => docNavItems.value.find((doc) => isIndexEntry(doc)) || docNavItems.value[0] || null)
const wikiTitle = computed(
  () =>
    readContentString(groupPrimaryDoc.value || {}, 'title') ||
    readContentString(page.value || {}, 'title') ||
    docCategory.value,
)
const wikiDescription = computed(() => readContentString(groupPrimaryDoc.value || {}, 'description'))

const currentDocIndex = computed(() => docNavItems.value.findIndex((doc) => doc.path === page.value?.path))
const prevDoc = computed(() => (currentDocIndex.value > 0 ? docNavItems.value[currentDocIndex.value - 1] : null))
const nextDoc = computed(() =>
  currentDocIndex.value >= 0 && currentDocIndex.value < docNavItems.value.length - 1
    ? docNavItems.value[currentDocIndex.value + 1]
    : null,
)

const tocLinks = computed(() => {
  const flatten = (links: TocLink[]): TocLink[] =>
    links.flatMap((link) => [link, ...flatten(link.children || [])])

  return flatten(page.value?.body?.toc?.links || [])
})

const hasToc = computed(() => tocLinks.value.length > 0)
const resolvedRoutePath = computed(() => (page.value ? getWikiRoutePath(page.value) : path))
const wikiMetricPaths = computed(() => {
  if (!page.value) {
    return [resolvedRoutePath.value]
  }

  if (!isIndexEntry(page.value)) {
    return [resolvedRoutePath.value]
  }

  const paths = [...new Set(docNavItems.value.map((doc) => getWikiRoutePath(doc)))]
  return paths.length ? paths : [resolvedRoutePath.value]
})

const currentWikiSourcePath = computed(() => page.value?.stem || page.value?.path || '')
const currentWikiGroupRoutePath = computed(() => {
  const groupRootDoc = groupPrimaryDoc.value || page.value
  return groupRootDoc ? getWikiRoutePath(groupRootDoc) : ''
})
const currentWikiLinkMap = computed<Record<string, string>>(() => {
  const map: Record<string, string> = {}

  for (const doc of docNavItems.value) {
    if (isIndexEntry(doc)) {
      continue
    }

    const targetPath = getWikiRoutePath(doc)

    for (const key of getWikiChapterAliasKeys(doc)) {
      map[key] = targetPath
    }
  }

  return map
})

const wikiRenderSourcePath = useState<string>('wiki-render-source-path', () => '')
const wikiRenderGroupRoutePath = useState<string>('wiki-render-group-route-path', () => '')
const wikiRenderLinkMap = useState<Record<string, string>>('wiki-render-link-map', () => ({}))

const syncWikiRenderContext = () => {
  wikiRenderSourcePath.value = currentWikiSourcePath.value
  wikiRenderGroupRoutePath.value = currentWikiGroupRoutePath.value
  wikiRenderLinkMap.value = currentWikiLinkMap.value
}

syncWikiRenderContext()

watch(
  [currentWikiSourcePath, currentWikiGroupRoutePath, currentWikiLinkMap],
  syncWikiRenderContext,
)

onBeforeUnmount(() => {
  if (wikiRenderSourcePath.value === currentWikiSourcePath.value) {
    wikiRenderSourcePath.value = ''
  }

  if (wikiRenderGroupRoutePath.value === currentWikiGroupRoutePath.value) {
    wikiRenderGroupRoutePath.value = ''
    wikiRenderLinkMap.value = {}
  }
})
</script>

<template>
  <div v-if="page" class="wiki-detail-layout" :class="{ 'wiki-detail-layout--no-toc': !hasToc }">
    <aside class="wiki-detail-layout__doc">
      <div class="wiki-detail-layout__panel">
        <div class="wiki-detail-layout__panel-head">
          <strong>章节目录</strong>
          <span>{{ wikiTitle }}</span>
        </div>

        <nav class="wiki-doc-nav">
          <NuxtLink
            v-for="doc in docNavItems"
            :key="doc.path"
            :to="getWikiRoutePath(doc)"
            class="wiki-doc-nav__item"
            :class="{ 'is-active': doc.path === page.path }"
          >
            <span class="wiki-doc-nav__title">{{ readContentString(doc, 'title') || '未命名 Wiki' }}</span>
            <span class="wiki-doc-nav__date">{{ formatContentDate(getContentDate(doc, ['updatedAt', 'date'])) }}</span>
          </NuxtLink>
        </nav>
      </div>
    </aside>

    <article class="content-detail">
      <WikiDocHeader
        :doc="page"
        :path="resolvedRoutePath"
        :metric-paths="wikiMetricPaths"
        :title-override="wikiTitle"
        :description-override="wikiDescription"
      />
      <div v-if="hasToc" class="wiki-detail-layout__mobile-toc">
        <WikiSideToc :links="tocLinks" />
      </div>
      <ContentRenderer :value="page" class="content-detail__body" />
      <nav class="wiki-page-switcher" aria-label="章节切换">
        <NuxtLink
          v-if="prevDoc"
          class="wiki-page-switcher__link wiki-page-switcher__link--prev"
          :to="getWikiRoutePath(prevDoc)"
        >
          <span class="wiki-page-switcher__icon">
            <ChevronLeft :size="16" aria-hidden="true" />
          </span>
          <span class="wiki-page-switcher__text">
            <span class="wiki-page-switcher__label">上一章</span>
            <span class="wiki-page-switcher__title">{{ readContentString(prevDoc, 'title') }}</span>
          </span>
        </NuxtLink>

        <NuxtLink
          v-if="nextDoc"
          class="wiki-page-switcher__link wiki-page-switcher__link--next"
          :to="getWikiRoutePath(nextDoc)"
        >
          <span class="wiki-page-switcher__text wiki-page-switcher__text--end">
            <span class="wiki-page-switcher__label">下一章</span>
            <span class="wiki-page-switcher__title">{{ readContentString(nextDoc, 'title') }}</span>
          </span>
          <span class="wiki-page-switcher__icon">
            <ChevronRight :size="16" aria-hidden="true" />
          </span>
        </NuxtLink>
      </nav>
    </article>

    <aside v-if="hasToc" class="wiki-detail-layout__toc">
      <WikiSideToc :links="tocLinks" />
    </aside>
  </div>
</template>

<style scoped>
.wiki-detail-layout {
  width: min(1424px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 820px) minmax(210px, 260px);
  gap: clamp(20px, 2.2vw, 32px);
  align-items: start;
  justify-content: center;
}

.wiki-detail-layout--no-toc {
  width: min(1132px, 100%);
  grid-template-columns: minmax(220px, 280px) minmax(0, 820px);
}

.content-detail {
  display: grid;
  gap: var(--space-16);
  width: 100%;
}

.content-detail__body {
  padding: clamp(1rem, 1.6vw, 1.25rem);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-12);
  background: var(--color-surface);
  color: var(--color-fg);
  box-shadow: var(--shadow-soft);
}

.wiki-page-switcher {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  padding-top: 2px;
}

.wiki-page-switcher__link {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 62px;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-8);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 96%, white), var(--color-surface));
  color: var(--color-fg);
  text-decoration: none;
  box-shadow: 0 10px 26px color-mix(in srgb, var(--color-shadow) 10%, transparent);
  transition:
    border-color 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.wiki-page-switcher__link--next {
  justify-content: flex-end;
}

.wiki-page-switcher__link:hover {
  border-color: color-mix(in srgb, var(--color-primary) 36%, var(--color-border));
  color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: 0 14px 30px color-mix(in srgb, var(--color-primary) 12%, transparent);
}

.wiki-page-switcher__icon {
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--color-border) 80%, transparent);
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--color-bg) 70%, transparent);
  color: var(--color-text-weak);
}

.wiki-page-switcher__link:hover .wiki-page-switcher__icon {
  color: var(--color-primary);
  border-color: color-mix(in srgb, var(--color-primary) 32%, var(--color-border));
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
}

.wiki-page-switcher__text {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.wiki-page-switcher__text--end {
  text-align: right;
}

.wiki-page-switcher__label {
  color: var(--color-text-weak);
  font-size: 0.76rem;
  font-weight: 700;
}

.wiki-page-switcher__title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.98rem;
  font-weight: 700;
}

.wiki-detail-layout__panel {
  position: sticky;
  top: 24px;
  display: grid;
  gap: 12px;
  padding: 14px;
  max-height: calc(100vh - 48px);
  overflow: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-12);
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
}

.wiki-detail-layout__panel-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: var(--color-text-weak);
  font-size: 0.86rem;
  font-weight: 700;
}

.wiki-doc-nav {
  display: grid;
  gap: 2px;
}

.wiki-doc-nav__item {
  display: grid;
  gap: 4px;
  padding: 8px 10px;
  border-radius: var(--radius-8);
  color: var(--color-text-weak);
  text-decoration: none;
}

.wiki-doc-nav__item:hover,
.wiki-doc-nav__item.is-active {
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  color: var(--color-primary);
}

.wiki-doc-nav__title {
  font-size: 0.92rem;
  font-weight: 700;
}

.wiki-doc-nav__date {
  font-size: 0.78rem;
  color: var(--color-text-weak);
}

.wiki-detail-layout__mobile-toc {
  display: none;
}

@media (max-width: 980px) {
  .wiki-detail-layout {
    width: 100%;
    grid-template-columns: 1fr;
  }

  .wiki-detail-layout__doc,
  .wiki-detail-layout__toc {
    display: none;
  }

  .wiki-detail-layout__mobile-toc {
    display: block;
  }

  .wiki-page-switcher {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .wiki-page-switcher__link {
    min-height: 58px;
    padding: 10px 11px;
    gap: 8px;
  }

  .wiki-page-switcher__icon {
    width: 30px;
    height: 30px;
    border-radius: 7px;
  }

  .wiki-page-switcher__label {
    font-size: 0.72rem;
  }

  .wiki-page-switcher__title {
    font-size: 0.9rem;
  }
}
</style>
