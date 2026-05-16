<script setup lang="ts">
const progress = ref(0)

const updateProgress = () => {
  if (!import.meta.client) {
    return
  }

  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  progress.value = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0
}

onMounted(() => {
  updateProgress()
  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('resize', updateProgress, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateProgress)
  window.removeEventListener('resize', updateProgress)
})
</script>

<template>
  <div class="reading-progress" aria-hidden="true">
    <span :style="{ width: `${progress}%` }" />
  </div>
</template>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 80;
  width: 100%;
  height: 3px;
  background: transparent;
}

.reading-progress span {
  display: block;
  height: 100%;
  background: var(--color-accent);
  transition: width 80ms linear;
}
</style>
