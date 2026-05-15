import { defineNuxtConfig } from 'nuxt/config'
import packageJson from './package.json'

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
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/content', '@pinia/nuxt', '@nuxtjs/tailwindcss'],
  app: {
    head: {
      title: 'Cherish Notebook',
      htmlAttrs: {
        class: 'theme-system',
        'data-theme': 'system',
      },
      meta: [
        {
          name: 'description',
          content: '高级、克制、文件驱动的个人知识展示站。',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/icons/favicon-placeholder.svg',
        },
        {
          rel: 'apple-touch-icon',
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
      defaultTheme: 'system',
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
