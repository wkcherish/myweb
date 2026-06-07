<script setup lang="ts">
type VisitCountVariant = 'compact' | 'pair' | 'summary'

const props = withDefaults(
  defineProps<{
    path?: string
    paths?: string[]
    variant?: VisitCountVariant
  }>(),
  {
    path: '',
    variant: 'compact',
  },
)

const route = useRoute()
const { readPathMetricsSummary } = useUmamiPathMetrics()

const targetPaths = computed(() => {
  const paths = props.paths?.map((path) => path.trim()).filter(Boolean) || []
  return paths.length ? paths : [props.path || route.path]
})

const metric = computed(() => readPathMetricsSummary(targetPaths.value))

const formatMetricCount = (value: number) => Math.max(0, Number(value || 0)).toLocaleString('zh-CN')

const formatDuration = (seconds: number) => {
  const total = Math.max(0, Math.round(Number(seconds || 0)))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const remainSeconds = total % 60

  if (hours > 0) return `${hours}时${minutes}分`
  if (minutes > 0) return `${minutes}分${remainSeconds}秒`
  return `${remainSeconds}秒`
}

const compactCount = computed(() => {
  if (!metric.value) {
    return '--'
  }

  return formatMetricCount(metric.value.visits)
})

const compactPairItems = computed(() => {
  const summary = metric.value

  return [
    {
      label: '浏览',
      value: summary ? formatMetricCount(summary.pageviews) : '--',
    },
    {
      label: '访问',
      value: summary ? formatMetricCount(summary.visits) : '--',
    },
  ]
})

const metricItems = computed(() => {
  const summary = metric.value
  const visits = Math.max(0, Number(summary?.visits || 0))
  const bounces = Math.min(Math.max(0, Number(summary?.bounces || 0)), visits)

  return [
    {
      label: '浏览次数',
      value: summary ? formatMetricCount(summary.pageviews) : '--',
    },
    {
      label: '访问次数',
      value: summary ? formatMetricCount(summary.visits) : '--',
    },
    {
      label: '跳出率',
      value: summary && visits > 0 ? `${Math.round((bounces / visits) * 100)}%` : '--',
    },
    {
      label: '平均停留',
      value: summary && visits > 0 ? formatDuration(summary.totaltime / visits) : '--',
    },
  ]
})
</script>

<template>
  <span v-if="variant === 'compact'" class="visit-count">访问 {{ compactCount }} 次</span>
  <span v-else-if="variant === 'pair'" class="visit-count-pair" aria-label="浏览和访问统计">
    <span v-for="item in compactPairItems" :key="item.label" class="visit-count-pair__item">
      <span>{{ item.label }}</span>
      <strong>{{ item.value }}</strong>
    </span>
  </span>
  <span v-else class="visit-metrics" aria-label="访问统计">
    <span v-for="item in metricItems" :key="item.label" class="visit-metrics__item">
      <strong>{{ item.value }}</strong>
      <span>{{ item.label }}</span>
    </span>
  </span>
</template>

<style scoped>
.visit-count {
  color: var(--color-text-weak);
  font-size: 0.82rem;
  font-weight: 800;
}

.visit-count-pair {
  display: inline-flex;
  align-items: center;
  overflow: hidden;
  max-width: 100%;
  min-height: 32px;
  border: 1px solid color-mix(in srgb, var(--color-border) 76%, transparent);
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--color-surface) 86%, var(--color-bg));
  color: var(--color-text-weak);
  font-size: 0.78rem;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
}

.visit-count-pair__item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 10px;
}

.visit-count-pair__item + .visit-count-pair__item {
  border-left: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
}

.visit-count-pair__item strong {
  color: var(--color-fg);
  font-size: 0.82rem;
  font-variant-numeric: tabular-nums;
  font-weight: 900;
}

.visit-metrics {
  width: min(100%, 520px);
  flex: 1 1 420px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: stretch;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--color-border) 78%, transparent);
  border-radius: var(--radius-8);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 96%, transparent), color-mix(in srgb, var(--color-bg) 72%, var(--color-surface)));
}

.visit-metrics__item {
  min-width: 0;
  min-height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0 8px;
  color: var(--color-text-weak);
  font-size: 0.76rem;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
}

.visit-metrics__item + .visit-metrics__item {
  border-left: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
}

.visit-metrics__item strong {
  color: var(--color-fg);
  font-size: 0.84rem;
  font-variant-numeric: tabular-nums;
  font-weight: 900;
}

@media (max-width: 560px) {
  .visit-count-pair {
    min-height: 30px;
    font-size: 0.74rem;
  }

  .visit-count-pair__item {
    padding: 0 9px;
  }

  .visit-count-pair__item strong {
    font-size: 0.78rem;
  }

  .visit-metrics {
    width: 100%;
    flex-basis: 100%;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .visit-metrics__item {
    min-height: 32px;
    justify-content: flex-start;
    padding: 0 10px;
  }

  .visit-metrics__item + .visit-metrics__item {
    border-left: 0;
  }

  .visit-metrics__item:nth-child(even) {
    border-left: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
  }

  .visit-metrics__item:nth-child(n + 3) {
    border-top: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
  }
}
</style>
