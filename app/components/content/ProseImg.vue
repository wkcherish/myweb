<template>
  <img :src="resolvedSrc" :alt="alt" :width="width" :height="height" />
</template>

<script setup lang="ts">
const props = defineProps<{
  src?: string
  alt?: string
  width?: string | number
  height?: string | number
}>()

const resolvedSrc = computed(() => {
  const src = props.src || ''

  if (src.startsWith('http') || src.startsWith('//')) {
    return src
  }

  // relative path into public/ → convert to absolute Nuxt URL
  const publicMatch = src.match(/(?:^|\.\.\/)+public\/(.+)$/)
  if (publicMatch) {
    return '/' + publicMatch[1]
  }

  return src
})
</script>
