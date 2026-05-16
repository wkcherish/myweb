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
