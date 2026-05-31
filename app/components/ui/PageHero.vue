<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  description?: string
  accent: string
}>()
</script>

<template>
  <section class="page-hero" :style="{ '--page-accent': accent }">
    <div class="page-hero__orb" aria-hidden="true" />
    <div class="page-hero__content">
      <span class="page-hero__bar" aria-hidden="true" />
      <p class="page-hero__eyebrow">{{ eyebrow }}</p>
      <h1 class="page-hero__title">{{ title }}</h1>
      <p v-if="description" class="page-hero__desc">{{ description }}</p>
    </div>
  </section>
</template>

<style scoped>
.page-hero {
  --page-accent-rgb: var(--page-accent);
  position: relative;
  padding: clamp(var(--space-48), 6vw, 80px) var(--space-16);
  overflow: hidden;
  border-block: 1px solid color-mix(in srgb, var(--page-accent) 14%, var(--color-border));
  background:
    radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--color-fg) 14%, transparent) 1px, transparent 1.6px),
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 96%, transparent), color-mix(in srgb, var(--color-bg) 92%, var(--color-surface)));
  background-size: 24px 24px, auto;
  animation: page-hero-rise 560ms ease both;
}

.page-hero__orb {
  position: absolute;
  top: -40%;
  right: -10%;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--page-accent) 10%, transparent), transparent 70%);
  pointer-events: none;
  animation: page-hero-orb-drift 8000ms ease-in-out infinite alternate;
}

.page-hero__content {
  position: relative;
  z-index: 1;
}

.page-hero__bar {
  display: block;
  width: 48px;
  height: 3px;
  margin-bottom: var(--space-16);
  border-radius: var(--radius-pill);
  background: linear-gradient(90deg, var(--page-accent), color-mix(in srgb, var(--page-accent) 40%, transparent));
  animation: page-hero-bar-grow 680ms 120ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.page-hero__eyebrow {
  color: color-mix(in srgb, var(--page-accent) 62%, var(--color-text-weak));
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.page-hero__title {
  margin-top: var(--space-8);
  font-size: clamp(2.3rem, 5.6vw, 4.4rem);
  font-weight: 850;
  line-height: 1;
  color: transparent;
  background:
    linear-gradient(
      135deg,
      var(--color-fg) 0%,
      color-mix(in srgb, var(--page-accent) 70%, var(--color-fg)) 50%,
      var(--color-fg) 100%
    );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  animation: page-hero-title-shimmer 6200ms linear infinite;
}

.page-hero__desc {
  margin-top: var(--space-16);
  max-width: 560px;
  color: var(--color-text-weak);
  font-size: clamp(0.96rem, 1.6vw, 1.08rem);
  line-height: 1.72;
}

@keyframes page-hero-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes page-hero-orb-drift {
  from {
    transform: translate(0, 0) scale(1);
  }

  to {
    transform: translate(-24px, 16px) scale(1.08);
  }
}

@keyframes page-hero-bar-grow {
  from {
    opacity: 0;
    transform: scaleX(0);
    transform-origin: left;
  }

  to {
    opacity: 1;
    transform: scaleX(1);
    transform-origin: left;
  }
}

@keyframes page-hero-title-shimmer {
  0% {
    background-position: 100% 50%;
  }

  100% {
    background-position: -100% 50%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .page-hero,
  .page-hero__bar {
    animation: none;
  }

  .page-hero__title {
    animation: none;
    background-position: 0% 50%;
  }

  .page-hero__orb {
    animation: none;
  }
}
</style>
