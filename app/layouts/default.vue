<script setup lang="ts">
import AppFooter from '~/components/layout/AppFooter.vue'
import AppHeader from '~/components/layout/AppHeader.vue'
import AppUtilityDock from '~/components/layout/AppUtilityDock.vue'
import PageShell from '~/components/layout/PageShell.vue'
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
        <AppUtilityDock />
      </ClientOnly>
    </template>
  </PageShell>
</template>
