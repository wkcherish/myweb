<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const FEISHU_UNSUPPORTED_TEXT = '暂时无法在飞书文档外展示此内容'

const slots = useSlots()

function collectSlotText(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map(collectSlotText).join('')
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  if (value && typeof value === 'object') {
    return collectSlotText((value as { children?: unknown }).children)
  }

  return ''
}

function normalizeText(value: string) {
  return value.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim()
}

const isFeishuUnsupported = computed(
  () => normalizeText(collectSlotText(slots.default?.() || [])) === FEISHU_UNSUPPORTED_TEXT,
)
</script>

<template>
  <p v-if="!isFeishuUnsupported" v-bind="$attrs">
    <slot />
  </p>
</template>
