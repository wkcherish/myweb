import {
  fetchUmamiPathMetricsMap,
  hasUmamiPublicConfig,
  normalizeUmamiPath,
  resolveUmamiRange,
  type UmamiPathMetricSummary,
} from '~/composables/useUmamiClient'

const EMPTY_PATH_METRIC: UmamiPathMetricSummary = {
  pageviews: 0,
  visits: 0,
  bounces: 0,
  totaltime: 0,
}

let pathMetricsRequest: Promise<Record<string, UmamiPathMetricSummary>> | null = null

export function useUmamiPathMetrics() {
  const pathMetrics = useState<Record<string, UmamiPathMetricSummary>>('umami-path-metrics-v2', () => ({}))
  const pathMetricsPending = useState('umami-path-metrics-v2-pending', () => false)
  const pathMetricsLoaded = useState('umami-path-metrics-v2-loaded', () => false)
  const pathMetricsError = useState<string | null>('umami-path-metrics-v2-error', () => null)

  const refreshPathMetrics = async () => {
    if (import.meta.server) {
      return pathMetrics.value
    }

    if (pathMetricsRequest) {
      return pathMetricsRequest
    }

    pathMetricsPending.value = true
    pathMetricsError.value = null

    pathMetricsRequest = (async () => {
      try {
        if (!hasUmamiPublicConfig()) {
          return {}
        }

        const range = resolveUmamiRange()
        return await fetchUmamiPathMetricsMap(range)
      } catch (error) {
        pathMetricsError.value = error instanceof Error ? error.message : String(error)
        return {}
      }
    })()
      .then((metrics) => {
        pathMetrics.value = metrics
        pathMetricsLoaded.value = true
        return metrics
      })
      .finally(() => {
        pathMetricsPending.value = false
        pathMetricsRequest = null
      })

    return pathMetricsRequest
  }

  if (import.meta.client && !pathMetricsLoaded.value && !pathMetricsPending.value) {
    onMounted(() => {
      void refreshPathMetrics()
    })
  }

  const readPathMetricsSummary = (paths: string | string[]): UmamiPathMetricSummary | null => {
    if (import.meta.server || !pathMetricsLoaded.value) {
      return null
    }

    const normalizedPaths = [...new Set((Array.isArray(paths) ? paths : [paths]).map((path) => normalizeUmamiPath(path)))]
    const metrics = pathMetrics.value || {}

    return normalizedPaths.reduce<UmamiPathMetricSummary>(
      (summary, path) => {
        const metric = metrics[path] || EMPTY_PATH_METRIC

        return {
          pageviews: summary.pageviews + metric.pageviews,
          visits: summary.visits + metric.visits,
          bounces: summary.bounces + metric.bounces,
          totaltime: summary.totaltime + metric.totaltime,
        }
      },
      { ...EMPTY_PATH_METRIC },
    )
  }

  const readPathMetric = (path: string): UmamiPathMetricSummary | null => readPathMetricsSummary(path)

  return {
    pathMetrics,
    pathMetricsPending,
    pathMetricsError,
    refreshPathMetrics,
    readPathMetric,
    readPathMetricsSummary,
  }
}
