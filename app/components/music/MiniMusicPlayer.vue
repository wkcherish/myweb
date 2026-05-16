<script setup lang="ts">
import { computed } from 'vue'
import { ChevronUp, Music2, PauseCircle, PlayCircle, SkipBack, SkipForward, X } from 'lucide-vue-next'

import type { MusicPlaybackState } from '~/composables/useMusicPlayer'

const props = defineProps<{
  state: MusicPlaybackState
  statusText: string
  title: string
  warningMessage?: string
}>()

defineEmits<{
  close: []
  expand: []
  nextTrack: []
  prevTrack: []
  togglePlayback: []
}>()

const stateClass = computed(() => `is-${props.state}`)
const displayTitle = computed(() => props.title || '等待播放')
const isPlaying = computed(() => props.state === 'playing')
</script>

<template>
  <div class="mini-music-player" :class="stateClass">
    <div class="mini-music-player__main">
      <div
        class="mini-music-player__summary"
        role="button"
        tabindex="0"
        @click="$emit('expand')"
        @keydown.enter="$emit('expand')"
        @keydown.space.prevent="$emit('expand')"
      >
        <span class="mini-music-player__icon" aria-hidden="true">
          <PlayCircle v-if="state === 'playing'" :size="16" />
          <PauseCircle v-else-if="state === 'paused'" :size="16" />
          <Music2 v-else :size="16" />
        </span>
        <span class="mini-music-player__text">
          <span class="mini-music-player__title">{{ displayTitle }}</span>
          <span class="mini-music-player__status">{{ statusText }}</span>
        </span>
        <ChevronUp :size="16" aria-hidden="true" />
      </div>

      <div class="mini-music-player__controls">
        <button
          class="mini-music-player__control"
          type="button"
          aria-label="上一首"
          title="上一首"
          @click.stop="$emit('prevTrack')"
        >
          <SkipBack :size="16" aria-hidden="true" />
        </button>
        <button
          class="mini-music-player__control"
          type="button"
          :aria-label="isPlaying ? '暂停播放' : '开始播放'"
          :title="isPlaying ? '暂停播放' : '开始播放'"
          :disabled="state === 'loading'"
          @click.stop="$emit('togglePlayback')"
        >
          <PauseCircle v-if="isPlaying" :size="16" aria-hidden="true" />
          <PlayCircle v-else :size="16" aria-hidden="true" />
        </button>
        <button class="mini-music-player__control" type="button" aria-label="下一首" title="下一首" @click.stop="$emit('nextTrack')">
          <SkipForward :size="16" aria-hidden="true" />
        </button>
        <button class="mini-music-player__close" type="button" aria-label="关闭音乐播放器" @click.stop="$emit('close')">
          <X :size="14" aria-hidden="true" />
        </button>
      </div>
    </div>
    <p v-if="warningMessage" class="mini-music-player__warning">{{ warningMessage }}</p>
  </div>
</template>

<style scoped>
.mini-music-player {
  display: grid;
  gap: var(--space-6);
  width: min(332px, calc(100vw - 32px));
  min-height: 58px;
  padding: var(--space-8);
  border: 1px solid color-mix(in srgb, var(--color-border) 86%, transparent);
  border-radius: 16px;
  background: color-mix(in srgb, var(--color-surface) 88%, transparent);
  box-shadow: var(--shadow-floating);
  backdrop-filter: blur(14px);
}

.mini-music-player__main {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.mini-music-player__summary {
  display: flex;
  flex: 1;
  align-items: center;
  gap: var(--space-8);
  min-width: 0;
  text-align: left;
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.mini-music-player__controls {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.mini-music-player__icon {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--color-primary) 16%, var(--color-surface));
  color: var(--color-primary);
}

.mini-music-player__text {
  display: grid;
  min-width: 0;
}

.mini-music-player__title {
  overflow: hidden;
  color: var(--color-fg);
  font-size: 0.84rem;
  font-weight: 600;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mini-music-player__status {
  color: var(--color-text-weak);
  font-size: 0.74rem;
  line-height: 1.35;
}

.mini-music-player__control,
.mini-music-player__close {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 1px solid color-mix(in srgb, var(--color-border) 76%, transparent);
  border-radius: var(--radius-pill);
  color: var(--color-text-weak);
}

.mini-music-player__control:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.mini-music-player__warning {
  margin: 0;
  color: var(--color-warning);
  font-size: 0.72rem;
  line-height: 1.35;
}

.mini-music-player.is-playing .mini-music-player__icon {
  animation: mini-music-pulse 760ms ease-in-out infinite;
}

@keyframes mini-music-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}

@media (max-width: 768px) {
  .mini-music-player {
    width: min(360px, calc(100vw - 24px));
  }
}
</style>
