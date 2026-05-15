<script setup lang="ts">
import { computed } from 'vue'

import BasePanel from '~/components/ui/BasePanel.vue'
import BaseTag from '~/components/ui/BaseTag.vue'
import EmptyState from '~/components/ui/EmptyState.vue'

interface QuickLink {
  label: string
  to: string
}

interface ContentBlock {
  title: string
  description: string
}

const quickLinks: QuickLink[] = [
  { label: '进入 Blog', to: '/blog' },
  { label: '查看 Wiki', to: '/wiki' },
  { label: '查看 Todo', to: '/todo' },
]

const contentBlocks: ContentBlock[] = [
  {
    title: 'Blog',
    description: '按文章阅读与归档沉淀想法，内容来自 content/blog。',
  },
  {
    title: 'Wiki',
    description: '用分类和检索组织知识，内容来自 content/wiki。',
  },
  {
    title: 'Todo',
    description: '展示阶段计划与路线图，不在网页端修改正式状态。',
  },
]

const runtimeConfig = useRuntimeConfig()

const nuxtVersionLabel = computed(() => {
  const value = runtimeConfig.public.nuxtVersion
  if (typeof value === 'string' && value.length > 0) {
    return `Nuxt ${value}`
  }

  return 'Nuxt 4'
})

const letterRows = [
  'CHERISH NOTEBOOK CHERISH NOTEBOOK CHERISH NOTEBOOK',
  'FILE DRIVEN KNOWLEDGE FILE DRIVEN KNOWLEDGE FILE DRIVEN',
  'BLOG WIKI TODO BLOG WIKI TODO BLOG WIKI TODO',
  'CHERISH NOTEBOOK CHERISH NOTEBOOK CHERISH NOTEBOOK',
]
</script>

<template>
  <section class="home">
    <BasePanel class="hero" tone="floating">
      <div class="hero__letter-field" aria-hidden="true">
        <span v-for="(row, index) in letterRows" :key="`${row}-${index}`">{{ row }}</span>
      </div>
      <div class="hero__orb" aria-hidden="true">
        <span class="hero__orb-ring" />
        <span class="hero__orb-core">CN</span>
      </div>

      <div class="hero__content">
        <p class="hero__eyebrow">CHERISH NOTEBOOK</p>
        <h1 class="hero__title">你好，我是 Cherish</h1>
        <p class="hero__desc">这是一个高级、克制、文件驱动的个人知识展示站。</p>

        <div class="hero__tags">
          <BaseTag>{{ nuxtVersionLabel }}</BaseTag>
          <BaseTag tone="accent">TypeScript</BaseTag>
          <BaseTag>File Driven</BaseTag>
        </div>

        <div class="hero__actions">
          <NuxtLink v-for="item in quickLinks" :key="item.to" :to="item.to" class="hero__link">
            {{ item.label }}
          </NuxtLink>
        </div>
      </div>
    </BasePanel>

    <div class="home__grid">
      <BasePanel v-for="item in contentBlocks" :key="item.title">
        <h2 class="home__card-title">{{ item.title }}</h2>
        <p class="home__card-desc">{{ item.description }}</p>
      </BasePanel>
    </div>

    <EmptyState
      title="示例内容待补充"
      description="下一步会从 content/ 目录读取真实 Markdown 与规划数据。"
    />
  </section>
</template>

<style scoped>
.home {
  display: grid;
  gap: var(--space-24);
}

.hero {
  position: relative;
  overflow: hidden;
  min-height: 320px;
}

.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--home-bg-overlay-light);
  pointer-events: none;
}

.hero__eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  color: var(--color-text-weak);
}

.hero__title {
  margin-top: var(--space-8);
  font-size: clamp(2rem, 5vw, 3rem);
  max-width: 15ch;
}

.hero__desc {
  margin-top: var(--space-12);
  max-width: 56ch;
}

.hero__content {
  position: relative;
  z-index: 2;
}

.hero__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
  margin-top: var(--space-16);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-12);
  margin-top: var(--space-24);
}

.hero__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 var(--space-16);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-12);
  color: var(--color-fg);
  background: color-mix(in srgb, var(--color-surface) 92%, transparent);
  text-decoration: none;
  transition:
    border-color var(--motion-180) ease,
    transform var(--motion-120) ease;
}

.hero__link:hover {
  border-color: color-mix(in srgb, var(--color-primary) 40%, var(--color-border));
  transform: translateY(-1px);
}

.hero__link:active {
  transform: translateY(0);
}

.hero__letter-field {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: grid;
  align-content: center;
  gap: var(--space-4);
  padding: var(--space-24);
  pointer-events: none;
}

.hero__letter-field span {
  display: block;
  font-size: clamp(0.58rem, 1.25vw, 0.82rem);
  letter-spacing: 0.22em;
  white-space: nowrap;
  color: color-mix(in srgb, var(--color-fg) 18%, transparent);
  opacity: 0.22;
}

.hero__orb {
  position: absolute;
  top: 50%;
  right: clamp(12px, 4vw, 64px);
  z-index: 1;
  display: grid;
  place-items: center;
  width: clamp(180px, 26vw, 280px);
  aspect-ratio: 1 / 1;
  transform: translateY(-50%);
}

.hero__orb-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--color-border) 78%, white 10%);
  background: radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0));
}

.hero__orb-core {
  display: grid;
  place-items: center;
  width: 58%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: color-mix(in srgb, var(--color-surface) 86%, transparent);
  color: color-mix(in srgb, var(--color-fg) 82%, var(--color-primary));
  font-size: clamp(1.4rem, 3.4vw, 2.2rem);
  font-weight: 700;
  letter-spacing: 0.04em;
}

:global(html[data-theme='dark']) .hero::after {
  background: var(--home-bg-overlay-dark);
}

:global(html[data-theme='dark']) .hero__letter-field span {
  color: color-mix(in srgb, var(--color-fg) 34%, transparent);
  opacity: 0.3;
}

:global(html[data-theme='dark']) .hero__orb-ring {
  border-color: color-mix(in srgb, var(--color-border) 70%, var(--color-primary) 12%);
  background: radial-gradient(circle at 35% 30%, rgba(127, 156, 255, 0.2), rgba(127, 156, 255, 0));
}

:global(html[data-theme='dark']) .hero__orb-core {
  background: color-mix(in srgb, var(--color-surface) 78%, transparent);
}

.home__grid {
  display: grid;
  gap: var(--space-16);
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.home__card-title {
  font-size: 1.08rem;
}

.home__card-desc {
  margin-top: var(--space-8);
}

@media (max-width: 900px) {
  .hero {
    min-height: 360px;
  }

  .hero__orb {
    width: clamp(136px, 40vw, 200px);
    top: auto;
    bottom: var(--space-12);
    right: var(--space-12);
    transform: none;
  }

  .hero__title {
    max-width: 100%;
  }

  .hero__letter-field span {
    letter-spacing: 0.14em;
  }

  .home__grid {
    grid-template-columns: 1fr;
  }
}
</style>
