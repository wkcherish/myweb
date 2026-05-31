<script setup lang="ts">
import type { Component } from 'vue'

import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Bot, Music2, Settings2 } from 'lucide-vue-next'

import { useHomeBackground } from '~/composables/useHomeBackground'

import BasePanel from '../ui/BasePanel.vue'
import IconButton from '../ui/IconButton.vue'

type UtilityKey = 'music' | 'settings' | 'ai'

interface UtilityItem {
  key: UtilityKey
  label: string
  icon: Component
}

const activeKey = ref<UtilityKey | null>(null)
const { availableBackgrounds, selectedBackground, selectedBackgroundId, setHomeBackground, refreshHomeBackgrounds, syncHomeBackgroundFromStorage } =
  useHomeBackground()

const utilityItems: UtilityItem[] = [
  { key: 'music', label: '音乐面板', icon: Music2 },
  { key: 'settings', label: '站点设置', icon: Settings2 },
  { key: 'ai', label: 'AI 问答', icon: Bot },
]

const activeLabel = computed(() => utilityItems.find((item) => item.key === activeKey.value)?.label ?? '')

function togglePanel(key: UtilityKey) {
  activeKey.value = activeKey.value === key ? null : key

  if (activeKey.value === 'settings') {
    void refreshHomeBackgrounds()
  }
}

function handleOpenUtility(event: Event) {
  const key = (event as CustomEvent<UtilityKey>).detail

  if (utilityItems.some((item) => item.key === key)) {
    activeKey.value = key
  }
}

onMounted(() => {
  syncHomeBackgroundFromStorage()
  window.addEventListener('notebook:open-utility', handleOpenUtility)
})

onBeforeUnmount(() => {
  window.removeEventListener('notebook:open-utility', handleOpenUtility)
})
</script>

<template>
  <aside class="utility-dock" aria-label="全站快捷入口">
    <BasePanel v-if="activeKey" class="utility-dock__panel" tone="floating">
      <p class="utility-dock__title">{{ activeLabel }}</p>
      <div v-if="activeKey === 'settings'" class="utility-dock__settings">
        <p class="utility-dock__description">首页背景</p>
        <section class="utility-dock__preview" aria-label="当前背景预览">
          <span
            class="utility-dock__preview-swatch"
            :class="{ 'is-video': selectedBackground.mediaType === 'video' }"
            aria-hidden="true"
          >
            <img
              v-if="selectedBackground.mediaType === 'image' && selectedBackground.path"
              class="utility-dock__swatch-image"
              :src="selectedBackground.path"
              alt=""
              loading="lazy"
              decoding="async"
            >
          </span>
          <span class="utility-dock__preview-meta">
            <strong>{{ selectedBackground.name }}</strong>
            <span v-if="selectedBackground.mediaType === 'video'" class="utility-dock__type-tag">视频</span>
          </span>
        </section>

        <div class="utility-dock__backgrounds" role="list">
          <button
            v-for="background in availableBackgrounds"
            :key="background.id"
            class="utility-dock__background"
            :class="{ 'is-active': selectedBackgroundId === background.id }"
            type="button"
            role="listitem"
            @click="setHomeBackground(background.id)"
          >
            <span
              class="utility-dock__swatch"
              :class="{ 'is-video': background.mediaType === 'video' }"
              aria-hidden="true"
            >
              <img
                v-if="background.mediaType === 'image' && background.path"
                class="utility-dock__swatch-image"
                :src="background.path"
                alt=""
                loading="lazy"
                decoding="async"
              >
            </span>
            <span class="utility-dock__background-meta">
              <span>{{ background.name }}</span>
              <span v-if="background.mediaType === 'video'" class="utility-dock__type-tag">视频</span>
            </span>
          </button>
        </div>
      </div>
      <p v-else class="utility-dock__description">阶段占位：该模块将在后续阶段接入真实功能。</p>
    </BasePanel>

    <div class="utility-dock__actions">
      <IconButton
        v-for="item in utilityItems"
        :key="item.key"
        :icon="item.icon"
        :label="item.label"
        :tooltip="item.label"
        :variant="activeKey === item.key ? 'primary' : 'secondary'"
        @click="togglePanel(item.key)"
      />
    </div>
  </aside>
</template>

<style scoped>
.utility-dock {
  position: fixed;
  right: var(--space-16);
  bottom: max(var(--space-16), env(safe-area-inset-bottom));
  z-index: 35;
  display: grid;
  justify-items: end;
  gap: var(--space-12);
}

.utility-dock__panel {
  width: min(360px, calc(100vw - 2 * var(--space-16)));
}

.utility-dock__title {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--color-fg);
}

.utility-dock__description {
  margin-top: var(--space-8);
  font-size: 0.82rem;
  line-height: 1.5;
}

.utility-dock__settings {
  display: grid;
  gap: var(--space-12);
}

.utility-dock__preview {
  display: grid;
  gap: var(--space-8);
  padding: 10px;
  border: 1px solid color-mix(in srgb, var(--color-border) 84%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, var(--color-surface) 88%, transparent);
}

.utility-dock__preview-swatch {
  position: relative;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 96%, white 4%), color-mix(in srgb, var(--color-surface-soft) 92%, var(--color-surface)));
}

.utility-dock__preview-meta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  min-width: 0;
  flex-wrap: wrap;
}

.utility-dock__backgrounds {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-8);
  max-height: min(46vh, 360px);
  overflow-y: auto;
  padding-right: 4px;
}

.utility-dock__background {
  display: grid;
  align-content: start;
  gap: var(--space-8);
  width: 100%;
  min-height: 128px;
  padding: var(--space-8);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: color-mix(in srgb, var(--color-surface) 84%, transparent);
  color: var(--color-fg);
  text-align: left;
  cursor: pointer;
}

.utility-dock__background.is-active {
  border-color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 10%, var(--color-surface));
}

.utility-dock__swatch {
  position: relative;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 16 / 10;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 96%, white 4%), color-mix(in srgb, var(--color-surface-soft) 92%, var(--color-surface)));
}

.utility-dock__swatch-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.utility-dock__swatch.is-video,
.utility-dock__preview-swatch.is-video {
  background:
    linear-gradient(135deg, rgba(19, 26, 38, 0.96), rgba(50, 65, 88, 0.82)),
    radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.2), transparent 40%);
}

.utility-dock__swatch.is-video::before,
.utility-dock__preview-swatch.is-video::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-left: 11px solid rgba(255, 255, 255, 0.88);
  transform: translate(-35%, -50%);
}

.utility-dock__background-meta {
  display: grid;
  gap: 4px;
}

.utility-dock__background-meta > span:first-child {
  display: -webkit-box;
  overflow: hidden;
  line-height: 1.3;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.utility-dock__actions {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  padding: var(--space-8);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--color-surface) 90%, transparent);
  box-shadow: var(--shadow-medium);
  backdrop-filter: blur(10px);
}

@media (max-width: 768px) {
  .utility-dock {
    right: 50%;
    transform: translateX(50%);
  }

  .utility-dock__panel {
    width: min(336px, calc(100vw - 20px));
  }

  .utility-dock__backgrounds {
    max-height: min(42vh, 300px);
  }

  .utility-dock__background {
    min-height: 116px;
  }
}
</style>
