<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { useHomeBackground } from '~/composables/useHomeBackground'
import { useMusicPlayer } from '~/composables/useMusicPlayer'

const isMenuOpen = ref(false)
const isBackgroundPickerOpen = ref(false)
const isCelebrating = ref(false)
const celebrationMessage = ref('完成啦')
const petRoot = ref<HTMLElement | null>(null)
const isPressed = ref(false)
const isHidden = ref(false)
const hiddenEdge = ref<'left' | 'right' | 'bottom'>('right')
const hiddenPosition = ref({ x: 0, y: 80 })
const position = ref({ x: 0, y: 0 })
const hasCustomPosition = ref(false)
const didDrag = ref(false)
const dragState = ref({
  pointerId: -1,
  startX: 0,
  startY: 0,
  originX: 0,
  originY: 0,
})
const restoreDragState = ref({
  pointerId: -1,
  startX: 0,
  startY: 0,
  originX: 0,
  originY: 0,
  didDrag: false,
})
const celebrationParticles = [
  { x: -58, y: -68, rotate: -28, delay: 0, color: '#f472b6' },
  { x: -34, y: -92, rotate: 24, delay: 48, color: '#60a5fa' },
  { x: -6, y: -76, rotate: -16, delay: 84, color: '#fbbf24' },
  { x: 24, y: -98, rotate: 34, delay: 112, color: '#34d399' },
  { x: 46, y: -62, rotate: -38, delay: 150, color: '#fb7185' },
  { x: 10, y: -126, rotate: 18, delay: 190, color: '#a78bfa' },
]
let celebrationTimer: ReturnType<typeof setTimeout> | null = null
const { availableBackgrounds, selectedBackgroundId, setHomeBackground, refreshHomeBackgrounds, syncHomeBackgroundFromStorage } =
  useHomeBackground()
const { isPlaying: isMusicPlaying } = useMusicPlayer()

const petStyle = computed(() => {
  if (!hasCustomPosition.value) {
    return {}
  }

  return {
    left: `${position.value.x}px`,
    top: `${position.value.y}px`,
    right: 'auto',
    bottom: 'auto',
  }
})

const restoreStyle = computed(() => {
  if (hiddenEdge.value === 'left') {
    return {
      left: '0px',
      top: `${hiddenPosition.value.y}px`,
      right: 'auto',
      bottom: 'auto',
    }
  }

  if (hiddenEdge.value === 'bottom') {
    return {
      left: `${hiddenPosition.value.x}px`,
      top: 'auto',
      right: 'auto',
      bottom: '0px',
    }
  }

  return {
    left: 'auto',
    top: `${hiddenPosition.value.y}px`,
    right: '0px',
    bottom: 'auto',
  }
})

function toggleMenu() {
  if (didDrag.value) {
    didDrag.value = false
    return
  }

  isMenuOpen.value = !isMenuOpen.value
  if (!isMenuOpen.value) {
    isBackgroundPickerOpen.value = false
  }
  isPressed.value = true
  window.setTimeout(() => {
    isPressed.value = false
  }, 180)
}

function handleAction(action: 'ai' | 'background' | 'music') {
  if (action === 'background') {
    if (!isBackgroundPickerOpen.value) {
      void refreshHomeBackgrounds()
    }

    isBackgroundPickerOpen.value = !isBackgroundPickerOpen.value
    isMenuOpen.value = true
    return
  }

  window.dispatchEvent(new CustomEvent('notebook:open-utility', { detail: action }))
  isMenuOpen.value = false
  isBackgroundPickerOpen.value = false
}

function selectBackground(id: string) {
  setHomeBackground(id)
}

function triggerCelebration(event?: Event) {
  const detail = (event as CustomEvent<{ message?: string }> | undefined)?.detail

  celebrationMessage.value = detail?.message || '完成啦'
  isCelebrating.value = false

  if (celebrationTimer) {
    window.clearTimeout(celebrationTimer)
  }

  window.requestAnimationFrame(() => {
    isCelebrating.value = true
  })

  celebrationTimer = window.setTimeout(() => {
    isCelebrating.value = false
    celebrationTimer = null
  }, 2200)
}

function handlePointerDown(event: PointerEvent) {
  const target = event.target as HTMLElement

  if (target.closest('.blog-pet__action') || target.closest('.blog-pet__background-panel')) {
    return
  }

  const rect = petRoot.value?.getBoundingClientRect()

  if (!rect) {
    return
  }

  didDrag.value = false
  dragState.value = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    originX: rect.left,
    originY: rect.top,
  }
  petRoot.value?.setPointerCapture(event.pointerId)
}

function handlePointerMove(event: PointerEvent) {
  if (dragState.value.pointerId !== event.pointerId) {
    return
  }

  const deltaX = event.clientX - dragState.value.startX
  const deltaY = event.clientY - dragState.value.startY

  if (Math.abs(deltaX) + Math.abs(deltaY) > 5) {
    didDrag.value = true
    isMenuOpen.value = false
    isBackgroundPickerOpen.value = false
  }

  const rect = petRoot.value?.getBoundingClientRect()
  const width = rect?.width ?? 136
  const height = rect?.height ?? 136
  const nextX = clamp(dragState.value.originX + deltaX, 0, window.innerWidth - width)
  const nextY = clamp(dragState.value.originY + deltaY, 0, window.innerHeight - height)

  hasCustomPosition.value = true
  position.value = { x: Math.round(nextX), y: Math.round(nextY) }

  if (touchesViewportEdge(nextX, nextY, width, height)) {
    hiddenEdge.value = getHiddenEdge(nextX, nextY, width, height)
    hiddenPosition.value = getHiddenPosition(nextX, nextY, width, height, hiddenEdge.value)
    isHidden.value = true
    isMenuOpen.value = false
    isBackgroundPickerOpen.value = false
    dragState.value.pointerId = -1
  }
}

function handlePointerUp(event: PointerEvent) {
  if (dragState.value.pointerId !== event.pointerId) {
    return
  }

  petRoot.value?.releasePointerCapture(event.pointerId)
  dragState.value.pointerId = -1
}

function restorePet() {
  if (restoreDragState.value.didDrag) {
    restoreDragState.value.didDrag = false
    return
  }

  isHidden.value = false
  hasCustomPosition.value = false
  didDrag.value = false
}

function handleRestorePointerDown(event: PointerEvent) {
  restoreDragState.value = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    originX: hiddenPosition.value.x,
    originY: hiddenPosition.value.y,
    didDrag: false,
  }
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

function handleRestorePointerMove(event: PointerEvent) {
  if (restoreDragState.value.pointerId !== event.pointerId) {
    return
  }

  const deltaX = event.clientX - restoreDragState.value.startX
  const deltaY = event.clientY - restoreDragState.value.startY

  if (Math.abs(deltaX) + Math.abs(deltaY) < 8) {
    return
  }

  restoreDragState.value.didDrag = true

  if (event.clientX <= 26 || event.clientX >= window.innerWidth - 26 || event.clientY >= window.innerHeight - 26) {
    hiddenEdge.value = getHiddenEdge(event.clientX - 24, event.clientY - 24, 48, 48)
    hiddenPosition.value = getHiddenPosition(event.clientX - 24, event.clientY - 24, 48, 48, hiddenEdge.value)
    return
  }

  const petWidth = 136
  const petHeight = 136
  isHidden.value = false
  hasCustomPosition.value = true
  didDrag.value = true
  position.value = {
    x: clamp(event.clientX - petWidth / 2, 0, window.innerWidth - petWidth),
    y: clamp(event.clientY - petHeight / 2, 0, window.innerHeight - petHeight),
  }
  dragState.value = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    originX: position.value.x,
    originY: position.value.y,
  }
}

function handleRestorePointerUp(event: PointerEvent) {
  if (restoreDragState.value.pointerId !== event.pointerId) {
    return
  }

  ;(event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId)
  restoreDragState.value.pointerId = -1
}

function handleOutsideClick(event: MouseEvent) {
  if (!petRoot.value?.contains(event.target as Node)) {
    isMenuOpen.value = false
    isBackgroundPickerOpen.value = false
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function touchesViewportEdge(x: number, y: number, width: number, height: number) {
  return x <= 0 || x + width >= window.innerWidth || y + height >= window.innerHeight
}

function getHiddenEdge(x: number, y: number, width: number, height: number) {
  if (y + height >= window.innerHeight) {
    return 'bottom'
  }

  return x + width / 2 < window.innerWidth / 2 ? 'left' : 'right'
}

function getHiddenPosition(x: number, y: number, width: number, height: number, edge: 'left' | 'right' | 'bottom') {
  if (edge === 'bottom') {
    return {
      x: Math.round(clamp(x + width / 2 - 24, 0, window.innerWidth - 48)),
      y: window.innerHeight - 48,
    }
  }

  return {
    x: edge === 'left' ? 0 : window.innerWidth - 48,
    y: Math.round(clamp(y + height / 2 - 24, 0, window.innerHeight - 48)),
  }
}

onMounted(() => {
  syncHomeBackgroundFromStorage()
  document.addEventListener('click', handleOutsideClick)
  window.addEventListener('notebook:pet-celebrate', triggerCelebration)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick)
  window.removeEventListener('notebook:pet-celebrate', triggerCelebration)

  if (celebrationTimer) {
    window.clearTimeout(celebrationTimer)
  }
})
</script>

<template>
  <button
    v-if="isHidden"
    class="blog-pet-restore"
    :class="`is-${hiddenEdge}`"
    :style="restoreStyle"
    type="button"
    aria-label="恢复 AI 宠物助手"
    @click="restorePet"
    @pointerdown="handleRestorePointerDown"
    @pointermove="handleRestorePointerMove"
    @pointerup="handleRestorePointerUp"
    @pointercancel="handleRestorePointerUp"
  >
    <svg viewBox="0 0 42 42" aria-hidden="true">
      <ellipse class="restore-shadow" cx="21" cy="35" rx="13" ry="3" />
      <path class="restore-ear restore-ear--left" d="M13 15c-7-7-12-1-9 7 2 5 6 8 11 8" />
      <path class="restore-ear restore-ear--right" d="M29 15c7-7 12-1 9 7-2 5-6 8-11 8" />
      <path class="restore-face" d="M7 22c0-10 6-17 14-17s14 7 14 17-6 17-14 17S7 32 7 22Z" />
      <path class="restore-mask" d="M14 21c1-7 4-11 7-11s6 4 7 11c1 8-2 14-7 14s-8-6-7-14Z" />
      <g class="restore-eyes">
        <ellipse cx="16.5" cy="22.5" rx="2.4" ry="3" />
        <ellipse cx="25.5" cy="22.5" rx="2.4" ry="3" />
        <circle cx="15.7" cy="21.5" r="0.8" />
        <circle cx="24.7" cy="21.5" r="0.8" />
      </g>
      <circle class="restore-blush" cx="13.5" cy="28" r="2.2" />
      <circle class="restore-blush" cx="28.5" cy="28" r="2.2" />
      <path class="restore-muzzle" d="M17 28c2-3 6-3 8 0 1.5 3-1 6-4 6s-5.5-3-4-6Z" />
      <path class="restore-nose" d="M19 27c1-1.5 3-1.5 4 0 .8 1.2-.4 2.5-2 2.5s-2.8-1.3-2-2.5Z" />
    </svg>
  </button>

  <div
    v-else
    ref="petRoot"
    class="blog-pet"
    :class="{ 'is-open': isMenuOpen, 'is-dragging': didDrag, 'is-celebrating': isCelebrating, 'is-music-playing': isMusicPlaying }"
    :style="petStyle"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
    @pointercancel="handlePointerUp"
    @click.stop="toggleMenu"
  >
    <Transition name="pet-menu">
      <div v-if="isMenuOpen" class="blog-pet__menu" aria-label="宠物快捷菜单">
        <button class="blog-pet__action blog-pet__action--ai" type="button" aria-label="AI 助手" @click.stop="handleAction('ai')">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 9.5h8a3 3 0 0 1 3 3v3.2a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-3.2a3 3 0 0 1 3-3Z" />
            <path d="M12 9.5V6" />
            <path d="M9.2 6h5.6" />
            <circle cx="9.5" cy="14" r="1" />
            <circle cx="14.5" cy="14" r="1" />
            <path d="M10 16.4c1.2.8 2.8.8 4 0" />
            <path d="m19.5 6.5.5-1.5.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5L18 7l1.5-.5Z" />
          </svg>
          <span class="blog-pet__action-label">AI 助手</span>
        </button>

        <button class="blog-pet__action blog-pet__action--background" type="button" aria-label="更换背景" @click.stop="handleAction('background')">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="4" y="5" width="16" height="14" rx="3" />
            <circle cx="9" cy="10" r="1.6" />
            <path d="m5.8 17 4.6-4.7 3.2 3.2 1.9-2.1 2.7 3.6" />
          </svg>
          <span class="blog-pet__action-label">更换背景</span>
        </button>

        <button class="blog-pet__action blog-pet__action--music" type="button" aria-label="音乐" @click.stop="handleAction('music')">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 18.5a2.7 2.7 0 1 1-1.2-2.2V6.4l10-2v11.4a2.7 2.7 0 1 1-1.2-2.2V8.1L9 9.6v8.9Z" />
          </svg>
          <span class="blog-pet__action-label">音乐</span>
        </button>
      </div>
    </Transition>

    <Transition name="pet-panel">
      <section
        v-if="isBackgroundPickerOpen"
        class="blog-pet__background-panel"
        aria-label="更换壁纸列表"
        @click.stop
        @pointerdown.stop
      >
        <p class="blog-pet__background-title">更换壁纸</p>
        <div class="blog-pet__background-list">
          <button
            v-for="background in availableBackgrounds"
            :key="background.id"
            class="blog-pet__background"
            :class="{ 'is-active': selectedBackgroundId === background.id }"
            type="button"
            @click.stop="selectBackground(background.id)"
          >
            <span
              class="blog-pet__background-swatch"
              :style="{ backgroundImage: background.path ? `url(${background.path})` : 'none' }"
              aria-hidden="true"
            />
            <span>{{ background.name }}</span>
          </button>
        </div>
      </section>
    </Transition>

    <div v-if="isCelebrating" class="blog-pet__celebration" aria-live="polite">
      <span class="blog-pet__speech">{{ celebrationMessage }}</span>
      <span class="blog-pet__particles" aria-hidden="true">
        <span
          v-for="particle in celebrationParticles"
          :key="`${particle.x}-${particle.y}`"
          class="blog-pet__particle"
          :style="{
            '--particle-x': `${particle.x}px`,
            '--particle-y': `${particle.y}px`,
            '--particle-rotate': `${particle.rotate}deg`,
            '--particle-delay': `${particle.delay}ms`,
            '--particle-color': particle.color,
          }"
        />
      </span>
    </div>

    <button
      class="blog-pet__button"
      :class="{ 'is-pressed': isPressed }"
      type="button"
      :aria-expanded="isMenuOpen"
      aria-label="打开 AI 宠物助手菜单"
    >
      <svg class="blog-pet__dog" viewBox="0 0 180 170" role="img" aria-label="Q 版边境牧羊犬">
        <defs>
          <linearGradient id="blog-pet-dark-fur" x1="52" y1="24" x2="134" y2="148" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#2d313b" />
            <stop offset="1" stop-color="#101217" />
          </linearGradient>
          <linearGradient id="blog-pet-cream-fur" x1="76" y1="42" x2="102" y2="142" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#fffaf0" />
            <stop offset="1" stop-color="#ffe9ca" />
          </linearGradient>
          <linearGradient id="blog-pet-bandana" x1="74" y1="111" x2="106" y2="135" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#93c5fd" />
            <stop offset="1" stop-color="#2563eb" />
          </linearGradient>
        </defs>
        <ellipse class="dog-shadow" cx="92" cy="150" rx="52" ry="9" />

        <g class="dog-sparkles" aria-hidden="true">
          <path d="M31 44v8M27 48h8" />
          <path d="M150 40v7M146.5 43.5h7" />
          <circle class="dog-sparkle-dot" cx="37" cy="57" r="1.6" />
        </g>

        <g class="dog-tail">
          <path class="dog-tail-base" d="M126 96c24-9 34-26 24-36-7-7-20-2-21 10-1 8 5 13 13 13" />
          <path class="dog-tail-tip" d="M143 83c-8 0-14-5-13-13 1-12 14-17 21-10" />
        </g>

        <g class="dog-body">
          <path class="dog-body-black" d="M47 99c5-26 27-43 58-40 30 3 50 22 48 48-2 29-26 45-60 44-32-1-52-23-46-52Z" />
          <path class="dog-chest" d="M66 91c8 16 17 26 30 33 15-8 24-20 31-35 8 12 11 26 6 39-6 15-20 22-38 21-19-1-31-9-36-24-4-12-1-24 7-34Z" />
          <path class="dog-chest-highlight" d="M78 112c6 8 13 13 21 16" />
          <path class="dog-bandana" d="M72 111c10 8 29 8 40 0l-9 22c-8 5-17 5-25 0Z" />
          <circle class="dog-bandana-knot" cx="92" cy="116" r="4.6" />
          <path class="dog-charm" d="M92 126c-3-4-8-1-5 4l5 5 5-5c3-5-2-8-5-4Z" />
          <path class="dog-paw dog-paw--left" d="M56 134c-9 6-8 17 4 20 12 3 21-2 21-10 0-8-15-15-25-10Z" />
          <path class="dog-paw dog-paw--right" d="M109 142c-1 8 8 13 20 9 10-3 11-14 2-19-10-5-21 2-22 10Z" />
          <path class="dog-toe dog-toe--left" d="M64 146c2 1 5 1 7-1" />
          <path class="dog-toe dog-toe--right" d="M119 146c2 1 5 1 7-1" />
        </g>

        <g class="dog-head">
          <path class="dog-ear dog-ear--left" d="M52 53c-14-21-34-15-34 7 0 19 13 33 29 35 10-11 13-26 5-42Z" />
          <path class="dog-ear dog-ear--right" d="M128 53c14-21 34-15 34 7 0 19-13 33-29 35-10-11-13-26-5-42Z" />
          <path class="dog-ear-inner dog-ear-inner--left" d="M42 58c-8-10-16-7-16 4 0 10 7 18 16 21 5-8 6-16 0-25Z" />
          <path class="dog-ear-inner dog-ear-inner--right" d="M138 58c8-10 16-7 16 4 0 10-7 18-16 21-5-8-6-16 0-25Z" />
          <path class="dog-face-black" d="M38 72c0-34 24-58 54-58s54 24 54 58c0 33-24 58-54 58S38 105 38 72Z" />
          <path class="dog-face-white" d="M58 72c0-22 14-39 34-39s34 17 34 39c0 27-15 48-34 48S58 99 58 72Z" />
          <path class="dog-tuft" d="M81 34c4-8 9-13 15-16-2 8 1 13 8 18" />
          <path class="dog-face-highlight" d="M68 57c7-10 15-15 24-15" />
          <path class="dog-brow dog-brow--left" d="M52 61c8-9 18-12 29-7-8 9-18 13-29 7Z" />
          <path class="dog-brow dog-brow--right" d="M132 61c-8-9-18-12-29-7 8 9 18 13 29 7Z" />
          <g v-if="isMusicPlaying" class="dog-headphones" aria-hidden="true">
            <path class="dog-headphones-band" d="M40 58c4-20 22-32 50-32s46 12 50 32" />
            <path class="dog-headphones-cable" d="M33 70v18" />
            <path class="dog-headphones-cable" d="M147 70v18" />
            <rect class="dog-headphones-earcup" x="24" y="55" width="18" height="28" rx="8" />
            <rect class="dog-headphones-earcup" x="138" y="55" width="18" height="28" rx="8" />
            <rect class="dog-headphones-pad" x="28" y="60" width="10" height="18" rx="4" />
            <rect class="dog-headphones-pad" x="142" y="60" width="10" height="18" rx="4" />
          </g>

          <g class="dog-eyes">
            <g class="dog-eye dog-eye--left">
              <ellipse cx="72" cy="76" rx="10" ry="12" />
              <circle cx="68.5" cy="71.5" r="3.4" />
              <circle cx="74" cy="80" r="1.4" />
            </g>
            <g class="dog-eye dog-eye--right">
              <ellipse cx="112" cy="76" rx="10" ry="12" />
              <circle cx="108.5" cy="71.5" r="3.4" />
              <circle cx="114" cy="80" r="1.4" />
            </g>
          </g>

          <circle class="dog-blush" cx="59" cy="94" r="8" />
          <circle class="dog-blush" cx="125" cy="94" r="8" />
          <path class="dog-muzzle" d="M75 91c5-9 29-9 34 0 4 9-4 21-17 21s-21-12-17-21Z" />
          <path class="dog-nose" d="M84 88c4-6 12-6 16 0 3 5-1 10-8 10s-11-5-8-10Z" />
          <circle class="dog-nose-shine" cx="88.8" cy="89.8" r="1.7" />
          <path class="dog-mouth" d="M92 98c-3 7-9 9-15 5M92 98c3 7 9 9 15 5" />
          <path class="dog-tongue" d="M87 104c2 11 12 11 14 0-4 3-10 3-14 0Z" />
        </g>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.blog-pet {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 9999;
  width: 136px;
  height: 136px;
  touch-action: none;
  user-select: none;
}

.blog-pet__button {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 1;
  width: 136px;
  height: 136px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  filter: drop-shadow(0 16px 24px rgba(15, 23, 42, 0.18));
  animation: pet-float 2400ms ease-in-out infinite;
  transform-origin: center bottom;
}

.blog-pet.is-dragging .blog-pet__button {
  cursor: grabbing;
}

.blog-pet__button.is-pressed {
  animation:
    pet-press 180ms ease,
    pet-float 2400ms ease-in-out infinite;
}

.blog-pet__dog {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.dog-shadow {
  fill: rgba(15, 23, 42, 0.16);
}

.dog-tail {
  transform-box: fill-box;
  transform-origin: 14% 78%;
  animation: tail-wag 620ms ease-in-out infinite;
}

.dog-sparkles {
  fill: none;
  stroke: #fbbf24;
  stroke-width: 2.4;
  stroke-linecap: round;
  opacity: 0.86;
  transform-box: fill-box;
  transform-origin: center;
  animation: sparkle-breathe 2200ms ease-in-out infinite;
}

.dog-sparkle-dot {
  fill: #f59e0b;
  stroke: none;
}

.dog-tail-base {
  fill: none;
  stroke: #15171c;
  stroke-width: 15;
  stroke-linecap: round;
}

.dog-tail-tip {
  fill: none;
  stroke: #fff8ed;
  stroke-width: 8;
  stroke-linecap: round;
}

.dog-body-black,
.dog-face-black,
.dog-ear {
  fill: url('#blog-pet-dark-fur');
}

.dog-ear-inner {
  fill: #f3a7b2;
  opacity: 0.72;
}

.dog-chest,
.dog-face-white,
.dog-paw,
.dog-muzzle {
  fill: url('#blog-pet-cream-fur');
}

.dog-chest-highlight,
.dog-face-highlight,
.dog-tuft {
  fill: none;
  stroke: rgba(255, 255, 255, 0.74);
  stroke-width: 3;
  stroke-linecap: round;
}

.dog-tuft {
  stroke: #fff8ed;
  stroke-width: 4;
}

.dog-bandana {
  fill: url('#blog-pet-bandana');
  stroke: rgba(23, 25, 31, 0.16);
  stroke-width: 1.4;
}

.dog-bandana-knot {
  fill: #2563eb;
}

.dog-charm {
  fill: #f9a8d4;
  stroke: #ffffff;
  stroke-width: 1.2;
  stroke-linejoin: round;
}

.dog-paw {
  stroke: rgba(23, 25, 31, 0.12);
  stroke-width: 2;
}

.dog-toe {
  fill: none;
  stroke: rgba(23, 25, 31, 0.38);
  stroke-width: 2;
  stroke-linecap: round;
}

.dog-ear--left {
  transform-box: fill-box;
  transform-origin: 80% 82%;
  animation: ear-soft-left 2600ms ease-in-out infinite;
}

.dog-ear--right {
  transform-box: fill-box;
  transform-origin: 20% 82%;
  animation: ear-soft-right 2600ms ease-in-out infinite;
}

.dog-head {
  transform-box: fill-box;
  transform-origin: center bottom;
  transition: transform 240ms ease;
}

.blog-pet:hover .dog-head,
.blog-pet.is-open .dog-head {
  transform: rotate(-2.5deg) translateY(-1px);
}

.dog-brow {
  fill: #fff8ed;
  opacity: 0.95;
}

.dog-headphones-band {
  fill: none;
  stroke: #60a5fa;
  stroke-width: 5;
  stroke-linecap: round;
}

.dog-headphones-cable {
  fill: none;
  stroke: #93c5fd;
  stroke-width: 2.6;
  stroke-linecap: round;
}

.dog-headphones-earcup {
  fill: #1e3a8a;
  stroke: #dbeafe;
  stroke-width: 1.8;
}

.dog-headphones-pad {
  fill: #bfdbfe;
  opacity: 0.84;
}

.dog-eyes {
  transform-box: fill-box;
  transform-origin: center;
  animation: blink 5200ms infinite;
}

.dog-eye ellipse {
  fill: #1d1f25;
}

.dog-eye circle {
  fill: #ffffff;
}

.dog-blush {
  fill: #f2a1ac;
  opacity: 0.74;
}

.dog-nose {
  fill: #17191f;
}

.dog-nose-shine {
  fill: #ffffff;
  opacity: 0.68;
}

.dog-mouth {
  fill: none;
  stroke: #17191f;
  stroke-width: 3;
  stroke-linecap: round;
}

.dog-tongue {
  fill: #f27d8d;
}

.blog-pet__menu {
  position: absolute;
  inset: -76px 0 auto auto;
  z-index: 3;
  width: 148px;
  height: 112px;
  pointer-events: none;
}

.blog-pet__action {
  --action-color: #2563eb;
  --action-bg: rgba(255, 255, 255, 0.94);
  --action-hover-bg: #2563eb;

  position: absolute;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 50%;
  background: var(--action-bg);
  color: var(--action-color);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.16);
  cursor: pointer;
  pointer-events: auto;
  transition:
    background 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.blog-pet__action:hover,
.blog-pet__action:focus-visible {
  border-color: transparent;
  background: var(--action-hover-bg);
  color: #ffffff;
  transform: translateY(-3px) scale(1.06);
}

.blog-pet__action svg {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentcolor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.blog-pet__action-label {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 8px);
  min-width: max-content;
  padding: 6px 9px;
  border: 1px solid color-mix(in srgb, var(--action-color) 28%, rgba(255, 255, 255, 0.82));
  border-radius: 999px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.92)),
    var(--action-bg);
  color: var(--action-color);
  font-size: 0.75rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.15);
  opacity: 0;
  pointer-events: none;
  transform: translateX(-50%) translateY(5px) scale(0.94);
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}

.blog-pet__action-label::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -5px;
  width: 9px;
  height: 9px;
  border-right: 1px solid color-mix(in srgb, var(--action-color) 22%, rgba(255, 255, 255, 0.72));
  border-bottom: 1px solid color-mix(in srgb, var(--action-color) 22%, rgba(255, 255, 255, 0.72));
  background: rgba(248, 250, 252, 0.96);
  transform: translateX(-50%) rotate(45deg);
}

.blog-pet__action:hover .blog-pet__action-label,
.blog-pet__action:focus-visible .blog-pet__action-label {
  opacity: 1;
  transform: translateX(-50%) translateY(0) scale(1);
}

.blog-pet__action--ai {
  --action-color: #7c3aed;
  --action-bg: rgba(245, 243, 255, 0.96);
  --action-hover-bg: #7c3aed;

  left: 4px;
  bottom: 4px;
}

.blog-pet__action--background {
  --action-color: #0284c7;
  --action-bg: rgba(240, 249, 255, 0.96);
  --action-hover-bg: #0284c7;

  left: 52px;
  top: 0;
}

.blog-pet__action--music {
  --action-color: #db2777;
  --action-bg: rgba(253, 242, 248, 0.96);
  --action-hover-bg: #db2777;

  right: 4px;
  bottom: 4px;
}

.blog-pet__background-panel {
  position: absolute;
  right: 0;
  bottom: 124px;
  z-index: 4;
  display: grid;
  gap: 12px;
  width: min(268px, calc(100vw - 32px));
  padding: 14px;
  border: 1px solid rgba(148, 163, 184, 0.34);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 20px 44px rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(14px);
}

.blog-pet__background-panel::after {
  content: '';
  position: absolute;
  right: 46px;
  bottom: -7px;
  width: 14px;
  height: 14px;
  border-right: 1px solid rgba(148, 163, 184, 0.28);
  border-bottom: 1px solid rgba(148, 163, 184, 0.28);
  background: rgba(255, 255, 255, 0.94);
  transform: rotate(45deg);
}

.blog-pet__background-title {
  margin: 0;
  color: #111827;
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.35;
}

.blog-pet__background-list {
  display: grid;
  gap: 8px;
}

.blog-pet__background {
  position: relative;
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 52px;
  padding: 8px 34px 8px 8px;
  border: 1px solid rgba(148, 163, 184, 0.36);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.78);
  color: #1f2937;
  font-size: 0.86rem;
  font-weight: 650;
  line-height: 1.3;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 180ms ease,
    background 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.blog-pet__background:hover,
.blog-pet__background:focus-visible {
  border-color: rgba(37, 99, 235, 0.58);
  background: rgba(239, 246, 255, 0.94);
  color: #1d4ed8;
  transform: translateY(-1px);
}

.blog-pet__background.is-active {
  border-color: #2563eb;
  background: rgba(219, 234, 254, 0.9);
  color: #1d4ed8;
}

.blog-pet__background.is-active::after {
  content: '';
  position: absolute;
  right: 12px;
  top: 50%;
  width: 9px;
  height: 5px;
  border-left: 2px solid #2563eb;
  border-bottom: 2px solid #2563eb;
  transform: translateY(-62%) rotate(-45deg);
}

.blog-pet__background-swatch {
  width: 48px;
  height: 34px;
  border: 1px solid rgba(148, 163, 184, 0.42);
  border-radius: 8px;
  background-color: #ffffff;
  background-position: center;
  background-size: cover;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}

.blog-pet__celebration {
  position: absolute;
  right: 10px;
  bottom: 118px;
  z-index: 6;
  display: grid;
  justify-items: end;
  width: 190px;
  pointer-events: none;
}

.blog-pet__speech {
  position: relative;
  padding: 8px 12px;
  border: 1px solid rgba(96, 165, 250, 0.3);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  color: #1d4ed8;
  font-size: 0.84rem;
  font-weight: 800;
  line-height: 1;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.16);
  animation: pet-speech-pop 520ms cubic-bezier(0.2, 1.4, 0.32, 1) both;
}

.blog-pet__speech::after {
  content: '';
  position: absolute;
  right: 24px;
  bottom: -6px;
  width: 10px;
  height: 10px;
  border-right: 1px solid rgba(96, 165, 250, 0.3);
  border-bottom: 1px solid rgba(96, 165, 250, 0.3);
  background: rgba(255, 255, 255, 0.96);
  transform: rotate(45deg);
}

.blog-pet__particles {
  position: absolute;
  right: 56px;
  bottom: -12px;
  width: 1px;
  height: 1px;
}

.blog-pet__particle {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 3px;
  background: var(--particle-color);
  opacity: 0;
  animation: pet-particle-pop 980ms ease-out both;
  animation-delay: var(--particle-delay);
}

.blog-pet.is-celebrating .blog-pet__button {
  animation: pet-celebrate-hop 780ms ease both;
}

.blog-pet.is-celebrating .dog-tail {
  animation: tail-wag 260ms ease-in-out infinite;
}

.blog-pet.is-celebrating .dog-ear--left {
  animation: ear-happy-left 420ms ease-in-out infinite;
}

.blog-pet.is-celebrating .dog-ear--right {
  animation: ear-happy-right 420ms ease-in-out infinite;
}

.blog-pet.is-celebrating .dog-paw--left {
  transform-box: fill-box;
  transform-origin: 84% 42%;
  animation: paw-wave-left 420ms ease-in-out infinite;
}

.blog-pet.is-celebrating .dog-bandana,
.blog-pet.is-celebrating .dog-bandana-knot {
  transform-box: fill-box;
  transform-origin: center;
  animation: bandana-pop 780ms ease both;
}

.blog-pet.is-music-playing .dog-headphones {
  transform-box: fill-box;
  transform-origin: center;
  animation: headphone-bounce 760ms ease-in-out infinite;
}

.pet-menu-enter-active,
.pet-menu-leave-active,
.pet-panel-enter-active,
.pet-panel-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.pet-menu-enter-from,
.pet-menu-leave-to,
.pet-panel-enter-from,
.pet-panel-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.86);
}

@keyframes pet-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

@keyframes pet-press {
  0%,
  100% {
    transform: scale(1);
  }

  45% {
    transform: scale(0.9);
  }
}

@keyframes pet-celebrate-hop {
  0%,
  100% {
    transform: translateY(0) rotate(0deg) scale(1);
  }

  24% {
    transform: translateY(-18px) rotate(-3deg) scale(1.04);
  }

  48% {
    transform: translateY(-6px) rotate(3deg) scale(1.02);
  }

  70% {
    transform: translateY(-12px) rotate(-1deg) scale(1.03);
  }
}

@keyframes pet-speech-pop {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.72);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes pet-particle-pop {
  0% {
    opacity: 0;
    transform: translate(0, 0) rotate(0deg) scale(0.45);
  }

  18% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translate(var(--particle-x), var(--particle-y)) rotate(var(--particle-rotate)) scale(1);
  }
}

@keyframes paw-wave-left {
  0%,
  100% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(-12deg) translateY(-2px);
  }
}

@keyframes bandana-pop {
  0%,
  100% {
    transform: scale(1);
  }

  44% {
    transform: scale(1.08);
  }
}

@keyframes headphone-bounce {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-0.8px);
  }
}

@keyframes tail-wag {
  0%,
  100% {
    transform: rotate(-9deg);
  }

  50% {
    transform: rotate(15deg);
  }
}

@keyframes blink {
  0%,
  46%,
  50%,
  100% {
    transform: scaleY(1);
  }

  48% {
    transform: scaleY(0.08);
  }
}

@keyframes sparkle-breathe {
  0%,
  100% {
    opacity: 0.46;
    transform: scale(0.92);
  }

  50% {
    opacity: 0.92;
    transform: scale(1.05);
  }
}

@keyframes ear-soft-left {
  0%,
  100% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(-3deg);
  }
}

@keyframes ear-soft-right {
  0%,
  100% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(3deg);
  }
}

@keyframes ear-happy-left {
  0%,
  100% {
    transform: rotate(-2deg);
  }

  50% {
    transform: rotate(-8deg);
  }
}

@keyframes ear-happy-right {
  0%,
  100% {
    transform: rotate(2deg);
  }

  50% {
    transform: rotate(8deg);
  }
}

.blog-pet-restore {
  position: fixed;
  z-index: 9999;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 1px solid rgba(148, 163, 184, 0.32);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.94);
  color: #17191f;
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.16);
  cursor: pointer;
  touch-action: none;
  user-select: none;
  backdrop-filter: blur(10px);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
}

.blog-pet-restore:hover {
  transform: scale(1.06);
  box-shadow: 0 18px 34px rgba(15, 23, 42, 0.2);
}

.blog-pet-restore.is-right {
  border-radius: 999px 0 0 999px;
}

.blog-pet-restore.is-left {
  border-radius: 0 999px 999px 0;
}

.blog-pet-restore.is-bottom {
  border-radius: 999px 999px 0 0;
}

.blog-pet-restore svg {
  width: 42px;
  height: 42px;
}

.restore-shadow {
  fill: rgba(15, 23, 42, 0.14);
}

.restore-ear,
.restore-face {
  fill: #17191f;
}

.restore-mask {
  fill: #fff8ed;
}

.restore-eyes ellipse {
  fill: #17191f;
}

.restore-eyes circle {
  fill: #ffffff;
}

.restore-blush {
  fill: #f2a1ac;
  opacity: 0.72;
}

.restore-muzzle {
  fill: #fff0d8;
}

.restore-nose {
  fill: #17191f;
}

.blog-pet-restore path:not(.restore-ear):not(.restore-face):not(.restore-mask):not(.restore-muzzle):not(.restore-nose) {
  stroke: currentcolor;
  stroke-width: 2;
  stroke-linecap: round;
}

@media (prefers-reduced-motion: reduce) {
  .blog-pet__button,
  .dog-head,
  .dog-tail,
  .dog-sparkles,
  .dog-eyes,
  .dog-ear,
  .blog-pet__speech,
  .blog-pet__particle {
    animation: none;
  }

  .blog-pet__action,
  .pet-menu-enter-active,
  .pet-menu-leave-active {
    transition: none;
  }
}
</style>
