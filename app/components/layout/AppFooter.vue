<script setup lang="ts">
import { computed } from 'vue'

import { siteConfig } from '~/config/site'

const currentYear = computed(() => new Date().getFullYear())
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer__inner">
      <p class="app-footer__line">
        © {{ currentYear }} {{ siteConfig.author }} · {{ siteConfig.name }}
      </p>
      <p class="app-footer__line">
        本站为静态内容站，正式内容由本地文件维护。备案号：待补充。
      </p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: auto;
  border-top: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface) 84%, transparent);
}

.app-footer__inner {
  width: 100%;
  padding: var(--space-24) var(--space-16);
  display: grid;
  gap: var(--space-8);
}

.app-footer__line {
  font-size: 0.88rem;
  color: var(--color-text-weak);
}
</style>
