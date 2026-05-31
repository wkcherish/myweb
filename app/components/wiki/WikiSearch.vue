<script setup lang="ts">
import { Search } from 'lucide-vue-next'

defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <label class="wiki-search">
    <Search :size="17" aria-hidden="true" />
    <span class="sr-only">搜索 Wiki</span>
    <input
      :value="modelValue"
      type="search"
      placeholder="搜索标题或摘要"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
  </label>
</template>

<style scoped>
.wiki-search {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: var(--space-8);
  padding: 0 var(--space-12);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-8);
  background: var(--color-surface);
  transition:
    border-color var(--motion-180) ease,
    box-shadow var(--motion-180) ease,
    background-color var(--motion-180) ease;
}

.wiki-search input {
  width: 100%;
  min-width: 0;
  border: 0;
  background: transparent;
  outline: none;
}

.wiki-search:focus-within {
  border-color: color-mix(in srgb, var(--color-primary) 42%, var(--color-border));
  background: color-mix(in srgb, var(--color-surface) 96%, white 4%);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 10%, transparent);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
