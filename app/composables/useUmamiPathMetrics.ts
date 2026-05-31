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
}

export function useUmamiPathMetrics() {
  const { data: pathMetrics, pending: pathMetricsPending, error: pathMetricsError, refresh: refreshPathMetrics } =
    useLazyAsyncData<Record<string, UmamiPathMetricSummary>>(
      'umami-path-metrics-v1',
      async () => {
        if (!hasUmamiPublicConfig()) {
          return {}
        }

        try {
          const range = resolveUmamiRange()
          return await fetchUmamiPathMetricsMap(range)
        } catch {
          return {}
        }
      },
      {
        server: false,
        default: () => ({}),
      },
    )

  const readPathMetric = (path: string): UmamiPathMetricSummary | null => {
    if (pathMetricsPending.value) {
      return null
    }

    return pathMetrics.value[normalizeUmamiPath(path)] || EMPTY_PATH_METRIC
  }

  return {
    pathMetrics,
    pathMetricsPending,
    pathMetricsError,
    refreshPathMetrics,
    readPathMetric,
  }
}
