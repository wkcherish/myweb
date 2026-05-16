<script setup lang="ts">
import AiChatPanel from '~/components/ai/AiChatPanel.vue'
import AppFooter from '~/components/layout/AppFooter.vue'
import AppHeader from '~/components/layout/AppHeader.vue'
import MusicPlayer from '~/components/music/MusicPlayer.vue'
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
        <AiChatPanel />
        <MusicPlayer />
        <BlogPet />
      </ClientOnly>
    </template>
  </PageShell>
</template>
