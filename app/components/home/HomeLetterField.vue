<script setup lang="ts">
interface Props {
  source?: string
  parallaxX?: number
  parallaxY?: number
}

const props = withDefaults(defineProps<Props>(), {
  source: 'NOTEBOOK',
  parallaxX: 0,
  parallaxY: 0,
})

const rows = Array.from({ length: 7 }, (_, index) => {
  const text = `${props.source} BLOG WIKI TODO`
  return `${text} ${text} ${text}`.slice(index, index + 44)
})
</script>

<template>
  <div
    class="letter-field"
    aria-hidden="true"
    :style="{
      '--letter-x': `${parallaxX}px`,
      '--letter-y': `${parallaxY}px`,
    }"
  >
    <span v-for="(row, index) in rows" :key="`${row}-${index}`">{{ row }}</span>
  </div>
</template>

<style scoped>
.letter-field {
  position: absolute;
  inset: -8% -12%;
  display: grid;
  align-content: space-between;
  overflow: hidden;
  transform: translate3d(var(--letter-x, 0), var(--letter-y, 0), 0);
  transition: transform var(--motion-240) ease;
  pointer-events: none;
}

.letter-field span {
  color: color-mix(in srgb, var(--color-fg) 13%, transparent);
  font-size: clamp(2.2rem, 8vw, 7rem);
  font-weight: 850;
  line-height: 0.95;
  letter-spacing: 0.12em;
  opacity: 0.48;
  white-space: nowrap;
}

.letter-field span:nth-child(even) {
  transform: translateX(-8vw);
}

:global(html[data-theme='dark']) .letter-field span {
  color: color-mix(in srgb, var(--color-fg) 11%, transparent);
  opacity: 0.38;
}

@media (prefers-reduced-motion: reduce) {
  .letter-field {
    transform: none;
  }
}
</style>
