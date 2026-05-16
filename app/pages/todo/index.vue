<script setup lang="ts">
import BasePanel from '~/components/ui/BasePanel.vue'
import BaseTag from '~/components/ui/BaseTag.vue'
import EmptyState from '~/components/ui/EmptyState.vue'

type TodoEntry = {
  path?: string
  title?: string
  description?: string
  targetDate?: string
  date?: string
  status?: string
  priority?: string
  meta?: Record<string, unknown>
}

const readString = (entry: TodoEntry, key: string) => {
  const directValue = entry[key as keyof TodoEntry]
  const metaValue = entry.meta?.[key]
  const value = directValue || metaValue

  return typeof value === 'string' ? value : ''
}

const getDate = (entry: TodoEntry) => readString(entry, 'targetDate') || readString(entry, 'date')

const formatDate = (date: string) => {
  const parsed = date ? new Date(date) : null

  return parsed && !Number.isNaN(parsed.getTime())
    ? new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(parsed)
    : '未标注日期'
}

const { data: todos } = await useAsyncData('todo-list', async () => {
  const entries = (await queryCollection('todo').all()) as TodoEntry[]

  return entries
    .filter((entry) => !(entry.path || '').toLowerCase().endsWith('/readme'))
    .sort((a, b) => (new Date(getDate(b)).getTime() || 0) - (new Date(getDate(a)).getTime() || 0))
})
</script>

<template>
  <section class="content-page">
    <BasePanel tone="floating">
      <BaseTag>Todo</BaseTag>
      <h1 class="content-page__title">规划看板</h1>
      <p class="content-page__desc">
        Todo 展示内容从 <code>content/todo/</code> 中的 Markdown 文件读取，只做只读展示。
      </p>
    </BasePanel>

    <BasePanel>
      <h2 class="content-page__subtitle">状态说明</h2>
      <div class="todo-tags">
        <BaseTag kind="status" tone="planned">计划中</BaseTag>
        <BaseTag kind="status" tone="in-progress">进行中</BaseTag>
        <BaseTag kind="status" tone="done">已完成</BaseTag>
        <BaseTag kind="status" tone="paused">搁置</BaseTag>
      </div>
      <p class="content-page__hint">当前为只读展示，不提供网页端新增或保存任务。</p>
    </BasePanel>

    <div v-if="todos?.length" class="todo-list">
      <NuxtLink v-for="todo in todos" :key="todo.path" class="todo-card" :to="todo.path || '/todo'">
        <div class="todo-card__meta">
          <span>{{ readString(todo, 'status') || '计划中' }}</span>
          <span>{{ readString(todo, 'priority') || 'normal' }}</span>
          <time>{{ formatDate(getDate(todo)) }}</time>
          <ContentVisitCount :path="todo.path" />
        </div>
        <h2>{{ readString(todo, 'title') || '未命名 Todo' }}</h2>
        <p>{{ readString(todo, 'description') || '暂无摘要。' }}</p>
      </NuxtLink>
    </div>

    <BasePanel v-else>
      <EmptyState title="暂无任务条目" description="请在本地 content/todo/ 补充规划文件。" />
    </BasePanel>
  </section>
</template>

<style scoped>
.content-page {
  display: grid;
  gap: var(--space-16);
}

.content-page__title {
  margin-top: var(--space-12);
  font-size: clamp(1.7rem, 4vw, 2.3rem);
}

.content-page__subtitle {
  font-size: 1.1rem;
}

.content-page__desc {
  margin-top: var(--space-12);
}

.todo-tags {
  margin-top: var(--space-12);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
}

.content-page__hint {
  margin-top: var(--space-12);
}

.todo-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-12);
}

.todo-card {
  min-height: 178px;
  padding: var(--space-24);
  display: grid;
  align-content: space-between;
  gap: var(--space-10, 10px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--color-surface) 88%, var(--color-bg));
  color: var(--color-fg);
  text-decoration: none;
  transition:
    background-color var(--motion-180) ease,
    border-color var(--motion-180) ease,
    transform var(--motion-180) ease;
}

.todo-card:hover {
  border-color: color-mix(in srgb, var(--color-warning) 42%, var(--color-border));
  background: color-mix(in srgb, var(--color-warning) 9%, var(--color-surface));
  transform: translateY(-2px);
}

.todo-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
  color: var(--color-text-weak);
  font-size: 0.82rem;
  font-weight: 800;
}

.todo-card h2 {
  font-size: 1.22rem;
}

@media (max-width: 700px) {
  .todo-list {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 701px) and (max-width: 980px) {
  .todo-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
