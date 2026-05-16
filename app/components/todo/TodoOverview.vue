<script setup lang="ts">
import BaseTag from '~/components/ui/BaseTag.vue'

type TodoStatus = 'planned' | 'in-progress' | 'done' | 'paused'

defineProps<{
  counts: Record<TodoStatus, number>
  total: number
}>()

const labels: Record<TodoStatus, string> = {
  planned: '计划中',
  'in-progress': '进行中',
  done: '已完成',
  paused: '搁置',
}
</script>

<template>
  <section class="todo-overview" aria-label="Todo 概览">
    <div class="todo-overview__main">
      <span>总计</span>
      <strong>{{ total }}</strong>
    </div>

    <div class="todo-overview__grid">
      <div v-for="(label, status) in labels" :key="status" class="todo-overview__item">
        <BaseTag kind="status" :tone="status">{{ label }}</BaseTag>
        <strong>{{ counts[status] }}</strong>
      </div>
    </div>
  </section>
</template>

<style scoped>
.todo-overview {
  display: grid;
  grid-template-columns: minmax(160px, 0.6fr) minmax(0, 2fr);
  gap: var(--space-12);
}

.todo-overview__main,
.todo-overview__item {
  padding: var(--space-16);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--color-surface) 92%, var(--color-bg));
}

.todo-overview__main {
  display: grid;
  align-content: center;
  gap: var(--space-8);
}

.todo-overview__main span {
  color: var(--color-text-weak);
  font-weight: 800;
}

.todo-overview strong {
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  line-height: 1;
}

.todo-overview__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-12);
}

.todo-overview__item {
  display: grid;
  gap: var(--space-12);
}

@media (max-width: 860px) {
  .todo-overview,
  .todo-overview__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 560px) {
  .todo-overview,
  .todo-overview__grid {
    grid-template-columns: 1fr;
  }
}
</style>
