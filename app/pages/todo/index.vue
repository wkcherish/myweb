<script setup lang="ts">
import TodoBoard from '~/components/todo/TodoBoard.vue'
import TodoOverview from '~/components/todo/TodoOverview.vue'
import BasePanel from '~/components/ui/BasePanel.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import ErrorState from '~/components/ui/ErrorState.vue'
import PageHero from '~/components/ui/PageHero.vue'
import type { ContentEntry } from '~/utils/content'

type TodoStatus = 'planned' | 'in-progress' | 'done' | 'paused'

const { data: todosResult } = await useAsyncData('todo-list', async () => {
  try {
    const entries = (await queryCollection('todo').all()) as ContentEntry[]

    return toContentResult(sortEntriesByDate(filterPublishedEntries(entries), ['targetDate', 'startDate', 'date']))
  } catch (error) {
    return toContentResult<ContentEntry>([], error)
  }
})

const todos = computed(() => todosResult.value?.data || [])

const getStatus = (todo: ContentEntry) => (readContentString(todo, 'status') || 'planned') as TodoStatus

const emptyGroups = (): Record<TodoStatus, ContentEntry[]> => ({
  planned: [],
  'in-progress': [],
  done: [],
  paused: [],
})

const groupedTodos = computed(() => {
  const groups = emptyGroups()

  for (const todo of todos.value) {
    groups[getStatus(todo)].push(todo)
  }

  return groups
})

const counts = computed(() => {
  const groups = emptyGroups()

  for (const todo of todos.value) {
    groups[getStatus(todo)].push(todo)
  }

  return {
    planned: groups.planned.length,
    'in-progress': groups['in-progress'].length,
    done: groups.done.length,
    paused: groups.paused.length,
  }
})

</script>

<template>
  <section class="content-page">
    <PageHero eyebrow="Todo" title="规划看板" description="追踪学习计划和项目进度。" accent="#b16a11" />

    <BasePanel v-if="todosResult?.error">
      <ErrorState title="Todo 读取失败" :description="todosResult.error" />
    </BasePanel>

    <template v-else-if="todos.length">
      <TodoOverview :counts="counts" :total="todos.length" />
      <TodoBoard :groups="groupedTodos" />
    </template>

    <BasePanel v-else-if="todosResult?.isEmpty">
      <EmptyState title="暂无任务条目" description="请在本地 content/todo/ 添加 Markdown 后重新预览。" />
    </BasePanel>
  </section>
</template>

<style scoped>
.content-page {
  display: grid;
  gap: var(--space-16);
}
</style>
