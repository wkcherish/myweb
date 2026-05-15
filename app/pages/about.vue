<script setup lang="ts">
import BasePanel from '~/components/ui/BasePanel.vue'
import BaseTag from '~/components/ui/BaseTag.vue'
</script>

<template>
  <section class="about-page">
    <BasePanel tone="floating">
      <BaseTag tone="accent">About</BaseTag>
      <h1 class="about-page__title">关于这个站</h1>
      <p class="about-page__desc">这里会逐步补充个人介绍、方向和长期维护说明。</p>
    </BasePanel>

    <BasePanel>
      <h2 class="about-page__subtitle">内容维护方式</h2>
      <ul class="about-page__list">
        <li>博客与 Wiki 正式内容统一来自本地 Markdown 文件。</li>
        <li>Todo 作为路线图展示，网页端不提供写入能力。</li>
        <li>更新流程为：本地编辑、预览、构建、部署。</li>
      </ul>
    </BasePanel>
  </section>
</template>

<style scoped>
.about-page {
  display: grid;
  gap: var(--space-16);
}

.about-page__title {
  margin-top: var(--space-12);
  font-size: clamp(1.7rem, 4vw, 2.3rem);
}

.about-page__subtitle {
  font-size: 1.1rem;
}

.about-page__desc {
  margin-top: var(--space-12);
}

.about-page__list {
  margin: var(--space-12) 0 0;
  padding-left: 1.1rem;
  display: grid;
  gap: var(--space-8);
  color: var(--color-text-weak);
}
</style>
