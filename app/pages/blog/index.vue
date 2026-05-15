<script setup lang="ts">
import BasePanel from '~/components/ui/BasePanel.vue'
import BaseTag from '~/components/ui/BaseTag.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
</script>

<template>
  <section class="content-page">
    <BasePanel tone="floating">
      <BaseTag>Blog</BaseTag>
      <h1 class="content-page__title">博客文章</h1>
      <p class="content-page__desc">
        博客内容将从 <code>content/blog/</code> 目录中的 Markdown 文件读取。
      </p>
    </BasePanel>

    <BasePanel>
      <h2 class="content-page__subtitle">当前状态</h2>
      <EmptyState
        title="还没有示例文章"
        description="请在本地 content/blog/ 新增 Markdown，下一阶段将接入列表、筛选和搜索。"
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
  margin-bottom: var(--space-12);
}

.content-page__desc {
  margin-top: var(--space-12);
}
</style>
