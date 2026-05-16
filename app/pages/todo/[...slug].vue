<script setup lang="ts">
const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
const path = `/todo/${slug}`
const noteDate = computed(() => formatContentDate(getContentDateFromPath(path)))

const { data: page } = await useAsyncData(`todo-${path}`, () => {
  return queryCollection('todo').path(path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Todo not found' })
}
</script>

<template>
  <article class="content-detail">
    <header class="content-detail__head">
      <NuxtLink to="/todo">Todo</NuxtLink>
      <h1>{{ page?.title }}</h1>
      <div class="content-detail__meta">
        <time>{{ noteDate }}</time>
        <p v-if="page?.description">{{ page.description }}</p>
        <ContentVisitCount :path="path" increment />
      </div>
    </header>
    <ContentRenderer v-if="page" :value="page" class="content-detail__body" />
  </article>
</template>

<style scoped>
.content-detail {
  width: min(820px, 100%);
  margin: 0 auto;
  display: grid;
  gap: var(--space-32);
}

.content-detail__head {
  display: grid;
  gap: var(--space-12);
}

.content-detail__head a {
  width: fit-content;
  font-weight: 800;
}

.content-detail__head h1 {
  font-size: clamp(2rem, 5vw, 3.2rem);
}

.content-detail__meta {
  display: grid;
  gap: var(--space-8);
}

.content-detail__body {
  color: var(--color-fg);
}
</style>
