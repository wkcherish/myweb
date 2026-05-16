<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue'

import type { SiteNavItem } from '~/config/site'

interface Props {
  open: boolean
  items: SiteNavItem[]
  moreItems?: SiteNavItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const route = useRoute()

function closeMenu() {
  emit('update:open', false)
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

watch(
  () => props.open,
  (isOpen) => {
    if (!import.meta.client) {
      return
    }

    document.body.style.overflow = isOpen ? 'hidden' : ''
  },
)

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})

watch(
  () => route.fullPath,
  () => {
    closeMenu()
  },
)

if (import.meta.client) {
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && props.open) {
      closeMenu()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
}
</script>

<template>
  <Transition name="mobile-nav-fade">
    <div v-if="open" class="mobile-nav" role="dialog" aria-modal="true" aria-label="移动端导航">
      <button class="mobile-nav__backdrop" aria-label="关闭移动端菜单" @click="closeMenu" />

      <aside class="mobile-nav__panel">
        <nav class="mobile-nav__links" aria-label="Mobile Primary">
          <p class="mobile-nav__group-title">主导航</p>
          <NuxtLink
            v-for="item in items"
            :key="item.to"
            :to="item.to"
            class="mobile-nav__link"
            @click="closeMenu"
            @pointerup="clearPointerFocus"
          >
            {{ item.label }}
          </NuxtLink>

          <template v-if="moreItems?.length">
            <p class="mobile-nav__group-title mobile-nav__group-title--more">更多页面</p>
            <NuxtLink
              v-for="item in moreItems"
              :key="item.to"
              :to="item.to"
              class="mobile-nav__link mobile-nav__link--more"
              @click="closeMenu"
              @pointerup="clearPointerFocus"
            >
              <span>{{ item.label }}</span>
              <span v-if="item.placeholder" class="mobile-nav__placeholder-tag">占位</span>
            </NuxtLink>
          </template>
        </nav>
      </aside>
    </div>
  </Transition>
</template>

<style scoped>
.mobile-nav {
  position: fixed;
  inset: 0;
  z-index: 60;
}

.mobile-nav__backdrop {
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, var(--color-overlay) 90%, transparent);
}

.mobile-nav__panel {
  position: absolute;
  top: 0;
  right: 0;
  width: min(80vw, 320px);
  height: 100%;
  padding: var(--space-24);
  background: var(--color-surface);
  border-left: 1px solid var(--color-border);
  box-shadow: var(--shadow-floating);
}

.mobile-nav__links {
  display: grid;
  gap: var(--space-8);
  margin-top: var(--space-32);
}

.mobile-nav__group-title {
  margin: 0;
  padding: 0 var(--space-12);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--color-text-weak) 78%, var(--color-fg));
}

.mobile-nav__group-title--more {
  margin-top: var(--space-16);
}

.mobile-nav__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
  padding: var(--space-12) var(--space-16);
  border-radius: var(--radius-8);
  color: var(--color-text-weak);
  text-decoration: none;
  transition:
    color var(--motion-180) ease,
    background-color var(--motion-180) ease;
}

.mobile-nav__link.router-link-active {
  color: var(--color-fg);
  background: var(--color-surface-soft);
}

.mobile-nav__link:focus,
.mobile-nav__link:focus-visible {
  outline: none;
}

.mobile-nav__link--more {
  background: color-mix(in srgb, var(--color-surface-soft) 42%, transparent);
}

.mobile-nav__placeholder-tag {
  display: inline-flex;
  align-items: center;
  min-height: 20px;
  padding: 0 8px;
  border-radius: var(--radius-pill);
  color: var(--color-primary);
  font-size: 0.7rem;
  letter-spacing: 0.02em;
  background: color-mix(in srgb, var(--color-primary) 14%, transparent);
}

.mobile-nav-fade-enter-active,
.mobile-nav-fade-leave-active {
  transition: opacity var(--motion-180) ease;
}

.mobile-nav-fade-enter-from,
.mobile-nav-fade-leave-to {
  opacity: 0;
}
</style>
