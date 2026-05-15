<script setup lang="ts">
import BasePanel from '~/components/ui/BasePanel.vue'
import BaseTag from '~/components/ui/BaseTag.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
</script>

<template>
  <section class="content-page">
    <BasePanel tone="floating">
      <BaseTag>Todo</BaseTag>
      <h1 class="content-page__title">规划看板</h1>
      <p class="content-page__desc">
        Todo 展示内容将从 <code>content/todo/</code> 中的 Markdown 或 JSON 文件读取。
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

    <BasePanel>
      <EmptyState
        title="暂无任务条目"
        description="请在本地 content/todo/ 补充规划文件，后续会渲染为时间线和分组列表。"
      />
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
</style>
