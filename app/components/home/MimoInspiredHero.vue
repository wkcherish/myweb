<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useHomeBackground } from '~/composables/useHomeBackground'

const pointerX = ref(0)
const pointerY = ref(0)
const cursorX = ref(0)
const cursorY = ref(0)
const titleLeft = ref(0)
const titleTop = ref(0)
const titleWidth = ref(0)
const scrollProgress = ref(0)
const isPointerInside = ref(false)
const isMagnifying = ref(false)
const isPointerMoving = ref(false)
const titleEl = ref<HTMLElement | null>(null)
let frameId = 0
let moveTimer: ReturnType<typeof window.setTimeout> | null = null
const { selectedBackground, syncHomeBackgroundFromStorage } = useHomeBackground()

const hasBackgroundMedia = computed(() => Boolean(selectedBackground.value.path))
const isBackgroundImage = computed(() => hasBackgroundMedia.value && selectedBackground.value.mediaType === 'image')
const isBackgroundVideo = computed(() => hasBackgroundMedia.value && selectedBackground.value.mediaType === 'video')

const heroStyle = computed(() => ({
  '--copy-x': `${pointerX.value * 26}px`,
  '--copy-y': `${pointerY.value * 18}px`,
  '--action-x': `${pointerX.value * -8}px`,
  '--action-y': `${pointerY.value * -5}px`,
  '--copy-rotate-x': `${pointerY.value * -2.6}deg`,
  '--copy-rotate-y': `${pointerX.value * 3.2}deg`,
  '--cursor-x': `${cursorX.value}px`,
  '--cursor-y': `${cursorY.value}px`,
  '--title-left': `${titleLeft.value}px`,
  '--title-top': `${titleTop.value}px`,
  '--title-width': `${titleWidth.value}px`,
  '--hero-scroll': scrollProgress.value.toFixed(3),
}))

function updatePointer(event: PointerEvent) {
  if (event.pointerType === 'touch') {
    return
  }

  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  cursorX.value = event.clientX
  cursorY.value = event.clientY
  pointerX.value = (event.clientX - rect.left) / rect.width - 0.5
  pointerY.value = (event.clientY - rect.top) / rect.height - 0.5
  isPointerMoving.value = true

  if (moveTimer) {
    window.clearTimeout(moveTimer)
  }

  moveTimer = window.setTimeout(() => {
    isPointerMoving.value = false
  }, 140)
}

function updateTitleBounds() {
  if (!titleEl.value) {
    return
  }

  const rect = titleEl.value.getBoundingClientRect()
  titleLeft.value = rect.left
  titleTop.value = rect.top
  titleWidth.value = rect.width
}

function handlePointerEnter(event: PointerEvent) {
  if (event.pointerType === 'touch') {
    return
  }

  isPointerInside.value = true
  updatePointer(event)
}

function handlePointerLeave() {
  isPointerInside.value = false
  isMagnifying.value = false
  isPointerMoving.value = false
  pointerX.value = 0
  pointerY.value = 0
}

function handleTitlePointerEnter() {
  updateTitleBounds()
  isMagnifying.value = true
}

function handleTitlePointerLeave() {
  isMagnifying.value = false
}

function updateScrollProgress() {
  frameId = 0
  updateTitleBounds()
  const viewport = window.innerHeight || 1
  scrollProgress.value = Math.min(Math.max(window.scrollY / viewport, 0), 1)
}

function queueScrollUpdate() {
  if (frameId) {
    return
  }

  frameId = window.requestAnimationFrame(updateScrollProgress)
}

onMounted(() => {
  syncHomeBackgroundFromStorage()
  updateTitleBounds()
  updateScrollProgress()
  window.addEventListener('scroll', queueScrollUpdate, { passive: true })
  window.addEventListener('resize', updateTitleBounds, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', queueScrollUpdate)
  window.removeEventListener('resize', updateTitleBounds)
  if (moveTimer) {
    window.clearTimeout(moveTimer)
  }
  if (frameId) {
    window.cancelAnimationFrame(frameId)
  }
})
</script>

<template>
  <section
    class="mimo-hero"
    :class="{
      'is-pointer-inside': isPointerInside,
      'is-magnifying': isMagnifying,
      'is-pointer-moving': isPointerMoving,
      'has-background-media': hasBackgroundMedia,
      'has-background-video': isBackgroundVideo,
    }"
    :style="heroStyle"
    @pointerenter="handlePointerEnter"
    @pointermove="updatePointer"
    @pointerleave="handlePointerLeave"
  >
    <img
      v-if="isBackgroundImage"
      class="mimo-hero__media mimo-hero__media--image-fill"
      :src="selectedBackground.path"
      alt=""
      loading="eager"
      decoding="async"
      aria-hidden="true"
    >
    <img
      v-if="isBackgroundImage"
      class="mimo-hero__media mimo-hero__media--image-focus"
      :src="selectedBackground.path"
      alt=""
      loading="eager"
      decoding="async"
      aria-hidden="true"
    >
    <video
      v-if="isBackgroundVideo"
      :key="selectedBackground.id"
      class="mimo-hero__media"
      :src="selectedBackground.path"
      autoplay
      loop
      muted
      playsinline
      preload="auto"
      disablepictureinpicture
      aria-hidden="true"
    />
    <div class="mimo-hero__cursor" aria-hidden="true">
      <span class="mimo-hero__cursor-text">你好, 我是 cherish</span>
    </div>
    <div class="mimo-hero__copy">
      <h1
        ref="titleEl"
        class="mimo-hero__title"
        aria-label="hello, I'm cherish"
        @pointerenter="handleTitlePointerEnter"
        @pointerleave="handleTitlePointerLeave"
      >
        <span class="mimo-hero__title-text">hello, I'm cherish</span>
      </h1>
      <p class="mimo-hero__desc">记录学习、开发和生活，把每天的小进展放进同一个地方。</p>
      <nav class="mimo-hero__actions" aria-label="首页入口">
        <NuxtLink class="mimo-hero__link" to="/blog">Blog</NuxtLink>
        <NuxtLink class="mimo-hero__link" to="/wiki">Wiki</NuxtLink>
        <NuxtLink class="mimo-hero__link" to="/todo">Todo</NuxtLink>
      </nav>
    </div>
  </section>
</template>

<style scoped>
.mimo-hero {
  --home-bg-overlay: transparent;
  --home-bg-shade: var(--hero-mobile-glow);
  position: relative;
  min-height: calc(100svh - 68px);
  overflow: hidden;
  display: grid;
  place-items: center;
  padding: clamp(var(--space-48), 8vw, 104px) var(--space-16);
  border-radius: 0;
  background: var(--color-bg);
  isolation: isolate;
  cursor: auto;
  transition: background-color var(--motion-280) ease;
}

.mimo-hero.has-background-media {
  --home-bg-overlay: var(--home-bg-overlay-light, rgba(255, 255, 255, 0));
  --home-bg-shade: transparent;
}

:global(html[data-theme='dark']) .mimo-hero.has-background-media {
  --home-bg-overlay: var(--home-bg-overlay-dark, rgba(16, 20, 30, 0.36));
}

.mimo-hero__media {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
  object-position: center;
  pointer-events: none;
}

.mimo-hero__media--image-fill {
  filter: blur(24px) saturate(1.08);
  transform: scale(1.08);
  opacity: 0.94;
}

.mimo-hero__media--image-focus {
  object-fit: cover;
}

.mimo-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(180deg, var(--home-bg-shade), transparent);
  pointer-events: none;
}

.mimo-hero::after {
  content: '';
  position: absolute;
  inset: auto 0 0;
  height: 42%;
  background: radial-gradient(ellipse at 50% 78%, var(--hero-mobile-glow), transparent 58%);
  opacity: 0;
  pointer-events: none;
  z-index: 1;
}

/* Cursor */
.mimo-hero__cursor {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 5;
  --cursor-radius: 42px;
  width: 84px;
  height: 84px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid var(--hero-cursor-border);
  background: var(--hero-cursor-bg);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.45) inset,
    0 10px 28px rgba(0, 0, 0, 0.14);
  opacity: 0;
  transform: translate3d(calc(var(--cursor-x, 0px) - var(--cursor-radius)), calc(var(--cursor-y, 0px) - var(--cursor-radius)), 0);
  transition:
    width var(--motion-180) ease,
    height var(--motion-180) ease,
    background-color var(--motion-180) ease,
    border-color var(--motion-180) ease,
    opacity var(--motion-120) ease;
  pointer-events: none;
}

.mimo-hero__cursor::before,
.mimo-hero__cursor::after {
  content: '';
  position: absolute;
  inset: -1px;
  border: 1px solid var(--hero-cursor-wave-border);
  border-radius: inherit;
  opacity: 0;
  animation: cursor-wave 1800ms ease-out infinite;
}

.mimo-hero__cursor::after {
  animation-delay: 650ms;
}

.mimo-hero__cursor::before,
.mimo-hero__cursor::after {
  animation-play-state: paused;
}

.mimo-hero.is-pointer-inside .mimo-hero__cursor {
  opacity: 1;
}

.mimo-hero.is-pointer-moving .mimo-hero__cursor {
  animation: cursor-pulse 1200ms ease-out infinite;
}

.mimo-hero.is-pointer-moving .mimo-hero__cursor::before,
.mimo-hero.is-pointer-moving .mimo-hero__cursor::after {
  animation-play-state: running;
}

.mimo-hero.is-magnifying .mimo-hero__cursor {
  --cursor-radius: 124px;
  width: 248px;
  height: 248px;
  border-color: var(--hero-cursor-mag-border);
  background: var(--hero-cursor-mag-bg);
  backdrop-filter: contrast(1.12) saturate(1.12);
}

.mimo-hero.is-magnifying {
  cursor: none;
}

.mimo-hero__cursor-text {
  position: absolute;
  left: calc(var(--title-left, 0px) - var(--cursor-x, 0px) + var(--cursor-radius));
  top: calc(var(--title-top, 0px) - var(--cursor-y, 0px) + var(--cursor-radius));
  width: var(--title-width, 960px);
  color: var(--hero-cursor-text-color);
  font-size: clamp(2.5rem, 7.9vw, 7.35rem);
  font-weight: 850;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  opacity: 0;
  transform: scale(1.24);
  transform-origin: center;
}

.mimo-hero.is-magnifying .mimo-hero__cursor-text {
  opacity: 1;
}

/* Copy */
.mimo-hero__copy {
  position: relative;
  z-index: 1;
  width: min(960px, 100%);
  text-align: center;
  transform:
    perspective(900px)
    translate3d(var(--copy-x, 0), var(--copy-y, 0), 0)
    rotateX(var(--copy-rotate-x, 0deg))
    rotateY(var(--copy-rotate-y, 0deg));
  transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.mimo-hero__copy,
.mimo-hero__title,
.mimo-hero__desc,
.mimo-hero__actions,
.mimo-hero__link {
  -webkit-user-select: none;
  user-select: none;
}

.mimo-hero__title {
  position: relative;
  display: block;
  white-space: nowrap;
  color: var(--hero-title-color);
  font-size: clamp(2.5rem, 7.9vw, 7.35rem);
  font-weight: 850;
  line-height: 1;
  text-align: center;
}

.mimo-hero.has-background-image .mimo-hero__title {
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.24), 0 0 40px rgba(0, 0, 0, 0.12);
}

.mimo-hero.has-background-image .mimo-hero__desc {
  filter: drop-shadow(0 1px 6px rgba(0, 0, 0, 0.18));
}

.mimo-hero__title-text {
  display: inline-block;
  color: inherit;
  transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

.mimo-hero.is-magnifying .mimo-hero__title-text {
  -webkit-mask-image:
    radial-gradient(
      circle 124px at calc(var(--cursor-x, 0px) - var(--title-left, 0px)) calc(var(--cursor-y, 0px) - var(--title-top, 0px)),
      transparent 0 99%,
      #000 100%
    );
  mask-image:
    radial-gradient(
      circle 124px at calc(var(--cursor-x, 0px) - var(--title-left, 0px)) calc(var(--cursor-y, 0px) - var(--title-top, 0px)),
      transparent 0 99%,
      #000 100%
    );
}

.mimo-hero__desc {
  width: min(560px, 100%);
  margin: var(--space-24) auto 0;
  color: transparent;
  background:
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--color-fg) 94%, black 4%),
      color-mix(in srgb, var(--color-primary) 82%, var(--color-fg)),
      color-mix(in srgb, var(--color-accent) 78%, var(--color-fg)),
      color-mix(in srgb, var(--color-fg) 94%, black 4%)
    );
  background-size: 220% 100%;
  background-position: 0% 50%;
  -webkit-background-clip: text;
  background-clip: text;
  font-size: clamp(1rem, 2vw, 1.18rem);
  font-weight: 700;
  line-height: 1.7;
  text-wrap: balance;
  text-shadow: none;
  animation: desc-gradient-flow 6200ms linear infinite;
}

.mimo-hero.has-background-image .mimo-hero__desc {
  background:
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--color-fg) 96%, black 6%),
      #243fb8,
      #08786b,
      color-mix(in srgb, var(--color-fg) 96%, black 6%)
    );
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow: none;
}

/* Actions / Links */
.mimo-hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-12);
  margin-top: var(--space-32);
  transform: translate3d(var(--action-x, 0), var(--action-y, 0), 0);
  transition: transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
}

.mimo-hero__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 104px;
  min-height: 44px;
  padding: 0 var(--space-16);
  border: 1px solid var(--hero-link-border);
  border-radius: var(--radius-pill);
  color: var(--hero-link-color);
  background: var(--hero-link-bg);
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  backdrop-filter: blur(16px);
  transition:
    background-color var(--motion-180) ease,
    border-color var(--motion-180) ease,
    color var(--motion-180) ease,
    transform var(--motion-180) ease;
}

.mimo-hero__link:hover {
  border-color: var(--hero-link-hover-bg);
  color: var(--hero-link-hover-color);
  background: var(--hero-link-hover-bg);
  transform: translateY(-2px);
}

.mimo-hero__link:focus {
  outline: none;
}

.mimo-hero__link:focus:not(:focus-visible) {
  box-shadow: none;
}

.mimo-hero__link:focus-visible {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 68%, white 10%);
}

@media (prefers-reduced-motion: reduce) {
  .mimo-hero__cursor,
  .mimo-hero__copy,
  .mimo-hero__actions {
    transform: none;
  }

  .mimo-hero__desc {
    animation: none;
    background-position: 50% 50%;
  }
}

@keyframes cursor-wave {
  0% {
    opacity: 0.46;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(1.65);
  }
}

@keyframes cursor-pulse {
  0% {
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.45) inset,
      0 10px 28px rgba(0, 0, 0, 0.14),
      0 0 0 0 rgba(0, 0, 0, 0.28);
  }

  100% {
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.45) inset,
      0 10px 28px rgba(0, 0, 0, 0.14),
      0 0 0 22px rgba(0, 0, 0, 0);
  }
}

@keyframes desc-gradient-flow {
  0% {
    background-position: 0% 50%;
  }

  100% {
    background-position: 220% 50%;
  }
}

/* Mobile */
@media (max-width: 700px) {
  .mimo-hero {
    min-height: calc(100svh - 68px);
    place-items: end center;
    padding: 0 18px clamp(88px, 14svh, 124px);
  }

  .mimo-hero__media--image-fill {
    filter: blur(28px) saturate(1.12);
    transform: scale(1.14);
    opacity: 0.88;
  }

  .mimo-hero__media--image-focus {
    object-fit: cover;
    object-position: center;
    transform: scale(1.03);
  }

  .mimo-hero::before {
    background:
      linear-gradient(180deg, var(--hero-mobile-overlay-top) 0%, transparent 34%),
      linear-gradient(0deg, var(--hero-mobile-overlay-bottom) 0%, var(--hero-mobile-overlay-bottom-start) 42%, transparent 76%);
  }

  .mimo-hero::after {
    height: 48%;
    background:
      radial-gradient(ellipse at 50% 64%, var(--hero-mobile-glow), transparent 42%),
      linear-gradient(180deg, transparent, var(--hero-mobile-glow));
    opacity: 1;
    animation: mobile-ambient-glow 6200ms ease-in-out infinite alternate;
  }

  .mimo-hero__copy {
    width: min(100%, 360px);
    transform: none;
    animation: mobile-copy-rise 720ms cubic-bezier(0.2, 0.9, 0.24, 1) both;
  }

  .mimo-hero__title {
    color: var(--hero-mobile-title-color);
    font-size: clamp(2.12rem, 9vw, 2.72rem);
    font-weight: 900;
    line-height: 0.96;
    white-space: nowrap;
    text-shadow: 0 8px 28px rgba(0, 0, 0, 0.32);
    animation: mobile-title-glow 4200ms ease-in-out infinite;
  }

  .mimo-hero__title-text {
    position: relative;
  }

  .mimo-hero__title-text::after {
    content: '';
    position: absolute;
    right: 4%;
    bottom: -8px;
    left: 4%;
    height: 2px;
    border-radius: var(--radius-pill);
    background: linear-gradient(90deg, transparent, var(--hero-mobile-underline), transparent);
    opacity: 0.72;
    transform: scaleX(0);
    transform-origin: center;
    animation: mobile-title-line 760ms 240ms cubic-bezier(0.2, 0.9, 0.24, 1) forwards;
  }

  .mimo-hero__desc {
    width: min(286px, 100%);
    margin-top: 18px;
    color: rgba(255, 255, 255, 0.84);
    background: none;
    font-size: clamp(0.93rem, 3.8vw, 1.02rem);
    font-weight: 760;
    line-height: 1.62;
    text-shadow: 0 4px 18px rgba(0, 0, 0, 0.36);
    animation: none;
    opacity: 0;
    transform: translateY(8px);
    animation: mobile-copy-fade 680ms 160ms cubic-bezier(0.2, 0.9, 0.24, 1) forwards;
  }

  .mimo-hero.has-background-image .mimo-hero__desc {
    color: rgba(255, 255, 255, 0.84);
    background: none;
    text-shadow: 0 4px 18px rgba(0, 0, 0, 0.36);
  }

  .mimo-hero__actions {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    width: min(318px, 100%);
    gap: 11px;
    margin: 26px auto 0;
    transform: none;
    opacity: 0;
    animation: mobile-copy-fade 680ms 280ms cubic-bezier(0.2, 0.9, 0.24, 1) forwards;
  }

  .mimo-hero__link {
    position: relative;
    overflow: hidden;
    min-width: 0;
    min-height: 44px;
    padding: 0 10px;
    border-color: var(--hero-mobile-link-border);
    color: var(--hero-mobile-link-color);
    background: var(--hero-mobile-link-bg);
    font-size: 0.95rem;
    font-weight: 760;
    box-shadow:
      0 10px 26px rgba(0, 0, 0, 0.22),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);
    transform: translateY(8px);
    animation: mobile-link-pop 560ms cubic-bezier(0.2, 0.9, 0.24, 1) forwards;
  }

  .mimo-hero__link::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(110deg, transparent 0 24%, var(--hero-mobile-sheen) 44%, transparent 62% 100%);
    transform: translateX(-120%);
    animation: mobile-link-sheen 5200ms ease-in-out infinite;
    pointer-events: none;
  }

  .mimo-hero__link:nth-child(2)::before {
    animation-delay: 520ms;
  }

  .mimo-hero__link:nth-child(3)::before {
    animation-delay: 1040ms;
  }

  .mimo-hero__link:nth-child(1) {
    animation-delay: 360ms;
  }

  .mimo-hero__link:nth-child(2) {
    animation-delay: 440ms;
  }

  .mimo-hero__link:nth-child(3) {
    animation-delay: 520ms;
  }

  .mimo-hero__link:active {
    transform: scale(0.97);
    background: var(--hero-mobile-link-active-bg);
  }
}

@media (max-width: 370px) {
  .mimo-hero {
    padding-right: 14px;
    padding-left: 14px;
  }

  .mimo-hero__title {
    font-size: clamp(1.96rem, 8.6vw, 2.18rem);
  }

  .mimo-hero__actions {
    width: 100%;
    gap: 8px;
  }

  .mimo-hero__link {
    min-height: 42px;
    font-size: 0.9rem;
  }
}

@keyframes mobile-copy-rise {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.985);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes mobile-copy-fade {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes mobile-link-pop {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.96);
  }

  72% {
    opacity: 1;
    transform: translateY(-1px) scale(1.01);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes mobile-title-line {
  to {
    transform: scaleX(1);
  }
}

@keyframes mobile-ambient-glow {
  from {
    opacity: 0.72;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes mobile-title-glow {
  0%,
  100% {
    text-shadow: 0 8px 28px rgba(0, 0, 0, 0.32);
  }

  50% {
    text-shadow:
      0 8px 28px rgba(0, 0, 0, 0.34),
      0 0 24px rgba(255, 255, 255, 0.24);
  }
}

@keyframes mobile-link-sheen {
  0%,
  58% {
    transform: translateX(-120%);
  }

  76%,
  100% {
    transform: translateX(120%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .mimo-hero,
  .mimo-hero__copy,
  .mimo-hero__title,
  .mimo-hero__desc,
  .mimo-hero__actions,
  .mimo-hero__link,
  .mimo-hero__link::before,
  .mimo-hero::after,
  .mimo-hero__title-text::after {
    animation: none;
  }

  .mimo-hero__desc,
  .mimo-hero__actions,
  .mimo-hero__link {
    opacity: 1;
    transform: none;
  }

  .mimo-hero__title-text::after {
    transform: scaleX(1);
  }
}

@media (hover: none), (pointer: coarse) {
  .mimo-hero {
    cursor: auto;
  }

  .mimo-hero__cursor {
    display: none;
  }
}
</style>
