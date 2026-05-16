<script setup lang="ts">
import AppFooter from '~/components/layout/AppFooter.vue'
import AppHeader from '~/components/layout/AppHeader.vue'
import PageShell from '~/components/layout/PageShell.vue'
import BlogPet from '~/components/pet/BlogPet.vue'
</script>

<template>
  <PageShell>
    <template #header>
      <AppHeader />
    </template>

    <slot />

    <template #footer>
      <AppFooter />
    </template>

    <template #floating>
      <ClientOnly>
        <BlogPet />
      </ClientOnly>
    </template>
  </PageShell>
</template>
