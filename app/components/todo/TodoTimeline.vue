<script setup lang="ts">
import type { ContentEntry } from '~/utils/content'

defineProps<{
  items: ContentEntry[]
}>()
</script>

<template>
  <section class="todo-timeline" aria-label="Todo 时间线">
    <h2>时间线</h2>
    <ol>
      <li v-for="item in items" :key="item.path">
        <time>{{ formatContentDate(readContentString(item, 'targetDate') || getContentDate(item, ['date'])) }}</time>
        <NuxtLink :to="item.path || '/todo'">
          {{ readContentString(item, 'title') || '未命名 Todo' }}
        </NuxtLink>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.todo-timeline {
  display: grid;
  gap: var(--space-12);
  padding: var(--space-16);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--color-surface) 92%, var(--color-bg));
}

.todo-timeline h2 {
  font-size: 1.05rem;
}

.todo-timeline ol {
  display: grid;
  gap: var(--space-8);
  margin: 0;
  padding: 0;
  list-style: none;
}

.todo-timeline li {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: var(--space-12);
  align-items: baseline;
}

.todo-timeline time {
  color: var(--color-text-weak);
  font-size: 0.84rem;
  font-weight: 800;
}

@media (max-width: 560px) {
  .todo-timeline li {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
}
</style>
