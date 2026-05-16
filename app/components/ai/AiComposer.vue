<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowUp } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string
  isLoading: boolean
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  send: []
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const canSend = computed(() => props.modelValue.trim().length > 0 && !props.isLoading)

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    if (canSend.value) emit('send')
  }
}

function handleSend() {
  if (canSend.value) emit('send')
}

function focus() {
  textareaRef.value?.focus()
}

defineExpose({ focus })
</script>

<template>
  <div class="composer">
    <div class="composer__inner">
      <textarea
        ref="textareaRef"
        class="composer__input"
        :value="modelValue"
        :placeholder="placeholder ?? '输入你的问题…'"
        :disabled="isLoading"
        rows="1"
        @input="handleInput"
        @keydown="handleKeydown"
      />
      <button
        class="composer__btn"
        :class="{ 'is-active': canSend, 'is-loading': isLoading }"
        type="button"
        aria-label="发送"
        :disabled="!canSend"
        @click="handleSend"
      >
        <span v-if="isLoading" class="composer__spinner" aria-hidden="true" />
        <ArrowUp v-else :size="18" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.composer {
  padding: var(--space-12) var(--space-16);
  border-top: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-fg) 1.5%, transparent);
}

.composer__inner {
  display: flex;
  align-items: flex-end;
  gap: var(--space-8);
  padding: 3px 3px 3px var(--space-16);
  border: 1.5px solid var(--color-border);
  border-radius: 28px;
  background: var(--color-surface);
  transition: border-color 180ms;
}

.composer__inner:focus-within {
  border-color: var(--color-primary);
}

.composer__input {
  flex: 1;
  min-height: 24px;
  max-height: 140px;
  padding: 8px 0;
  border: 0;
  background: transparent;
  color: var(--color-fg);
  font-size: 0.88rem;
  line-height: 1.55;
  resize: none;
  outline: none;
}

.composer__input::placeholder {
  color: var(--color-text-weak);
}

.composer__input:disabled {
  opacity: 0.45;
}

.composer__btn {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 50%;
  background: var(--color-border);
  color: var(--color-text-weak);
  flex-shrink: 0;
  transition: background 160ms, color 160ms, transform 160ms;
}

.composer__btn.is-active {
  background: var(--color-primary);
  color: #fff;
}

.composer__btn.is-active:hover {
  transform: scale(1.07);
}

.composer__btn.is-loading {
  background: var(--color-primary);
  color: #fff;
  opacity: 0.6;
}

.composer__spinner {
  display: block;
  width: 14px;
  height: 14px;
  border: 2px solid rgb(255 255 255 / 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
