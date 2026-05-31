<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import { ref } from 'vue'
import {
  fetchUmamiExpandedMetrics,
  getUmamiPublicConfig,
  hasUmamiPublicConfig,
  normalizeUmamiPath,
  resolveUmamiRange,
  type UmamiMetricRow,
} from '~/composables/useUmamiClient'
import BaseTag from '~/components/ui/BaseTag.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import {
  formatContentDate,
  getContentDate,
  isIndexEntry,
  readContentString,
  readContentTags,
  sortWikiChapterEntries,
  type ContentEntry,
} from '~/utils/content'
import { getWikiRoutePath } from '~/utils/wikiPath'

type WikiGroup = {
  path: string
  title: string
  items: ContentEntry[]
  primary: ContentEntry
}

type PathMetricSummary = Pick<UmamiMetricRow, 'pageviews' | 'visits'>

const props = defineProps<{
  groups: WikiGroup[]
}>()

const expandedGroups = ref<string[]>([])

const { data: pathMetrics, pending: pathMetricsPending } = await useLazyAsyncData<Record<string, PathMetricSummary>>(
  'wiki-doc-list-path-metrics-v1',
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

const getGroupKey = (group: WikiGroup) => group.path || group.primary.path || group.title

const isGroupExpanded = (group: WikiGroup) => expandedGroups.value.includes(getGroupKey(group))

const toggleGroup = (group: WikiGroup) => {
  const key = getGroupKey(group)

  expandedGroups.value = isGroupExpanded(group)
    ? expandedGroups.value.filter((item) => item !== key)
    : [...expandedGroups.value, key]
}

const getChapterItems = (group: WikiGroup) => {
  const sortedItems = sortWikiChapterEntries(group.items)
  const primaryPath = group.primary.path || ''
  const shouldExcludePrimary = isIndexEntry(group.primary)
  const chapterItems = shouldExcludePrimary
    ? sortedItems.filter((item) => (item.path || '') !== primaryPath)
    : sortedItems

  return chapterItems.length ? chapterItems : [group.primary]
}

const getChapterCountLabel = (group: WikiGroup) => {
  const count = getChapterItems(group).length
  return `${count} 个章节`
}

const formatMetricCount = (value: number) => Math.max(0, Number(value || 0)).toLocaleString('zh-CN')

const readPathMetric = (path: string): PathMetricSummary | null => {
  if (pathMetricsPending.value) {
    return null
  }

  return pathMetrics.value[normalizeUmamiPath(path)] || {
    pageviews: 0,
    visits: 0,
  }
}

const getMetricValue = (path: string, key: keyof PathMetricSummary) => {
  const metric = readPathMetric(path)

  return metric ? formatMetricCount(metric[key]) : '--'
}
</script>

<template>
  <div v-if="props.groups.length" class="wiki-doc-list">
    <article
      v-for="(group, groupIndex) in props.groups"
      :key="getGroupKey(group)"
      class="wiki-doc-card"
      :class="{ 'is-open': isGroupExpanded(group) }"
    >
      <div class="wiki-doc-card__surface">
        <div class="wiki-doc-card__summary">
          <NuxtLink class="wiki-doc-card__main" :to="getWikiRoutePath(group.primary)">
            <div class="wiki-doc-card__meta">
              <time>{{ formatContentDate(getContentDate(group.primary, ['date', 'updatedAt'])) }}</time>
            </div>
            <h2>{{ group.title }}</h2>
            <p class="wiki-doc-card__description">
              {{ readContentString(group.primary, 'description') || '暂无摘要。' }}
            </p>
          </NuxtLink>

          <div v-if="readContentTags(group.primary).length" class="wiki-doc-card__tags">
            <BaseTag v-for="tag in readContentTags(group.primary)" :key="tag" tone="accent">
              {{ tag }}
            </BaseTag>
          </div>
        </div>

        <div class="wiki-doc-card__footer">
          <span class="wiki-doc-card__footer-label">{{ getChapterCountLabel(group) }}</span>
          <button
            type="button"
            class="wiki-doc-card__toggle"
            :aria-expanded="isGroupExpanded(group)"
            :aria-controls="`wiki-doc-card-chapters-${groupIndex}`"
            @click="toggleGroup(group)"
          >
            <span>{{ isGroupExpanded(group) ? '收起' : '展开' }}</span>
            <ChevronDown
              :size="16"
              class="wiki-doc-card__toggle-icon"
              :class="{ 'is-open': isGroupExpanded(group) }"
              aria-hidden="true"
            />
          </button>
        </div>

        <ol
          v-if="isGroupExpanded(group)"
          :id="`wiki-doc-card-chapters-${groupIndex}`"
          class="wiki-doc-card__chapters"
        >
          <li v-for="(chapter, chapterIndex) in getChapterItems(group)" :key="chapter.path || `${getGroupKey(group)}-${chapterIndex}`">
            <NuxtLink class="wiki-doc-card__chapter" :to="getWikiRoutePath(chapter)">
              <span class="wiki-doc-card__chapter-index">{{ chapterIndex + 1 }}</span>
              <span class="wiki-doc-card__chapter-title">
                {{ readContentString(chapter, 'title') || group.title }}
              </span>
              <span class="wiki-doc-card__chapter-metrics">
                <span>浏览 {{ getMetricValue(getWikiRoutePath(chapter), 'pageviews') }}</span>
                <span>访问 {{ getMetricValue(getWikiRoutePath(chapter), 'visits') }}</span>
              </span>
            </NuxtLink>
          </li>
        </ol>
      </div>
    </article>
  </div>

  <EmptyState
    v-else
    title="没有匹配的 Wiki"
    description="调整搜索或分类后再看。内容仍来自本地 Markdown。"
  />
</template>

<style scoped>
.wiki-doc-list {
  --wiki-card-height: 258px;
  --wiki-card-height-expanded: 408px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-12);
  align-items: start;
}

.wiki-doc-card {
  min-width: 0;
  height: var(--wiki-card-height);
  transition: height 180ms ease;
}

.wiki-doc-card.is-open {
  height: var(--wiki-card-height-expanded);
}

.wiki-doc-card__surface {
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto 0fr;
  gap: 10px;
  padding: 16px 16px 14px;
  border: 1px solid color-mix(in srgb, var(--color-border) 76%, transparent);
  border-radius: var(--radius-8);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 96%, transparent), color-mix(in srgb, var(--color-surface) 90%, var(--color-bg)));
  box-shadow: 0 18px 36px rgba(18, 24, 38, 0.05);
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease,
    grid-template-rows 180ms ease;
}

.wiki-doc-card:hover .wiki-doc-card__surface,
.wiki-doc-card.is-open .wiki-doc-card__surface {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--color-accent) 36%, var(--color-border));
  box-shadow: var(--shadow-medium);
}

.wiki-doc-card.is-open .wiki-doc-card__surface {
  grid-template-rows: minmax(0, 0.7fr) auto minmax(0, 1.3fr);
}

.wiki-doc-card__summary {
  min-height: 0;
  display: grid;
  gap: var(--space-12);
  overflow: hidden;
}

.wiki-doc-card__main {
  min-width: 0;
  display: grid;
  gap: 8px;
  color: inherit;
  text-decoration: none;
}

.wiki-doc-card__meta,
.wiki-doc-card__tags,
.wiki-doc-card__footer {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.wiki-doc-card__meta {
  justify-content: space-between;
  color: var(--color-text-weak);
  font-size: 0.82rem;
  font-weight: 700;
}

.wiki-doc-card__main h2 {
  display: -webkit-box;
  overflow: hidden;
  font-size: 1.05rem;
  line-height: 1.4;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.wiki-doc-card__description {
  display: -webkit-box;
  overflow: hidden;
  color: var(--color-text-weak);
  line-height: 1.65;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.wiki-doc-card.is-open .wiki-doc-card__description {
  -webkit-line-clamp: 1;
}

.wiki-doc-card__tags {
  flex-wrap: wrap;
  align-content: start;
  overflow: hidden;
  max-height: calc(1.75rem * 2 + var(--space-8));
}

.wiki-doc-card.is-open .wiki-doc-card__tags {
  max-height: 1.75rem;
}

.wiki-doc-card__footer {
  justify-content: space-between;
  min-width: 0;
  padding-top: 2px;
}

.wiki-doc-card__footer-label {
  min-width: 0;
  color: var(--color-text-weak);
  font-size: 0.8rem;
  font-weight: 700;
}

.wiki-doc-card__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  gap: 6px;
  min-width: 78px;
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid color-mix(in srgb, var(--color-accent) 42%, var(--color-border));
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-surface) 94%, var(--color-accent));
  color: color-mix(in srgb, var(--color-accent) 78%, var(--color-fg));
  font-size: 0.82rem;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
  transition:
    border-color 180ms ease,
    background-color 180ms ease,
    transform 180ms ease;
}

.wiki-doc-card__toggle:hover,
.wiki-doc-card__toggle:focus-visible {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--color-accent) 56%, var(--color-border));
  background: color-mix(in srgb, var(--color-accent) 12%, var(--color-surface));
}

.wiki-doc-card__toggle-icon {
  transition: transform 180ms ease;
}

.wiki-doc-card__toggle-icon.is-open {
  transform: rotate(180deg);
}

.wiki-doc-card__chapters {
  min-height: 0;
  margin: 0;
  padding: 6px 0 0;
  list-style: none;
  overflow: auto;
  border-top: 1px dashed color-mix(in srgb, var(--color-accent) 26%, var(--color-border));
  scrollbar-width: thin;
}

.wiki-doc-card__chapter {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) auto;
  gap: var(--space-12);
  align-items: center;
  padding: 12px 0;
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 76%, transparent);
}

.wiki-doc-card__chapters li:last-child .wiki-doc-card__chapter {
  border-bottom: 0;
  padding-bottom: 4px;
}

.wiki-doc-card__chapter-index {
  color: var(--color-accent);
  font-size: 0.88rem;
  font-weight: 900;
}

.wiki-doc-card__chapter-title {
  min-width: 0;
  display: -webkit-box;
  overflow: hidden;
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.55;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.wiki-doc-card__chapter-metrics {
  display: grid;
  justify-items: end;
  gap: 2px;
  min-width: 88px;
  color: var(--color-text-weak);
  font-size: 0.74rem;
  font-weight: 700;
  text-align: right;
  white-space: nowrap;
}

.wiki-doc-card__main:hover h2,
.wiki-doc-card__main:focus-visible h2,
.wiki-doc-card__chapter:hover .wiki-doc-card__chapter-title,
.wiki-doc-card__chapter:focus-visible .wiki-doc-card__chapter-title {
  color: var(--color-accent);
}

.wiki-doc-card__main:focus-visible,
.wiki-doc-card__chapter:focus-visible,
.wiki-doc-card__toggle:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--color-accent) 34%, transparent);
  outline-offset: 3px;
}

@media (max-width: 1040px) {
  .wiki-doc-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .wiki-doc-list {
    --wiki-card-height: 238px;
    --wiki-card-height-expanded: 342px;
    grid-template-columns: 1fr;
  }

  .wiki-doc-card__surface {
    padding: 14px;
    gap: 10px;
  }

  .wiki-doc-card__meta {
    font-size: 0.78rem;
  }

  .wiki-doc-card__main h2 {
    font-size: 1rem;
  }

  .wiki-doc-card__description {
    font-size: 0.88rem;
    line-height: 1.55;
    -webkit-line-clamp: 1;
  }

  .wiki-doc-card__footer-label {
    font-size: 0.76rem;
  }

  .wiki-doc-card__toggle {
    min-width: 72px;
    min-height: 36px;
    padding-inline: 12px;
    font-size: 0.78rem;
  }

  .wiki-doc-card__chapter {
    grid-template-columns: 20px minmax(0, 1fr) 82px;
    gap: 10px;
    padding: 10px 0;
  }

  .wiki-doc-card__chapter-title {
    font-size: 0.88rem;
  }

  .wiki-doc-card__chapter-metrics {
    min-width: 82px;
    font-size: 0.7rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wiki-doc-card,
  .wiki-doc-card__surface,
  .wiki-doc-card__toggle,
  .wiki-doc-card__toggle-icon {
    transition: none;
  }
}

:global(html[data-theme='dark']) .wiki-doc-card__surface {
  box-shadow: 0 16px 34px rgba(6, 10, 19, 0.28);
}

:global(html[data-theme='dark']) .wiki-doc-card__description,
:global(html[data-theme='dark']) .wiki-doc-card__chapter-metrics,
:global(html[data-theme='dark']) .wiki-doc-card__footer-label,
:global(html[data-theme='dark']) .wiki-doc-card__meta {
  color: color-mix(in srgb, var(--color-fg) 74%, var(--color-text-weak));
}
</style>
