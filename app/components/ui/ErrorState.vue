<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import BasePanel from './BasePanel.vue'

interface Props {
  title?: string
  description?: string
  retryLabel?: string
}

withDefaults(defineProps<Props>(), {
  title: '内容加载失败',
  description: '请稍后重试，或检查网络与资源路径是否正确。',
  retryLabel: '重试',
})

defineEmits<{
  retry: []
}>()
</script>

<template>
  <BasePanel class="error-state" tone="default">
    <div class="error-state__signal" aria-hidden="true">
      <span />
    </div>

    <h2 class="error-state__title">{{ title }}</h2>
    <p class="error-state__description">{{ description }}</p>

    <BaseButton variant="danger" @click="$emit('retry')">
      {{ retryLabel }}
    </BaseButton>
  </BasePanel>
</template>

<style scoped>
.error-state {
  display: grid;
  justify-items: center;
  gap: var(--space-12);
  text-align: center;
}

.error-state__signal {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-pill);
  border: 1px solid color-mix(in srgb, var(--color-danger) 28%, transparent);
  background: color-mix(in srgb, var(--color-danger) 12%, transparent);
}

.error-state__signal span {
  width: 0.22rem;
  height: 1rem;
  border-radius: var(--radius-pill);
  background: var(--color-danger);
}

.error-state__title {
  font-size: 1rem;
}

.error-state__description {
  max-width: 52ch;
  font-size: 0.92rem;
}
</style>
