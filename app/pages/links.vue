<script setup lang="ts">
import BasePanel from '~/components/ui/BasePanel.vue'
import BaseTag from '~/components/ui/BaseTag.vue'
</script>

<template>
  <section class="links-page">
    <BasePanel tone="floating">
      <BaseTag tone="accent">More</BaseTag>
      <h1 class="links-page__title">友情链接</h1>
      <p class="links-page__desc">该页面暂作占位，后续会补充常用站点、朋友项目与推荐链接。</p>
    </BasePanel>
  </section>
</template>

<style scoped>
.links-page {
  display: grid;
  gap: var(--space-16);
}

.links-page__title {
  margin-top: var(--space-12);
  font-size: clamp(1.65rem, 4vw, 2.15rem);
}

.links-page__desc {
  margin-top: var(--space-12);
}
</style>
