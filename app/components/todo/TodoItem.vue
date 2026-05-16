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
  <NuxtLink class="todo-item" :to="todo.path || '/todo'">
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
  min-height: 72px;
  display: grid;
  gap: var(--space-12);
  padding: var(--space-16);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--color-surface) 92%, var(--color-bg));
  color: var(--color-fg);
  text-decoration: none;
}

.todo-item:hover {
  border-color: color-mix(in srgb, var(--color-warning) 40%, var(--color-border));
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
