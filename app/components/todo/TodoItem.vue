<script setup lang="ts">
import { CalendarClock } from 'lucide-vue-next'

import VisitCount from '~/components/content/VisitCount.vue'
import BaseTag from '~/components/ui/BaseTag.vue'
import type { ContentEntry } from '~/utils/content'

type TodoStatus = 'planned' | 'in-progress' | 'done' | 'paused'
type TodoPriority = 'high' | 'medium' | 'low'

const props = defineProps<{
  todo: ContentEntry
}>()

const status = computed(() => (readContentString(props.todo, 'status') || 'planned') as TodoStatus)
const priority = computed(() => (readContentString(props.todo, 'priority') || 'medium') as TodoPriority)
const targetDate = computed(() => readContentString(props.todo, 'targetDate'))

const statusLabels: Record<TodoStatus, string> = {
  planned: '计划中',
  'in-progress': '进行中',
  done: '已完成',
  paused: '搁置',
}

const priorityLabels: Record<TodoPriority, string> = {
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级',
}
</script>

<template>
  <NuxtLink class="todo-item card-stagger" :to="todo.path || '/todo'">
    <div class="todo-item__meta">
      <BaseTag kind="status" :tone="status">{{ statusLabels[status] }}</BaseTag>
      <BaseTag kind="priority" :tone="priority">{{ priorityLabels[priority] }}</BaseTag>
    </div>

    <div class="todo-item__body">
      <h3>{{ readContentString(todo, 'title') || '未命名 Todo' }}</h3>
      <p>{{ readContentString(todo, 'description') || '暂无摘要。' }}</p>
    </div>

    <div class="todo-item__foot">
      <span>
        <CalendarClock :size="15" aria-hidden="true" />
        {{ targetDate ? formatContentDate(targetDate) : '未设目标日期' }}
      </span>
      <VisitCount :path="todo.path" />
      <time>{{ formatContentDate(getContentDate(todo, ['date'])) }}</time>
    </div>
  </NuxtLink>
</template>

<style scoped>
.todo-item {
  --card-accent: var(--color-warning);
  position: relative;
  min-height: 72px;
  display: grid;
  gap: var(--space-12);
  padding: var(--space-16);
  border: 1px solid color-mix(in srgb, var(--color-border) 88%, transparent);
  border-radius: var(--radius-12);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 96%, transparent), color-mix(in srgb, var(--color-surface) 88%, var(--color-bg)));
  color: var(--color-fg);
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(18, 24, 38, 0.04);
  transition:
    border-color var(--motion-180) ease,
    transform var(--motion-240) cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow var(--motion-240) ease;
}

.todo-item:hover {
  border-color: color-mix(in srgb, var(--card-accent) 36%, var(--color-border));
  transform: translateY(-3px);
  box-shadow:
    0 12px 32px rgba(18, 24, 38, 0.08),
    0 0 0 1px color-mix(in srgb, var(--card-accent) 12%, transparent);
}

.todo-item__meta,
.todo-item__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
}

.todo-item__body {
  display: grid;
  gap: var(--space-8);
}

.todo-item h3 {
  font-size: 1.08rem;
  font-weight: 800;
  transition: color var(--motion-180) ease;
}

.todo-item:hover h3 {
  color: var(--card-accent);
}

.todo-item__foot {
  color: var(--color-text-weak);
  font-size: 0.84rem;
  font-weight: 700;
}

.todo-item__foot span {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
}
</style>
