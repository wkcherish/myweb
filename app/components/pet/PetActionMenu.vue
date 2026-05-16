<script setup lang="ts">
import type { Component } from 'vue'

import { Bot, EyeOff, Music2, Palette, RotateCcw, Settings2, Sparkles, ArrowUp } from 'lucide-vue-next'

type PetActionKey = 'ai' | 'music' | 'background' | 'settings' | 'top' | 'hide' | 'reset'

interface PetAction {
  key: PetActionKey
  label: string
  icon: Component
}

const emit = defineEmits<{
  select: [key: PetActionKey]
}>()

const actions: PetAction[] = [
  { key: 'ai', label: 'AI 问答', icon: Bot },
  { key: 'music', label: '音乐播放', icon: Music2 },
  { key: 'background', label: '换个背景', icon: Palette },
  { key: 'settings', label: '站点设置', icon: Settings2 },
  { key: 'top', label: '回到顶部', icon: ArrowUp },
  { key: 'reset', label: '复位小狗', icon: RotateCcw },
  { key: 'hide', label: '隐藏小狗', icon: EyeOff },
]
</script>

<template>
  <div class="pet-action-menu" role="menu" aria-label="小狗快捷菜单">
    <button
      v-for="action in actions"
      :key="action.key"
      class="pet-action-menu__item"
      type="button"
      role="menuitem"
      @click="emit('select', action.key)"
    >
      <component :is="action.icon" class="pet-action-menu__icon" aria-hidden="true" />
      <span>{{ action.label }}</span>
      <Sparkles v-if="action.key === 'background'" class="pet-action-menu__hint" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
.pet-action-menu {
  display: grid;
  gap: var(--space-4);
  width: 190px;
  padding: var(--space-8);
  border: 1px solid color-mix(in srgb, var(--color-border) 84%, transparent);
  border-radius: var(--radius-12);
  background: color-mix(in srgb, var(--color-surface) 92%, transparent);
  box-shadow: var(--shadow-floating);
  backdrop-filter: blur(14px);
}

.pet-action-menu__item {
  display: grid;
  grid-template-columns: 18px 1fr 14px;
  align-items: center;
  gap: var(--space-8);
  min-height: 38px;
  padding: var(--space-8);
  border-radius: var(--radius-8);
  color: var(--color-fg);
  font-size: 0.86rem;
  text-align: left;
  transition:
    background var(--motion-180) ease,
    color var(--motion-180) ease;
}

.pet-action-menu__item:hover,
.pet-action-menu__item:focus-visible {
  background: color-mix(in srgb, var(--color-primary) 11%, var(--color-surface));
  color: var(--color-primary);
}

.pet-action-menu__icon,
.pet-action-menu__hint {
  width: 1rem;
  height: 1rem;
}

.pet-action-menu__hint {
  color: var(--color-accent);
}

@media (max-width: 768px) {
  .pet-action-menu {
    width: min(240px, calc(100vw - 32px));
  }
}
</style>
