<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const FEISHU_UNSUPPORTED_TEXT = '暂时无法在飞书文档外展示此内容'

const props = defineProps<{
  code?: string
  language?: string
  filename?: string
  class?: string
}>()

const attrs = useAttrs()
const slots = useSlots()
const root = ref<HTMLElement | null>(null)
const codeEl = ref<HTMLElement | null>(null)

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const label = ref('CODE')

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

const slotText = computed(() => collectSlotText(slots.default?.() || []))
const isFeishuUnsupported = computed(() => normalizeText(props.code || slotText.value) === FEISHU_UNSUPPORTED_TEXT)

const getCodeText = () => props.code || codeEl.value?.textContent?.replace(/\n$/, '') || slotText.value || ''

const readLanguage = () => {
  const codeClass = codeEl.value?.className || ''
  const classValue = [props.class, attrs.class, codeClass].filter(Boolean).join(' ')
  const languageClass = classValue.split(/\s+/).find((item) => /^language-/i.test(item))
  const language = props.language || languageClass?.replace(/^language-/i, '') || props.filename || 'code'

  return language.toUpperCase()
}

const detectMeta = () => {
  codeEl.value = root.value?.querySelector('code') as HTMLElement | null
  label.value = readLanguage()
}

const copyCode = async () => {
  const text = getCodeText()
  if (!text) return

  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      copied.value = false
    }, 1400)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', 'true')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      copied.value = false
    }, 1400)
  }
}

onMounted(() => {
  if (!isFeishuUnsupported.value) {
    detectMeta()
  }
})

onBeforeUnmount(() => {
  clearTimeout(timer)
})
</script>

<template>
  <div v-if="!isFeishuUnsupported" ref="root" class="prose-pre">
    <div class="prose-pre__bar">
      <span class="prose-pre__label">{{ label }}</span>
      <button type="button" class="prose-pre__copy" @click="copyCode">
        {{ copied ? '已复制' : '复制' }}
      </button>
    </div>

    <pre class="prose-pre__code"><slot /></pre>
  </div>
</template>

<style scoped>
.prose-pre {
  position: relative;
  margin: 0.72rem 0;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.prose-pre__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
  min-height: 34px;
  padding: 0 10px 0 12px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-soft);
}

.prose-pre__label {
  color: var(--color-text-weak);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0;
}

.prose-pre__copy {
  min-height: 24px;
  padding: 0 10px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-weak);
  font-size: 0.72rem;
  font-weight: 700;
  background: var(--color-surface);
}

.prose-pre__copy:hover {
  color: var(--color-fg);
  border-color: color-mix(in srgb, var(--color-primary) 45%, var(--color-border));
  background: color-mix(in srgb, var(--color-primary) 6%, var(--color-surface));
}

.prose-pre__code {
  margin: 0;
  padding: 0.9rem 1rem 1rem;
  overflow-x: auto;
  border: 0;
  border-radius: 0;
  background: var(--color-surface);
  box-shadow: none;
  color: #1d4ed8;
  font-size: 0.92rem;
  line-height: 1.68;
}

:deep(.prose-pre__code code) {
  white-space: pre;
  color: inherit;
}

:deep(.prose-pre__code .line) {
  display: block;
  padding-right: 1rem;
}

html[data-theme='dark'] .prose-pre {
  border-color: #46546c;
  background: #222b3a;
}

html[data-theme='dark'] .prose-pre__bar {
  border-bottom-color: #46546c;
  background: #303a4d;
}

html[data-theme='dark'] .prose-pre__label {
  color: #c6cfdf;
}

html[data-theme='dark'] .prose-pre__copy {
  border-color: #53627a;
  background: #253044;
  color: #d5dbea;
}

html[data-theme='dark'] .prose-pre__copy:hover {
  border-color: #7485a2;
  background: #303a4d;
  color: #fff;
}

html[data-theme='dark'] .prose-pre__code {
  background: #202838;
  color: #c7d2fe;
}
</style>
