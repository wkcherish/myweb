<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    path?: string
    increment?: boolean
  }>(),
  {
    path: '',
    increment: false,
  },
)

const count = ref(0)

onMounted(() => {
  const route = useRoute()
  const targetPath = props.path || route.path
  const key = `notebook:visits:${targetPath}`
  const current = Number.parseInt(window.localStorage.getItem(key) || '0', 10) || 0
  const next = props.increment ? current + 1 : current

  if (props.increment) {
    window.localStorage.setItem(key, String(next))
  }

  count.value = next
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
