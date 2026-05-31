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
  <Teleport to="body">
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
  </Teleport>
</template>

<style scoped>
.mobile-nav {
  position: fixed;
  inset: 0;
  z-index: 1000;
  isolation: isolate;
  pointer-events: auto;
}

.mobile-nav__backdrop {
  position: absolute;
  inset: 0;
  background: var(--color-overlay);
  background: color-mix(in srgb, var(--color-overlay) 90%, transparent);
  z-index: 0;
}

.mobile-nav__panel {
  position: absolute;
  top: 0;
  right: 0;
  width: min(80vw, 320px);
  height: 100%;
  padding: max(var(--space-24), env(safe-area-inset-top)) var(--space-24) max(var(--space-24), env(safe-area-inset-bottom));
  z-index: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  opacity: 1;
  background-color: var(--color-surface);
  background: var(--color-surface);
  border-left: 1px solid var(--color-border);
  box-shadow:
    -2px 0 0 color-mix(in srgb, var(--color-border) 32%, transparent),
    var(--shadow-floating);
}

.mobile-nav__panel::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--color-surface);
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
  color: var(--color-text-weak);
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
  color: color-mix(in srgb, var(--color-fg) 84%, var(--color-text-weak));
  background: var(--color-surface-soft);
  background: color-mix(in srgb, var(--color-surface-soft) 76%, var(--color-surface));
  text-decoration: none;
  transition:
    color var(--motion-180) ease,
    background-color var(--motion-180) ease,
    border-color var(--motion-180) ease;
  border: 1px solid var(--color-border);
  border: 1px solid color-mix(in srgb, var(--color-border) 58%, transparent);
}

.mobile-nav__link.router-link-active {
  color: var(--color-fg);
  background: var(--color-surface-muted);
  background: color-mix(in srgb, var(--color-primary) 11%, var(--color-surface));
  border-color: var(--color-border);
  border-color: color-mix(in srgb, var(--color-primary) 34%, var(--color-border));
}

.mobile-nav__link:focus:not(:focus-visible) {
  outline: none;
}

.mobile-nav__link:focus-visible {
  color: var(--color-fg);
  background: color-mix(in srgb, var(--color-primary) 11%, var(--color-surface));
  border-color: color-mix(in srgb, var(--color-primary) 34%, var(--color-border));
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 16%, transparent);
}

.mobile-nav__link--more {
  background: var(--color-surface-soft);
  background: color-mix(in srgb, var(--color-surface-soft) 86%, var(--color-surface));
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
  background: var(--color-surface-soft);
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

@supports (-webkit-touch-callout: none) {
  .mobile-nav {
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }

  .mobile-nav__panel {
    background: var(--color-surface);
  }
}
</style>
