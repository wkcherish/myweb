<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { AlertCircle, ChevronDown, Disc3, GripHorizontal, Loader2, RefreshCw, X } from 'lucide-vue-next'

import { musicConfig } from '~/config/music'
import { useMusicPlayer, type MusicPlaybackState } from '~/composables/useMusicPlayer'

import MiniMusicPlayer from './MiniMusicPlayer.vue'

type UtilityKey = 'ai' | 'music' | 'settings'

interface FloatingPosition {
  x: number | null
  y: number | null
}

interface FiniteFloatingPosition {
  x: number
  y: number
}

interface APlayerTrack {
  name?: string
  title?: string
  artist?: unknown
}

interface APlayerListLike {
  index?: number
  audios?: APlayerTrack[]
  switch?: (index: number) => void
}

interface APlayerLike {
  audio?: HTMLAudioElement
  list?: APlayerListLike
  on?: (event: string, callback: (...args: unknown[]) => void) => void
  off?: (event: string, callback: (...args: unknown[]) => void) => void
  pause?: () => void
  play?: () => Promise<void> | void
  toggle?: () => void
  skipForward?: () => void
}

interface MetingElement extends HTMLElement {
  aplayer?: APlayerLike
}

const PANEL_POSITION_STORAGE_KEY = 'notebook:music-panel-position'
const TRACK_WARNING_DURATION = 2600
const DRAG_EDGE_MARGIN = 8
const DRAG_TOP_MARGIN = 70

const {
  clearError,
  close,
  collapse,
  currentTrackTitle,
  errorMessage,
  expand,
  isErrored,
  isExpanded,
  isMusicActive,
  isOpen,
  open,
  playbackState,
  setCurrentTrackTitle,
  setError,
  setPlaybackState,
  syncMusicPlayerFromStorage,
} = useMusicPlayer()

const panelRef = ref<HTMLElement | null>(null)
const panelHeaderRef = ref<HTMLElement | null>(null)
const miniWrapperRef = ref<HTMLElement | null>(null)
const metingRef = ref<MetingElement | null>(null)
const metingRenderKey = ref(0)
const hasInitializedMeting = ref(false)
const isBindingPlayer = ref(false)
const isDragging = ref(false)
const panelPosition = ref<FloatingPosition>({ x: null, y: null })
const trackWarningMessage = ref('')
const dragState = ref({
  pointerId: -1,
  startX: 0,
  startY: 0,
  originX: 0,
  originY: 0,
})

let bindTimer: ReturnType<typeof setInterval> | null = null
let trackWarningTimer: ReturnType<typeof setTimeout> | null = null
let boundPlayer: APlayerLike | null = null
let boundEvents: Array<{ event: string; handler: (...args: unknown[]) => void }> = []
let shouldResumeAfterTrackSwitch = false

const stateTextMap: Record<MusicPlaybackState, string> = {
  idle: '等待播放',
  loading: '正在加载歌曲',
  paused: '已暂停',
  playing: '播放中',
  error: '加载失败',
}

const statusText = computed(() => stateTextMap[playbackState.value] ?? stateTextMap.idle)
const panelStyle = computed(() => {
  if (typeof panelPosition.value.x !== 'number' || typeof panelPosition.value.y !== 'number') {
    return {}
  }

  return {
    left: `${panelPosition.value.x}px`,
    top: `${panelPosition.value.y}px`,
    right: 'auto',
    bottom: 'auto',
    transform: 'none',
  }
})
const metingApi = computed(() => {
  const apiTemplate = musicConfig.api.trim()

  if (apiTemplate.includes(':server') && apiTemplate.includes(':type') && apiTemplate.includes(':id')) {
    return apiTemplate
  }

  return 'https://api.injahow.cn/meting/?server=:server&type=:type&id=:id&r=:r'
})

function handleOpenUtility(event: Event) {
  const detail = (event as CustomEvent<UtilityKey>).detail

  if (detail !== 'music') {
    return
  }

  open()
  expand()
  queuePanelPositionNormalization()
  bootMetingPlayer()
}

function handleClose() {
  pausePlaybackIfPossible()
  clearTrackWarning()
  close()
}

function handleRetry() {
  clearError()
  clearTrackWarning()
  shouldResumeAfterTrackSwitch = false
  setPlaybackState('loading')
  hasInitializedMeting.value = true
  metingRenderKey.value += 1
  detachPlayerListeners()
  void nextTick(() => {
    beginBindingLoop()
  })
}

function handleTogglePlayback() {
  clearTrackWarning()

  if (boundPlayer?.toggle) {
    boundPlayer.toggle()
    return
  }

  if (!boundPlayer?.audio) {
    if (!hasInitializedMeting.value) {
      bootMetingPlayer()
      notifyTrackWarning('播放器正在初始化，请稍候再试。')
      return
    }

    notifyTrackWarning('播放器尚未就绪，请稍后再试。')
    return
  }

  if (boundPlayer.audio.paused) {
    if (boundPlayer.play) {
      void boundPlayer.play()
      return
    }

    void boundPlayer.audio.play()
    return
  }

  pausePlaybackIfPossible()
}

function handleNextTrack() {
  clearTrackWarning()

  if (playNextTrack()) {
    return
  }

  notifyTrackWarning('暂无下一首可播放歌曲。')
}

function handlePrevTrack() {
  clearTrackWarning()

  if (playPrevTrack()) {
    return
  }

  notifyTrackWarning('暂无上一首可播放歌曲。')
}

function handleHeaderPointerDown(event: PointerEvent) {
  if (!panelRef.value) {
    return
  }

  const target = event.target as HTMLElement

  if (target.closest('button')) {
    return
  }

  const rect = panelRef.value.getBoundingClientRect()
  dragState.value = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    originX: rect.left,
    originY: rect.top,
  }
  isDragging.value = false
  panelHeaderRef.value?.setPointerCapture(event.pointerId)
}

function handleHeaderPointerMove(event: PointerEvent) {
  if (dragState.value.pointerId !== event.pointerId || !panelRef.value) {
    return
  }

  const deltaX = event.clientX - dragState.value.startX
  const deltaY = event.clientY - dragState.value.startY

  if (Math.abs(deltaX) + Math.abs(deltaY) > 3) {
    isDragging.value = true
  }

  const rect = panelRef.value.getBoundingClientRect()
  const width = rect.width
  const height = rect.height
  const maxX = Math.max(DRAG_EDGE_MARGIN, window.innerWidth - width - DRAG_EDGE_MARGIN)
  const maxY = Math.max(DRAG_TOP_MARGIN, window.innerHeight - height - DRAG_EDGE_MARGIN)
  const nextX = clamp(dragState.value.originX + deltaX, DRAG_EDGE_MARGIN, maxX)
  const nextY = clamp(dragState.value.originY + deltaY, DRAG_TOP_MARGIN, maxY)

  panelPosition.value = {
    x: Math.round(nextX),
    y: Math.round(nextY),
  }
}

function handleHeaderPointerUp(event: PointerEvent) {
  if (dragState.value.pointerId !== event.pointerId) {
    return
  }

  panelHeaderRef.value?.releasePointerCapture(event.pointerId)
  dragState.value.pointerId = -1

  if (isDragging.value) {
    persistPanelPosition()
    window.setTimeout(() => {
      isDragging.value = false
    }, 120)
  }
}

function handleMiniPointerDown(event: PointerEvent) {
  if (!miniWrapperRef.value) {
    return
  }

  const target = event.target as HTMLElement

  if (target.closest('button')) {
    return
  }

  const rect = miniWrapperRef.value.getBoundingClientRect()
  dragState.value = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    originX: rect.left,
    originY: rect.top,
  }
  isDragging.value = false

  document.addEventListener('pointermove', handleMiniPointerMove)
  document.addEventListener('pointerup', handleMiniPointerUpCleanup)
  document.addEventListener('pointercancel', handleMiniPointerUpCleanup)
}

function handleMiniPointerMove(event: PointerEvent) {
  if (dragState.value.pointerId !== event.pointerId || !miniWrapperRef.value) {
    return
  }

  const deltaX = event.clientX - dragState.value.startX
  const deltaY = event.clientY - dragState.value.startY

  if (Math.abs(deltaX) + Math.abs(deltaY) > 3) {
    isDragging.value = true
  }

  const rect = miniWrapperRef.value.getBoundingClientRect()
  const width = rect.width
  const height = rect.height
  const maxX = Math.max(DRAG_EDGE_MARGIN, window.innerWidth - width - DRAG_EDGE_MARGIN)
  const maxY = Math.max(DRAG_TOP_MARGIN, window.innerHeight - height - DRAG_EDGE_MARGIN)
  const nextX = clamp(dragState.value.originX + deltaX, DRAG_EDGE_MARGIN, maxX)
  const nextY = clamp(dragState.value.originY + deltaY, DRAG_TOP_MARGIN, maxY)

  panelPosition.value = {
    x: Math.round(nextX),
    y: Math.round(nextY),
  }
}

function handleMiniPointerUpCleanup(event: PointerEvent) {
  if (dragState.value.pointerId !== event.pointerId) {
    return
  }

  document.removeEventListener('pointermove', handleMiniPointerMove)
  document.removeEventListener('pointerup', handleMiniPointerUpCleanup)
  document.removeEventListener('pointercancel', handleMiniPointerUpCleanup)

  dragState.value.pointerId = -1

  if (isDragging.value) {
    persistPanelPosition()
    window.setTimeout(() => {
      isDragging.value = false
    }, 120)
  }
}

function handleMiniClickCapture(event: MouseEvent) {
  if (!isDragging.value) {
    return
  }

  event.preventDefault()
  event.stopPropagation()
}

function bootMetingPlayer() {
  if (!hasInitializedMeting.value) {
    hasInitializedMeting.value = true
    setPlaybackState('loading')
  }

  void nextTick(() => {
    beginBindingLoop()
  })
}

function beginBindingLoop() {
  stopBindingLoop()
  isBindingPlayer.value = true

  let attempts = 0
  bindTimer = window.setInterval(() => {
    attempts += 1

    if (attachMetingPlayer()) {
      stopBindingLoop()
      clearError()

      if (playbackState.value === 'loading') {
        setPlaybackState('paused')
      }

      return
    }

    if (attempts >= 30) {
      stopBindingLoop()

      if (!window.customElements.get('meting-js')) {
        setError('Meting 资源加载失败，请检查网络后重试。')
        return
      }

      setError('歌单加载失败，请重试。')
    }
  }, 260)
}

function stopBindingLoop() {
  if (bindTimer) {
    window.clearInterval(bindTimer)
    bindTimer = null
  }

  isBindingPlayer.value = false
}

function attachMetingPlayer() {
  const instance = metingRef.value?.aplayer

  if (!instance?.on) {
    return false
  }

  if (boundPlayer === instance) {
    syncTrackTitleFromPlayer()
    return true
  }

  detachPlayerListeners()
  boundPlayer = instance

  registerPlayerEvent('loadstart', () => {
    markPendingTrackResume()
    setPlaybackState('loading')
  })

  registerPlayerEvent('play', handlePlayerPlaying)
  registerPlayerEvent('playing', handlePlayerPlaying)

  registerPlayerEvent('pause', () => {
    if (shouldResumeAfterTrackSwitch) {
      return
    }

    if (playbackState.value !== 'error') {
      setPlaybackState('paused')
    }
  })

  registerPlayerEvent('canplay', () => {
    if (shouldResumeAfterTrackSwitch || isAudioPlaying()) {
      shouldResumeAfterTrackSwitch = false
      setPlaybackState('playing')
      return
    }

    if (playbackState.value === 'loading') {
      setPlaybackState('paused')
    }
  })

  registerPlayerEvent('listswitch', () => {
    markPendingTrackResume()
    clearTrackWarning()
    syncTrackTitleFromPlayer()
  })

  registerPlayerEvent('error', () => {
    notifyTrackWarning('当前歌曲受限制，已尝试切到下一首。')

    if (!playNextTrack()) {
      shouldResumeAfterTrackSwitch = false
      setPlaybackState('paused')
    }
  })

  syncTrackTitleFromPlayer()

  return true
}

function registerPlayerEvent(event: string, handler: (...args: unknown[]) => void) {
  if (!boundPlayer?.on) {
    return
  }

  boundPlayer.on(event, handler)
  boundEvents.push({ event, handler })
}

function detachPlayerListeners() {
  if (boundPlayer?.off) {
    for (const { event, handler } of boundEvents) {
      boundPlayer.off(event, handler)
    }
  }

  boundEvents = []
  boundPlayer = null
  shouldResumeAfterTrackSwitch = false
}

function playNextTrack() {
  const shouldResume = shouldKeepPlayingAfterTrackChange()

  if (boundPlayer?.skipForward) {
    shouldResumeAfterTrackSwitch = shouldResume
    boundPlayer.skipForward()
    setPlaybackState('loading')
    resumePlaybackAfterTrackChange(shouldResume)
    return true
  }

  const list = boundPlayer?.list

  if (!list?.switch || !list.audios?.length) {
    return false
  }

  const currentIndex = typeof list.index === 'number' ? list.index : 0
  const nextIndex = (currentIndex + 1) % list.audios.length
  shouldResumeAfterTrackSwitch = shouldResume
  list.switch(nextIndex)
  setPlaybackState('loading')
  resumePlaybackAfterTrackChange(shouldResume)

  return true
}

function playPrevTrack() {
  const shouldResume = shouldKeepPlayingAfterTrackChange()
  const list = boundPlayer?.list

  if (!list?.switch || !list.audios?.length) {
    return false
  }

  const currentIndex = typeof list.index === 'number' ? list.index : 0
  const prevIndex = (currentIndex - 1 + list.audios.length) % list.audios.length
  shouldResumeAfterTrackSwitch = shouldResume
  list.switch(prevIndex)
  setPlaybackState('loading')
  resumePlaybackAfterTrackChange(shouldResume)

  return true
}

function handlePlayerPlaying() {
  shouldResumeAfterTrackSwitch = false
  clearError()
  clearTrackWarning()
  setPlaybackState('playing')
  syncTrackTitleFromPlayer()
}

function markPendingTrackResume() {
  shouldResumeAfterTrackSwitch = shouldResumeAfterTrackSwitch || shouldKeepPlayingAfterTrackChange()
}

function shouldKeepPlayingAfterTrackChange() {
  return isMusicActive.value || playbackState.value === 'playing' || isAudioPlaying()
}

function isAudioPlaying() {
  const audio = boundPlayer?.audio

  return Boolean(audio && !audio.paused && !audio.ended)
}

function resumePlaybackAfterTrackChange(shouldResume: boolean) {
  if (!shouldResume) {
    return
  }

  if (boundPlayer?.play) {
    void boundPlayer.play()
    return
  }

  if (boundPlayer?.audio) {
    void boundPlayer.audio.play()
  }
}

function syncTrackTitleFromPlayer() {
  if (!boundPlayer?.list?.audios?.length) {
    return
  }

  const currentIndex = boundPlayer.list.index ?? 0
  const track = boundPlayer.list.audios[currentIndex]

  if (!track) {
    return
  }

  const title = track.name || track.title || ''
  const artist = formatArtist(track.artist)
  const merged = artist ? `${title} - ${artist}` : title

  if (merged.trim()) {
    setCurrentTrackTitle(merged)
  }
}

function formatArtist(rawArtist: unknown) {
  if (typeof rawArtist === 'string') {
    return rawArtist
  }

  if (Array.isArray(rawArtist)) {
    return rawArtist
      .map((item) => {
        if (typeof item === 'string') {
          return item
        }

        if (item && typeof item === 'object' && 'name' in item) {
          const maybeName = (item as { name?: unknown }).name
          return typeof maybeName === 'string' ? maybeName : ''
        }

        return ''
      })
      .filter(Boolean)
      .join(' / ')
  }

  return ''
}

function pausePlaybackIfPossible() {
  shouldResumeAfterTrackSwitch = false

  if (boundPlayer?.pause) {
    boundPlayer.pause()
    return
  }

  boundPlayer?.audio?.pause()
}

function notifyTrackWarning(message: string) {
  trackWarningMessage.value = message

  if (trackWarningTimer) {
    window.clearTimeout(trackWarningTimer)
  }

  trackWarningTimer = window.setTimeout(() => {
    trackWarningMessage.value = ''
    trackWarningTimer = null
  }, TRACK_WARNING_DURATION)
}

function clearTrackWarning() {
  trackWarningMessage.value = ''

  if (trackWarningTimer) {
    window.clearTimeout(trackWarningTimer)
    trackWarningTimer = null
  }
}

function syncPanelPositionFromStorage() {
  if (!import.meta.client) {
    return
  }

  const rawPosition = localStorage.getItem(PANEL_POSITION_STORAGE_KEY)

  if (!rawPosition) {
    return
  }

  try {
    const parsed = JSON.parse(rawPosition) as FloatingPosition

    if (isFinitePosition(parsed)) {
      panelPosition.value = clampPanelPosition(parsed, getFallbackPlayerBounds())
    }
  } catch {
    localStorage.removeItem(PANEL_POSITION_STORAGE_KEY)
  }
}

function persistPanelPosition() {
  if (!import.meta.client || !isFinitePosition(panelPosition.value)) {
    return
  }

  localStorage.setItem(PANEL_POSITION_STORAGE_KEY, JSON.stringify(panelPosition.value))
}

function queuePanelPositionNormalization() {
  if (!import.meta.client) {
    return
  }

  void nextTick(() => {
    normalizePanelPosition()
  })
}

function normalizePanelPosition() {
  if (!import.meta.client) {
    return
  }

  const currentPosition = panelPosition.value

  if (!isFinitePosition(currentPosition)) {
    return
  }

  const activeElement = isExpanded.value ? panelRef.value : miniWrapperRef.value
  const rect = activeElement?.getBoundingClientRect()
  const fallbackBounds = getFallbackPlayerBounds()
  const nextPosition = clampPanelPosition(currentPosition, {
    width: rect?.width ?? fallbackBounds.width,
    height: rect?.height ?? fallbackBounds.height,
  })

  if (nextPosition.x !== currentPosition.x || nextPosition.y !== currentPosition.y) {
    panelPosition.value = nextPosition
  }
}

function clampPanelPosition(position: FiniteFloatingPosition, bounds: { width: number; height: number }) {
  const maxX = Math.max(DRAG_EDGE_MARGIN, window.innerWidth - bounds.width - DRAG_EDGE_MARGIN)
  const maxY = Math.max(DRAG_TOP_MARGIN, window.innerHeight - bounds.height - DRAG_EDGE_MARGIN)

  return {
    x: Math.round(clamp(position.x, DRAG_EDGE_MARGIN, maxX)),
    y: Math.round(clamp(position.y, DRAG_TOP_MARGIN, maxY)),
  }
}

function getFallbackPlayerBounds() {
  return {
    width: Math.min(372, Math.max(0, window.innerWidth - 24)),
    height: isExpanded.value ? Math.min(420, Math.max(120, window.innerHeight - DRAG_TOP_MARGIN - DRAG_EDGE_MARGIN)) : 120,
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function isFinitePosition(value: FloatingPosition): value is FiniteFloatingPosition {
  return typeof value.x === 'number' && Number.isFinite(value.x) && typeof value.y === 'number' && Number.isFinite(value.y)
}

watch(
  () => isOpen.value,
  (nextOpen) => {
    if (!nextOpen) {
      return
    }

    queuePanelPositionNormalization()
    bootMetingPlayer()
  },
)

watch(
  () => isExpanded.value,
  () => {
    if (isOpen.value) {
      queuePanelPositionNormalization()
    }
  },
)

onMounted(() => {
  syncMusicPlayerFromStorage()
  syncPanelPositionFromStorage()
  window.addEventListener('resize', queuePanelPositionNormalization)
  window.addEventListener('notebook:open-utility', handleOpenUtility)
})

onBeforeUnmount(() => {
  stopBindingLoop()
  clearTrackWarning()
  detachPlayerListeners()
  window.removeEventListener('resize', queuePanelPositionNormalization)
  window.removeEventListener('notebook:open-utility', handleOpenUtility)
  document.removeEventListener('pointermove', handleMiniPointerMove)
  document.removeEventListener('pointerup', handleMiniPointerUpCleanup)
  document.removeEventListener('pointercancel', handleMiniPointerUpCleanup)
})
</script>

<template>
  <aside class="music-player" :class="{ 'is-open': isOpen }" :style="panelStyle" aria-label="移动小电台">
    <template v-if="isOpen">
      <div
        v-if="!isExpanded"
        ref="miniWrapperRef"
        class="music-player__mini-wrapper"
        :class="{ 'is-dragging': isDragging }"
        @click.capture="handleMiniClickCapture"
        @pointerdown="handleMiniPointerDown"
      >
        <MiniMusicPlayer
          :state="playbackState"
          :status-text="statusText"
          :title="currentTrackTitle"
          :warning-message="trackWarningMessage"
          @expand="expand"
          @close="handleClose"
          @prev-track="handlePrevTrack"
          @toggle-playback="handleTogglePlayback"
          @next-track="handleNextTrack"
        />
      </div>

      <section v-show="isExpanded" ref="panelRef" class="music-player__panel">
      <header
        ref="panelHeaderRef"
        class="music-player__header"
        :class="{ 'is-dragging': isDragging }"
        @pointerdown="handleHeaderPointerDown"
        @pointermove="handleHeaderPointerMove"
        @pointerup="handleHeaderPointerUp"
        @pointercancel="handleHeaderPointerUp"
      >
        <div class="music-player__headline">
          <Disc3 :size="16" aria-hidden="true" />
          <p>移动小电台</p>
          <span class="music-player__drag-hint">
            <GripHorizontal :size="14" aria-hidden="true" />
            <span>可拖动</span>
          </span>
        </div>
        <div class="music-player__actions">
          <button type="button" aria-label="收起音乐播放器" @click="collapse">
            <ChevronDown :size="16" aria-hidden="true" />
          </button>
          <button type="button" aria-label="关闭音乐播放器" @click="handleClose">
            <X :size="16" aria-hidden="true" />
          </button>
        </div>
      </header>

      <p class="music-player__status">
        <Loader2 v-if="playbackState === 'loading' || isBindingPlayer" :size="14" class="is-spinning" aria-hidden="true" />
        <span>{{ statusText }}</span>
      </p>

      <p class="music-player__track">
        {{ currentTrackTitle || `歌单：${musicConfig.playlistId}` }}
      </p>

      <p v-if="trackWarningMessage" class="music-player__warning">
        <AlertCircle :size="14" aria-hidden="true" />
        <span>{{ trackWarningMessage }}</span>
      </p>

      <div class="music-player__body">
        <meting-js
          v-if="hasInitializedMeting"
          ref="metingRef"
          :key="metingRenderKey"
          :server="musicConfig.server"
          :type="musicConfig.type"
          :id="musicConfig.playlistId"
          :api="metingApi"
          :autoplay="musicConfig.autoplay ? 'true' : null"
          list-folded="false"
          storage-name="notebook-aplayer"
          theme="#3451d1"
        />
      </div>

      <div v-if="isErrored" class="music-player__error">
        <p>
          <AlertCircle :size="14" aria-hidden="true" />
          <span>{{ errorMessage || '播放器加载失败，请稍后重试。' }}</span>
        </p>
        <button type="button" @click="handleRetry">
          <RefreshCw :size="14" aria-hidden="true" />
          <span>重试加载</span>
        </button>
      </div>
    </section>
    </template>
  </aside>
</template>

<style scoped>
.music-player {
  position: fixed;
  right: max(var(--space-16), env(safe-area-inset-right));
  bottom: calc(max(var(--space-16), env(safe-area-inset-bottom)) + 166px);
  z-index: 34;
  display: grid;
  justify-items: end;
  width: min(360px, calc(100vw - 32px));
  pointer-events: none;
}

.music-player.is-open {
  pointer-events: auto;
}

.music-player__mini-wrapper {
  touch-action: none;
}

.music-player__mini-wrapper.is-dragging {
  cursor: grabbing;
}

.music-player__panel {
  width: 100%;
  padding: var(--space-12);
  border: 1px solid color-mix(in srgb, var(--color-border) 84%, transparent);
  border-radius: 16px;
  background: color-mix(in srgb, var(--color-surface) 90%, transparent);
  box-shadow: var(--shadow-floating);
  backdrop-filter: blur(14px);
}

.music-player__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
  cursor: grab;
  touch-action: none;
}

.music-player__header.is-dragging {
  cursor: grabbing;
}

.music-player__headline {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-fg);
  font-size: 0.86rem;
  font-weight: 700;
}

.music-player__drag-hint {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 7px;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  color: var(--color-text-weak);
  font-size: 0.68rem;
  font-weight: 600;
}

.music-player__actions {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
}

.music-player__actions button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 1px solid color-mix(in srgb, var(--color-border) 76%, transparent);
  border-radius: var(--radius-pill);
  color: var(--color-text-weak);
}

.music-player__status {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  margin-top: var(--space-8);
  color: var(--color-text-weak);
  font-size: 0.78rem;
}

.music-player__track {
  margin-top: var(--space-4);
  overflow: hidden;
  color: var(--color-fg);
  font-size: 0.86rem;
  font-weight: 600;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.music-player__warning {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  margin-top: var(--space-8);
  color: var(--color-warning);
  font-size: 0.76rem;
  line-height: 1.35;
}

.music-player__body {
  margin-top: var(--space-12);
}

.music-player__error {
  margin-top: var(--space-12);
  padding: var(--space-8);
  border: 1px solid color-mix(in srgb, var(--color-warning) 36%, transparent);
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--color-warning) 11%, transparent);
}

.music-player__error p {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-warning);
  font-size: 0.78rem;
}

.music-player__error button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  margin-top: var(--space-8);
  color: var(--color-primary);
  font-size: 0.78rem;
  font-weight: 600;
}

.music-player :deep(.aplayer) {
  border: 1px solid color-mix(in srgb, var(--color-border) 80%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, var(--color-surface) 85%, transparent);
  box-shadow: none;
}

.music-player :deep(.aplayer-body) {
  background: transparent;
}

.music-player :deep(.aplayer-info),
.music-player :deep(.aplayer-list) {
  border-color: color-mix(in srgb, var(--color-border) 72%, transparent);
}

.music-player :deep(.aplayer-list ol li) {
  color: var(--color-fg);
}

.music-player :deep(.aplayer-list ol li.aplayer-list-light) {
  background: color-mix(in srgb, var(--color-primary) 14%, var(--color-surface));
}

.music-player :deep(.aplayer-title),
.music-player :deep(.aplayer-author),
.music-player :deep(.aplayer-time) {
  color: var(--color-fg);
}

.music-player :deep(.aplayer-icon path) {
  fill: var(--color-primary);
}

.is-spinning {
  animation: music-player-spin 1s linear infinite;
}

@keyframes music-player-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 960px) {
  .music-player {
    right: 50%;
    bottom: calc(max(var(--space-12), env(safe-area-inset-bottom)) + 136px);
    width: min(372px, calc(100vw - 24px));
    transform: translateX(50%);
  }

  .music-player__drag-hint {
    display: none;
  }
}
</style>
