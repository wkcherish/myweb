<script setup lang="ts">
import TodoItem from '~/components/todo/TodoItem.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import type { ContentEntry } from '~/utils/content'

type TodoStatus = 'planned' | 'in-progress' | 'done' | 'paused'

defineProps<{
  groups: Record<TodoStatus, ContentEntry[]>
}>()

const columns: Array<{ status: TodoStatus; label: string }> = [
  { status: 'planned', label: '计划中' },
  { status: 'in-progress', label: '进行中' },
  { status: 'done', label: '已完成' },
  { status: 'paused', label: '搁置' },
]
</script>

<template>
  <section class="todo-board" aria-label="Todo 看板">
    <div v-for="column in columns" :key="column.status" class="todo-board__column">
      <header class="todo-board__head">
        <strong>{{ column.label }}</strong>
        <span>{{ groups[column.status].length }}</span>
      </header>

      <div v-if="groups[column.status].length" class="todo-board__items">
        <TodoItem v-for="todo in groups[column.status]" :key="todo.path" :todo="todo" />
      </div>

      <EmptyState v-else title="暂无条目" description="该状态下暂时没有规划。" />
    </div>
  </section>
</template>

<style scoped>
.todo-board {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-12);
}

.todo-board__column {
  min-width: 0;
  display: grid;
  align-content: start;
  gap: var(--space-12);
}

.todo-board__head {
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-12);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-8);
  background: var(--color-surface);
}

.todo-board__head span {
  color: var(--color-text-weak);
  font-weight: 800;
}

.todo-board__items {
  display: grid;
  gap: var(--space-12);
}

@media (max-width: 700px) {
  .todo-board {
    grid-template-columns: 1fr;
  }
}
</style>
