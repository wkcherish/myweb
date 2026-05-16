<script setup lang="ts">
import BasePanel from '~/components/ui/BasePanel.vue'
import BaseTag from '~/components/ui/BaseTag.vue'
</script>

<template>
  <section class="placeholder-page">
    <BasePanel tone="floating">
      <BaseTag tone="accent">More</BaseTag>
      <h1 class="placeholder-page__title">数据统计分析</h1>
      <p class="placeholder-page__desc">该页面作为功能占位，后续会补充访问统计、内容趋势与数据看板。</p>
    </BasePanel>
  </section>
</template>

<style scoped>
.placeholder-page {
  display: grid;
  gap: var(--space-16);
}

.placeholder-page__title {
  margin-top: var(--space-12);
  font-size: clamp(1.65rem, 4vw, 2.15rem);
}

.placeholder-page__desc {
  margin-top: var(--space-12);
}
</style>
