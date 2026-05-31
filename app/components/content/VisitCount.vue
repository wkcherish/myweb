<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    path?: string
  }>(),
  {
    path: '',
  },
)

const route = useRoute()
const { readPathMetric } = useUmamiPathMetrics()

const targetPath = computed(() => props.path || route.path)
const count = computed(() => {
  const metric = readPathMetric(targetPath.value)

  if (!metric) {
    return '--'
  }

  return Math.max(0, Number(metric.visits || 0)).toLocaleString('zh-CN')
})
</script>

<template>
  <span class="visit-count">访问 {{ count }} 次</span>
</template>

<style scoped>
.visit-count {
  color: var(--color-text-weak);
  font-size: 0.82rem;
  font-weight: 800;
}
</style>
