<template>
  <img
    :src="resolvedSrc"
    :alt="alt"
    :width="width"
    :height="height"
    class="prose-img"
    :class="{ 'prose-img--interactive': canPreview }"
    loading="lazy"
    decoding="async"
    :tabindex="canPreview ? 0 : undefined"
    :role="canPreview ? 'button' : undefined"
    :aria-label="canPreview ? previewLabel : undefined"
    @click.prevent.stop="openPreview"
    @keydown.enter.prevent.stop="openPreview"
    @keydown.space.prevent.stop="openPreview"
  />

  <Teleport to="body">
    <Transition name="image-preview-fade">
      <div
        v-if="isPreviewOpen"
        class="image-preview"
        role="dialog"
        aria-modal="true"
        :aria-label="dialogLabel"
        @click.self="closePreview"
      >
        <div class="image-preview__stage">
          <img class="image-preview__img" :src="resolvedSrc" :alt="alt || '图片预览'" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  src?: string
  alt?: string
  width?: string | number
  height?: string | number
}>()

const isPreviewOpen = ref(false)
let previousBodyOverflow = ''

const resolvedSrc = computed(() => {
  const src = props.src || ''

  if (src.startsWith('http') || src.startsWith('//')) {
    return src
  }

  const publicImageMatch = src.match(/^(?:\.{1,2}\/+)*(images\/.+)$/)
  if (publicImageMatch) {
    return '/' + publicImageMatch[1]
  }

  // relative path into public/ → convert to absolute Nuxt URL
  const publicMatch = src.match(/(?:^|\.\.\/)+public\/(.+)$/)
  if (publicMatch) {
    return '/' + publicMatch[1]
  }

  return src
})

const canPreview = computed(() => Boolean(resolvedSrc.value))
const previewLabel = computed(() => (props.alt ? `放大查看：${props.alt}` : '点击放大图片'))
const dialogLabel = computed(() => (props.alt ? `图片预览：${props.alt}` : '图片预览'))

const openPreview = () => {
  if (!canPreview.value) return
  isPreviewOpen.value = true
}

const closePreview = () => {
  isPreviewOpen.value = false
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closePreview()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)

  if (isPreviewOpen.value) {
    document.body.style.overflow = previousBodyOverflow
  }
})

watch(isPreviewOpen, (isOpen) => {
  if (isOpen) {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return
  }

  document.body.style.overflow = previousBodyOverflow
})
</script>

<style scoped>
.prose-img--interactive {
  cursor: zoom-in;
  transition:
    transform 0.22s ease,
    filter 0.22s ease,
    box-shadow 0.22s ease;
}

.prose-img--interactive:hover {
  transform: translateY(-1px);
  filter: brightness(0.98);
}

.prose-img--interactive:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--color-primary) 42%, transparent);
  outline-offset: 4px;
}

.image-preview {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: clamp(18px, 4vw, 52px);
  background: rgba(12, 12, 14, 0.78);
  backdrop-filter: blur(12px);
  cursor: zoom-out;
}

.image-preview__stage {
  display: grid;
  gap: 10px;
  justify-items: center;
  max-width: min(86vw, 1180px);
  max-height: calc(100vh - 72px);
  padding: clamp(12px, 2vw, 24px);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 10px;
  background: #fff;
  cursor: default;
  box-shadow:
    0 24px 70px rgba(0, 0, 0, 0.34),
    0 8px 24px rgba(0, 0, 0, 0.2);
  transform-origin: center center;
  will-change: transform, opacity;
}

.image-preview__img {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: calc(100vh - 134px);
  object-fit: contain;
  border-radius: 4px;
  box-shadow: none;
}

.image-preview-fade-enter-active,
.image-preview-fade-leave-active {
  transition: opacity 0.24s ease;
}

.image-preview-fade-enter-from,
.image-preview-fade-leave-to {
  opacity: 0;
}

.image-preview-fade-enter-active .image-preview__stage {
  transition:
    transform 0.42s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.26s ease;
}

.image-preview-fade-leave-active .image-preview__stage {
  transition:
    transform 0.22s ease,
    opacity 0.18s ease;
}

.image-preview-fade-enter-from .image-preview__stage {
  opacity: 0;
  transform: translateY(18px) scale(0.9);
}

.image-preview-fade-enter-to .image-preview__stage,
.image-preview-fade-leave-from .image-preview__stage {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.image-preview-fade-leave-to .image-preview__stage {
  opacity: 0;
  transform: translateY(8px) scale(0.96);
}

@media (max-width: 700px) {
  .image-preview {
    padding: 14px;
  }

  .image-preview__stage {
    max-width: 94vw;
    max-height: calc(100vh - 42px);
    padding: 10px;
  }

  .image-preview__img {
    max-height: calc(100vh - 74px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .prose-img--interactive,
  .image-preview-fade-enter-active,
  .image-preview-fade-leave-active,
  .image-preview-fade-enter-active .image-preview__stage,
  .image-preview-fade-leave-active .image-preview__stage {
    transition: none;
  }
}
</style>
