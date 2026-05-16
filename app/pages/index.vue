<template>
  <div class="home-page">
    <HomeMimoInspiredHero />
    <HomeOverview />
    <HomeRecentPosts />
    <HomeKnowledgePanel />
    <HomeTodoSnapshot />
  </div>
</template>

<style scoped>
.home-page {
  display: grid;
  gap: var(--space-48);
  margin: calc(var(--space-32) * -1) calc(var(--space-16) * -1) 0;
}
</style>
