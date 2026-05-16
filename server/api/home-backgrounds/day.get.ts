import { existsSync, readdirSync } from 'node:fs'
import { extname, parse, resolve } from 'node:path'

import { defineEventHandler } from 'h3'

const HOME_DAY_BACKGROUND_DIR = resolve(process.cwd(), 'public/backgrounds/home/day')
const HOME_DAY_BACKGROUND_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])
const PREFERRED_DEFAULT_BACKGROUND_STEM = 'school-girl-campus'

interface HomeBackgroundPayload {
  id: string
  name: string
  path: string
  appliesTo: 'light'
  overlayOpacity: number
}

function formatHomeBackgroundName(stem: string) {
  if (stem === 'school-girl-campus') {
    return '校园背景'
  }

  if (/^\d+$/.test(stem)) {
    return `背景 ${stem}`
  }

  const normalized = stem.replace(/[-_]+/g, ' ').trim()
  return normalized || '首页背景'
}

function loadHomeDayBackgrounds(): HomeBackgroundPayload[] {
  if (!existsSync(HOME_DAY_BACKGROUND_DIR)) {
    return []
  }

  const entries = readdirSync(HOME_DAY_BACKGROUND_DIR, { withFileTypes: true })
  const backgrounds = entries
    .filter((entry: { isFile: () => boolean }) => entry.isFile())
    .map((entry: { name: string }) => entry.name)
    .filter((fileName: string) => HOME_DAY_BACKGROUND_EXTENSIONS.has(extname(fileName).toLowerCase()))
    .map((fileName: string) => {
      const stem = parse(fileName).name

      return {
        id: stem,
        name: formatHomeBackgroundName(stem),
        path: `/backgrounds/home/day/${encodeURI(fileName)}`,
        appliesTo: 'light' as const,
        overlayOpacity: 0,
      }
    })

  backgrounds.sort((left: HomeBackgroundPayload, right: HomeBackgroundPayload) => {
    if (left.id === PREFERRED_DEFAULT_BACKGROUND_STEM && right.id !== PREFERRED_DEFAULT_BACKGROUND_STEM) {
      return -1
    }

    if (right.id === PREFERRED_DEFAULT_BACKGROUND_STEM && left.id !== PREFERRED_DEFAULT_BACKGROUND_STEM) {
      return 1
    }

    return left.id.localeCompare(right.id, 'zh-CN', { numeric: true, sensitivity: 'base' })
  })

  return backgrounds
}

export default defineEventHandler(() => {
  return loadHomeDayBackgrounds()
})
