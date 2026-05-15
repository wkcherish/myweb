<script setup lang="ts">
import BasePanel from './BasePanel.vue'

interface Props {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: '正在加载',
  description: '内容正在准备中，请稍候。',
})
</script>

<template>
  <BasePanel class="loading-state" tone="muted">
    <span class="loading-state__spinner" aria-hidden="true" />
    <h2 class="loading-state__title">{{ title }}</h2>
    <p class="loading-state__description">{{ description }}</p>
  </BasePanel>
</template>

<style scoped>
.loading-state {
  display: grid;
  justify-items: center;
  gap: var(--space-12);
  text-align: center;
}

.loading-state__spinner {
  width: 1.35rem;
  height: 1.35rem;
  border-radius: var(--radius-pill);
  border: 2px solid color-mix(in srgb, var(--color-primary) 56%, transparent);
  border-right-color: transparent;
  animation: loading-spin 820ms linear infinite;
}

.loading-state__title {
  font-size: 1rem;
}

.loading-state__description {
  max-width: 52ch;
  font-size: 0.92rem;
}

@keyframes loading-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
