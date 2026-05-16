<script setup lang="ts">
import type { ContentEntry } from '~/utils/content'

type CollectionName = 'todo' | 'blog' | 'wiki'

type ActivityItem = {
  title: string
  description: string
  dateLabel: string
  status?: string
  sortTime: number
  path: string
}

type HomeModule = {
  key: CollectionName
  title: string
  to: string
  accent: string
  eyebrow: string
  variant: 'static' | 'flip' | 'wide'
  empty: string
}

const modules: HomeModule[] = [
  {
    key: 'todo',
    title: '最新 TODO 规划',
    to: '/todo',
    accent: '#b16a11',
    eyebrow: 'Todo',
    variant: 'static',
    empty: '近一个月还没有新的 Todo 规划。',
  },
  {
    key: 'blog',
    title: '最新博客',
    to: '/blog',
    accent: '#1c8f7d',
    eyebrow: 'Blog',
    variant: 'flip',
    empty: '近一个月还没有新的博客。',
  },
  {
    key: 'wiki',
    title: '最新 WiKi',
    to: '/wiki',
    accent: '#8b5cf6',
    eyebrow: 'Wiki',
    variant: 'wide',
    empty: '近一个月还没有新的 Wiki。',
  },
]

const oneMonthAgo = new Date()
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

const readString = (entry: ContentEntry, key: string) => {
  const directValue = entry[key as keyof ContentEntry]
  const metaValue = entry.meta?.[key]
  const value = directValue || metaValue

  return typeof value === 'string' ? value : ''
}

const getEntryDate = (entry: ContentEntry) =>
  getContentDate(entry, ['date', 'publishedAt', 'updatedAt', 'startDate', 'targetDate'])

const parseEntryDate = (entry: ContentEntry) => {
  const rawDate = getEntryDate(entry)
  const date = rawDate ? new Date(rawDate) : null

  return date && !Number.isNaN(date.getTime()) ? date : null
}

const formatDate = (date: Date | null) =>
  date
    ? new Intl.DateTimeFormat('zh-CN', {
        month: '2-digit',
        day: '2-digit',
      }).format(date)
    : '最近'

const normalizeEntry = (entry: ContentEntry): ActivityItem | null => {
  const path = entry.path || ''

  if (path.endsWith('/README') || path.endsWith('/readme')) {
    return null
  }

  const date = parseEntryDate(entry)

  if (date && date < oneMonthAgo) {
    return null
  }

  return {
    title: readString(entry, 'title') || '未命名内容',
    description: readString(entry, 'description') || '新增内容已进入最近一个月的首页摘要。',
    dateLabel: formatDate(date),
    status: readString(entry, 'status'),
    sortTime: date?.getTime() || 0,
    path,
  }
}

const fetchCollection = async (collection: CollectionName) => {
  const entries = (await queryCollection(collection).all()) as ContentEntry[]

  return entries
    .map(normalizeEntry)
    .filter((entry): entry is ActivityItem => Boolean(entry))
    .sort((a, b) => b.sortTime - a.sortTime)
    .slice(0, 6)
}

const { data: activityGroups } = await useAsyncData('home-activity-showcase-v2', async () => {
  const [todo, blog, wiki] = await Promise.all([
    fetchCollection('todo'),
    fetchCollection('blog'),
    fetchCollection('wiki'),
  ])

  return { todo, blog, wiki }
})

const groups = computed<Record<CollectionName, ActivityItem[]>>(
  () =>
    activityGroups.value || {
      todo: [],
      blog: [],
      wiki: [],
    },
)
</script>

<template>
  <section class="activity-showcase" aria-label="最近内容">
    <article
      v-for="module in modules"
      :key="module.key"
      class="activity-module"
      :class="[`activity-module--${module.variant}`, `activity-module--${module.key}`]"
      :style="{ '--activity-accent': module.accent }"
    >
      <header class="activity-module__head">
        <p>{{ module.eyebrow }}</p>
        <h2>
          <NuxtLink :to="module.to">{{ module.title }}</NuxtLink>
        </h2>
        <span>最近 6 条</span>
      </header>

      <div v-if="groups[module.key].length" class="activity-module__items">
        <NuxtLink
          v-for="(item, index) in groups[module.key]"
          :key="`${module.key}-${item.title}-${index}`"
          class="activity-item"
          :class="[`activity-item--${module.variant}`, `activity-item--${module.key}`]"
          :style="{ '--item-index': index }"
          :to="item.path || module.to"
        >
          <span class="activity-item__inner">
            <span class="activity-item__face activity-item__front">
              <span class="activity-item__meta">
                <time>{{ item.dateLabel }}</time>
                <span v-if="item.status">{{ item.status }}</span>
              </span>
              <strong>{{ item.title }}</strong>
            </span>
            <span class="activity-item__face activity-item__back">
              <span>{{ item.description }}</span>
            </span>
          </span>
        </NuxtLink>
      </div>

      <NuxtLink v-else class="activity-empty" :to="module.to">
        <span>{{ module.empty }}</span>
        <small>新增 Markdown 后自动展示</small>
      </NuxtLink>
    </article>
  </section>
</template>

<style scoped>
.activity-showcase {
  width: 100%;
  margin: 0 auto;
  padding: var(--space-16) 0 var(--space-64);
  display: grid;
  gap: var(--space-48);
}

.activity-module {
  --activity-soft: color-mix(in srgb, var(--activity-accent) 12%, transparent);
  position: relative;
  padding: var(--space-48) var(--space-16);
  overflow: hidden;
  border-block: 1px solid color-mix(in srgb, var(--activity-accent) 12%, var(--color-border));
  border-radius: 0;
  background:
    radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--color-fg) 18%, transparent) 1px, transparent 1.6px),
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 96%, transparent), color-mix(in srgb, var(--color-bg) 92%, var(--color-surface)));
  background-size: 24px 24px, auto;
  animation: module-rise 560ms ease both;
}

.activity-module:nth-child(2) {
  animation-delay: 80ms;
}

.activity-module:nth-child(3) {
  animation-delay: 160ms;
}

.activity-module:nth-child(4) {
  animation-delay: 240ms;
}

.activity-module__head {
  position: relative;
  z-index: 1;
  width: min(860px, 100%);
  margin: 0 auto var(--space-48);
  display: grid;
  justify-items: center;
  gap: var(--space-8);
  text-align: center;
}

.activity-module__head p {
  color: color-mix(in srgb, var(--activity-accent) 58%, var(--color-text-weak));
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.activity-module__head h2 {
  font-size: clamp(2.3rem, 5.6vw, 4.4rem);
  line-height: 1;
}

.activity-module__head h2 a {
  color: var(--color-fg);
  text-decoration: none;
  text-shadow: 0 8px 26px color-mix(in srgb, var(--activity-accent) 12%, transparent);
  transition:
    color var(--motion-180) ease,
    transform var(--motion-180) ease;
}

.activity-module__head h2 a:hover {
  color: var(--activity-accent);
}

.activity-module__head span {
  color: var(--color-text-weak);
  font-size: 0.9rem;
}

.activity-module__items {
  position: relative;
  z-index: 1;
  width: min(1180px, 100%);
  margin: 0 auto;
  display: grid;
  gap: var(--space-16);
}

.activity-item,
.activity-empty {
  color: var(--color-fg);
  text-decoration: none;
}

.activity-item {
  position: relative;
  min-height: 244px;
  perspective: 1000px;
}

.activity-item__inner {
  position: absolute;
  inset: 0;
  display: block;
  border-radius: var(--radius-8);
  transform-style: preserve-3d;
  transition:
    transform 680ms cubic-bezier(0.2, 0.72, 0.2, 1),
    box-shadow 260ms ease;
}

.activity-item:hover .activity-item__inner,
.activity-item:focus-visible .activity-item__inner {
  box-shadow: var(--shadow-medium);
}

.activity-item__face {
  position: absolute;
  inset: 0;
  display: grid;
  align-content: center;
  gap: var(--space-10, 10px);
  padding: var(--space-16);
  border: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
  border-radius: var(--radius-4);
  background:
    linear-gradient(180deg, color-mix(in srgb, #fff 72%, transparent), transparent),
    color-mix(in srgb, var(--color-surface) 92%, var(--color-bg));
  box-shadow: 0 24px 50px rgba(18, 24, 38, 0.06);
  backface-visibility: hidden;
}

.activity-item__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
  color: var(--color-text-weak);
  font-size: 0.8rem;
  font-weight: 800;
}

.activity-item strong {
  font-size: clamp(1.1rem, 2vw, 1.38rem);
  line-height: 1.25;
  text-align: center;
}

.activity-item__back {
  color: var(--color-text-weak);
  font-size: 0.94rem;
  transform: rotateY(180deg);
}

.activity-module--flip .activity-item__back,
.activity-module--wide .activity-item__back {
  color: #384153;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--activity-accent) 10%, transparent), transparent 48%),
    color-mix(in srgb, #ffffff 94%, var(--activity-accent));
}

.activity-module--static .activity-module__items {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.activity-module--static .activity-item {
  min-height: 180px;
}

.activity-module--static .activity-item__face {
  place-items: center;
  text-align: center;
}

.activity-module--static .activity-item__front {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--activity-accent) 10%, transparent), transparent 40%),
    color-mix(in srgb, var(--color-surface) 92%, var(--color-bg));
}

.activity-module--static .activity-item:hover .activity-item__face,
.activity-module--static .activity-item:focus-visible .activity-item__face {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--activity-accent) 20%, transparent), transparent 40%),
    color-mix(in srgb, var(--activity-accent) 12%, var(--color-surface));
}

.activity-module--flip .activity-module__items {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.activity-module--flip .activity-item {
  min-height: 180px;
}

.activity-module--flip .activity-item__front {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--activity-accent) 8%, transparent), transparent 46%),
    color-mix(in srgb, #ffffff 96%, var(--activity-accent));
}

.activity-module--flip .activity-item__inner {
  transform-origin: center;
}

.activity-module--flip .activity-item:hover .activity-item__inner,
.activity-module--flip .activity-item:focus-visible .activity-item__inner {
  transform: rotateY(-180deg);
}

.activity-module--wide .activity-module__items {
  display: grid;
  gap: var(--space-16);
  width: min(1180px, calc(100% - var(--space-32)));
}

.activity-module--wide .activity-item {
  min-height: 150px;
}

.activity-module--wide .activity-item__inner {
  transform-origin: center;
}

.activity-module--wide .activity-item__face {
  align-content: center;
  padding-inline: clamp(var(--space-24), 4vw, var(--space-48));
}

.activity-module--wide .activity-item__front {
  text-align: left;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--activity-accent) 8%, transparent), transparent 46%),
    color-mix(in srgb, #ffffff 96%, var(--activity-accent));
}

.activity-module--wide .activity-item:hover .activity-item__inner,
.activity-module--wide .activity-item:focus-visible .activity-item__inner {
  transform: rotateY(180deg);
}

.activity-empty {
  position: relative;
  z-index: 1;
  width: min(720px, calc(100% - var(--space-32)));
  min-height: 220px;
  margin: 0 auto;
  padding: var(--space-20, 20px);
  display: grid;
  align-content: end;
  gap: var(--space-8);
  border: 1px dashed color-mix(in srgb, var(--activity-accent) 38%, var(--color-border));
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--activity-accent) 8%, transparent);
}

.activity-empty span {
  font-weight: 800;
}

.activity-empty small {
  color: var(--color-text-weak);
}

@keyframes module-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 980px) {
  .activity-module--static .activity-module__items,
  .activity-module--flip .activity-module__items {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .activity-showcase {
    padding-bottom: var(--space-48);
  }

  .activity-module {
    padding: var(--space-32) var(--space-16);
  }

  .activity-module__head {
    margin-bottom: var(--space-24);
  }

  .activity-module--static .activity-module__items,
  .activity-module--flip .activity-module__items {
    grid-template-columns: 1fr;
  }

  .activity-item {
    min-height: 168px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .activity-module {
    animation: none;
  }

  .activity-item__inner,
  .activity-module__head a {
    transition: none;
  }

  .activity-item:hover .activity-item__inner,
  .activity-item:focus-visible .activity-item__inner {
    transform: none;
  }
}
</style>
