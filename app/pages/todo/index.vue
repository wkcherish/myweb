<script setup lang="ts">
import VisitCount from '~/components/content/VisitCount.vue'
import BasePanel from '~/components/ui/BasePanel.vue'
import BaseTag from '~/components/ui/BaseTag.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import ErrorState from '~/components/ui/ErrorState.vue'
import type { ContentEntry } from '~/utils/content'

const { data: todosResult } = await useAsyncData('todo-list', async () => {
  try {
    const entries = (await queryCollection('todo').all()) as ContentEntry[]

    return toContentResult(sortEntriesByDate(filterPublishedEntries(entries), ['targetDate', 'startDate', 'date']))
  } catch (error) {
    return toContentResult<ContentEntry>([], error)
  }
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

    <BasePanel v-if="todosResult?.error">
      <ErrorState title="Todo 读取失败" :description="todosResult.error" />
    </BasePanel>

    <div v-else-if="todosResult?.data.length" class="todo-list">
      <NuxtLink v-for="todo in todosResult.data" :key="todo.path" class="todo-card" :to="todo.path || '/todo'">
        <div class="todo-card__meta">
          <span>{{ readContentString(todo, 'status') || 'planned' }}</span>
          <span>{{ readContentString(todo, 'priority') || 'medium' }}</span>
          <time>{{ formatContentDate(getContentDate(todo, ['targetDate', 'startDate', 'date'])) }}</time>
          <VisitCount :path="todo.path" />
        </div>
        <h2>{{ readContentString(todo, 'title') || '未命名 Todo' }}</h2>
        <p>{{ readContentString(todo, 'description') || '暂无摘要。' }}</p>
      </NuxtLink>
    </div>

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
