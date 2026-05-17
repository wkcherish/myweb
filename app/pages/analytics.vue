<script setup lang="ts">
import { computed } from 'vue'

import BasePanel from '~/components/ui/BasePanel.vue'
import BaseTag from '~/components/ui/BaseTag.vue'
import {
  clearUmamiClientCache,
  fetchUmamiExpandedMetrics,
  fetchUmamiStats,
  getUmamiShareFrameUrl,
  hasUmamiPublicConfig,
  resolveUmamiRange,
  type UmamiMetricRow,
} from '~/composables/useUmamiClient'

interface OverviewSummary {
  pageviews: number
  visitors: number
  visits: number
  bounces: number
  totaltime: number
  bounceRate: number
  avgVisitDuration: number
  pagesPerVisit: number
}

interface OverviewResponse {
  summary: OverviewSummary
  top: {
    paths: UmamiMetricRow[]
    referrers: UmamiMetricRow[]
    channels: UmamiMetricRow[]
    countries: UmamiMetricRow[]
    regions: UmamiMetricRow[]
    cities: UmamiMetricRow[]
    browsers: UmamiMetricRow[]
    os: UmamiMetricRow[]
    devices: UmamiMetricRow[]
    events: UmamiMetricRow[]
  }
}

const pageDescription = '该页面参考 tungchiahui.github.io 的实现方式，基于 Umami Share API 聚合统计并展示分析看板。'
const topLimit = 12

useHead({
  title: '数据统计分析',
  meta: [
    {
      name: 'description',
      content: pageDescription,
    },
  ],
})

function formatNumber(value: number | undefined) {
  return Math.max(0, Number(value || 0)).toLocaleString('zh-CN')
}

function formatPercent(value: number | undefined) {
  if (value === undefined || Number.isNaN(value)) {
    return '--'
  }

  return `${Math.round(value * 100)}%`
}

function formatDuration(seconds: number | undefined) {
  const total = Math.max(0, Math.round(Number(seconds || 0)))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const remainSeconds = total % 60

  if (hours > 0) return `${hours}时 ${minutes}分 ${remainSeconds}秒`
  if (minutes > 0) return `${minutes}分 ${remainSeconds}秒`
  return `${remainSeconds}秒`
}

const isUmamiConfigured = computed(() => hasUmamiPublicConfig())
const umamiShareFrameUrl = computed(() => getUmamiShareFrameUrl())

async function loadOverviewData(): Promise<OverviewResponse | null> {
  if (!isUmamiConfigured.value) {
    return null
  }

  const range = resolveUmamiRange()
  const [
    summary,
    paths,
    referrers,
    channels,
    countries,
    regions,
    cities,
    browsers,
    osList,
    devices,
    events,
  ] = await Promise.all([
    fetchUmamiStats(range),
    fetchUmamiExpandedMetrics('path', range, { limit: topLimit }),
    fetchUmamiExpandedMetrics('referrer', range, { limit: topLimit }),
    fetchUmamiExpandedMetrics('channel', range, { limit: topLimit }),
    fetchUmamiExpandedMetrics('country', range, { limit: topLimit }),
    fetchUmamiExpandedMetrics('region', range, { limit: topLimit }),
    fetchUmamiExpandedMetrics('city', range, { limit: topLimit }),
    fetchUmamiExpandedMetrics('browser', range, { limit: topLimit }),
    fetchUmamiExpandedMetrics('os', range, { limit: topLimit }),
    fetchUmamiExpandedMetrics('device', range, { limit: topLimit }),
    fetchUmamiExpandedMetrics('event', range, { limit: topLimit }),
  ])

  const visits = Math.max(summary.visits || 0, 1)
  const bounces = Math.min(summary.bounces || 0, visits)

  return {
    summary: {
      ...summary,
      bounceRate: bounces / visits,
      avgVisitDuration: (summary.totaltime || 0) / visits,
      pagesPerVisit: (summary.pageviews || 0) / visits,
    },
    top: {
      paths: paths.slice(0, topLimit),
      referrers: referrers.slice(0, topLimit),
      channels: channels.slice(0, topLimit),
      countries: countries.slice(0, topLimit),
      regions: regions.slice(0, topLimit),
      cities: cities.slice(0, topLimit),
      browsers: browsers.slice(0, topLimit),
      os: osList.slice(0, topLimit),
      devices: devices.slice(0, topLimit),
      events: events.slice(0, topLimit),
    },
  }
}

const { data, pending, error, refresh } = await useAsyncData(
  'analytics-overview',
  () => loadOverviewData(),
  {
    server: false,
    default: () => null,
  },
)

async function handleRefresh() {
  clearUmamiClientCache()
  await refresh()
}

const summaryCards = computed(() => {
  const summary = data.value?.summary
  if (!summary) return []

  return [
    { label: '独立访客', value: formatNumber(summary.visitors) },
    { label: '访问次数', value: formatNumber(summary.visits) },
    { label: '页面浏览', value: formatNumber(summary.pageviews) },
    { label: '跳出次数', value: formatNumber(summary.bounces) },
    { label: '跳出率', value: formatPercent(summary.bounceRate) },
    { label: '平均访问时长', value: formatDuration(summary.avgVisitDuration) },
    { label: '平均每次访问页数', value: `${summary.pagesPerVisit.toFixed(2)} 页` },
    { label: '总停留时长', value: formatDuration(summary.totaltime) },
  ]
})

const sections = computed(() => {
  const top = data.value?.top
  if (!top) return []

  return [
    {
      title: '热门页面',
      rows: top.paths,
      value: (row: UmamiMetricRow) => `${formatNumber(row.pageviews)} PV / ${formatNumber(row.visits)} 次访问`,
    },
    {
      title: '来源 Referrer',
      rows: top.referrers,
      value: (row: UmamiMetricRow) => `${formatNumber(row.visits)} 次访问`,
    },
    {
      title: '访问渠道',
      rows: top.channels,
      value: (row: UmamiMetricRow) => `${formatNumber(row.visits)} 次访问`,
    },
    {
      title: '国家 / 地区',
      rows: top.countries,
      value: (row: UmamiMetricRow) => `${formatNumber(row.visitors)} 位访客`,
    },
    {
      title: '省份 / 州',
      rows: top.regions,
      value: (row: UmamiMetricRow) => `${formatNumber(row.visitors)} 位访客`,
    },
    {
      title: '城市',
      rows: top.cities,
      value: (row: UmamiMetricRow) => `${formatNumber(row.visitors)} 位访客`,
    },
    {
      title: '浏览器',
      rows: top.browsers,
      value: (row: UmamiMetricRow) => `${formatNumber(row.visits)} 次访问`,
    },
    {
      title: '操作系统',
      rows: top.os,
      value: (row: UmamiMetricRow) => `${formatNumber(row.visits)} 次访问`,
    },
    {
      title: '设备类型',
      rows: top.devices,
      value: (row: UmamiMetricRow) => `${formatNumber(row.visits)} 次访问`,
    },
    {
      title: '自定义事件',
      rows: top.events,
      value: (row: UmamiMetricRow) => `${formatNumber(row.pageviews)} 次触发`,
    },
  ]
})
</script>

<template>
  <section class="analytics-page">
    <BasePanel tone="floating" class="analytics-hero">
      <BaseTag tone="accent">Analytics</BaseTag>
      <h1 class="analytics-hero__title">数据统计分析</h1>
      <p class="analytics-hero__desc">
        {{ pageDescription }}
      </p>
      <div class="analytics-hero__actions">
        <button class="analytics-refresh-btn" type="button" :disabled="pending" @click="handleRefresh">
          {{ pending ? '刷新中...' : '刷新数据' }}
        </button>
      </div>
    </BasePanel>

    <BasePanel v-if="!isUmamiConfigured" tone="muted" class="analytics-notice">
      <p>尚未配置 Umami 共享参数，请在 `runtimeConfig.public.umami` 中设置 `baseUrl` 与 `shareId`。</p>
    </BasePanel>

    <BasePanel v-else-if="error" tone="muted" class="analytics-notice">
      <p>统计数据加载失败，请稍后刷新或检查 Umami 配置与网络可达性。</p>
    </BasePanel>

    <section v-else-if="summaryCards.length" class="analytics-summary-grid" aria-label="统计概览">
      <article v-for="card in summaryCards" :key="card.label" class="analytics-summary-card">
        <p class="analytics-summary-card__label">{{ card.label }}</p>
        <p class="analytics-summary-card__value">{{ card.value }}</p>
      </article>
    </section>

    <BasePanel v-else-if="pending" tone="muted" class="analytics-notice">
      <p>正在加载统计数据...</p>
    </BasePanel>

    <section v-if="sections.length" class="analytics-panel-grid">
      <BasePanel v-for="section in sections" :key="section.title" class="analytics-panel">
        <h2 class="analytics-panel__title">{{ section.title }}</h2>
        <ol v-if="section.rows.length" class="analytics-list">
          <li v-for="(row, index) in section.rows" :key="`${section.title}-${row.name}-${index}`" class="analytics-list__item">
            <span class="analytics-list__rank">{{ index + 1 }}</span>
            <span class="analytics-list__name">{{ row.name || '直接访问' }}</span>
            <span class="analytics-list__value">{{ section.value(row) }}</span>
          </li>
        </ol>
        <p v-else class="analytics-panel__empty">暂无数据</p>
      </BasePanel>
    </section>

    <BasePanel v-if="umamiShareFrameUrl" class="analytics-frame-wrap" :padded="false">
      <iframe
        class="analytics-frame"
        :src="umamiShareFrameUrl"
        title="网站访问数据统计"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      />
    </BasePanel>
  </section>
</template>

<style scoped>
.analytics-page {
  display: grid;
  gap: var(--space-16);
}

.analytics-hero__title {
  margin-top: var(--space-12);
  font-size: clamp(1.65rem, 4vw, 2.2rem);
}

.analytics-hero__desc {
  margin-top: var(--space-12);
  max-width: 72ch;
}

.analytics-hero__actions {
  margin-top: var(--space-16);
}

.analytics-refresh-btn {
  min-height: 36px;
  padding: 0 var(--space-12);
  border: 1px solid color-mix(in srgb, var(--color-primary) 34%, var(--color-border));
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--color-surface) 88%, white 10%);
  color: var(--color-fg);
  font-size: 0.9rem;
  font-weight: 700;
  transition:
    transform var(--motion-120) ease,
    border-color var(--motion-180) ease,
    background-color var(--motion-180) ease;
}

.analytics-refresh-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--color-primary) 58%, var(--color-border));
  background: color-mix(in srgb, var(--color-primary) 10%, var(--color-surface));
}

.analytics-refresh-btn:disabled {
  opacity: 0.62;
  cursor: wait;
}

.analytics-notice {
  font-size: 0.94rem;
}

.analytics-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.analytics-summary-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-12);
  background: color-mix(in srgb, var(--color-surface-soft) 74%, transparent);
  padding: var(--space-12);
}

.analytics-summary-card__label {
  color: var(--color-text-weak);
  font-size: 0.78rem;
}

.analytics-summary-card__value {
  margin-top: var(--space-8);
  color: var(--color-fg);
  font-size: 1.04rem;
  font-weight: 800;
}

.analytics-panel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}

.analytics-panel {
  display: grid;
  gap: var(--space-10);
}

.analytics-panel__title {
  font-size: 1.02rem;
}

.analytics-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 6px;
}

.analytics-list__item {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) auto;
  align-items: baseline;
  gap: var(--space-8);
  border-radius: var(--radius-8);
  padding: 6px 8px;
  background: color-mix(in srgb, var(--color-surface-soft) 76%, transparent);
}

.analytics-list__rank {
  color: var(--color-text-weak);
  font-size: 0.8rem;
  font-weight: 700;
}

.analytics-list__name {
  min-width: 0;
  overflow-wrap: anywhere;
  color: var(--color-fg);
  font-size: 0.87rem;
}

.analytics-list__value {
  color: var(--color-text-weak);
  font-size: 0.76rem;
  white-space: nowrap;
}

.analytics-panel__empty {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--color-surface-soft) 84%, transparent);
  padding: 0.72rem 0.82rem;
}

.analytics-frame-wrap {
  overflow: hidden;
}

.analytics-frame {
  width: 100%;
  min-height: 900px;
  border: 0;
  display: block;
}

@media (max-width: 640px) {
  .analytics-list__item {
    grid-template-columns: 24px minmax(0, 1fr);
  }

  .analytics-list__value {
    grid-column: 2;
  }
}
</style>
