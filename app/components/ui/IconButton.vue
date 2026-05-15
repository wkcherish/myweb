<script setup lang="ts">
import type { Component } from 'vue'

import { computed } from 'vue'

import BaseButton from './BaseButton.vue'

type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface Props {
  icon?: Component
  label: string
  tooltip?: string
  variant?: IconButtonVariant
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  tooltip: '',
  variant: 'ghost',
  loading: false,
  disabled: false,
})

const tooltipText = computed(() => props.tooltip || props.label)
</script>

<template>
  <div class="icon-button-wrap">
    <BaseButton
      class="icon-button"
      :variant="variant"
      :loading="loading"
      :disabled="disabled"
      icon-only
      :aria-label="label"
      :title="tooltipText"
    >
      <component :is="icon" v-if="icon" class="icon-button__icon" aria-hidden="true" />
      <slot v-else name="icon" />
    </BaseButton>
    <span v-if="tooltip" class="icon-button__tooltip" role="tooltip">{{ tooltip }}</span>
  </div>
</template>

<style scoped>
.icon-button-wrap {
  position: relative;
  display: inline-flex;
}

.icon-button__icon {
  width: 1.1rem;
  height: 1.1rem;
}

.icon-button__tooltip {
  position: absolute;
  left: 50%;
  bottom: calc(100% + var(--space-8));
  transform: translateX(-50%) translateY(var(--space-4));
  z-index: 10;
  min-width: max-content;
  padding: var(--space-4) var(--space-8);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-8);
  background: var(--color-surface);
  color: var(--color-text-weak);
  font-size: 0.75rem;
  line-height: 1.2;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  box-shadow: var(--shadow-soft);
  transition:
    opacity var(--motion-180) ease,
    transform var(--motion-180) ease;
}

.icon-button-wrap:hover .icon-button__tooltip,
.icon-button-wrap:focus-within .icon-button__tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
</style>
