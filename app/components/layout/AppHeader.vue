<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Menu, MoonStar, SunMedium } from 'lucide-vue-next'

import { siteConfig } from '~/config/site'
import { useThemeMode } from '~/composables/useThemeMode'

import IconButton from '../ui/IconButton.vue'
import MobileNav from './MobileNav.vue'

const isMobileNavOpen = ref(false)
const { mode, modeLabel, cycleMode, syncFromStorage } = useThemeMode()

const themeIcon = computed(() => {
  if (mode.value === 'light') {
    return SunMedium
  }

  return MoonStar
})

const themeTooltip = computed(() => `主题：${modeLabel.value}（点击切换）`)

function toggleMobileNav() {
  isMobileNavOpen.value = !isMobileNavOpen.value
}

onMounted(() => {
  syncFromStorage()
})
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <NuxtLink class="app-header__brand" to="/">
        <img :src="siteConfig.iconPath" alt="" aria-hidden="true" class="app-header__brand-icon" />
        <span>{{ siteConfig.name }}</span>
      </NuxtLink>

      <nav class="app-header__desktop-nav" aria-label="Primary">
        <NuxtLink v-for="item in siteConfig.nav" :key="item.to" :to="item.to" class="app-header__link">
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="app-header__actions">
        <IconButton
          :icon="themeIcon"
          :label="themeTooltip"
          :tooltip="themeTooltip"
          variant="secondary"
          @click="cycleMode"
        />

        <IconButton
          class="app-header__menu-btn"
          :icon="Menu"
          label="打开移动端菜单"
          tooltip="菜单"
          variant="secondary"
          @click="toggleMobileNav"
        />
      </div>
    </div>

    <MobileNav v-model:open="isMobileNavOpen" :items="siteConfig.nav" />
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface) 90%, transparent);
  backdrop-filter: blur(12px);
}

.app-header__inner {
  width: 100%;
  min-height: 68px;
  padding: 0 var(--space-16);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-16);
}

.app-header__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  min-width: 0;
  color: var(--color-fg);
  font-weight: 700;
  text-decoration: none;
}

.app-header__brand-icon {
  width: 22px;
  height: 22px;
  border-radius: var(--radius-4);
}

.app-header__desktop-nav {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.app-header__link {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 var(--space-12);
  border-radius: var(--radius-8);
  color: var(--color-text-weak);
  text-decoration: none;
  transition:
    color var(--motion-180) ease,
    background-color var(--motion-180) ease;
}

.app-header__link:hover {
  color: var(--color-fg);
  background: color-mix(in srgb, var(--color-surface-soft) 84%, transparent);
}

.app-header__link.router-link-active {
  color: var(--color-fg);
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
}

.app-header__actions {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
}

.app-header__menu-btn {
  display: none;
}

@media (max-width: 900px) {
  .app-header__desktop-nav {
    display: none;
  }

  .app-header__menu-btn {
    display: inline-flex;
  }

  .app-header__brand {
    max-width: calc(100% - 96px);
  }
}
</style>
