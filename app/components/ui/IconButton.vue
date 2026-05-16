<script setup lang="ts">
import type { Component } from 'vue'

import BaseButton from './BaseButton.vue'

type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type TooltipPlacement = 'top' | 'bottom'
type TooltipAlign = 'center' | 'start' | 'end'

interface Props {
  icon?: Component
  label: string
  tooltip?: string
  tooltipPlacement?: TooltipPlacement
  tooltipAlign?: TooltipAlign
  variant?: IconButtonVariant
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  tooltip: '',
  tooltipPlacement: 'top',
  tooltipAlign: 'center',
  variant: 'ghost',
  loading: false,
  disabled: false,
})
</script>

<template>
  <div class="icon-button-wrap" :class="[`is-tooltip-${tooltipPlacement}`, `is-tooltip-align-${tooltipAlign}`]">
    <BaseButton
      class="icon-button"
      :variant="variant"
      :loading="loading"
      :disabled="disabled"
      icon-only
      :aria-label="label"
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
  z-index: 10;
  min-width: max-content;
  max-width: min(240px, calc(100vw - 32px));
  padding: 7px 10px;
  border: 1px solid color-mix(in srgb, var(--color-border) 72%, transparent);
  border-radius: 999px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 98%, white), color-mix(in srgb, var(--color-surface) 90%, var(--color-bg))),
    var(--color-surface);
  color: var(--color-fg);
  font-size: 0.76rem;
  font-weight: 750;
  line-height: 1.15;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.16);
  backdrop-filter: blur(12px);
  transition:
    opacity var(--motion-180) ease,
    transform var(--motion-180) ease;
}

.icon-button__tooltip::after {
  content: '';
  position: absolute;
  width: 9px;
  height: 9px;
  border-right: 1px solid color-mix(in srgb, var(--color-border) 72%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 72%, transparent);
  background: color-mix(in srgb, var(--color-surface) 94%, var(--color-bg));
}

.icon-button-wrap.is-tooltip-align-center .icon-button__tooltip {
  left: 50%;
}

.icon-button-wrap.is-tooltip-align-start .icon-button__tooltip {
  left: 0;
}

.icon-button-wrap.is-tooltip-align-end .icon-button__tooltip {
  right: 0;
}

.icon-button-wrap.is-tooltip-top .icon-button__tooltip {
  bottom: calc(100% + 10px);
  transform: translateY(var(--space-4)) scale(0.96);
}

.icon-button-wrap.is-tooltip-bottom .icon-button__tooltip {
  top: calc(100% + 10px);
  transform: translateY(calc(-1 * var(--space-4))) scale(0.96);
}

.icon-button-wrap.is-tooltip-align-center .icon-button__tooltip {
  transform: translateX(-50%);
}

.icon-button-wrap.is-tooltip-top.is-tooltip-align-center .icon-button__tooltip {
  transform: translateX(-50%) translateY(var(--space-4)) scale(0.96);
}

.icon-button-wrap.is-tooltip-bottom.is-tooltip-align-center .icon-button__tooltip {
  transform: translateX(-50%) translateY(calc(-1 * var(--space-4))) scale(0.96);
}

.icon-button-wrap.is-tooltip-top .icon-button__tooltip::after {
  bottom: -5px;
  transform: rotate(45deg);
}

.icon-button-wrap.is-tooltip-bottom .icon-button__tooltip::after {
  top: -5px;
  transform: rotate(225deg);
}

.icon-button-wrap.is-tooltip-align-center .icon-button__tooltip::after {
  left: 50%;
  margin-left: -4.5px;
}

.icon-button-wrap.is-tooltip-align-start .icon-button__tooltip::after {
  left: 14px;
}

.icon-button-wrap.is-tooltip-align-end .icon-button__tooltip::after {
  right: 14px;
}

.icon-button-wrap:hover .icon-button__tooltip,
.icon-button-wrap:focus-within .icon-button__tooltip {
  opacity: 1;
}

.icon-button-wrap.is-tooltip-top:hover .icon-button__tooltip,
.icon-button-wrap.is-tooltip-top:focus-within .icon-button__tooltip,
.icon-button-wrap.is-tooltip-bottom:hover .icon-button__tooltip,
.icon-button-wrap.is-tooltip-bottom:focus-within .icon-button__tooltip {
  transform: translateY(0) scale(1);
}

.icon-button-wrap.is-tooltip-top.is-tooltip-align-center:hover .icon-button__tooltip,
.icon-button-wrap.is-tooltip-top.is-tooltip-align-center:focus-within .icon-button__tooltip,
.icon-button-wrap.is-tooltip-bottom.is-tooltip-align-center:hover .icon-button__tooltip,
.icon-button-wrap.is-tooltip-bottom.is-tooltip-align-center:focus-within .icon-button__tooltip {
  transform: translateX(-50%) translateY(0) scale(1);
}
</style>
