<template>
  <div class="page-shell">
    <slot name="header" />

    <main class="page-shell__main">
      <div class="page-shell__content">
        <slot />
      </div>
    </main>

    <slot name="footer" />
    <slot name="floating" />
  </div>
</template>

<style scoped>
.page-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-shell__main {
  flex: 1;
  width: 100%;
}

.page-shell__content {
  width: min(var(--layout-content-width), calc(100% - 2 * var(--space-16)));
  margin: 0 auto;
  padding: var(--space-32) 0 var(--space-48);
}

@media (max-width: 768px) {
  .page-shell__content {
    padding: var(--space-24) 0 calc(var(--space-64) + 96px);
  }
}
</style>
