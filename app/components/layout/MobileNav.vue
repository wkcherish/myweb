<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue'

import type { SiteNavItem } from '~/config/site'

interface Props {
  open: boolean
  items: SiteNavItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const route = useRoute()

function closeMenu() {
  emit('update:open', false)
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
          <NuxtLink
            v-for="item in items"
            :key="item.to"
            :to="item.to"
            class="mobile-nav__link"
            @click="closeMenu"
          >
            {{ item.label }}
          </NuxtLink>
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

.mobile-nav__link {
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

.mobile-nav-fade-enter-active,
.mobile-nav-fade-leave-active {
  transition: opacity var(--motion-180) ease;
}

.mobile-nav-fade-enter-from,
.mobile-nav-fade-leave-to {
  opacity: 0;
}
</style>
