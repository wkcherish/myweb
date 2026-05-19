<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { MessageSquare, Trash2, X } from 'lucide-vue-next'

import { useAiChat } from '~/composables/useAiChat'

import AiComposer from './AiComposer.vue'
import AiMessageList from './AiMessageList.vue'

type UtilityKey = 'ai' | 'music' | 'settings'

interface PanelState {
  x: number | null
  y: number | null
  w: number
  h: number
}

const PANEL_STATE_KEY = 'notebook:ai-panel-state'
const MIN_W = 360
const MIN_H = 420
const MAX_W = 800
const MAX_H = 900

const {
  clearConversation,
  close,
  errorMessage,
  inputText,
  isLoading,
  isOpen,
  messages,
  open,
  sendMessage,
  setInput,
} = useAiChat()

const route = useRoute()
const panelRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const composerRef = ref<InstanceType<typeof AiComposer> | null>(null)

const isDragging = ref(false)
const isResizing = ref(false)
const panelState = ref<PanelState>({ x: null, y: null, w: 460, h: 640 })

const drag = ref({ pointerId: -1, startX: 0, startY: 0, originX: 0, originY: 0 })
const resize = ref({ pointerId: -1, startX: 0, startY: 0, originW: 0, originH: 0, fromRight: false, fromBottom: false })

const panelStyle = computed(() => {
  const s: Record<string, string> = {
    width: `${panelState.value.w}px`,
    height: `${panelState.value.h}px`,
  }
  if (typeof panelState.value.x === 'number' && typeof panelState.value.y === 'number') {
    s.left = `${panelState.value.x}px`
    s.top = `${panelState.value.y}px`
    s.right = 'auto'
    s.bottom = 'auto'
    s.transform = 'none'
  }
  return s
})

function handleOpenUtility(event: Event) {
  if ((event as CustomEvent<UtilityKey>).detail !== 'ai') return
  open()
  void nextTick(() => composerRef.value?.focus())
}

function handleSuggestion(text: string) { void sendMessage(text) }
function handleClose() { close() }
function handleSend() { void sendMessage() }
function handleClear() { clearConversation() }
function onKeydown(e: KeyboardEvent) { if (e.key === 'Escape') close() }

/* ---- drag ---- */
function onHeaderPtrDown(e: PointerEvent) {
  if (!panelRef.value) return
  if ((e.target as HTMLElement).closest('button')) return
  const r = panelRef.value.getBoundingClientRect()
  drag.value = { pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, originX: r.left, originY: r.top }
  isDragging.value = false
  headerRef.value?.setPointerCapture(e.pointerId)
}

function onHeaderPtrMove(e: PointerEvent) {
  if (drag.value.pointerId !== e.pointerId || !panelRef.value) return
  const dx = e.clientX - drag.value.startX
  const dy = e.clientY - drag.value.startY
  if (Math.abs(dx) + Math.abs(dy) > 3) isDragging.value = true
  panelState.value.x = Math.round(clamp(drag.value.originX + dx, 8, window.innerWidth - panelState.value.w - 8))
  panelState.value.y = Math.round(clamp(drag.value.originY + dy, 48, window.innerHeight - panelState.value.h - 8))
}

function onHeaderPtrUp(e: PointerEvent) {
  if (drag.value.pointerId !== e.pointerId) return
  headerRef.value?.releasePointerCapture(e.pointerId)
  drag.value.pointerId = -1
  if (isDragging.value) { saveState(); window.setTimeout(() => { isDragging.value = false }, 120) }
}

/* ---- resize ---- */
function onResizePtrDown(e: PointerEvent) {
  e.preventDefault()
  e.stopPropagation()
  resize.value = {
    pointerId: e.pointerId,
    startX: e.clientX,
    startY: e.clientY,
    originW: panelState.value.w,
    originH: panelState.value.h,
    fromRight: true,
    fromBottom: true,
  }
  isResizing.value = true
  panelRef.value?.setPointerCapture(e.pointerId)
}

function onResizePtrMove(e: PointerEvent) {
  if (resize.value.pointerId !== e.pointerId) return
  const dx = e.clientX - resize.value.startX
  const dy = e.clientY - resize.value.startY
  let nw = resize.value.originW
  let nh = resize.value.originH
  if (resize.value.fromRight) nw = clamp(resize.value.originW + dx, MIN_W, MAX_W)
  if (resize.value.fromBottom) nh = clamp(resize.value.originH + dy, MIN_H, MAX_H)
  panelState.value.w = nw
  panelState.value.h = nh
}

function onResizePtrUp(e: PointerEvent) {
  if (resize.value.pointerId !== e.pointerId) return
  panelRef.value?.releasePointerCapture(e.pointerId)
  resize.value.pointerId = -1
  isResizing.value = false
  saveState()
}

/* ---- persist ---- */
function loadState() {
  if (!import.meta.client) return
  try {
    const raw = localStorage.getItem(PANEL_STATE_KEY)
    if (!raw) return
    const s = JSON.parse(raw) as PanelState
    if (typeof s.w === 'number' && s.w >= MIN_W && s.w <= MAX_W) panelState.value.w = s.w
    if (typeof s.h === 'number' && s.h >= MIN_H && s.h <= MAX_H) panelState.value.h = s.h
    if (typeof s.x === 'number' && Number.isFinite(s.x)) panelState.value.x = s.x
    if (typeof s.y === 'number' && Number.isFinite(s.y)) panelState.value.y = s.y
  } catch { localStorage.removeItem(PANEL_STATE_KEY) }
}

function saveState() {
  if (!import.meta.client) return
  localStorage.setItem(PANEL_STATE_KEY, JSON.stringify(panelState.value))
}

function clamp(v: number, min: number, max: number) { return Math.min(Math.max(v, min), max) }

watch(
  () => route.fullPath,
  () => {
    close()
  },
)

onMounted(() => {
  loadState()
  window.addEventListener('notebook:open-utility', handleOpenUtility)
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('notebook:open-utility', handleOpenUtility)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <aside
    v-if="isOpen"
    ref="panelRef"
    class="ai-panel"
    :class="{ 'is-resizing': isResizing }"
    :style="panelStyle"
    aria-label="AI 问答"
  >
    <!-- Header -->
    <header
      ref="headerRef"
      class="ai-panel__header"
      :class="{ 'is-dragging': isDragging }"
      @pointerdown="onHeaderPtrDown"
      @pointermove="onHeaderPtrMove"
      @pointerup="onHeaderPtrUp"
      @pointercancel="onHeaderPtrUp"
    >
      <div class="ai-panel__title">
        <MessageSquare :size="16" aria-hidden="true" />
        <span>AI 问答</span>
      </div>
      <div class="ai-panel__actions">
        <button type="button" aria-label="清空对话" title="清空对话" :disabled="messages.length === 0" @click="handleClear">
          <Trash2 :size="15" aria-hidden="true" />
        </button>
        <button type="button" aria-label="关闭" @click="handleClose">
          <X :size="17" aria-hidden="true" />
        </button>
      </div>
    </header>

    <!-- Error -->
    <div v-if="errorMessage" class="ai-panel__error">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Messages -->
    <AiMessageList
      :messages="messages"
      :is-loading="isLoading"
      @suggestion="handleSuggestion"
    />

    <!-- Composer -->
    <AiComposer
      ref="composerRef"
      :model-value="inputText"
      :is-loading="isLoading"
      @update:model-value="setInput"
      @send="handleSend"
    />

    <!-- Resize handle -->
    <div
      class="ai-panel__resize"
      @pointerdown="onResizePtrDown"
      @pointermove="onResizePtrMove"
      @pointerup="onResizePtrUp"
      @pointercancel="onResizePtrUp"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M10 2v8H2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
        <path d="M7 5v5H2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
        <path d="M4 8v2H2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
      </svg>
    </div>
  </aside>
</template>

<style scoped>
.ai-panel {
  position: fixed;
  right: max(20px, env(safe-area-inset-right));
  bottom: calc(max(20px, env(safe-area-inset-bottom)) + 166px);
  z-index: 33;
  display: grid;
  grid-template-rows: 48px auto auto 1fr auto;
  border: 1px solid color-mix(in srgb, var(--color-border) 78%, transparent);
  border-radius: 22px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 96%, white 4%), var(--color-surface));
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 0.5) inset,
    0 16px 48px rgb(15 23 42 / 0.14),
    0 3px 12px rgb(15 23 42 / 0.08);
  overflow: hidden;
  user-select: none;
  backdrop-filter: blur(18px);
}

.ai-panel.is-resizing {
  user-select: none;
}

/* header */
.ai-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-12) 0 var(--space-16);
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 72%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 92%, white 8%), color-mix(in srgb, var(--color-surface) 86%, transparent));
  cursor: grab;
  touch-action: none;
}

.ai-panel__header.is-dragging { cursor: grabbing; }

.ai-panel__title {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-fg);
  font-size: 0.9rem;
  font-weight: 720;
  letter-spacing: 0;
}

.ai-panel__title svg {
  color: var(--color-primary);
}

.ai-panel__actions {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
}

.ai-panel__actions button {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 10px;
  color: var(--color-text-weak);
  transition: color 120ms, background 120ms, transform 120ms;
}

.ai-panel__actions button:hover {
  color: var(--color-fg);
  background: color-mix(in srgb, var(--color-fg) 7%, transparent);
  transform: translateY(-1px);
}

.ai-panel__actions button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* error */
.ai-panel__error {
  margin: var(--space-8) var(--space-16) 0;
  padding: var(--space-8) var(--space-12);
  border: 1px solid color-mix(in srgb, var(--color-warning) 26%, transparent);
  border-radius: var(--radius-12);
  background: color-mix(in srgb, var(--color-warning) 9%, var(--color-surface));
}

.ai-panel__error p {
  margin: 0;
  color: var(--color-warning);
  font-size: 0.78rem;
}

/* resize handle */
.ai-panel__resize {
  position: absolute;
  right: 0;
  bottom: 0;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  color: var(--color-text-weak);
  cursor: nwse-resize;
  touch-action: none;
  z-index: 10;
  opacity: 0.4;
  transition: opacity 120ms;
}

.ai-panel__resize:hover {
  opacity: 1;
}

/* mobile */
@media (max-width: 768px) {
  .ai-panel {
    left: 0 !important;
    top: 0 !important;
    right: 0;
    bottom: 0;
    transform: none !important;
    width: 100vw !important;
    height: 100dvh !important;
    border-radius: 0;
    border: 0;
    box-shadow: none;
  }

  .ai-panel__resize {
    display: none;
  }
}
</style>
