<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import { BookOpen, ChartNoAxesColumnIncreasing, CircleAlert, Handshake, LayoutGrid, Newspaper } from 'lucide-vue-next'

import { siteConfig, type SiteContactIcon, type SiteFooterNavIcon, type SiteFooterNavItem } from '~/config/site'

const currentYear = computed(() => new Date().getFullYear())
const footerNavItems = computed<SiteFooterNavItem[]>(() => siteConfig.footerNav ?? [])
const contactItems = computed(() => siteConfig.socialLinks ?? [])

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
    <div class="app-footer__inner">
      <section class="app-footer__block app-footer__block--meta">
        <p class="app-footer__line app-footer__line--strong">
          © {{ currentYear }} {{ siteConfig.author }} · {{ siteConfig.name }}
        </p>
        <p class="app-footer__line">
          本站持续记录开发与学习，内容来自本地 Markdown 与工程实践。
        </p>
        <p class="app-footer__line">点击邮箱图标可直接唤起邮件客户端发送信息。</p>
      </section>

      <nav class="app-footer__block" aria-label="站内导航">
        <p class="app-footer__title">站内导航</p>
        <div class="app-footer__nav-grid">
          <NuxtLink
            v-for="item in footerNavItems"
            :key="item.to"
            :to="item.to"
            class="app-footer__nav-link"
            @pointerup="clearPointerFocus"
          >
            <component :is="footerIconMap[item.icon]" class="app-footer__nav-icon" aria-hidden="true" />
            <span class="app-footer__nav-text">{{ item.label }}</span>
            <span v-if="item.placeholder" class="app-footer__placeholder-tag">占位</span>
          </NuxtLink>
        </div>
      </nav>

      <section class="app-footer__block" aria-label="联系方式">
        <p class="app-footer__title">联系方式</p>
        <div class="app-footer__contact-grid">
          <a
            v-for="item in contactItems"
            :key="item.href"
            :href="item.href"
            class="app-footer__contact-link"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noopener noreferrer' : undefined"
            :aria-label="item.label"
            :title="item.description || item.label"
            @pointerup="clearPointerFocus"
          >
            <img :src="contactIconMap[item.icon]" class="app-footer__contact-image" :alt="item.label" loading="lazy" />
          </a>
        </div>
      </section>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: auto;
  border-top: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface) 84%, transparent);
}

.app-footer__inner {
  width: 100%;
  padding: var(--space-32) var(--space-16);
  display: grid;
  gap: var(--space-24);
  grid-template-columns: minmax(220px, 1.2fr) minmax(240px, 1fr) minmax(220px, 1fr);
}

.app-footer__block {
  display: grid;
  align-content: start;
  gap: var(--space-12);
}

.app-footer__block--meta {
  gap: var(--space-8);
}

.app-footer__title {
  margin: 0;
  color: var(--color-fg);
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.app-footer__line {
  font-size: 0.88rem;
  color: var(--color-text-weak);
}

.app-footer__line--strong {
  color: var(--color-fg);
}

.app-footer__nav-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-10, 10px);
}

.app-footer__nav-link {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--space-8);
  min-height: 40px;
  padding: 0 var(--space-10, 10px);
  border: 1px solid color-mix(in srgb, var(--color-border) 84%, transparent);
  border-radius: var(--radius-8);
  color: var(--color-text-weak);
  text-decoration: none;
  transition:
    color var(--motion-180) ease,
    border-color var(--motion-180) ease,
    background-color var(--motion-180) ease;
}

.app-footer__nav-link:hover,
.app-footer__nav-link.router-link-active {
  color: var(--color-fg);
  border-color: color-mix(in srgb, var(--color-primary) 42%, var(--color-border));
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
}

.app-footer__nav-link:focus,
.app-footer__nav-link:focus-visible,
.app-footer__contact-link:focus,
.app-footer__contact-link:focus-visible {
  outline: none;
}

.app-footer__nav-icon {
  width: 0.95rem;
  height: 0.95rem;
  opacity: 0.88;
}

.app-footer__nav-text {
  line-height: 1.2;
  font-size: 0.95rem;
}

.app-footer__placeholder-tag {
  display: inline-flex;
  align-items: center;
  min-height: 19px;
  padding: 0 7px;
  border-radius: var(--radius-pill);
  color: var(--color-primary);
  font-size: 0.68rem;
  background: color-mix(in srgb, var(--color-primary) 16%, transparent);
}

.app-footer__contact-grid {
  display: grid;
  grid-template-columns: repeat(4, 46px);
  gap: 10px;
}

.app-footer__contact-link {
  width: 46px;
  height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-12);
  border: 1px solid color-mix(in srgb, var(--color-border) 82%, transparent);
  text-decoration: none;
  background: color-mix(in srgb, #ffffff 90%, var(--color-surface));
  transition:
    transform var(--motion-120) ease,
    border-color var(--motion-180) ease,
    background-color var(--motion-180) ease;
}

.app-footer__contact-link:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--color-primary) 44%, var(--color-border));
  background: color-mix(in srgb, #ffffff 78%, var(--color-primary));
}

.app-footer__contact-image {
  width: 1.02rem;
  height: 1.02rem;
  object-fit: contain;
}

@media (max-width: 1000px) {
  .app-footer__inner {
    grid-template-columns: minmax(0, 1fr);
  }

  .app-footer__contact-grid {
    grid-template-columns: repeat(auto-fit, minmax(42px, 46px));
  }
}

@media (max-width: 520px) {
  .app-footer__nav-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
