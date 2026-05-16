export type ContentEntry = {
  path?: string
  title?: string
  description?: string
  date?: string
  publishedAt?: string
  updatedAt?: string
  startDate?: string
  targetDate?: string
  tags?: string[]
  category?: string
  draft?: boolean
  status?: string
  priority?: string
  meta?: Record<string, unknown>
}

export type ContentResult<T extends ContentEntry> = {
  data: T[]
  error: string | null
  isEmpty: boolean
}

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const fileDatePattern = /(?:^|\/)(\d{4}-\d{2}-\d{2})-[^/]+$/

export const readContentString = (entry: ContentEntry, key: keyof ContentEntry) => {
  const directValue = entry[key]
  const metaValue = entry.meta?.[key]
  const value = directValue || metaValue

  return typeof value === 'string' ? value : ''
}

export const readContentBoolean = (entry: ContentEntry, key: keyof ContentEntry) => {
  const directValue = entry[key]
  const metaValue = entry.meta?.[key]
  const value = directValue ?? metaValue

  return typeof value === 'boolean' ? value : false
}

export const readContentTags = (entry: ContentEntry) => {
  const value = entry.tags || entry.meta?.tags

  return Array.isArray(value) ? value.filter((tag): tag is string => typeof tag === 'string') : []
}

export const getContentDate = (entry: ContentEntry, keys: (keyof ContentEntry)[]) => {
  const filenameDate = getContentDateFromPath(entry.path)

  if (filenameDate) {
    return filenameDate
  }

  for (const key of keys) {
    const value = readContentString(entry, key)

    if (value) {
      return value
    }
  }

  return ''
}

export const getContentDateFromPath = (path?: string) => {
  const match = path?.match(fileDatePattern)

  return match?.[1] || ''
}

export const formatContentDate = (date: string, fallback = '未标注日期') => {
  const parsed = date ? new Date(date) : null

  return parsed && !Number.isNaN(parsed.getTime()) ? dateFormatter.format(parsed) : fallback
}

export const getTagTone = (tag: string) => {
  const tones = ['accent', 'primary', 'success', 'warning'] as const
  const charTotal = [...tag].reduce((total, char) => total + char.charCodeAt(0), 0)

  return tones[charTotal % tones.length]
}

export const isReadmeEntry = (entry: ContentEntry) => (entry.path || '').toLowerCase().endsWith('/readme')

export const filterPublishedEntries = <T extends ContentEntry>(entries: T[]) =>
  entries.filter((entry) => !isReadmeEntry(entry) && !readContentBoolean(entry, 'draft'))

export const sortEntriesByDate = <T extends ContentEntry>(entries: T[], keys: (keyof ContentEntry)[]) =>
  [...entries].sort((a, b) => {
    const dateA = new Date(getContentDate(a, keys)).getTime() || 0
    const dateB = new Date(getContentDate(b, keys)).getTime() || 0

    return dateB - dateA
  })

export const toContentResult = <T extends ContentEntry>(data: T[], error: unknown = null): ContentResult<T> => ({
  data,
  error: error instanceof Error ? error.message : typeof error === 'string' ? error : null,
  isEmpty: data.length === 0,
})
