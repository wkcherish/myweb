<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ChevronDown, Menu, MoonStar, SunMedium } from 'lucide-vue-next'

import { siteConfig, type SiteNavItem } from '~/config/site'
import { useAiChat } from '~/composables/useAiChat'
import { useThemeMode } from '~/composables/useThemeMode'

import IconButton from '../ui/IconButton.vue'
import MobileNav from './MobileNav.vue'

const isMobileNavOpen = ref(false)
const isMoreMenuOpen = ref(false)
const moreMenuButtonRef = ref<HTMLButtonElement | null>(null)
const moreMenuPanelRef = ref<HTMLElement | null>(null)
const route = useRoute()

const { mode, cycleMode, syncFromStorage } = useThemeMode()
const { close: closeAiChat } = useAiChat()
const primaryNavItems = computed(() => siteConfig.nav)
const moreNavItems = computed(() => siteConfig.moreNav ?? [])

const themeIcon = computed(() => {
  if (mode.value === 'light') {
    return SunMedium
  }

  return MoonStar
})

const nextModeLabel = computed(() => (mode.value === 'light' ? '深色模式' : '浅色模式'))
const themeTooltip = computed(() => `切换到${nextModeLabel.value}`)

function toggleMobileNav() {
  closeAiChat()
  isMobileNavOpen.value = !isMobileNavOpen.value
}

function handleBrandClick() {
  closeAiChat()
  isMobileNavOpen.value = false
  closeMoreMenu()
}

function closeMoreMenu() {
  isMoreMenuOpen.value = false
}

function toggleMoreMenu() {
  isMoreMenuOpen.value = !isMoreMenuOpen.value
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

function handleMoreItemClick(_item: SiteNavItem) {
  closeMoreMenu()
}

function handleDocumentPointerDown(event: PointerEvent) {
  if (!isMoreMenuOpen.value) {
    return
  }

  const target = event.target
  if (!(target instanceof Node)) {
    return
  }

  const clickedTrigger = moreMenuButtonRef.value?.contains(target)
  const clickedPanel = moreMenuPanelRef.value?.contains(target)

  if (!clickedTrigger && !clickedPanel) {
    closeMoreMenu()
  }
}

watch(
  () => route.fullPath,
  () => {
    closeMoreMenu()
  },
)

onMounted(() => {
  syncFromStorage()
  document.addEventListener('pointerdown', handleDocumentPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
})
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <NuxtLink class="app-header__brand" to="/" @click="handleBrandClick">
        <img :src="siteConfig.iconPath" alt="" aria-hidden="true" class="app-header__brand-icon" />
        <span>{{ siteConfig.name }}</span>
      </NuxtLink>

      <nav class="app-header__desktop-nav" aria-label="Primary">
        <NuxtLink
          v-for="item in primaryNavItems"
          :key="item.to"
          :to="item.to"
          class="app-header__link"
          @pointerup="clearPointerFocus"
        >
          {{ item.label }}
        </NuxtLink>

        <div class="app-header__more">
          <button
            ref="moreMenuButtonRef"
            type="button"
            class="app-header__more-trigger"
            :aria-expanded="isMoreMenuOpen"
            aria-haspopup="menu"
            @click="toggleMoreMenu"
            @pointerup="clearPointerFocus"
          >
            <span>更多页面</span>
            <ChevronDown class="app-header__more-icon" :class="{ 'is-open': isMoreMenuOpen }" aria-hidden="true" />
          </button>

          <Transition name="app-header-menu">
            <div v-if="isMoreMenuOpen" ref="moreMenuPanelRef" class="app-header__more-panel" role="menu" aria-label="更多页面">
              <NuxtLink
                v-for="item in moreNavItems"
                :key="item.to"
                :to="item.to"
                class="app-header__more-link"
                role="menuitem"
                @click="handleMoreItemClick(item)"
                @pointerup="clearPointerFocus"
              >
                <span>{{ item.label }}</span>
                <span v-if="item.placeholder" class="app-header__placeholder-tag">占位</span>
              </NuxtLink>
            </div>
          </Transition>
        </div>
      </nav>

      <div class="app-header__actions">
        <IconButton
          :icon="themeIcon"
          label="切换主题"
          :tooltip="themeTooltip"
          tooltip-placement="bottom"
          tooltip-align="end"
          variant="secondary"
          @click="cycleMode"
        />

        <IconButton
          class="app-header__menu-btn"
          :icon="Menu"
          label="打开移动端菜单"
          tooltip="菜单"
          tooltip-placement="bottom"
          tooltip-align="end"
          variant="secondary"
          @click="toggleMobileNav"
        />
      </div>
    </div>

    <MobileNav v-model:open="isMobileNavOpen" :items="primaryNavItems" :more-items="moreNavItems" />
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
}

.app-header__link:focus:not(:focus-visible),
.app-header__more-trigger:focus:not(:focus-visible) {
  outline: none;
}

.app-header__link:focus-visible,
.app-header__more-trigger:focus-visible {
  color: var(--color-fg);
  background: color-mix(in srgb, var(--color-surface-soft) 84%, transparent);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 18%, transparent);
}

.app-header__more {
  position: relative;
}

.app-header__more-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 40px;
  padding: 0 var(--space-12);
  border-radius: var(--radius-8);
  color: var(--color-text-weak);
  font-size: 0.95rem;
  font-weight: 500;
  transition:
    color var(--motion-180) ease,
    background-color var(--motion-180) ease;
}

.app-header__more-trigger:hover,
.app-header__more-trigger[aria-expanded='true'] {
  color: var(--color-fg);
  background: color-mix(in srgb, var(--color-surface-soft) 84%, transparent);
}

.app-header__more-icon {
  width: 0.9rem;
  height: 0.9rem;
  transition: transform var(--motion-180) ease;
}

.app-header__more-icon.is-open {
  transform: rotate(180deg);
}

.app-header__more-panel {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 200px;
  padding: var(--space-8);
  border: 1px solid color-mix(in srgb, var(--color-border) 82%, transparent);
  border-radius: var(--radius-12);
  background: color-mix(in srgb, var(--color-surface) 94%, transparent);
  box-shadow: var(--shadow-soft);
  backdrop-filter: blur(12px);
}

.app-header__more-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
  width: 100%;
  min-height: 38px;
  padding: 0 var(--space-12);
  border-radius: var(--radius-8);
  color: var(--color-text-weak);
  text-decoration: none;
  font-size: 0.9rem;
  transition:
    color var(--motion-180) ease,
    background-color var(--motion-180) ease;
}

.app-header__more-link:hover,
.app-header__more-link.router-link-active {
  color: var(--color-fg);
  background: color-mix(in srgb, var(--color-surface-soft) 84%, transparent);
}

.app-header__placeholder-tag {
  display: inline-flex;
  align-items: center;
  min-height: 20px;
  padding: 0 8px;
  border-radius: var(--radius-pill);
  color: var(--color-primary);
  font-size: 0.72rem;
  letter-spacing: 0.02em;
  background: color-mix(in srgb, var(--color-primary) 14%, transparent);
}

.app-header-menu-enter-active,
.app-header-menu-leave-active {
  transition:
    opacity var(--motion-180) ease,
    transform var(--motion-180) ease;
}

.app-header-menu-enter-from,
.app-header-menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
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
  .app-header {
    background: var(--color-surface);
    backdrop-filter: none;
  }

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
