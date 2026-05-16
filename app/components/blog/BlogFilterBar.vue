<script setup lang="ts">
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-vue-next'

interface Props {
  search: string
  category: string
  tag: string
  categories: string[]
  tags: string[]
  archives: string[]
  activeArchive?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:category': [value: string]
  'update:tag': [value: string]
  'update:archive': [value: string]
  reset: []
}>()

const isOpen = ref(false)

const hasActiveFilter = computed(() =>
  Boolean(props.search.trim() || props.category || props.tag || props.activeArchive),
)
</script>

<template>
  <section class="blog-filter" aria-label="博客筛选">
    <div class="blog-filter__bar">
      <button
        type="button"
        class="blog-filter__toggle"
        :aria-expanded="isOpen"
        @click="isOpen = !isOpen"
      >
        <SlidersHorizontal :size="17" aria-hidden="true" />
        搜索与筛选
        <ChevronDown :size="16" aria-hidden="true" class="blog-filter__chevron" :class="{ 'is-open': isOpen }" />
      </button>

      <div class="blog-filter__summary">
        <span v-if="!hasActiveFilter">全部文章</span>
        <template v-else>
          <span v-if="search">“{{ search }}”</span>
          <span v-if="category">{{ category }}</span>
          <span v-if="tag">#{{ tag }}</span>
          <span v-if="activeArchive">{{ activeArchive }}</span>
        </template>
      </div>

      <button
        v-if="hasActiveFilter"
        type="button"
        class="blog-filter__clear"
        aria-label="重置筛选"
        @click="emit('reset')"
      >
        <X :size="15" aria-hidden="true" />
        清除
      </button>
    </div>

    <div v-if="isOpen" class="blog-filter__body">
      <label class="blog-filter__search">
        <Search :size="17" aria-hidden="true" />
        <span class="sr-only">搜索文章</span>
        <input
          :value="search"
          type="search"
          placeholder="搜索标题或摘要"
          @input="emit('update:search', ($event.target as HTMLInputElement).value)"
        >
      </label>

      <div class="blog-filter__selects">
        <select
          aria-label="按分类筛选"
          :value="category"
          @change="emit('update:category', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">全部分类</option>
          <option v-for="item in categories" :key="item" :value="item">
            {{ item }}
          </option>
        </select>

        <select
          aria-label="按月份归档筛选"
          :value="activeArchive || ''"
          @change="emit('update:archive', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">全部月份</option>
          <option v-for="item in archives" :key="item" :value="item">
            {{ item }}
          </option>
        </select>
      </div>

      <div v-if="tags.length" class="blog-filter__tags" aria-label="标签">
        <button
          v-for="item in tags"
          :key="item"
          type="button"
          class="blog-filter__tag"
          :class="{ 'is-active': tag === item }"
          @click="emit('update:tag', tag === item ? '' : item)"
        >
          {{ item }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.blog-filter {
  display: grid;
  gap: var(--space-10, 10px);
  padding: var(--space-12);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--color-surface) 94%, var(--color-bg));
}

.blog-filter__bar {
  min-height: 42px;
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.blog-filter__toggle,
.blog-filter__clear {
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  gap: var(--space-6, 6px);
  border-radius: var(--radius-pill);
  font-weight: 800;
}

.blog-filter__toggle {
  padding: 0 var(--space-10, 10px);
  color: var(--color-fg);
  background: color-mix(in srgb, var(--color-fg) 6%, transparent);
}

.blog-filter__chevron {
  transition: transform var(--motion-180) ease;
}

.blog-filter__chevron.is-open {
  transform: rotate(180deg);
}

.blog-filter__summary {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-6, 6px);
  color: var(--color-text-weak);
  font-size: 0.86rem;
}

.blog-filter__summary span {
  max-width: 18ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.blog-filter__clear {
  padding: 0 var(--space-8);
  color: var(--color-text-weak);
  background: transparent;
  font-size: 0.84rem;
}

.blog-filter__clear:hover {
  color: var(--color-fg);
  background: color-mix(in srgb, var(--color-fg) 7%, transparent);
}

.blog-filter__body {
  display: grid;
  gap: var(--space-10, 10px);
  padding-top: var(--space-8);
  border-top: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
}

.blog-filter__search {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: var(--space-8);
  padding: 0 var(--space-12);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-8);
  background: var(--color-surface);
}

.blog-filter__search input {
  width: 100%;
  min-width: 0;
  border: 0;
  background: transparent;
  outline: none;
}

.blog-filter__selects {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-8);
}

.blog-filter__selects select {
  min-height: 44px;
  padding: 0 var(--space-12);
}

.blog-filter__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
}

.blog-filter__tag {
  min-height: 32px;
  display: inline-flex;
  align-items: center;
  padding: 0 var(--space-10, 10px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-text-weak);
  background: transparent;
  font-size: 0.84rem;
  transition:
    background-color var(--motion-180) ease,
    border-color var(--motion-180) ease,
    color var(--motion-180) ease;
}

.blog-filter__tag:hover,
.blog-filter__tag.is-active {
  color: var(--color-fg);
  border-color: color-mix(in srgb, var(--color-accent) 46%, var(--color-border));
  background: color-mix(in srgb, var(--color-accent) 10%, transparent);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 700px) {
  .blog-filter__bar {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .blog-filter__summary {
    flex-basis: 100%;
    order: 3;
  }

  .blog-filter__selects {
    grid-template-columns: 1fr;
  }
}
</style>
