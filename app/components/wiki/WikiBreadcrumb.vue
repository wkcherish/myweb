<script setup lang="ts">
defineProps<{
  category?: string
  title?: string
}>()
</script>

<template>
  <nav class="wiki-breadcrumb" aria-label="面包屑">
    <NuxtLink to="/wiki">Wiki</NuxtLink>
    <span v-if="category">/ {{ category }}</span>
    <span v-if="title">/ {{ title }}</span>
  </nav>
</template>

<style scoped>
.wiki-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  color: var(--color-text-weak);
  font-size: 0.86rem;
}

.wiki-breadcrumb a {
  font-weight: 800;
}
</style>
