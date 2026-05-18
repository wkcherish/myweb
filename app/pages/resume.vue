<script setup lang="ts">
import { ArrowUpRight, BriefcaseBusiness, Github, GraduationCap, Image, Mail, MapPin, Sparkles } from 'lucide-vue-next'
import BaseTag from '~/components/ui/BaseTag.vue'
import type { ContentEntry } from '~/utils/content'

type ResumeEducation = {
  school: string
  degree: string
  major: string
  focus?: string
}

type ResumePage = ContentEntry & {
  role?: string
  location?: string
  email?: string
  website?: string
  github?: string
  photo?: string
  summary?: string
  education?: ResumeEducation[]
  skills?: string[]
}

const { data: resume } = await useAsyncData('resume-profile', () => {
  return queryCollection('resume').path('/resume/profile').first() as Promise<ResumePage | null>
})

if (!resume.value) {
  throw createError({ statusCode: 404, statusMessage: 'Resume not found' })
}

const readResumeField = <T,>(key: keyof ResumePage, fallback: T): T => {
  const directValue = resume.value?.[key]
  const metaValue = resume.value?.meta?.[key]
  const value = directValue ?? metaValue

  return (value ?? fallback) as T
}

const role = computed(() => readResumeField('role', '具身智能 / 机器人方向研究生'))
const summary = computed(() => readResumeField('summary', ''))
const photo = computed(() => readResumeField('photo', ''))
const educationItems = computed(() => readResumeField<ResumeEducation[]>('education', []))
const skillItems = computed(() => readResumeField<string[]>('skills', []))

const formatLinkLabel = (value: string) => {
  return value.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

const contactItems = computed(() => [
  {
    label: readResumeField('location', '上海'),
    icon: MapPin,
    href: '',
  },
  {
    label: readResumeField('email', ''),
    icon: Mail,
    href: readResumeField('email', '') ? `mailto:${readResumeField('email', '')}` : '',
  },
  {
    label: formatLinkLabel(readResumeField('website', '')),
    icon: ArrowUpRight,
    href: readResumeField('website', ''),
  },
  {
    label: formatLinkLabel(readResumeField('github', '')),
    icon: Github,
    href: readResumeField('github', ''),
  },
].filter((item) => item.label))
</script>

<template>
  <section v-if="resume" class="resume-page">
    <header class="resume-hero">
      <div class="resume-hero__content">
        <BaseTag tone="accent">Resume</BaseTag>
        <h1>{{ resume.title || '个人简历' }}</h1>
        <p class="resume-hero__role">{{ role }}</p>
        <p class="resume-hero__summary">{{ summary }}</p>

        <div class="resume-hero__contacts" aria-label="联系方式">
          <component
            :is="item.href ? 'a' : 'span'"
            v-for="item in contactItems"
            :key="item.label"
            class="resume-hero__contact"
            :href="item.href || undefined"
            :target="item.href?.startsWith('http') ? '_blank' : undefined"
            :rel="item.href?.startsWith('http') ? 'noreferrer' : undefined"
          >
            <component :is="item.icon" :size="15" aria-hidden="true" />
            <span>{{ item.label }}</span>
          </component>
        </div>
      </div>

      <div class="resume-hero__photo" aria-label="个人照片">
        <img v-if="photo" :src="photo" :alt="`${resume.title || 'Cherish'} 的照片`" />
        <div v-else class="resume-hero__photo-placeholder">
          <Image :size="28" aria-hidden="true" />
          <span>照片预留</span>
        </div>
      </div>
    </header>

    <div class="resume-layout">
      <aside class="resume-sidebar" aria-label="简历摘要">
        <section class="resume-side-card">
          <div class="resume-side-card__head">
            <GraduationCap :size="18" aria-hidden="true" />
            <h2>教育背景</h2>
          </div>
          <div class="resume-education">
            <article v-for="item in educationItems" :key="`${item.school}-${item.degree}`">
              <strong>{{ item.school }}</strong>
              <span>{{ item.degree }} · {{ item.major }}</span>
              <p v-if="item.focus">{{ item.focus }}</p>
            </article>
          </div>
        </section>

        <section class="resume-side-card">
          <div class="resume-side-card__head">
            <BriefcaseBusiness :size="18" aria-hidden="true" />
            <h2>能力关键词</h2>
          </div>
          <div class="resume-skills">
            <span v-for="skill in skillItems" :key="skill">{{ skill }}</span>
          </div>
        </section>

        <section class="resume-side-card resume-side-card--focus">
          <div class="resume-side-card__head">
            <Sparkles :size="18" aria-hidden="true" />
            <h2>当前方向</h2>
          </div>
          <p>具身智能、机器人学习、仿真训练与算法复现。</p>
        </section>
      </aside>

      <article class="resume-content">
        <ContentRenderer :value="resume" class="resume-content__body" />
      </article>
    </div>
  </section>
</template>

<style scoped>
.resume-page {
  width: min(1160px, 100%);
  margin: 0 auto;
  display: grid;
  gap: var(--space-24);
}

.resume-hero {
  position: relative;
  overflow: hidden;
  min-height: 250px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(176px, 260px);
  gap: clamp(0.85rem, 1.8vw, 1.35rem);
  align-items: flex-end;
  padding: clamp(1.25rem, 3vw, 2rem);
  border: 1px solid color-mix(in srgb, var(--color-primary) 18%, var(--color-border));
  border-radius: var(--radius-12);
  background:
    radial-gradient(circle at 12% 12%, color-mix(in srgb, var(--color-accent) 20%, transparent), transparent 32%),
    radial-gradient(circle at 82% 8%, color-mix(in srgb, var(--color-primary) 22%, transparent), transparent 34%),
    linear-gradient(135deg, color-mix(in srgb, var(--color-surface) 96%, white), color-mix(in srgb, var(--color-surface-soft) 86%, transparent));
  box-shadow: var(--shadow-soft);
}

.resume-hero::after {
  content: '';
  position: absolute;
  inset: auto -10% -45% 35%;
  height: 72%;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  filter: blur(16px);
  transform: rotate(-8deg);
  pointer-events: none;
}

.resume-hero__content,
.resume-hero__photo,
.resume-hero__card {
  position: relative;
  z-index: 1;
}

.resume-hero__photo {
  width: 176px;
  aspect-ratio: 3 / 4;
  justify-self: start;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--color-border) 78%, transparent);
  border-radius: var(--radius-12);
  background: color-mix(in srgb, var(--color-surface) 58%, transparent);
  box-shadow: 0 16px 42px color-mix(in srgb, var(--color-primary) 12%, transparent);
}

.resume-hero__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.resume-hero__photo-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  align-content: center;
  gap: var(--space-8);
  color: color-mix(in srgb, var(--color-accent) 78%, var(--color-fg));
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--color-accent) 12%, transparent), transparent 48%),
    color-mix(in srgb, var(--color-surface-soft) 74%, transparent);
  font-size: 0.86rem;
  font-weight: 800;
}

.resume-hero__content {
  width: min(840px, 100%);
}

.resume-hero h1 {
  margin-top: var(--space-12);
  font-size: clamp(2rem, 5vw, 3.8rem);
  letter-spacing: 0;
}

.resume-hero__role {
  margin-top: var(--space-8);
  max-width: 620px;
  font-size: clamp(1rem, 2vw, 1.18rem);
  color: color-mix(in srgb, var(--color-fg) 88%, var(--color-text-weak));
  font-weight: 700;
}

.resume-hero__summary {
  margin-top: var(--space-12);
  max-width: 780px;
  color: var(--color-text-weak);
  font-size: 0.98rem;
}

.resume-hero__contacts {
  margin-top: var(--space-24);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
}

.resume-hero__contact {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 36px;
  max-width: 100%;
  padding: 0 12px;
  border: 1px solid color-mix(in srgb, var(--color-border) 78%, transparent);
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--color-surface) 74%, transparent);
  color: var(--color-fg);
  text-decoration: none;
  font-size: 0.9rem;
  box-shadow: 0 10px 28px color-mix(in srgb, var(--color-primary) 8%, transparent);
}

.resume-hero__contact span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.resume-hero__mark {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-12);
  color: var(--color-accent);
  background: color-mix(in srgb, var(--color-accent) 13%, transparent);
}

.resume-hero__card strong {
  font-size: 1.12rem;
}

.resume-layout {
  display: grid;
  grid-template-columns: minmax(260px, 320px) minmax(0, 1fr);
  gap: var(--space-24);
  align-items: start;
}

.resume-sidebar {
  position: sticky;
  top: 92px;
  display: grid;
  gap: var(--space-16);
}

.resume-side-card,
.resume-content__body {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-12);
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
}

.resume-side-card {
  padding: var(--space-20, 20px);
}

.resume-side-card--focus p {
  margin-top: var(--space-12);
  color: var(--color-text-weak);
  font-size: 0.92rem;
}

.resume-side-card__head {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-primary);
}

.resume-side-card__head h2 {
  font-size: 1rem;
}

.resume-education {
  margin-top: var(--space-16);
  display: grid;
  gap: var(--space-16);
}

.resume-education article {
  display: grid;
  gap: 3px;
  padding-left: var(--space-12);
  border-left: 2px solid color-mix(in srgb, var(--color-primary) 28%, var(--color-border));
}

.resume-education strong {
  color: var(--color-fg);
}

.resume-education span,
.resume-education p {
  color: var(--color-text-weak);
  font-size: 0.9rem;
}

.resume-skills {
  margin-top: var(--space-16);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
}

.resume-skills span {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 10px;
  border-radius: var(--radius-pill);
  color: color-mix(in srgb, var(--color-primary) 78%, var(--color-fg));
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  font-size: 0.84rem;
  font-weight: 700;
}

.resume-content__body {
  padding: clamp(1rem, 2.2vw, 1.6rem);
  display: grid;
  gap: var(--space-16);
  color: var(--color-fg);
  line-height: 1.78;
}

.resume-content__body :deep(h2) {
  margin: var(--space-8) 0 0;
  padding: 0 0 var(--space-10, 10px);
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 78%, transparent);
  color: var(--color-fg);
  font-size: clamp(1.24rem, 2vw, 1.5rem);
  line-height: 1.28;
}

.resume-content__body :deep(h2:first-child) {
  margin-top: 0;
}

.resume-content__body :deep(h3) {
  margin: var(--space-8) 0 0;
  color: color-mix(in srgb, var(--color-primary) 82%, var(--color-fg));
  font-size: 1.06rem;
  line-height: 1.35;
}

.resume-content__body :deep(p) {
  margin: 0;
  color: var(--color-text-weak);
}

.resume-content__body :deep(ul) {
  margin: 0;
  padding-left: 1.15rem;
  display: grid;
  gap: var(--space-8);
  color: var(--color-text-weak);
}

.resume-content__body :deep(li::marker) {
  color: var(--color-primary);
}

.resume-content__body :deep(strong) {
  color: var(--color-fg);
}

@media (max-width: 900px) {
  .resume-hero {
    grid-template-columns: minmax(0, 1fr) minmax(132px, 168px);
    gap: var(--space-12);
    align-items: end;
  }

  .resume-hero__photo {
    width: 132px;
  }

  .resume-layout {
    grid-template-columns: 1fr;
  }

  .resume-sidebar {
    position: static;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .resume-page {
    gap: var(--space-16);
  }

  .resume-hero {
    grid-template-columns: 1fr;
    min-height: 220px;
    padding: var(--space-20, 20px);
  }

  .resume-hero__photo {
    position: absolute;
    top: var(--space-16);
    right: var(--space-16);
    width: 78px;
    aspect-ratio: 1;
    justify-self: auto;
  }

  .resume-hero h1 {
    font-size: 2.05rem;
  }

  .resume-hero__role {
    max-width: calc(100% - 96px);
  }

  .resume-hero__summary {
    max-width: none;
    margin-top: var(--space-10, 10px);
  }

  .resume-hero__contacts {
    display: grid;
    grid-template-columns: 1fr;
    gap: 7px;
  }

  .resume-hero__contact {
    justify-content: flex-start;
    width: 100%;
  }

  .resume-sidebar {
    grid-template-columns: 1fr;
  }

  .resume-content__body {
    border-radius: var(--radius-8);
  }
}
</style>
