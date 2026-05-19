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
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-shell__main {
  flex: 1;
  width: 100%;
}

.page-shell__content {
  width: 100%;
  padding: var(--space-32) var(--space-16) var(--space-48);
}

@media (max-width: 768px) {
  .page-shell__content {
    padding: var(--space-16) var(--space-12) var(--space-48);
  }
}
</style>
