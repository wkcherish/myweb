<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { Component } from 'vue'

import { Bot, Eye, Loader2, Music2, Settings2 } from 'lucide-vue-next'

import { usePetAssistant } from '~/composables/usePetAssistant'

type PetActionKey = 'ai' | 'music' | 'settings'

interface OrbitAction {
  key: PetActionKey
  label: string
  icon: Component
}

const {
  closeMenu,
  hide,
  isHidden,
  isMenuOpen,
  position,
  resetPosition,
  setHovering,
  setPosition,
  show,
  status,
  syncPetAssistantFromStorage,
  toggleMenu,
} = usePetAssistant()

const rootRef = ref<HTMLElement | null>(null)
const didDrag = ref(false)
const hiddenEdge = ref<'left' | 'right' | 'bottom'>('right')
const dragState = ref({
  pointerId: -1,
  startX: 0,
  startY: 0,
  originX: 0,
  originY: 0,
})

const orbitActions: OrbitAction[] = [
  { key: 'music', label: '音乐播放', icon: Music2 },
  { key: 'settings', label: '站点设置', icon: Settings2 },
  { key: 'ai', label: 'AI 问答', icon: Bot },
]

const petStyle = computed(() => {
  if (typeof position.value.x === 'number' && typeof position.value.y === 'number') {
    return {
      left: `${position.value.x}px`,
      top: `${position.value.y}px`,
      right: 'auto',
      bottom: 'auto',
    }
  }

  return {}
})

function handleAction(key: PetActionKey) {
  window.dispatchEvent(new CustomEvent('notebook:open-utility', { detail: key }))
  closeMenu()
}

function handlePointerDown(event: PointerEvent) {
  const target = event.target as HTMLElement

  if (target.closest('.pet-dog__orbit-button')) {
    return
  }

  didDrag.value = false
  const rect = rootRef.value?.getBoundingClientRect()

  if (!rect) {
    return
  }

  dragState.value = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    originX: rect.left,
    originY: rect.top,
  }

  rootRef.value?.setPointerCapture(event.pointerId)
}

function handlePointerMove(event: PointerEvent) {
  if (dragState.value.pointerId !== event.pointerId) {
    return
  }

  const deltaX = event.clientX - dragState.value.startX
  const deltaY = event.clientY - dragState.value.startY

  if (Math.abs(deltaX) + Math.abs(deltaY) > 4) {
    didDrag.value = true
  }

  const rect = rootRef.value?.getBoundingClientRect()
  const width = rect?.width ?? 96
  const height = rect?.height ?? 96
  const nextX = clamp(dragState.value.originX + deltaX, 8, window.innerWidth - width - 8)
  const nextY = clamp(dragState.value.originY + deltaY, 72, window.innerHeight - height - 8)

  setPosition({ x: Math.round(nextX), y: Math.round(nextY) })

  if (touchesViewportEdge(nextX, nextY, width, height)) {
    hiddenEdge.value = getHiddenEdge(nextX, nextY, width, height)
    hide()
    dragState.value.pointerId = -1
  }
}

function handlePointerUp(event: PointerEvent) {
  if (dragState.value.pointerId !== event.pointerId) {
    return
  }

  rootRef.value?.releasePointerCapture(event.pointerId)
  dragState.value.pointerId = -1
}

function handleToggleClick() {
  if (didDrag.value) {
    didDrag.value = false
    return
  }

  toggleMenu()
}

function restorePet() {
  show()

  if (hiddenEdge.value === 'left') {
    setPosition({ x: 16, y: Math.round(window.innerHeight * 0.62) })
    return
  }

  if (hiddenEdge.value === 'bottom') {
    setPosition({ x: Math.round(window.innerWidth - 136), y: Math.round(window.innerHeight - 124) })
    return
  }

  resetPosition()
}

function handleDocumentClick(event: MouseEvent) {
  const target = event.target as Node

  if (rootRef.value?.contains(target)) {
    return
  }

  closeMenu()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeMenu()
  }
}

onMounted(() => {
  syncPetAssistantFromStorage()
  document.addEventListener('click', handleDocumentClick)
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
  window.removeEventListener('keydown', handleKeydown)
})

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function touchesViewportEdge(x: number, y: number, width: number, height: number) {
  return x <= 10 || y + height >= window.innerHeight - 10 || x + width >= window.innerWidth - 10
}

function getHiddenEdge(x: number, y: number, width: number, height: number) {
  if (y + height >= window.innerHeight - 10) {
    return 'bottom'
  }

  return x + width / 2 < window.innerWidth / 2 ? 'left' : 'right'
}
</script>

<template>
  <div v-if="isHidden" class="pet-restore" :class="`is-${hiddenEdge}`">
    <button class="pet-restore__button" type="button" aria-label="显示小狗助手" title="显示小狗助手" @click="restorePet">
      <Eye :size="18" aria-hidden="true" />
    </button>
  </div>

  <aside
    v-else
    ref="rootRef"
    class="pet-dog"
    :class="[`is-${status}`, { 'is-open': isMenuOpen }]"
    :style="petStyle"
    aria-label="小狗宠物助手"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
    @pointercancel="handlePointerUp"
    @mouseenter="setHovering(true)"
    @mouseleave="setHovering(false)"
  >
    <div v-if="isMenuOpen" class="pet-dog__orbit" aria-label="小狗快捷入口">
      <button
        v-for="(action, index) in orbitActions"
        :key="action.key"
        class="pet-dog__orbit-button"
        :class="`is-${action.key}`"
        type="button"
        :aria-label="action.label"
        :title="action.label"
        :style="{ '--orbit-index': index }"
        @pointerdown.stop
        @click.stop="handleAction(action.key)"
      >
        <component :is="action.icon" :size="18" aria-hidden="true" />
      </button>
    </div>

    <button
      class="pet-dog__button"
      type="button"
      :aria-expanded="isMenuOpen"
      aria-label="打开小狗快捷菜单"
      title="拖动小狗，点击打开快捷菜单"
      @click="handleToggleClick"
    >
      <span class="pet-dog__aura" aria-hidden="true" />
      <span class="pet-runner" aria-hidden="true">
        <span class="pet-runner__tail" />
        <span class="pet-runner__body">
          <span class="pet-runner__ruff" />
          <span class="pet-runner__spot" />
        </span>
        <span class="pet-runner__head">
          <span class="pet-runner__ear pet-runner__ear--left" />
          <span class="pet-runner__ear pet-runner__ear--right" />
          <span class="pet-runner__face">
            <span class="pet-runner__eye pet-runner__eye--left" />
            <span class="pet-runner__eye pet-runner__eye--right" />
            <span class="pet-runner__cheek pet-runner__cheek--left" />
            <span class="pet-runner__cheek pet-runner__cheek--right" />
            <span class="pet-runner__muzzle">
              <span class="pet-runner__nose" />
            </span>
          </span>
        </span>
        <span class="pet-runner__leg pet-runner__leg--front" />
        <span class="pet-runner__leg pet-runner__leg--front-back" />
        <span class="pet-runner__leg pet-runner__leg--back" />
        <span class="pet-runner__leg pet-runner__leg--back-back" />
        <span class="pet-runner__shadow" />
      </span>
      <span v-if="status === 'music'" class="pet-dog__badge" aria-hidden="true">
        <Music2 :size="15" />
      </span>
      <span v-if="status === 'thinking'" class="pet-dog__badge is-thinking" aria-hidden="true">
        <Loader2 :size="15" />
      </span>
    </button>
  </aside>
</template>

<style scoped>
.pet-dog {
  position: fixed;
  right: max(var(--space-24), env(safe-area-inset-right));
  bottom: calc(max(var(--space-24), env(safe-area-inset-bottom)) + 76px);
  z-index: 42;
  display: grid;
  justify-items: end;
  gap: var(--space-8);
  touch-action: none;
  user-select: none;
}

.pet-dog__orbit {
  position: absolute;
  inset: -54px -18px auto auto;
  width: 154px;
  height: 130px;
  pointer-events: none;
}

.pet-dog__orbit-button {
  position: absolute;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border: 1px solid color-mix(in srgb, var(--color-border) 78%, transparent);
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--color-surface) 94%, transparent);
  color: var(--color-primary);
  box-shadow: var(--shadow-medium);
  backdrop-filter: blur(12px);
  pointer-events: auto;
  animation: pet-orbit-in 220ms ease both;
  animation-delay: calc(var(--orbit-index) * 36ms);
  transition:
    transform var(--motion-180) ease,
    background var(--motion-180) ease,
    color var(--motion-180) ease;
}

.pet-dog__orbit-button:hover {
  background: var(--color-primary);
  color: #ffffff;
  transform: translateY(-2px) scale(1.04);
}

.pet-dog__orbit-button.is-music {
  right: 76px;
  top: 18px;
}

.pet-dog__orbit-button.is-settings {
  right: 28px;
  top: -2px;
}

.pet-dog__orbit-button.is-ai {
  right: -10px;
  top: 38px;
}

.pet-dog__button {
  position: relative;
  width: 126px;
  height: 96px;
  border-radius: 32px;
  filter: drop-shadow(0 16px 24px rgba(20, 28, 44, 0.16));
  transition:
    transform var(--motion-180) ease,
    filter var(--motion-180) ease;
}

.pet-dog__button:hover,
.pet-dog.is-open .pet-dog__button {
  transform: translateY(-3px);
  filter: drop-shadow(0 18px 28px rgba(20, 28, 44, 0.24));
}

.pet-dog__aura {
  position: absolute;
  inset: 16px 10px 2px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 38% 14%, rgba(255, 255, 255, 0.8), transparent 30%),
    radial-gradient(circle at 66% 75%, rgba(69, 192, 159, 0.18), transparent 44%);
  opacity: 0.78;
}

.pet-runner {
  position: absolute;
  left: 11px;
  bottom: 8px;
  width: 104px;
  height: 76px;
  animation: pet-run-bob 520ms ease-in-out infinite;
}

.pet-runner__body {
  position: absolute;
  left: 33px;
  bottom: 18px;
  width: 56px;
  height: 38px;
  border: 2px solid rgba(84, 56, 34, 0.16);
  border-radius: 31px 27px 25px 25px;
  background:
    radial-gradient(circle at 24% 26%, #fffdf7 0 17px, transparent 18px),
    radial-gradient(circle at 72% 30%, #ef9c45 0 23px, transparent 24px),
    linear-gradient(150deg, #fff8e9 0%, #f3a24c 74%);
  box-shadow:
    inset 0 6px 10px rgba(255, 255, 255, 0.44),
    inset 0 -7px 12px rgba(146, 82, 32, 0.13);
}

.pet-runner__ruff {
  position: absolute;
  left: 0;
  top: 8px;
  width: 19px;
  height: 25px;
  border-radius: 60% 32% 50% 45%;
  background: #fffdf7;
}

.pet-runner__spot {
  position: absolute;
  right: 4px;
  top: 4px;
  width: 22px;
  height: 23px;
  border-radius: 52% 48% 48% 50%;
  background: #38302a;
}

.pet-runner__head {
  position: absolute;
  left: 4px;
  bottom: 25px;
  width: 48px;
  height: 45px;
  border: 2px solid rgba(84, 56, 34, 0.14);
  border-radius: 50% 48% 46% 46%;
  background:
    radial-gradient(circle at 34% 54%, #fffdf7 0 21px, transparent 22px),
    linear-gradient(140deg, #f4a24b 0%, #e38a36 58%, #38302a 59%);
  box-shadow: inset 0 5px 8px rgba(255, 255, 255, 0.35);
}

.pet-runner__ear {
  position: absolute;
  top: -11px;
  width: 19px;
  height: 28px;
  border: 2px solid rgba(67, 45, 30, 0.14);
  transform-origin: bottom center;
}

.pet-runner__ear--left {
  left: 4px;
  border-radius: 14px 7px 15px 8px;
  background: #f0a14b;
  transform: rotate(-24deg);
}

.pet-runner__ear--right {
  right: 2px;
  border-radius: 7px 14px 8px 15px;
  background: #38302a;
  transform: rotate(30deg);
}

.pet-runner__face {
  position: absolute;
  inset: 0;
}

.pet-runner__eye {
  position: absolute;
  top: 18px;
  width: 5px;
  height: 7px;
  border-radius: var(--radius-pill);
  background: #241c18;
  box-shadow:
    inset 1px 1px 0 rgba(255, 255, 255, 0.72),
    0 0 0 2px rgba(255, 255, 255, 0.08);
}

.pet-runner__eye--left {
  left: 15px;
}

.pet-runner__eye--right {
  right: 12px;
}

.pet-runner__cheek {
  position: absolute;
  top: 28px;
  width: 6px;
  height: 4px;
  border-radius: var(--radius-pill);
  background: rgba(238, 143, 130, 0.42);
}

.pet-runner__cheek--left {
  left: 10px;
}

.pet-runner__cheek--right {
  right: 8px;
}

.pet-runner__muzzle {
  position: absolute;
  left: 50%;
  bottom: 4px;
  width: 24px;
  height: 15px;
  border-radius: 48% 48% 46% 46%;
  background: #fff2dc;
  transform: translateX(-50%);
}

.pet-runner__nose {
  position: absolute;
  left: 50%;
  top: 3px;
  width: 7px;
  height: 5px;
  border-radius: 55% 55% 48% 48%;
  background: #241c18;
  transform: translateX(-50%);
}

.pet-runner__muzzle::after {
  position: absolute;
  left: 50%;
  bottom: 4px;
  width: 11px;
  height: 4px;
  border-bottom: 2px solid rgba(43, 33, 28, 0.72);
  border-radius: 0 0 999px 999px;
  content: '';
  transform: translateX(-50%);
}

.pet-runner__tail {
  position: absolute;
  right: 4px;
  bottom: 39px;
  width: 28px;
  height: 13px;
  border: 4px solid #f0a14b;
  border-left: 0;
  border-radius: 0 999px 999px 0;
  transform-origin: left center;
  animation: pet-tail-run 360ms ease-in-out infinite;
}

.pet-runner__leg {
  position: absolute;
  bottom: 11px;
  width: 9px;
  height: 23px;
  border-radius: 999px;
  background: #fffdf7;
  transform-origin: top center;
  animation: pet-leg-front 520ms ease-in-out infinite;
}

.pet-runner__leg::after {
  position: absolute;
  left: -4px;
  bottom: -2px;
  width: 16px;
  height: 7px;
  border-radius: 999px;
  background: #fff9ee;
  content: '';
}

.pet-runner__leg--front {
  left: 36px;
}

.pet-runner__leg--front-back {
  left: 46px;
  background: #f0a14b;
  animation-name: pet-leg-back;
}

.pet-runner__leg--back {
  right: 24px;
  background: #f0a14b;
  animation-name: pet-leg-back;
}

.pet-runner__leg--back-back {
  right: 13px;
  background: #342c26;
}

.pet-runner__shadow {
  position: absolute;
  left: 23px;
  bottom: 5px;
  width: 74px;
  height: 10px;
  border-radius: 50%;
  background: rgba(19, 28, 44, 0.12);
}

.pet-dog__badge {
  position: absolute;
  right: 8px;
  top: 6px;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 1px solid color-mix(in srgb, var(--color-border) 76%, transparent);
  border-radius: var(--radius-pill);
  background: var(--color-surface);
  color: var(--color-primary);
  box-shadow: var(--shadow-soft);
}

.pet-dog__badge.is-thinking svg {
  animation: pet-spin 900ms linear infinite;
}

.pet-restore {
  position: fixed;
  right: max(var(--space-16), env(safe-area-inset-right));
  bottom: calc(max(var(--space-16), env(safe-area-inset-bottom)) + 76px);
  z-index: 42;
}

.pet-restore__button {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--color-surface) 92%, transparent);
  color: var(--color-text-weak);
  box-shadow: var(--shadow-medium);
  backdrop-filter: blur(10px);
}

.pet-restore.is-left {
  right: auto;
  left: 0;
  bottom: 48%;
}

.pet-restore.is-right {
  right: 0;
}

.pet-restore.is-bottom {
  right: 96px;
  bottom: 0;
}

.pet-dog.is-music .pet-dog__button {
  animation: pet-groove 720ms ease-in-out infinite;
}

.pet-dog.is-thinking .pet-runner__eye {
  animation: pet-blink 900ms ease-in-out infinite;
}

@keyframes pet-groove {
  0%,
  100% {
    transform: translateY(0) rotate(-1deg);
  }

  50% {
    transform: translateY(-3px) rotate(1deg);
  }
}

@keyframes pet-tail {
  0%,
  100% {
    transform: rotate(-8deg);
  }

  50% {
    transform: rotate(16deg);
  }
}

@keyframes pet-tail-run {
  0%,
  100% {
    transform: rotate(-18deg);
  }

  50% {
    transform: rotate(22deg);
  }
}

@keyframes pet-run-bob {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-1px);
  }
}

@keyframes pet-leg-front {
  0%,
  100% {
    transform: rotate(25deg);
  }

  50% {
    transform: rotate(-30deg);
  }
}

@keyframes pet-leg-back {
  0%,
  100% {
    transform: rotate(-24deg);
  }

  50% {
    transform: rotate(28deg);
  }
}

@keyframes pet-orbit-in {
  from {
    opacity: 0;
    transform: translate(18px, 26px) scale(0.78);
  }

  to {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
}

@keyframes pet-blink {
  0%,
  100% {
    transform: scaleY(1);
  }

  45%,
  55% {
    transform: scaleY(0.2);
  }
}

@keyframes pet-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .pet-dog {
    right: max(var(--space-12), env(safe-area-inset-right));
    bottom: calc(max(var(--space-16), env(safe-area-inset-bottom)) + 78px);
  }

  .pet-dog__button {
    width: 104px;
    height: 82px;
  }

  .pet-runner {
    left: 4px;
    bottom: 5px;
    transform: scale(0.86);
    transform-origin: center bottom;
  }

  .pet-dog__orbit {
    right: -14px;
    top: -52px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pet-dog__button,
  .pet-runner,
  .pet-runner__tail,
  .pet-runner__leg,
  .pet-runner__eye,
  .pet-dog__orbit-button,
  .pet-dog__badge svg {
    animation: none !important;
    transition: none !important;
  }
}
</style>
