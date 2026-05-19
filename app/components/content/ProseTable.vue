<template>
  <div class="prose-table-scroll">
    <table>
      <slot />
    </table>
  </div>
</template>

<style scoped>
.prose-table-scroll {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-8);
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
  -webkit-overflow-scrolling: touch;
}

.prose-table-scroll table {
  margin: 0;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}
</style>
