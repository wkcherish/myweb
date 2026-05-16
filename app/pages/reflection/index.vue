<script setup lang="ts">
import BasePanel from '~/components/ui/BasePanel.vue'
import BaseTag from '~/components/ui/BaseTag.vue'
import EmptyState from '~/components/ui/EmptyState.vue'

type ReflectionEntry = {
  path?: string
  title?: string
  description?: string
  date?: string
  meta?: Record<string, unknown>
}

const readString = (entry: ReflectionEntry, key: string) => {
  const directValue = entry[key as keyof ReflectionEntry]
  const metaValue = entry.meta?.[key]
  const value = directValue || metaValue

  return typeof value === 'string' ? value : ''
}

const { data: reflections } = await useAsyncData('reflection-list', async () => {
  const entries = (await queryCollection('reflection').all()) as ReflectionEntry[]

  return entries
    .filter((entry) => !(entry.path || '').toLowerCase().endsWith('/readme'))
    .sort((a, b) => {
      const left = new Date(getContentDate(a, ['date'])).getTime() || 0
      const right = new Date(getContentDate(b, ['date'])).getTime() || 0

      return right - left
    })
})
</script>

<template>
  <section class="reflection-page">
    <BasePanel tone="floating">
      <BaseTag>Reflection</BaseTag>
      <h1 class="reflection-page__title">最近反思总结</h1>
      <p class="reflection-page__desc">
        这里展示 <code>content/reflection/</code> 中维护的 Markdown 反思记录。
      </p>
    </BasePanel>

    <div v-if="reflections?.length" class="reflection-list">
      <article v-for="item in reflections" :key="item.path" class="reflection-card">
        <time>{{ formatContentDate(getContentDate(item, ['date'])) }}</time>
        <h2>{{ readString(item, 'title') || '未命名反思' }}</h2>
        <p>{{ readString(item, 'description') || '暂无摘要。' }}</p>
      </article>
    </div>

    <BasePanel v-else>
      <EmptyState
        title="暂无反思记录"
        description="请在本地 content/reflection/ 添加 Markdown 文件。"
      />
    </BasePanel>
  </section>
</template>

<style scoped>
.reflection-page {
  display: grid;
  gap: var(--space-16);
}

.reflection-page__title {
  margin-top: var(--space-12);
  font-size: clamp(1.7rem, 4vw, 2.3rem);
}

.reflection-page__desc {
  margin-top: var(--space-12);
}

.reflection-list {
  display: grid;
  gap: var(--space-12);
}

.reflection-card {
  padding: var(--space-20, 20px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--color-surface) 86%, var(--color-bg));
  box-shadow: var(--shadow-soft);
}

.reflection-card time {
  color: var(--color-primary);
  font-size: 0.84rem;
  font-weight: 800;
}

.reflection-card h2 {
  margin-top: var(--space-8);
  font-size: 1.25rem;
}

.reflection-card p {
  margin-top: var(--space-8);
}
</style>
