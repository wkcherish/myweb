<script setup lang="ts">
import type { Component } from 'vue'

import { computed, onMounted, ref } from 'vue'
import { Bot, Dog, Music2, Settings2 } from 'lucide-vue-next'

import { useHomeBackground } from '~/composables/useHomeBackground'

import BasePanel from '../ui/BasePanel.vue'
import IconButton from '../ui/IconButton.vue'

type UtilityKey = 'pet' | 'music' | 'settings' | 'ai'

interface UtilityItem {
  key: UtilityKey
  label: string
  icon: Component
}

const activeKey = ref<UtilityKey | null>(null)
const { availableBackgrounds, selectedBackgroundId, setHomeBackground, syncHomeBackgroundFromStorage } =
  useHomeBackground()

const utilityItems: UtilityItem[] = [
  { key: 'pet', label: '小狗助手', icon: Dog },
  { key: 'music', label: '音乐面板', icon: Music2 },
  { key: 'settings', label: '站点设置', icon: Settings2 },
  { key: 'ai', label: 'AI 问答', icon: Bot },
]

const activeLabel = computed(() => utilityItems.find((item) => item.key === activeKey.value)?.label ?? '')

function togglePanel(key: UtilityKey) {
  activeKey.value = activeKey.value === key ? null : key
}

onMounted(() => {
  syncHomeBackgroundFromStorage()
})
</script>

<template>
  <aside class="utility-dock" aria-label="全站快捷入口">
    <BasePanel v-if="activeKey" class="utility-dock__panel" tone="floating">
      <p class="utility-dock__title">{{ activeLabel }}</p>
      <div v-if="activeKey === 'settings'" class="utility-dock__settings">
        <p class="utility-dock__description">首页背景</p>
        <div class="utility-dock__backgrounds">
          <button
            v-for="background in availableBackgrounds"
            :key="background.id"
            class="utility-dock__background"
            :class="{ 'is-active': selectedBackgroundId === background.id }"
            type="button"
            @click="setHomeBackground(background.id)"
          >
            <span
              class="utility-dock__swatch"
              :style="{ backgroundImage: background.path ? `url(${background.path})` : 'none' }"
              aria-hidden="true"
            />
            <span>{{ background.name }}</span>
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
  width: min(320px, calc(100vw - 2 * var(--space-16)));
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

.utility-dock__backgrounds {
  display: grid;
  gap: var(--space-8);
}

.utility-dock__background {
  display: grid;
  grid-template-columns: 42px 1fr;
  align-items: center;
  gap: var(--space-12);
  width: 100%;
  min-height: 48px;
  padding: var(--space-8);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-8);
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
  width: 42px;
  height: 30px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-4);
  background-color: #ffffff;
  background-position: center;
  background-size: cover;
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
}
</style>
