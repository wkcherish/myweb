<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import {
  fetchUmamiExpandedMetrics,
  getUmamiPublicConfig,
  hasUmamiPublicConfig,
  normalizeUmamiPath,
  resolveUmamiRange,
  type UmamiMetricRow,
} from '~/composables/useUmamiClient'
import type { ContentEntry } from '~/utils/content'

type CollectionName = 'todo' | 'blog' | 'wiki'
type RegularCollectionName = Exclude<CollectionName, 'wiki'>
type TodoStatus = 'planned' | 'in-progress' | 'done' | 'paused'

type ActivityItem = {
  title: string
  description: string
  dateLabel: string
  status?: string
  statusLabel?: string
  targetDateLabel?: string
  categoryLabel?: string
  sortTime: number
  path: string
}

type WikiChapterPreview = {
  title: string
  path: string
}

type PathMetricSummary = Pick<UmamiMetricRow, 'pageviews' | 'visits'>

type WikiActivityGroup = {
  keyPath: string
  title: string
  description: string
  dateLabel: string
  chapterCount: number
  chapterPaths: string[]
  previewChapters: WikiChapterPreview[]
  sortTime: number
  path: string
}

type HomeModule = {
  key: CollectionName
  title: string
  to: string
  accent: string
  eyebrow: string
  variant: 'todo' | 'static' | 'flip' | 'wide'
  empty: string
  counterLabel: string
}

const modules: HomeModule[] = [
  {
    key: 'todo',
    title: '最新 TODO 规划',
    to: '/todo',
    accent: '#b16a11',
    eyebrow: 'Todo',
    variant: 'todo',
    empty: '近一个月还没有新的 Todo 规划。',
    counterLabel: '最近 6 条',
  },
  {
    key: 'blog',
    title: '最新博客',
    to: '/blog',
    accent: '#1c8f7d',
    eyebrow: 'Blog',
    variant: 'flip',
    empty: '近一个月还没有新的博客。',
    counterLabel: '最近 6 条',
  },
  {
    key: 'wiki',
    title: '最新 Wiki',
    to: '/wiki',
    accent: '#8b5cf6',
    eyebrow: 'Wiki',
    variant: 'wide',
    empty: '还没有可展示的 Wiki 大章节。',
    counterLabel: '最近 6 个大章节',
  },
]

const expandedWikiGroups = ref<string[]>([])

const todoStatusLabels: Record<TodoStatus, string> = {
  planned: '计划中',
  'in-progress': '进行中',
  done: '已完成',
  paused: '搁置',
}

const oneMonthAgo = new Date()
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

const readString = (entry: ContentEntry, key: string) => {
  const directValue = entry[key as keyof ContentEntry]
  const metaValue = entry.meta?.[key]
  const value = directValue || metaValue

  return typeof value === 'string' ? value : ''
}

const getEntryDate = (entry: ContentEntry) =>
  getContentDate(entry, ['date', 'publishedAt', 'updatedAt', 'startDate', 'targetDate'])

const parseEntryDate = (entry: ContentEntry) => {
  const rawDate = getEntryDate(entry)
  const date = rawDate ? new Date(rawDate) : null

  return date && !Number.isNaN(date.getTime()) ? date : null
}

const formatDate = (date: Date | null) =>
  date
    ? new Intl.DateTimeFormat('zh-CN', {
        month: '2-digit',
        day: '2-digit',
      }).format(date)
    : '最近'

const toTimestamp = (date: Date | null) => date?.getTime() || 0

const getLatestEntryDate = (entries: ContentEntry[]) => {
  let latest: Date | null = null

  for (const entry of entries) {
    const date = parseEntryDate(entry)

    if (date && (!latest || date.getTime() > latest.getTime())) {
      latest = date
    }
  }

  return latest
}

const getWikiChapterCountLabel = (count: number) => (count ? `${count} 个小章节` : '单篇笔记')

const formatMetricCount = (value: number) => Math.max(0, Number(value || 0)).toLocaleString('zh-CN')

const normalizeTodoStatus = (value: string): TodoStatus => {
  if (value === 'in-progress' || value === 'done' || value === 'paused') {
    return value
  }

  return 'planned'
}

const sanitizeTodoDescription = (value: string) => {
  const trimmed = value.trim()

  if (!trimmed || ['无', '暂无', 'none', 'null', 'todo'].includes(trimmed.toLowerCase())) {
    return ''
  }

  return trimmed
}

const normalizeEntry = (entry: ContentEntry, collection: RegularCollectionName): ActivityItem | null => {
  const date = parseEntryDate(entry)

  if (date && date < oneMonthAgo) {
    return null
  }

  const status = collection === 'todo' ? normalizeTodoStatus(readString(entry, 'status')) : readString(entry, 'status')
  const targetDate = collection === 'todo' ? readString(entry, 'targetDate') : ''
  const description = collection === 'todo'
    ? sanitizeTodoDescription(readString(entry, 'description'))
    : readString(entry, 'description') || '新增内容已进入最近一个月的首页摘要。'

  return {
    title: readString(entry, 'title') || '未命名内容',
    description,
    dateLabel: formatDate(date),
    status,
    statusLabel: collection === 'todo' ? todoStatusLabels[status as TodoStatus] : '',
    targetDateLabel: collection === 'todo'
      ? (targetDate ? formatContentDate(targetDate, '未设目标日期') : '未设目标日期')
      : '',
    categoryLabel: collection === 'blog' ? (readString(entry, 'category') || '未分类') : '',
    sortTime: toTimestamp(date),
    path: entry.path || '',
  }
}

const fetchCollection = async (collection: RegularCollectionName) => {
  const entries = filterPublishedEntries((await queryCollection(collection).all()) as ContentEntry[])

  return entries
    .map((entry) => normalizeEntry(entry, collection))
    .filter((entry): entry is ActivityItem => Boolean(entry))
    .sort((a, b) => b.sortTime - a.sortTime)
    .slice(0, 6)
}

const fetchWikiGroups = async () => {
  const entries = filterPublishedEntries((await queryCollection('wiki').all()) as ContentEntry[])
  const grouped = new Map<string, ContentEntry[]>()

  for (const entry of entries) {
    const groupPath = getContentGroupPath(entry)
    grouped.set(groupPath, [...(grouped.get(groupPath) || []), entry])
  }

  return [...grouped.entries()]
    .map(([groupPath, items]) => {
      const sortedItems = sortWikiChapterEntries(items)
      const primary = sortedItems.find((item) => isIndexEntry(item)) || sortedItems[0]

      if (!primary) {
        return null
      }

      const chapterItems = sortedItems.filter((item) => item.path !== primary.path)
      const latestDate = getLatestEntryDate(sortedItems)
      const chapterPaths = chapterItems.map((item) => getWikiRoutePath(item))

      if (!chapterPaths.length) {
        return null
      }

      return {
        keyPath: groupPath || primary.path || readString(primary, 'title'),
        title: readString(primary, 'title') || '未命名 Wiki',
        description: readString(primary, 'description') || '这一章节的首页摘要还没有填写。',
        dateLabel: formatDate(latestDate),
        chapterCount: chapterPaths.length,
        chapterPaths,
        previewChapters: chapterItems.slice(0, 3).map((item) => ({
          title: readString(item, 'title') || '未命名小章节',
          path: getWikiRoutePath(item),
        })),
        sortTime: toTimestamp(latestDate),
        path: getWikiRoutePath(primary),
      }
    })
    .filter((entry): entry is WikiActivityGroup => Boolean(entry))
    .sort((a, b) => b.sortTime - a.sortTime)
    .slice(0, 6)
}

const { data: activityGroups } = await useAsyncData('home-activity-showcase-v3', async () => {
  const [todo, blog, wiki] = await Promise.all([
    fetchCollection('todo'),
    fetchCollection('blog'),
    fetchWikiGroups(),
  ])

  return { todo, blog, wiki }
})

const regularGroups = computed<Record<RegularCollectionName, ActivityItem[]>>(
  () =>
    activityGroups.value || {
      todo: [],
      blog: [],
    },
)

const wikiGroups = computed<WikiActivityGroup[]>(() => activityGroups.value?.wiki || [])

const { data: wikiPathMetrics, pending: wikiPathMetricsPending } = await useLazyAsyncData<Record<string, PathMetricSummary>>(
  'home-wiki-path-metrics',
  async () => {
    if (!hasUmamiPublicConfig()) {
      return {}
    }

    try {
      const range = resolveUmamiRange()
      const { pathLimit } = getUmamiPublicConfig()
      const rows = await fetchUmamiExpandedMetrics('path', range, {
        limit: pathLimit,
      })

      return rows.reduce<Record<string, PathMetricSummary>>((accumulator, row) => {
        accumulator[normalizeUmamiPath(row.name)] = {
          pageviews: row.pageviews,
          visits: row.visits,
        }

        return accumulator
      }, {})
    } catch {
      return {}
    }
  },
  {
    server: false,
    default: () => ({}),
  },
)

const getRegularItems = (key: CollectionName) => (key === 'wiki' ? [] : regularGroups.value[key])

const hasModuleItems = (key: CollectionName) => (key === 'wiki' ? wikiGroups.value.length > 0 : getRegularItems(key).length > 0)

const isWikiGroupExpanded = (path: string) => expandedWikiGroups.value.includes(path)

const readPathMetric = (path: string): PathMetricSummary | null => {
  if (wikiPathMetricsPending.value) {
    return null
  }

  return wikiPathMetrics.value[normalizeUmamiPath(path)] || {
    pageviews: 0,
    visits: 0,
  }
}

const getChapterMetricLabel = (path: string) => {
  const metric = readPathMetric(path)

  if (!metric) {
    return '-- 浏览 · -- 访问'
  }

  return `${formatMetricCount(metric.pageviews)} 浏览 · ${formatMetricCount(metric.visits)} 访问`
}

const toggleWikiGroup = (path: string) => {
  expandedWikiGroups.value = isWikiGroupExpanded(path)
    ? expandedWikiGroups.value.filter((item) => item !== path)
    : [...expandedWikiGroups.value, path]
}
</script>

<template>
  <section class="activity-showcase" aria-label="最近内容">
    <article
      v-for="module in modules"
      :key="module.key"
      class="activity-module"
      :class="[`activity-module--${module.variant}`, `activity-module--${module.key}`]"
      :style="{ '--activity-accent': module.accent }"
    >
      <header class="activity-module__head">
        <p>{{ module.eyebrow }}</p>
        <h2>
          <NuxtLink :to="module.to">{{ module.title }}</NuxtLink>
        </h2>
        <span>{{ module.counterLabel }}</span>
      </header>

      <div
        v-if="hasModuleItems(module.key)"
        class="activity-module__items"
        :class="{
          'activity-module__items--blog': module.key === 'blog',
          'activity-module__items--todo': module.key === 'todo',
          'activity-module__items--wiki': module.key === 'wiki',
        }"
      >
        <template v-if="module.key === 'todo'">
          <NuxtLink
            v-for="(item, index) in getRegularItems(module.key)"
            :key="`${module.key}-${item.title}-${index}`"
            class="activity-todo-card"
            :to="item.path || module.to"
          >
            <span class="activity-todo-card__inner">
              <span class="activity-todo-card__meta">
                <time>{{ item.dateLabel }}</time>
                <span class="activity-todo-card__status" :class="`is-${item.status || 'planned'}`">
                  {{ item.statusLabel || '计划中' }}
                </span>
              </span>

              <span class="activity-todo-card__body">
                <strong>{{ item.title }}</strong>
                <span v-if="item.description" class="activity-todo-card__description">{{ item.description }}</span>
              </span>

              <span class="activity-todo-card__foot">
                <span>目标日期</span>
                <span>{{ item.targetDateLabel || '未设目标日期' }}</span>
              </span>
            </span>
          </NuxtLink>
        </template>

        <template v-else-if="module.key === 'blog'">
          <NuxtLink
            v-for="(item, index) in getRegularItems(module.key)"
            :key="`${module.key}-${item.title}-${index}`"
            class="activity-blog-card"
            :to="item.path || module.to"
          >
            <span class="activity-blog-card__inner">
              <span class="activity-blog-card__meta">
                <time>{{ item.dateLabel }}</time>
                <span class="activity-blog-card__category">{{ item.categoryLabel || '未分类' }}</span>
              </span>

              <span class="activity-blog-card__body">
                <strong>{{ item.title }}</strong>
                <span class="activity-blog-card__description">{{ item.description }}</span>
              </span>

              <span class="activity-blog-card__foot">继续阅读</span>
            </span>
          </NuxtLink>
        </template>

        <template v-else-if="module.key === 'wiki'">
          <article
            v-for="(group, index) in wikiGroups"
            :key="group.keyPath"
            class="activity-wiki-card"
            :class="{ 'is-open': isWikiGroupExpanded(group.keyPath) }"
          >
            <div class="activity-wiki-card__inner">
              <div class="activity-wiki-card__summary">
                <NuxtLink class="activity-wiki-card__main" :to="group.path">
                  <span class="activity-item__meta activity-item__meta--wiki">
                    <time>{{ group.dateLabel }}</time>
                    <span>{{ getWikiChapterCountLabel(group.chapterCount) }}</span>
                  </span>
                  <span class="activity-item__body activity-item__body--wiki">
                    <strong>{{ group.title }}</strong>
                    <span class="activity-item__description">{{ group.description }}</span>
                  </span>
                </NuxtLink>

                <button
                  v-if="group.chapterCount"
                  type="button"
                  class="activity-wiki-card__toggle"
                  :aria-expanded="isWikiGroupExpanded(group.keyPath)"
                  :aria-controls="`home-wiki-preview-${index}`"
                  @click="toggleWikiGroup(group.keyPath)"
                >
                  <span>{{ isWikiGroupExpanded(group.keyPath) ? '收起' : '展开' }}</span>
                  <ChevronDown
                    :size="16"
                    class="activity-wiki-card__toggle-icon"
                    :class="{ 'is-open': isWikiGroupExpanded(group.keyPath) }"
                    aria-hidden="true"
                  />
                </button>

                <NuxtLink v-else class="activity-wiki-card__toggle activity-wiki-card__toggle--link" :to="group.path">
                  <span>查看</span>
                </NuxtLink>
              </div>

              <ol
                v-if="group.previewChapters.length && isWikiGroupExpanded(group.keyPath)"
                :id="`home-wiki-preview-${index}`"
                class="activity-wiki-card__preview"
              >
                <li v-for="(chapter, chapterIndex) in group.previewChapters" :key="chapter.path">
                  <NuxtLink class="activity-wiki-card__chapter" :to="chapter.path">
                    <span class="activity-wiki-card__chapter-index">{{ chapterIndex + 1 }}</span>
                    <span class="activity-wiki-card__chapter-title">{{ chapter.title }}</span>
                    <span class="activity-wiki-card__chapter-meta">{{ getChapterMetricLabel(chapter.path) }}</span>
                  </NuxtLink>
                </li>
              </ol>
            </div>
          </article>
        </template>

        <template v-else>
          <NuxtLink
            v-for="(item, index) in getRegularItems(module.key)"
            :key="`${module.key}-${item.title}-${index}`"
            class="activity-item"
            :class="[`activity-item--${module.variant}`, `activity-item--${module.key}`]"
            :style="{ '--item-index': index }"
            :to="item.path || module.to"
          >
            <span class="activity-item__inner">
              <span class="activity-item__meta">
                <time>{{ item.dateLabel }}</time>
                <span v-if="item.status">{{ item.status }}</span>
              </span>
              <span class="activity-item__body">
                <strong>{{ item.title }}</strong>
                <span class="activity-item__description">{{ item.description }}</span>
              </span>
            </span>
          </NuxtLink>
        </template>
      </div>

      <NuxtLink v-else class="activity-empty" :to="module.to">
        <span>{{ module.empty }}</span>
        <small>新增 Markdown 后自动展示</small>
      </NuxtLink>
    </article>
  </section>
</template>

<style scoped>
.activity-showcase {
  --activity-module-width: min(1180px, calc(100% - var(--space-32)));
  --activity-compact-card-height: 212px;
  --activity-compact-card-height-mobile: 176px;
  width: 100%;
  margin: 0 auto;
  padding: var(--space-16) 0 var(--space-64);
  display: grid;
  gap: var(--space-48);
}

.activity-module {
  --activity-soft: color-mix(in srgb, var(--activity-accent) 12%, transparent);
  position: relative;
  padding: var(--space-48) var(--space-16);
  overflow: hidden;
  border-block: 1px solid color-mix(in srgb, var(--activity-accent) 12%, var(--color-border));
  border-radius: 0;
  background:
    radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--color-fg) 18%, transparent) 1px, transparent 1.6px),
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 96%, transparent), color-mix(in srgb, var(--color-bg) 92%, var(--color-surface)));
  background-size: 24px 24px, auto;
  animation: module-rise 560ms ease both;
}

.activity-module:nth-child(2) {
  animation-delay: 80ms;
}

.activity-module:nth-child(3) {
  animation-delay: 160ms;
}

.activity-module:nth-child(4) {
  animation-delay: 240ms;
}

.activity-module__head {
  position: relative;
  z-index: 1;
  width: min(860px, 100%);
  margin: 0 auto var(--space-48);
  display: grid;
  justify-items: center;
  gap: var(--space-8);
  text-align: center;
}

.activity-module__head p {
  color: color-mix(in srgb, var(--activity-accent) 58%, var(--color-text-weak));
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.activity-module__head h2 {
  font-size: clamp(2.3rem, 5.6vw, 4.4rem);
  line-height: 1;
}

.activity-module__head h2 a {
  color: var(--color-fg);
  text-decoration: none;
  text-shadow: 0 8px 26px color-mix(in srgb, var(--activity-accent) 12%, transparent);
  transition:
    color var(--motion-180) ease,
    transform var(--motion-180) ease;
}

.activity-module__head h2 a:hover {
  color: var(--activity-accent);
}

.activity-module__head span {
  color: var(--color-text-weak);
  font-size: 0.9rem;
}

.activity-module__items {
  position: relative;
  z-index: 1;
  width: min(1180px, 100%);
  margin: 0 auto;
  display: grid;
  gap: var(--space-16);
}

.activity-module__items--wiki {
  width: var(--activity-module-width);
  gap: var(--space-14, 14px);
}

.activity-module__items--blog,
.activity-module__items--todo {
  width: var(--activity-module-width);
  align-items: stretch;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-14, 14px);
}

.activity-item,
.activity-blog-card,
.activity-todo-card,
.activity-empty {
  color: var(--color-fg);
  text-decoration: none;
}

.activity-item {
  position: relative;
  min-height: 244px;
}

.activity-item__inner {
  display: grid;
  align-content: space-between;
  gap: var(--space-16);
  min-height: 100%;
  padding: var(--space-18, 18px);
  border: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
  border-radius: var(--radius-8);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 94%, transparent), transparent),
    color-mix(in srgb, var(--color-surface) 92%, var(--color-bg));
  box-shadow: 0 24px 50px rgba(18, 24, 38, 0.06);
  transition:
    transform 260ms ease,
    border-color 260ms ease,
    background-color 260ms ease,
    box-shadow 260ms ease;
}

.activity-item:hover .activity-item__inner,
.activity-item:focus-visible .activity-item__inner {
  transform: translateY(-4px);
  box-shadow: var(--shadow-medium);
  border-color: color-mix(in srgb, var(--activity-accent) 42%, var(--color-border));
}

.activity-item__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-text-weak);
  font-size: 0.8rem;
  font-weight: 800;
}

.activity-item__body {
  display: grid;
  gap: var(--space-10, 10px);
}

.activity-item strong,
.activity-wiki-card strong {
  display: -webkit-box;
  font-size: clamp(1.1rem, 2vw, 1.38rem);
  line-height: 1.25;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.activity-item__description {
  color: var(--color-text-weak);
  font-size: 0.94rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.activity-blog-card {
  position: relative;
  min-height: var(--activity-compact-card-height);
  height: 100%;
}

.activity-blog-card__inner {
  position: relative;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  align-content: stretch;
  gap: var(--space-14, 14px);
  height: 100%;
  min-height: 100%;
  padding: clamp(var(--space-18, 18px), 2.4vw, var(--space-24));
  border: 1px solid color-mix(in srgb, var(--color-border) 86%, transparent);
  border-radius: var(--radius-12);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 96%, transparent), color-mix(in srgb, var(--color-surface) 88%, var(--color-bg)));
  box-shadow: 0 18px 38px rgba(18, 24, 38, 0.06);
  transition:
    transform 240ms ease,
    border-color 240ms ease,
    background-color 240ms ease,
    box-shadow 240ms ease;
}

.activity-blog-card:hover .activity-blog-card__inner,
.activity-blog-card:focus-visible .activity-blog-card__inner {
  transform: translateY(-3px);
  box-shadow: var(--shadow-medium);
  border-color: color-mix(in srgb, var(--activity-accent) 36%, var(--color-border));
}

.activity-blog-card__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-10, 10px);
  color: var(--color-text-weak);
  font-size: 0.82rem;
  font-weight: 800;
}

.activity-blog-card__category {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  border: 1px solid color-mix(in srgb, var(--activity-accent) 26%, var(--color-border));
  border-radius: 999px;
  background: color-mix(in srgb, var(--activity-accent) 12%, transparent);
  color: color-mix(in srgb, var(--activity-accent) 76%, var(--color-fg));
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.activity-blog-card__body {
  display: grid;
  gap: var(--space-10, 10px);
}

.activity-blog-card__body strong {
  display: -webkit-box;
  font-size: clamp(1.2rem, 2.2vw, 1.5rem);
  line-height: 1.28;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.activity-blog-card__description {
  color: color-mix(in srgb, var(--color-fg) 82%, var(--color-text-weak));
  font-size: 0.96rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.activity-blog-card__foot {
  margin-top: auto;
  padding-top: var(--space-10, 10px);
  border-top: 1px dashed color-mix(in srgb, var(--activity-accent) 22%, var(--color-border));
  color: color-mix(in srgb, var(--activity-accent) 78%, var(--color-fg));
  font-size: 0.82rem;
  font-weight: 900;
  letter-spacing: 0.06em;
}

.activity-todo-card {
  position: relative;
  min-height: var(--activity-compact-card-height);
  height: 100%;
}

.activity-todo-card__inner {
  position: relative;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  align-content: stretch;
  gap: var(--space-14, 14px);
  height: 100%;
  min-height: 100%;
  padding: clamp(var(--space-18, 18px), 2.4vw, var(--space-22, 22px));
  border: 1px solid color-mix(in srgb, var(--color-border) 86%, transparent);
  border-radius: var(--radius-12);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 96%, transparent), color-mix(in srgb, var(--color-surface) 88%, var(--color-bg)));
  box-shadow: 0 18px 38px rgba(18, 24, 38, 0.06);
  transition:
    transform 240ms ease,
    border-color 240ms ease,
    background-color 240ms ease,
    box-shadow 240ms ease;
}

.activity-todo-card:hover .activity-todo-card__inner,
.activity-todo-card:focus-visible .activity-todo-card__inner {
  transform: translateY(-3px);
  box-shadow: var(--shadow-medium);
  border-color: color-mix(in srgb, var(--activity-accent) 36%, var(--color-border));
}

.activity-todo-card__meta,
.activity-todo-card__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-10, 10px);
}

.activity-todo-card__meta {
  color: var(--color-text-weak);
  font-size: 0.82rem;
  font-weight: 800;
}

.activity-todo-card__status {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  border: 1px solid color-mix(in srgb, var(--todo-tone) 30%, var(--color-border));
  border-radius: 999px;
  background: color-mix(in srgb, var(--todo-tone) 12%, transparent);
  color: color-mix(in srgb, var(--todo-tone) 76%, var(--color-fg));
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.activity-todo-card__status.is-planned {
  --todo-tone: #c58c2b;
}

.activity-todo-card__status.is-in-progress {
  --todo-tone: #3b82f6;
}

.activity-todo-card__status.is-done {
  --todo-tone: #17a56b;
}

.activity-todo-card__status.is-paused {
  --todo-tone: #7a869a;
}

.activity-todo-card__body {
  display: grid;
  gap: var(--space-10, 10px);
}

.activity-todo-card__body strong {
  display: -webkit-box;
  font-size: clamp(1.18rem, 2.2vw, 1.46rem);
  line-height: 1.24;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.activity-todo-card__description {
  color: color-mix(in srgb, var(--color-fg) 82%, var(--color-text-weak));
  font-size: 0.94rem;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.activity-todo-card__foot {
  padding-top: var(--space-10, 10px);
  border-top: 1px dashed color-mix(in srgb, var(--activity-accent) 20%, var(--color-border));
  color: var(--color-text-weak);
  font-size: 0.82rem;
  font-weight: 800;
}

.activity-todo-card__foot span:last-child {
  color: var(--color-fg);
}

.activity-module--static .activity-module__items {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.activity-module--static .activity-item {
  min-height: 196px;
}

.activity-module--static .activity-item__inner {
  justify-items: center;
  text-align: center;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--activity-accent) 10%, transparent), transparent 40%),
    color-mix(in srgb, var(--color-surface) 92%, var(--color-bg));
}

.activity-module--static .activity-item:hover .activity-item__inner,
.activity-module--static .activity-item:focus-visible .activity-item__inner {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--activity-accent) 20%, transparent), transparent 40%),
    color-mix(in srgb, var(--activity-accent) 12%, var(--color-surface));
}

.activity-module--flip .activity-module__items {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.activity-module--flip .activity-item {
  min-height: 196px;
}

.activity-module--flip .activity-item__inner {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--activity-accent) 8%, transparent), transparent 46%),
    color-mix(in srgb, var(--color-surface) 96%, var(--activity-accent));
}

.activity-module--flip .activity-item__description,
.activity-module--wide .activity-item__description {
  color: color-mix(in srgb, var(--color-fg) 82%, var(--color-text-weak));
}

.activity-module--wide .activity-module__items {
  display: grid;
  gap: var(--space-16);
  width: var(--activity-module-width);
}

.activity-module--wide .activity-item {
  min-height: 164px;
}

.activity-module--wide .activity-item__inner {
  grid-template-columns: minmax(120px, 180px) minmax(0, 1fr);
  align-items: center;
  column-gap: clamp(var(--space-16), 4vw, var(--space-48));
  padding-inline: clamp(var(--space-24), 4vw, var(--space-48));
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--activity-accent) 8%, transparent), transparent 46%),
    color-mix(in srgb, var(--color-surface) 96%, var(--activity-accent));
}

.activity-module--wide .activity-item__meta {
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-6, 6px);
}

.activity-module--wide .activity-item__body {
  text-align: left;
}

.activity-wiki-card {
  color: var(--color-fg);
}

.activity-wiki-card__inner {
  display: grid;
  gap: var(--space-16);
  padding: clamp(var(--space-18, 18px), 3vw, var(--space-24));
  border: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
  border-radius: var(--radius-8);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 96%, transparent), color-mix(in srgb, var(--color-surface) 88%, var(--color-bg)));
  box-shadow: 0 24px 50px rgba(18, 24, 38, 0.06);
  transition:
    transform 260ms ease,
    border-color 260ms ease,
    background-color 260ms ease,
    box-shadow 260ms ease;
}

.activity-wiki-card:hover .activity-wiki-card__inner,
.activity-wiki-card.is-open .activity-wiki-card__inner {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
  border-color: color-mix(in srgb, var(--activity-accent) 42%, var(--color-border));
}

.activity-wiki-card__summary {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--space-16);
  align-items: start;
}

.activity-wiki-card__main {
  min-width: 0;
  display: grid;
  gap: var(--space-12);
  color: inherit;
  text-decoration: none;
}

.activity-item__meta--wiki {
  justify-content: flex-start;
}

.activity-item__body--wiki {
  gap: var(--space-8);
  text-align: left;
}

.activity-wiki-card__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  justify-self: end;
  align-self: start;
  gap: var(--space-8);
  min-width: 88px;
  min-height: 44px;
  padding: 0 var(--space-16);
  border: 1px solid color-mix(in srgb, var(--activity-accent) 48%, var(--color-border));
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-surface) 94%, var(--activity-accent));
  color: color-mix(in srgb, var(--activity-accent) 78%, var(--color-fg));
  font-size: 0.88rem;
  font-weight: 800;
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform var(--motion-180) ease,
    border-color var(--motion-180) ease,
    background-color var(--motion-180) ease,
    color var(--motion-180) ease;
}

.activity-wiki-card__toggle:hover,
.activity-wiki-card__toggle:focus-visible {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--activity-accent) 58%, var(--color-border));
  background: color-mix(in srgb, var(--activity-accent) 14%, var(--color-surface));
}

.activity-wiki-card__toggle-icon {
  transition: transform var(--motion-180) ease;
}

.activity-wiki-card__toggle-icon.is-open {
  transform: rotate(180deg);
}

.activity-wiki-card__preview {
  display: grid;
  gap: 0;
  margin: 0;
  padding: var(--space-4) 0 0;
  list-style: none;
  border-top: 1px dashed color-mix(in srgb, var(--activity-accent) 28%, var(--color-border));
}

.activity-wiki-card__chapter {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) auto;
  gap: var(--space-12);
  align-items: center;
  padding: 14px 0;
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid color-mix(in srgb, var(--activity-accent) 12%, transparent);
}

.activity-wiki-card__preview li:last-child .activity-wiki-card__chapter {
  padding-bottom: 0;
  border-bottom: 0;
}

.activity-wiki-card__chapter-index {
  color: var(--activity-accent);
  font-size: 0.92rem;
  font-weight: 900;
}

.activity-wiki-card__chapter-title {
  min-width: 0;
  font-weight: 700;
  line-height: 1.45;
}

.activity-wiki-card__chapter-meta {
  color: var(--color-text-weak);
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
}

.activity-wiki-card__chapter:hover .activity-wiki-card__chapter-title,
.activity-wiki-card__main:hover strong,
.activity-wiki-card__main:focus-visible strong {
  color: var(--activity-accent);
}

.activity-wiki-card__main:focus-visible,
.activity-wiki-card__chapter:focus-visible,
.activity-wiki-card__toggle:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--activity-accent) 38%, transparent);
  outline-offset: 3px;
}

.activity-empty {
  position: relative;
  z-index: 1;
  width: min(720px, calc(100% - var(--space-32)));
  min-height: 220px;
  margin: 0 auto;
  padding: var(--space-20, 20px);
  display: grid;
  align-content: end;
  gap: var(--space-8);
  border: 1px dashed color-mix(in srgb, var(--activity-accent) 38%, var(--color-border));
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--activity-accent) 8%, transparent);
}

.activity-empty span {
  font-weight: 800;
}

.activity-empty small {
  color: var(--color-text-weak);
}

@keyframes module-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 980px) {
  .activity-module__items--blog,
  .activity-module__items--todo,
  .activity-module--static .activity-module__items,
  .activity-module--flip .activity-module__items {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .activity-showcase {
    padding-bottom: var(--space-48);
  }

  .activity-module {
    padding: var(--space-32) var(--space-16);
  }

  .activity-module__head {
    margin-bottom: var(--space-24);
  }

  .activity-module--static .activity-module__items,
  .activity-module__items--blog,
  .activity-module__items--todo,
  .activity-module--flip .activity-module__items {
    grid-template-columns: 1fr;
  }

  .activity-item {
    min-height: 168px;
  }

  .activity-blog-card {
    min-height: var(--activity-compact-card-height-mobile);
  }

  .activity-todo-card {
    min-height: var(--activity-compact-card-height-mobile);
  }

  .activity-module--wide .activity-item__inner {
    grid-template-columns: 1fr;
    row-gap: var(--space-12);
    padding-inline: var(--space-18, 18px);
  }

  .activity-module--wide .activity-item__meta {
    flex-direction: row;
  }

  .activity-module__items--wiki {
    width: 100%;
  }

  .activity-module__items--blog,
  .activity-module__items--todo {
    width: 100%;
  }

  .activity-wiki-card__toggle {
    gap: var(--space-6);
    min-width: 72px;
    min-height: 38px;
    padding-inline: 12px;
    font-size: 0.81rem;
  }

  .activity-wiki-card__chapter {
    grid-template-columns: 20px minmax(0, 1fr) auto;
    gap: var(--space-8);
    align-items: baseline;
  }

  .activity-wiki-card__chapter-index {
    font-size: 0.8rem;
  }

  .activity-wiki-card__chapter-title {
    font-size: 0.92rem;
    line-height: 1.35;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .activity-wiki-card__chapter-meta {
    font-size: 0.68rem;
    letter-spacing: -0.01em;
    white-space: nowrap;
  }
}

@media (prefers-reduced-motion: reduce) {
  .activity-module {
    animation: none;
  }

  .activity-item__inner,
  .activity-blog-card__inner,
  .activity-todo-card__inner,
  .activity-module__head a,
  .activity-wiki-card__inner,
  .activity-wiki-card__toggle,
  .activity-wiki-card__toggle-icon {
    transition: none;
  }
}

:global(html[data-theme='dark']) .activity-item__inner,
:global(html[data-theme='dark']) .activity-blog-card__inner,
:global(html[data-theme='dark']) .activity-todo-card__inner,
:global(html[data-theme='dark']) .activity-wiki-card__inner {
  box-shadow: 0 18px 36px rgba(6, 10, 19, 0.32);
}

:global(html[data-theme='dark']) .activity-item__meta,
:global(html[data-theme='dark']) .activity-blog-card__meta,
:global(html[data-theme='dark']) .activity-todo-card__meta,
:global(html[data-theme='dark']) .activity-item__description,
:global(html[data-theme='dark']) .activity-blog-card__description,
:global(html[data-theme='dark']) .activity-todo-card__description,
:global(html[data-theme='dark']) .activity-wiki-card__chapter-meta {
  color: color-mix(in srgb, var(--color-fg) 76%, var(--color-text-weak));
}
</style>
