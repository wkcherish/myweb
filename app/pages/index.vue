<template>
  <div class="home-page">
    <HomeMimoInspiredHero />
    <HomeActivityShowcase />
  </div>
</template>

<style scoped>
.home-page {
  display: grid;
  gap: var(--space-48);
  margin: calc(var(--space-32) * -1) calc(var(--space-16) * -1) 0;
  max-width: 100vw;
  overflow-x: hidden;
}
</style>
