<script setup lang="ts">
import BasePanel from '~/components/ui/BasePanel.vue'
import BaseTag from '~/components/ui/BaseTag.vue'
import LoadingState from '~/components/ui/LoadingState.vue'
</script>

<template>
  <section class="content-page">
    <BasePanel tone="floating">
      <BaseTag tone="accent">Wiki</BaseTag>
      <h1 class="content-page__title">知识库</h1>
      <p class="content-page__desc">
        Wiki 内容将从 <code>content/wiki/</code> 目录中的 Markdown 文件读取。
      </p>
    </BasePanel>

    <BasePanel>
      <h2 class="content-page__subtitle">检索模块预留</h2>
      <LoadingState title="正在准备索引结构" description="下一阶段接入分类树、搜索与目录导航。" />
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
