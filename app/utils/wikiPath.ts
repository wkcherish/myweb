import { pinyin } from 'pinyin-pro'
import type { ContentEntry } from '~/utils/content'

const normalizeWikiStem = (entry: ContentEntry) => {
  const source = entry.stem || entry.path || ''
  const withoutCollection = source.replace(/^\/?wiki\/?/i, '')
  return withoutCollection.replace(/\/index$/i, '')
}

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

export const getWikiRoutePath = (entry: ContentEntry) => {
  const stem = normalizeWikiStem(entry)
  const slug = stem
    .split('/')
    .filter(Boolean)
    .map((part) => toPinyinSlug(part))
    .filter(Boolean)
    .join('/')

  return slug ? `/wiki/${slug}` : entry.path || '/wiki'
}
