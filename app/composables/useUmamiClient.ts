import { $fetch as ofetch } from 'ofetch'

interface UmamiShareToken {
  websiteId: string
  token: string
}

export interface UmamiMetricRow {
  name: string
  pageviews: number
  visitors: number
  visits: number
  bounces: number
  totaltime: number
}

export interface UmamiStatsResponse {
  pageviews: number
  visitors: number
  visits: number
  bounces: number
  totaltime: number
  comparison: {
    pageviews: number
    visitors: number
    visits: number
    bounces: number
    totaltime: number
  }
}

export interface UmamiRange {
  startAt: number
  endAt: number
}

export interface UmamiPublicConfig {
  baseUrl: string
  shareId: string
  websiteId: string
  startAt: string | number
  pathLimit: number
}

export type UmamiMetricType = 'path' | 'referrer' | 'channel' | 'country' | 'region' | 'city' | 'browser' | 'os' | 'device' | 'event'

const SHARE_TOKEN_HEADER = 'x-umami-share-token'
const CACHE_TTL_MS = 60 * 1000

const shareTokenCache = new Map<string, UmamiShareToken>()
const shareTokenRequestCache = new Map<string, Promise<UmamiShareToken>>()
const statsCache = new Map<string, UmamiStatsResponse>()
const metricsCache = new Map<string, UmamiMetricRow[]>()
const cacheTimeStore = new Map<string, number>()

function asNumber(value: unknown): number {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : 0
}

function normalizeBaseUrl(input: unknown): string {
  return String(input || '').replace(/\/+$/, '')
}

function normalizePath(path: string): string {
  const clean = String(path || '/').trim()
  if (!clean) return '/'
  const withSlash = clean.startsWith('/') ? clean : `/${clean}`
  return withSlash.replace(/\/+$/, '') || '/'
}

function parseBoundary(input: unknown, fallback: number): number {
  if (typeof input === 'number' && Number.isFinite(input)) {
    return input
  }

  if (typeof input === 'string') {
    const numeric = Number(input)
    if (Number.isFinite(numeric)) {
      return numeric
    }

    const timestamp = Date.parse(input)
    if (Number.isFinite(timestamp)) {
      return timestamp
    }
  }

  return fallback
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function toMetricRow(row: Record<string, unknown>): UmamiMetricRow {
  return {
    name: String(row.name || ''),
    pageviews: asNumber(row.pageviews),
    visitors: asNumber(row.visitors),
    visits: asNumber(row.visits),
    bounces: asNumber(row.bounces),
    totaltime: asNumber(row.totaltime),
  }
}

function getErrorStatus(error: unknown): number {
  return Number((error as { statusCode?: number; status?: number })?.statusCode || (error as { status?: number })?.status || 0)
}

function readCachedValue<T>(cacheKey: string, map: Map<string, T>): T | null {
  const updatedAt = cacheTimeStore.get(cacheKey)
  if (!updatedAt) return null

  if (Date.now() - updatedAt > CACHE_TTL_MS) {
    cacheTimeStore.delete(cacheKey)
    map.delete(cacheKey)
    return null
  }

  return map.get(cacheKey) || null
}

function saveCachedValue<T>(cacheKey: string, value: T, map: Map<string, T>) {
  cacheTimeStore.set(cacheKey, Date.now())
  map.set(cacheKey, value)
}

export function getUmamiPublicConfig(): UmamiPublicConfig {
  const runtimeConfig = useRuntimeConfig()
  const publicConfig = runtimeConfig.public as Record<string, unknown>
  const rawUmamiInput = publicConfig.umami
  const rawUmami = isObjectRecord(rawUmamiInput) ? rawUmamiInput : {}
  const startAtValue = rawUmami.startAt

  return {
    baseUrl: normalizeBaseUrl(rawUmami.baseUrl || 'https://umami.tungchiahui.cn'),
    shareId: String(rawUmami.shareId || 'PuRYIqggKwmqEx7e').trim(),
    websiteId: String(rawUmami.websiteId || '183eae08-767c-4a1f-9e75-1b4081a2dda4').trim(),
    startAt: typeof startAtValue === 'string' || typeof startAtValue === 'number'
      ? startAtValue
      : '2024-01-01T00:00:00.000Z',
    pathLimit: Number.isFinite(Number(rawUmami.pathLimit)) ? Number(rawUmami.pathLimit) : 5000,
  }
}

export function hasUmamiPublicConfig(): boolean {
  const config = getUmamiPublicConfig()
  return Boolean(config.baseUrl && config.shareId && config.websiteId)
}

export function getUmamiShareFrameUrl(): string {
  const config = getUmamiPublicConfig()
  if (!config.baseUrl || !config.shareId) return ''
  return `${config.baseUrl}/share/${encodeURIComponent(config.shareId)}`
}

export function resolveUmamiRange(startAtInput?: string | number, endAtInput?: string | number): UmamiRange {
  const config = getUmamiPublicConfig()
  const now = Date.now()
  const fallbackStartAt = parseBoundary(config.startAt, now - 365 * 24 * 60 * 60 * 1000)
  const startAt = parseBoundary(startAtInput, fallbackStartAt)
  const endAt = parseBoundary(endAtInput, now)

  return endAt >= startAt
    ? { startAt, endAt }
    : { startAt, endAt: startAt }
}

async function getShareToken(forceRefresh = false): Promise<UmamiShareToken> {
  const config = getUmamiPublicConfig()
  const cacheKey = `${config.baseUrl}::${config.shareId}`

  if (!forceRefresh) {
    const cachedToken = shareTokenCache.get(cacheKey)
    if (cachedToken) return cachedToken

    const pendingRequest = shareTokenRequestCache.get(cacheKey)
    if (pendingRequest) return pendingRequest
  }

  shareTokenRequestCache.delete(cacheKey)

  const tokenRequest = ofetch<UmamiShareToken>(`${config.baseUrl}/api/share/${config.shareId}`)
    .then((token) => {
      shareTokenCache.set(cacheKey, token)
      return token
    })
    .finally(() => {
      shareTokenRequestCache.delete(cacheKey)
    })

  shareTokenRequestCache.set(cacheKey, tokenRequest)
  return tokenRequest
}

async function umamiApiFetch<T>(
  path: string,
  query: Record<string, string | number | undefined>,
): Promise<T> {
  const config = getUmamiPublicConfig()
  const shareToken = await getShareToken()
  const endpoint = `${config.baseUrl}/api${path}`

  try {
    return await ofetch<T>(endpoint, {
      query,
      headers: {
        [SHARE_TOKEN_HEADER]: shareToken.token,
      },
    })
  } catch (error: unknown) {
    const status = getErrorStatus(error)
    if (status === 401 || status === 403) {
      const refreshedToken = await getShareToken(true)
      return await ofetch<T>(endpoint, {
        query,
        headers: {
          [SHARE_TOKEN_HEADER]: refreshedToken.token,
        },
      })
    }

    throw error
  }
}

export function clearUmamiClientCache() {
  shareTokenCache.clear()
  shareTokenRequestCache.clear()
  statsCache.clear()
  metricsCache.clear()
  cacheTimeStore.clear()
}

export async function fetchUmamiStats(range: UmamiRange): Promise<UmamiStatsResponse> {
  const config = getUmamiPublicConfig()
  await getShareToken()
  const cacheKey = `${config.websiteId}|stats|${range.startAt}|${range.endAt}`
  const cachedStats = readCachedValue(cacheKey, statsCache)
  if (cachedStats) return cachedStats

  const stats = await umamiApiFetch<UmamiStatsResponse>(
    `/websites/${config.websiteId}/stats`,
    {
      startAt: range.startAt,
      endAt: range.endAt,
    },
  )

  saveCachedValue(cacheKey, stats, statsCache)
  return stats
}

export async function fetchUmamiExpandedMetrics(
  type: UmamiMetricType,
  range: UmamiRange,
  extraQuery: Record<string, string | number | undefined> = {},
): Promise<UmamiMetricRow[]> {
  const config = getUmamiPublicConfig()
  await getShareToken()
  const cacheKey = `${config.websiteId}|expanded|${type}|${range.startAt}|${range.endAt}|${JSON.stringify(extraQuery)}`
  const cachedRows = readCachedValue(cacheKey, metricsCache)
  if (cachedRows) return cachedRows

  const rows = await umamiApiFetch<Record<string, unknown>[]>(
    `/websites/${config.websiteId}/metrics/expanded`,
    {
      type,
      startAt: range.startAt,
      endAt: range.endAt,
      ...extraQuery,
    },
  )

  const normalizedRows = (rows || []).map((row) => toMetricRow(row))

  saveCachedValue(cacheKey, normalizedRows, metricsCache)
  return normalizedRows
}

export function normalizeUmamiPath(path: string): string {
  return normalizePath(path)
}
