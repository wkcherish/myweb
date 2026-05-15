<script setup lang="ts">
import { computed, useAttrs } from 'vue'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type NativeButtonType = 'button' | 'submit' | 'reset'

interface Props {
  variant?: ButtonVariant
  type?: NativeButtonType
  loading?: boolean
  disabled?: boolean
  iconOnly?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  loading: false,
  disabled: false,
  iconOnly: false,
  ariaLabel: '',
})

const attrs = useAttrs()

const isDisabled = computed(() => props.disabled || props.loading)

const resolvedAriaLabel = computed(() => {
  if (!props.iconOnly) {
    return props.ariaLabel || undefined
  }

  const fromAttrs = attrs['aria-label'] || attrs.title
  return props.ariaLabel || (typeof fromAttrs === 'string' ? fromAttrs : undefined)
})

const classList = computed(() => [
  'base-button',
  `base-button--${props.variant}`,
  {
    'is-loading': props.loading,
    'is-icon-only': props.iconOnly,
  },
])
</script>

<template>
  <button
    v-bind="$attrs"
    :type="type"
    :class="classList"
    :disabled="isDisabled"
    :aria-label="resolvedAriaLabel"
    :aria-busy="loading || undefined"
  >
    <span v-if="loading" class="base-button__spinner" aria-hidden="true" />
    <span class="base-button__content">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  min-width: 88px;
  min-height: 44px;
  padding: 0 var(--space-16);
  border: 1px solid transparent;
  border-radius: var(--radius-12);
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
  user-select: none;
  transition:
    transform var(--motion-120) ease,
    box-shadow var(--motion-180) ease,
    border-color var(--motion-180) ease,
    background-color var(--motion-180) ease,
    color var(--motion-180) ease;
}

.base-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.base-button:active:not(:disabled) {
  transform: translateY(0);
}

.base-button:disabled {
  cursor: not-allowed;
  opacity: 0.62;
  box-shadow: none;
}

.base-button--primary {
  color: #f6f9ff;
  background: var(--color-primary);
  box-shadow: var(--shadow-soft);
}

.base-button--primary:hover:not(:disabled) {
  background: color-mix(in srgb, var(--color-primary) 90%, black);
}

.base-button--secondary {
  color: var(--color-fg);
  background: var(--color-surface);
  border-color: var(--color-border);
}

.base-button--secondary:hover:not(:disabled) {
  background: color-mix(in srgb, var(--color-surface) 72%, var(--color-primary));
}

.base-button--ghost {
  color: var(--color-fg);
  background: transparent;
  border-color: color-mix(in srgb, var(--color-fg) 14%, transparent);
}

.base-button--ghost:hover:not(:disabled) {
  background: color-mix(in srgb, var(--color-fg) 12%, transparent);
}

.base-button--danger {
  color: #fff6f7;
  background: var(--color-danger);
}

.base-button--danger:hover:not(:disabled) {
  background: color-mix(in srgb, var(--color-danger) 88%, black);
}

.is-icon-only {
  width: 44px;
  min-width: 44px;
  padding: 0;
  border-radius: var(--radius-pill);
}

.is-loading .base-button__content {
  opacity: 0.6;
}

.base-button__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentcolor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: button-spin 720ms linear infinite;
}

.base-button__content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  white-space: nowrap;
}

@keyframes button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
