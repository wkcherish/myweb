<template>
  <div class="app-shell">
    <header class="site-header">
      <NuxtLink class="brand" to="/">Cherish Notebook</NuxtLink>
      <nav class="nav-links" aria-label="Primary">
        <NuxtLink to="/blog">Blog</NuxtLink>
        <NuxtLink to="/wiki">Wiki</NuxtLink>
        <NuxtLink to="/todo">Todo</NuxtLink>
        <NuxtLink to="/about">关于</NuxtLink>
      </nav>
    </header>

    <main class="page-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
}

.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.brand {
  font-weight: 700;
  text-decoration: none;
  color: inherit;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-links a {
  text-decoration: none;
  color: var(--color-text-secondary);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
}

.nav-links a.router-link-active {
  color: var(--color-text-primary);
  background: var(--color-surface-muted);
}

.page-main {
  width: min(960px, 100% - 2rem);
  margin: 0 auto;
  padding: 2rem 0 3rem;
}
</style>
