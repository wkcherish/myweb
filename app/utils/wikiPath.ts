import { pinyin } from 'pinyin-pro'
import type { ContentEntry } from '~/utils/content'
import { getContentParentPath } from '~/utils/content'

const decodeWikiPath = (value: string) => {
  try {
    return decodeURI(value)
  } catch {
    return value
  }
}

const stripHrefSuffix = (value: string) => {
  const match = value.match(/[?#]/)
  const index = match?.index ?? -1

  if (index < 0) {
    return { path: value, suffix: '' }
  }

  return {
    path: value.slice(0, index),
    suffix: value.slice(index),
  }
}

const normalizeWikiSourcePath = (value: string) => {
  const { path } = stripHrefSuffix(value.trim())
  const decodedPath = decodeWikiPath(path).replace(/\/+$/g, '')
  const withoutCollection = decodedPath.replace(/^\/?wiki\/?/i, '')

  return withoutCollection
    .replace(/\.md$/i, '')
    .replace(/\/index$/i, '')
    .replace(/^\/+|\/+$/g, '')
}

const normalizeWikiStem = (entry: ContentEntry) => {
  const source = entry.stem || entry.path || ''
  return normalizeWikiSourcePath(source)
}

const getWikiPathBasename = (value: string) =>
  decodeWikiPath(stripHrefSuffix(value).path)
    .replace(/\\/g, '/')
    .split('/')
    .filter(Boolean)
    .pop() || ''

export const toPinyinSlug = (value: string) => {
  const parts: string[] = []
  let ascii = ''

  for (const char of value) {
    if (/^[a-z0-9]$/i.test(char)) {
      ascii += char
      continue
    }

    if (ascii) {
      parts.push(ascii.toLowerCase())
      ascii = ''
    }

    if (/^[\u4e00-\u9fff]$/.test(char)) {
      parts.push(pinyin(char, { toneType: 'none' }).toLowerCase())
    } else if (char.trim()) {
      parts.push('-')
    }
  }

  if (ascii) {
    parts.push(ascii.toLowerCase())
  }

  return parts
    .join('-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export const getWikiRoutePathFromSourcePath = (value: string) => {
  const slug = normalizeWikiSourcePath(value)
    .split('/')
    .filter(Boolean)
    .map((part) => toPinyinSlug(part))
    .filter(Boolean)
    .join('/')

  return slug ? `/wiki/${slug}` : '/wiki'
}

export const normalizeWikiRouteLookupPath = (value: string) => getWikiRoutePathFromSourcePath(value)

export const getWikiRouteAliasSlug = (value: string) => {
  const basename = getWikiPathBasename(value).replace(/\.md$/i, '')
  const asciiOnly = basename.replace(/[^\x00-\x7F]+/g, '')

  return toPinyinSlug(asciiOnly)
}

export const getWikiChapterAliasKeys = (entry: ContentEntry) => {
  const keys = new Set<string>()

  for (const value of [entry.stem || '', entry.path || '']) {
    const alias = getWikiRouteAliasSlug(value)

    if (alias) {
      keys.add(alias.toLowerCase())
    }

    const chapter = getWikiPathBasename(value).match(/^ch\d+/i)?.[0]?.toLowerCase()

    if (chapter) {
      keys.add(chapter)
    }
  }

  return [...keys]
}

const isExternalHref = (value: string) => /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value)

const getWikiSourceDirectory = (value: string) => {
  const cleanPath = stripHrefSuffix(value).path.replace(/\/+$/g, '')
  const parentPath = getContentParentPath(cleanPath)

  return `${(parentPath || '/wiki').replace(/\/+$/g, '')}/`
}

const getWikiRouteDirectory = (value: string) => `${stripHrefSuffix(value).path.replace(/\/+$/g, '')}/`

export const resolveWikiMarkdownHref = (href: string, currentContentPath = '', currentRoutePath = '') => {
  const trimmedHref = href.trim()

  if (!trimmedHref || trimmedHref.startsWith('#') || isExternalHref(trimmedHref)) {
    return trimmedHref
  }

  if (trimmedHref.startsWith('/wiki/')) {
    const { path, suffix } = stripHrefSuffix(trimmedHref)
    return `${getWikiRoutePathFromSourcePath(path)}${suffix}`
  }

  if (trimmedHref.startsWith('/')) {
    return trimmedHref
  }

  if (!currentContentPath) {
    const routeSegments = currentRoutePath.split('/').filter(Boolean)

    if (!currentRoutePath.startsWith('/wiki/') || routeSegments.length > 2) {
      return trimmedHref
    }

    try {
      const resolved = new URL(trimmedHref, `https://content.local${getWikiRouteDirectory(currentRoutePath)}`)
      return `${getWikiRoutePathFromSourcePath(resolved.pathname)}${resolved.search}${resolved.hash}`
    } catch {
      return trimmedHref
    }
  }

  try {
    const basePath = getWikiSourceDirectory(currentContentPath)
    const resolved = new URL(trimmedHref, `https://content.local${basePath}`)

    return `${getWikiRoutePathFromSourcePath(resolved.pathname)}${resolved.search}${resolved.hash}`
  } catch {
    return trimmedHref
  }
}

export const resolveWikiRouteAliasHref = (
  href: string,
  currentGroupRoutePath = '',
  aliasMap: Record<string, string> = {},
) => {
  const trimmedHref = href.trim()

  if (!trimmedHref || trimmedHref.startsWith('#') || isExternalHref(trimmedHref)) {
    return trimmedHref
  }

  const { path, suffix } = stripHrefSuffix(trimmedHref)
  const normalizedGroupPath = currentGroupRoutePath.replace(/\/+$/g, '')

  if (!path.startsWith('/wiki/') || !normalizedGroupPath) {
    return trimmedHref
  }

  const normalizedPath = path.replace(/\/+$/g, '')

  if (!normalizedPath.startsWith(`${normalizedGroupPath}/`)) {
    return trimmedHref
  }

  const alias = normalizedPath.split('/').filter(Boolean).pop()?.toLowerCase()
  const targetPath = alias ? aliasMap[alias] : ''

  return targetPath ? `${targetPath}${suffix}` : trimmedHref
}

export const getWikiRoutePath = (entry: ContentEntry) => {
  const stem = normalizeWikiStem(entry)
  return getWikiRoutePathFromSourcePath(stem)
}
