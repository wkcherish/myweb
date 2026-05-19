<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import { BookOpen, ChartNoAxesColumnIncreasing, CircleAlert, Handshake, LayoutGrid, Newspaper } from 'lucide-vue-next'

import { siteConfig, type SiteContactIcon, type SiteFooterNavIcon, type SiteFooterNavItem } from '~/config/site'

const currentYear = computed(() => new Date().getFullYear())
const footerNavItems = computed<SiteFooterNavItem[]>(() => siteConfig.footerNav ?? [])
const contactItems = computed(() => siteConfig.socialLinks ?? [])
const filingInfo = computed(() => siteConfig.filing)

const footerIconMap: Record<SiteFooterNavIcon, Component> = {
  about: CircleAlert,
  stats: ChartNoAxesColumnIncreasing,
  blog: Newspaper,
  wiki: BookOpen,
  friends: Handshake,
  more: LayoutGrid,
}

const contactIconMap: Record<SiteContactIcon, string> = {
  website: siteConfig.iconPath,
  mail: '/icons/social/gmail.svg',
  github: '/icons/social/github.svg',
  gitee: '/icons/social/gitee.svg',
  xiaohongshu: '/icons/social/xiaohongshu.svg',
}

function clearPointerFocus(event: PointerEvent) {
  const target = event.currentTarget
  if (!(target instanceof HTMLElement)) {
    return
  }
  requestAnimationFrame(() => {
    target.blur()
  })
}
</script>

<template>
  <footer class="app-footer">
    <!-- 顶部强调线 -->
    <div class="app-footer__accent" aria-hidden="true" />

    <div class="app-footer__inner">
      <!-- 品牌 -->
      <div class="app-footer__brand">
        <p class="app-footer__copyright">
          &copy; {{ currentYear }} {{ siteConfig.author }}
          <span class="app-footer__dot">&middot;</span>
          {{ siteConfig.name }}
        </p>
        <p class="app-footer__tagline">持续记录开发与学习</p>
      </div>

      <!-- 导航 -->
      <nav class="app-footer__nav" aria-label="站内导航">
        <NuxtLink
          v-for="item in footerNavItems"
          :key="item.to"
          :to="item.to"
          class="app-footer__nav-link"
          @pointerup="clearPointerFocus"
        >
          <component :is="footerIconMap[item.icon]" class="app-footer__nav-icon" aria-hidden="true" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- 社交 -->
      <div class="app-footer__social" aria-label="联系方式">
        <a
          v-for="item in contactItems"
          :key="item.href"
          :href="item.href"
          class="app-footer__social-link"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noopener noreferrer' : undefined"
          :aria-label="item.label"
          :title="item.description || item.label"
          @pointerup="clearPointerFocus"
        >
          <img
            :src="contactIconMap[item.icon]"
            class="app-footer__social-icon"
            :alt="item.label"
            loading="lazy"
          />
        </a>
      </div>
    </div>

    <!-- 备案 -->
    <div class="app-footer__filing-bar">
      <p class="app-footer__filing">
        <template v-if="filingInfo.icpText">
          <a
            :href="filingInfo.icpHref || 'https://beian.miit.gov.cn/'"
            target="_blank"
            rel="noopener noreferrer"
            class="app-footer__filing-link"
          >
            {{ filingInfo.icpText }}
          </a>
        </template>
        <span v-else class="app-footer__filing-pending">{{ filingInfo.pendingText || '网站备案审核中…' }}</span>
        <template v-if="filingInfo.icpText && filingInfo.policeText">
          <span class="app-footer__filing-sep">|</span>
        </template>
        <template v-if="filingInfo.policeText">
          <a
            :href="filingInfo.policeHref || 'http://www.beian.gov.cn/'"
            target="_blank"
            rel="noopener noreferrer"
            class="app-footer__filing-link app-footer__filing-link--police"
          >
            <img
              v-if="filingInfo.policeIcon"
              :src="filingInfo.policeIcon"
              class="app-footer__police-icon"
              alt="公安备案图标"
              loading="lazy"
            />
            {{ filingInfo.policeText }}
          </a>
        </template>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  position: relative;
  margin-top: auto;
  background: var(--color-surface);
}

/* ====== 顶部强调线 ====== */
.app-footer__accent {
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    color-mix(in srgb, var(--color-primary) 60%, transparent) 30%,
    var(--color-primary) 50%,
    color-mix(in srgb, var(--color-primary) 60%, transparent) 70%,
    transparent 100%
  );
}

/* ====== 主体内容区 ====== */
.app-footer__inner {
  max-width: 720px;
  margin: 0 auto;
  padding: var(--space-32) var(--space-16) var(--space-24);
  display: grid;
  justify-items: center;
  gap: var(--space-24);
}

/* ====== 品牌 ====== */
.app-footer__brand {
  text-align: center;
}

.app-footer__copyright {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-fg);
  letter-spacing: 0.01em;
}

.app-footer__dot {
  color: color-mix(in srgb, var(--color-text-weak) 40%, transparent);
}

.app-footer__tagline {
  margin: var(--space-4) 0 0;
  font-size: 0.82rem;
  color: var(--color-text-weak);
}

/* ====== 导航 ====== */
.app-footer__nav {
  display: grid;
  grid-template-columns: repeat(3, minmax(134px, 160px));
  justify-content: center;
  gap: var(--space-8);
}

.app-footer__nav-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-6);
  min-height: 36px;
  padding: 0 var(--space-12);
  border: 1px solid color-mix(in srgb, var(--color-border) 60%, transparent);
  border-radius: var(--radius-pill);
  color: var(--color-text-weak);
  font-size: 0.88rem;
  text-decoration: none;
  transition:
    color 0.18s ease,
    border-color 0.18s ease,
    background-color 0.18s ease,
    transform 0.15s ease;
}

.app-footer__nav-link:hover {
  color: var(--color-fg);
  border-color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 6%, transparent);
  transform: translateY(-1px);
}

.app-footer__nav-link.router-link-active {
  color: var(--color-primary);
  border-color: color-mix(in srgb, var(--color-primary) 50%, transparent);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
}

.app-footer__nav-icon {
  width: 0.88rem;
  height: 0.88rem;
  flex-shrink: 0;
  opacity: 0.8;
}

/* ====== 社交图标 ====== */
.app-footer__social {
  display: flex;
  justify-content: center;
  gap: var(--space-6);
}

.app-footer__social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-8);
  border: 1px solid color-mix(in srgb, var(--color-border) 55%, transparent);
  text-decoration: none;
  background: transparent;
  transition:
    transform 0.15s ease,
    border-color 0.18s ease,
    background-color 0.18s ease;
}

.app-footer__social-link:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
}

.app-footer__social-icon {
  width: 1.05rem;
  height: 1.05rem;
  object-fit: contain;
}

/* ====== 备案栏 ====== */
.app-footer__filing-bar {
  border-top: 1px solid color-mix(in srgb, var(--color-border) 45%, transparent);
  padding: var(--space-12) var(--space-16);
  text-align: center;
}

.app-footer__filing {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0 var(--space-10);
  margin: 0;
  font-size: 0.76rem;
  color: var(--color-text-weak);
  line-height: 1.8;
}

.app-footer__filing-link {
  color: var(--color-text-weak);
  text-decoration: none;
  transition: color 0.15s ease;
}

.app-footer__filing-link:hover {
  color: var(--color-primary);
}

.app-footer__filing-link--police {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.app-footer__police-icon {
  width: 13px;
  height: 13px;
  object-fit: contain;
  flex-shrink: 0;
}

.app-footer__filing-pending {
  opacity: 0.65;
}

.app-footer__filing-sep {
  color: color-mix(in srgb, var(--color-text-weak) 35%, transparent);
  user-select: none;
}

/* ====== 移动端 ====== */
@media (max-width: 768px) {
  .app-footer__inner {
    padding: var(--space-20) var(--space-12) var(--space-16);
    gap: var(--space-16);
  }

  .app-footer__copyright {
    font-size: 0.9rem;
  }

  .app-footer__nav {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-8);
  }

  .app-footer__nav-link {
    min-height: 34px;
    padding: 0 var(--space-12);
    font-size: 0.82rem;
  }

  .app-footer__nav-icon {
    width: 0.82rem;
    height: 0.82rem;
  }

  .app-footer__social-link {
    width: 34px;
    height: 34px;
  }

  .app-footer__social-icon {
    width: 0.95rem;
    height: 0.95rem;
  }

  .app-footer__filing {
    font-size: 0.72rem;
  }
}
</style>
