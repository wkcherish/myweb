<script setup lang="ts">
import { ChevronDown, ListTree, X } from 'lucide-vue-next'
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue'

type TocLink = {
  id: string
  text: string
  depth?: number
}

const props = defineProps<{
  links: TocLink[]
}>()

const isOpen = ref(false)
const activeId = ref('')
const panelId = useId()
const isDragging = ref(false)
const dragOffset = ref(0)
const didDrag = ref(false)
const dragState = ref({
  pointerId: -1,
  startY: 0,
  mode: 'open' as 'open' | 'close',
})

const activeLink = computed(() => props.links.find((link) => link.id === activeId.value) || props.links[0])
const panelStyle = computed(() =>
  isDragging.value
    ? {
        transform: `translateY(${dragOffset.value}px)`,
        transition: 'none',
      }
    : undefined,
)

const updateActive = () => {
  if (!import.meta.client) {
    return
  }

  const headings = props.links
    .map((link) => document.getElementById(link.id))
    .filter((heading): heading is HTMLElement => Boolean(heading))

  const current = [...headings].reverse().find((heading) => heading.getBoundingClientRect().top <= 120)
  activeId.value = current?.id || headings[0]?.id || ''
}

function openToc() {
  isOpen.value = true
  dragOffset.value = 0
}

function closeToc() {
  isOpen.value = false
  dragOffset.value = 0
}

function handleTriggerClick() {
  if (didDrag.value) {
    didDrag.value = false
    return
  }

  openToc()
}

function startOpenDrag(event: PointerEvent) {
  dragState.value = {
    pointerId: event.pointerId,
    startY: event.clientY,
    mode: 'open',
  }
  didDrag.value = false
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

function startCloseDrag(event: PointerEvent) {
  const target = event.target as HTMLElement

  if (target.closest('button') || target.closest('a')) {
    return
  }

  dragState.value = {
    pointerId: event.pointerId,
    startY: event.clientY,
    mode: 'close',
  }
  didDrag.value = false
  isDragging.value = true
  dragOffset.value = 0
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

function handleDragMove(event: PointerEvent) {
  if (dragState.value.pointerId !== event.pointerId) {
    return
  }

  const deltaY = event.clientY - dragState.value.startY

  if (Math.abs(deltaY) > 6) {
    didDrag.value = true
  }

  if (dragState.value.mode === 'open') {
    if (deltaY > -8 && !isDragging.value) {
      return
    }

    event.preventDefault()
    isOpen.value = true
    isDragging.value = true
    dragOffset.value = Math.max(0, Math.min(112, 112 + deltaY * 1.15))
    return
  }

  event.preventDefault()
  dragOffset.value = Math.max(0, deltaY)
}

function handleDragEnd(event: PointerEvent) {
  if (dragState.value.pointerId !== event.pointerId) {
    return
  }

  ;(event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId)

  const openedByDrag = dragState.value.mode === 'open' && isDragging.value
  const shouldOpen =
    dragState.value.mode === 'open'
      ? openedByDrag && (dragOffset.value <= 72 || dragState.value.startY - event.clientY > 42)
      : dragOffset.value < 72

  if (shouldOpen) {
    openToc()
  } else {
    closeToc()
  }

  isDragging.value = false
  dragOffset.value = 0
  dragState.value.pointerId = -1
}

function handleDragCancel(event: PointerEvent) {
  if (dragState.value.pointerId !== event.pointerId) {
    return
  }

  ;(event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId)
  isDragging.value = false
  dragOffset.value = 0
  dragState.value.pointerId = -1
}

onMounted(() => {
  updateActive()
  window.addEventListener('scroll', updateActive, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActive)
})
</script>

<template>
  <aside class="wiki-side-toc" :class="{ 'is-open': isOpen, 'is-dragging': isDragging }">
    <button
      type="button"
      class="wiki-side-toc__mobile-trigger"
      :aria-expanded="isOpen"
      :aria-controls="panelId"
      @click="handleTriggerClick"
      @pointerdown="startOpenDrag"
      @pointermove="handleDragMove"
      @pointerup="handleDragEnd"
      @pointercancel="handleDragCancel"
    >
      <span class="wiki-side-toc__mobile-icon">
        <ListTree :size="18" aria-hidden="true" />
      </span>
      <span class="wiki-side-toc__mobile-copy">
        <span>目录</span>
        <strong>{{ activeLink?.text || '章节导航' }}</strong>
      </span>
      <ChevronDown :size="18" aria-hidden="true" />
    </button>

    <button
      v-if="isOpen"
      type="button"
      class="wiki-side-toc__scrim"
      aria-label="关闭目录"
      @click="closeToc"
    />

    <div :id="panelId" class="wiki-side-toc__panel" :style="panelStyle">
      <div
        class="wiki-side-toc__grabber"
        aria-hidden="true"
        @pointerdown="startCloseDrag"
        @pointermove="handleDragMove"
        @pointerup="handleDragEnd"
        @pointercancel="handleDragCancel"
      />
      <div class="wiki-side-toc__head">
        <span class="wiki-side-toc__label">
          <ListTree :size="18" aria-hidden="true" />
          目录
        </span>
        <button type="button" class="wiki-side-toc__toggle" :aria-expanded="isOpen" @click="isOpen ? closeToc() : openToc()">
          <span>{{ isOpen ? '收起' : '展开' }}</span>
          <X v-if="isOpen" :size="18" aria-hidden="true" />
        </button>
      </div>

      <ol class="wiki-side-toc__list" :class="{ 'is-open': isOpen }">
        <li
          v-for="link in links"
          :key="link.id"
          class="wiki-side-toc__item"
          :style="{ '--toc-indent': `${Math.max((link.depth || 2) - 2, 0) * 14}px` }"
        >
          <a :href="`#${link.id}`" :class="{ 'is-active': activeId === link.id }" @click="closeToc">
            <span class="wiki-side-toc__text">{{ link.text }}</span>
          </a>
        </li>
      </ol>
    </div>
  </aside>
</template>

<style scoped>
.wiki-side-toc {
  position: sticky;
  top: 24px;
  align-self: start;
  display: grid;
  gap: 12px;
  padding: 14px;
  max-height: calc(100vh - 48px);
  overflow: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-12);
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
}

.wiki-side-toc__mobile-trigger,
.wiki-side-toc__scrim,
.wiki-side-toc__grabber {
  display: none;
}

.wiki-side-toc__panel {
  display: contents;
}

.wiki-side-toc__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.wiki-side-toc__label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-fg);
  font-weight: 800;
}

.wiki-side-toc__toggle {
  display: none;
  align-items: center;
  gap: 6px;
  color: var(--color-text-weak);
  font-size: 0.86rem;
  font-weight: 700;
}

.wiki-side-toc__list {
  display: grid;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.wiki-side-toc__item {
  --toc-indent: 0px;
}

.wiki-side-toc__list a {
  display: block;
  padding: 8px 10px 8px calc(10px + var(--toc-indent));
  border: 1px solid transparent;
  border-radius: var(--radius-8);
  color: var(--color-text-weak);
  text-decoration: none;
  font-size: 0.9rem;
  line-height: 1.35;
  transition: all 0.18s ease;
}

.wiki-side-toc__list a:hover,
.wiki-side-toc__list a.is-active {
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  border-color: color-mix(in srgb, var(--color-primary) 26%, transparent);
}

.wiki-side-toc__text {
  min-width: 0;
  overflow-wrap: anywhere;
}

@media (max-width: 980px) {
  .wiki-side-toc {
    position: relative;
    padding: 0;
    max-height: none;
    overflow: visible;
    border: 0;
    background: transparent;
    box-shadow: none;
  }

  .wiki-side-toc__mobile-trigger {
    position: fixed;
    right: 14px;
    bottom: max(10px, env(safe-area-inset-bottom));
    left: 14px;
    z-index: 10000;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    min-height: 58px;
    padding: 14px 14px 8px 12px;
    border: 1px solid color-mix(in srgb, var(--color-border) 76%, transparent);
    border-radius: 18px 18px 14px 14px;
    background: color-mix(in srgb, var(--color-surface) 94%, transparent);
    color: var(--color-fg);
    box-shadow: 0 14px 34px rgba(15, 23, 42, 0.16);
    backdrop-filter: blur(18px);
    touch-action: none;
    transition:
      opacity var(--motion-180) ease,
      transform var(--motion-180) ease;
  }

  .wiki-side-toc__mobile-trigger::before {
    content: '';
    position: absolute;
    top: 7px;
    left: 50%;
    width: 42px;
    height: 4px;
    border-radius: var(--radius-pill);
    background: color-mix(in srgb, var(--color-text-weak) 26%, transparent);
    transform: translateX(-50%);
  }

  .wiki-side-toc.is-open:not(.is-dragging) .wiki-side-toc__mobile-trigger {
    opacity: 0;
    pointer-events: none;
    transform: translateY(18px);
  }

  .wiki-side-toc__mobile-trigger > svg {
    transform: rotate(180deg);
  }

  .wiki-side-toc__mobile-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--color-primary) 12%, transparent);
    color: var(--color-primary);
  }

  .wiki-side-toc__mobile-copy {
    display: grid;
    min-width: 0;
    text-align: left;
    line-height: 1.15;
  }

  .wiki-side-toc__mobile-copy span {
    color: var(--color-text-weak);
    font-size: 0.72rem;
    font-weight: 800;
  }

  .wiki-side-toc__mobile-copy strong {
    overflow: hidden;
    color: var(--color-fg);
    font-size: 0.9rem;
    font-weight: 800;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .wiki-side-toc__scrim {
    position: fixed;
    inset: 0;
    z-index: 10010;
    display: block;
    background: rgba(12, 18, 30, 0.24);
  }

  .wiki-side-toc__panel {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10011;
    display: grid;
    gap: 12px;
    max-height: min(74dvh, 620px);
    padding: 10px 16px calc(16px + env(safe-area-inset-bottom));
    border: 1px solid color-mix(in srgb, var(--color-border) 72%, transparent);
    border-bottom: 0;
    border-radius: 18px 18px 0 0;
    background: var(--color-surface);
    box-shadow: 0 -18px 54px rgba(15, 23, 42, 0.2);
    overscroll-behavior: contain;
    transform: translateY(calc(100% + 16px));
    transition: transform var(--motion-240) ease;
  }

  .wiki-side-toc.is-open .wiki-side-toc__panel {
    transform: translateY(0);
  }

  .wiki-side-toc__grabber {
    display: block;
    justify-self: center;
    width: 42px;
    height: 20px;
    border-radius: var(--radius-pill);
    cursor: grab;
    touch-action: none;
  }

  .wiki-side-toc__grabber::before {
    content: '';
    display: block;
    width: 42px;
    height: 4px;
    margin-top: 4px;
    border-radius: var(--radius-pill);
    background: color-mix(in srgb, var(--color-text-weak) 28%, transparent);
  }

  .wiki-side-toc__grabber:active {
    cursor: grabbing;
  }

  .wiki-side-toc__head {
    padding: 2px 2px 10px;
  }

  .wiki-side-toc__list {
    display: grid;
    max-height: calc(min(74dvh, 620px) - 112px);
    overflow: auto;
    padding-right: 2px;
    overscroll-behavior: contain;
  }

  .wiki-side-toc__toggle {
    display: inline-flex;
    min-height: 40px;
    padding: 0 4px 0 10px;
  }

  .wiki-side-toc__item {
    --toc-indent: 0px !important;
  }

  .wiki-side-toc__list a {
    min-height: 44px;
    padding: 11px 12px;
    border-radius: var(--radius-8);
    font-size: 0.95rem;
  }
}
</style>
