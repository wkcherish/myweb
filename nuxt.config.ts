import { defineNuxtConfig } from 'nuxt/config'
import { existsSync, readdirSync } from 'node:fs'
import { extname, parse, resolve } from 'node:path'
import packageJson from './package.json'

const HOME_DAY_BACKGROUND_DIR = resolve(process.cwd(), 'public/backgrounds/home/day')
const HOME_DAY_BACKGROUND_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])
const PREFERRED_DEFAULT_BACKGROUND_STEM = 'school-girl-campus'

interface RuntimeHomeBackground {
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

function loadHomeDayBackgrounds(): RuntimeHomeBackground[] {
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

  backgrounds.sort((left: RuntimeHomeBackground, right: RuntimeHomeBackground) => {
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

const homeDayBackgrounds = loadHomeDayBackgrounds()
const defaultHomeBackgroundId =
  homeDayBackgrounds.find((item) => item.id === PREFERRED_DEFAULT_BACKGROUND_STEM)?.id ?? homeDayBackgrounds[0]?.id ?? ''

const rawNuxtVersion = packageJson.devDependencies.nuxt ?? '4'
const installedNuxtVersion = rawNuxtVersion.replace(/^[^\d]*/, '')

export default defineNuxtConfig({
  compatibilityDate: '2026-05-15',
  srcDir: 'app/',
  dir: {
    public: 'public',
  },
  devtools: { enabled: true },
  typescript: {
    strict: true,
    typeCheck: true,
  },
  css: ['~/assets/css/main.css', '~/assets/css/prose.css'],
  modules: ['@nuxt/content', '@pinia/nuxt', '@nuxtjs/tailwindcss'],
  vite: {
    build: {
      modulePreload: {
        polyfill: false,
      },
    },
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit', 'lucide-vue-next'],
    },
  },
  app: {
    head: {
      title: 'Cherish Notebook',
      htmlAttrs: {
        class: 'theme-light',
        'data-theme': 'light',
      },
      meta: [
        {
          name: 'description',
          content: '这是我的主页，用于记录自己的学习、开发以及生活分享。',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
      ],
      link: [
        {
          rel: 'icon',
          sizes: 'any',
          href: '/icons/favicon.ico',
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/icons/site-icon.svg',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/icons/icon-32.png',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/icons/apple-touch-icon.png',
        },
        {
          rel: 'manifest',
          href: '/site.webmanifest',
        },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css',
        },
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js',
          defer: true,
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js',
          defer: true,
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      nuxtVersion: installedNuxtVersion,
      aiApiBase: '',
      aiModel: '',
      qqPlaylistId: '',
      defaultTheme: 'light',
      homeDayBackgrounds,
      defaultHomeBackgroundId,
    },
  },
  nitro: {
    debug: false,
    timing: false,
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },
  routeRules: {
    '/**': { prerender: true },
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'meting-js',
    },
  },
})
