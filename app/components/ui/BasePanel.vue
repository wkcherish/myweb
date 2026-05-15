<script setup lang="ts">
import { computed } from 'vue'

type PanelTone = 'default' | 'muted' | 'floating'

interface Props {
  tag?: string
  tone?: PanelTone
  padded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'section',
  tone: 'default',
  padded: true,
})

const classList = computed(() => [
  'base-panel',
  `base-panel--${props.tone}`,
  {
    'is-unpadded': !props.padded,
  },
])
</script>

<template>
  <component :is="tag" :class="classList">
    <slot />
  </component>
</template>

<style scoped>
.base-panel {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-12);
  background: color-mix(in srgb, var(--color-surface) 88%, transparent);
  box-shadow: var(--shadow-soft);
  backdrop-filter: blur(10px);
}

.base-panel:not(.is-unpadded) {
  padding: var(--space-24);
}

.base-panel--default {
  background: color-mix(in srgb, var(--color-surface) 90%, transparent);
}

.base-panel--muted {
  background: color-mix(in srgb, var(--color-surface-soft) 84%, transparent);
}

.base-panel--floating {
  background: color-mix(in srgb, var(--color-surface) 80%, transparent);
  box-shadow: var(--shadow-floating);
  border-color: color-mix(in srgb, var(--color-border) 75%, white 8%);
}
</style>
