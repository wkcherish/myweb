<script setup lang="ts">
import type { Component } from 'vue'

import { computed, ref } from 'vue'
import { Bot, Dog, Music2, Settings2 } from 'lucide-vue-next'

import BasePanel from '../ui/BasePanel.vue'
import IconButton from '../ui/IconButton.vue'

type UtilityKey = 'pet' | 'music' | 'settings' | 'ai'

interface UtilityItem {
  key: UtilityKey
  label: string
  icon: Component
}

const activeKey = ref<UtilityKey | null>(null)

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
</script>

<template>
  <aside class="utility-dock" aria-label="全站快捷入口">
    <BasePanel v-if="activeKey" class="utility-dock__panel" tone="floating">
      <p class="utility-dock__title">{{ activeLabel }}</p>
      <p class="utility-dock__description">阶段占位：该模块将在后续阶段接入真实功能。</p>
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
