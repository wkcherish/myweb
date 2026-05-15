<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import BasePanel from './BasePanel.vue'

interface Props {
  title?: string
  description?: string
  actionLabel?: string
}

withDefaults(defineProps<Props>(), {
  title: '暂无内容',
  description: '当前没有可展示的数据，请稍后再看。',
  actionLabel: '',
})

defineEmits<{
  action: []
}>()
</script>

<template>
  <BasePanel class="empty-state" tone="muted">
    <div class="empty-state__icon" aria-hidden="true">
      <slot name="icon">
        <span class="empty-state__dot" />
      </slot>
    </div>

    <h2 class="empty-state__title">{{ title }}</h2>
    <p class="empty-state__description">{{ description }}</p>

    <BaseButton v-if="actionLabel" variant="secondary" @click="$emit('action')">
      {{ actionLabel }}
    </BaseButton>
  </BasePanel>
</template>

<style scoped>
.empty-state {
  display: grid;
  justify-items: center;
  gap: var(--space-12);
  text-align: center;
}

.empty-state__icon {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface-soft) 80%, transparent);
}

.empty-state__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--color-text-weak) 68%, transparent);
}

.empty-state__title {
  font-size: 1rem;
}

.empty-state__description {
  max-width: 52ch;
  font-size: 0.92rem;
}
</style>
