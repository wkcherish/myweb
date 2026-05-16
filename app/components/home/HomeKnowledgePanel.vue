<template>
  <section class="home-split" aria-labelledby="home-wiki-title">
    <div>
      <p>Wiki</p>
      <h2 id="home-wiki-title">把零散知识沉下来。</h2>
    </div>
    <div class="home-split__body">
      <p>这里会放可复用的开发笔记、工具链记录和问题复盘。它不是在线编辑器，只是一个更安静的阅读入口。</p>
      <NuxtLink to="/wiki">查看 Wiki</NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.home-split {
  width: min(980px, 100%);
  margin: 0 auto;
  padding: var(--space-32) var(--space-16);
  display: grid;
  grid-template-columns: minmax(220px, 0.8fr) minmax(0, 1.2fr);
  gap: var(--space-32);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.home-split p:first-child {
  color: var(--color-primary);
  font-size: 0.78rem;
  font-weight: 800;
}

.home-split h2 {
  margin-top: var(--space-8);
  font-size: clamp(1.5rem, 3vw, 2.4rem);
}

.home-split__body {
  display: grid;
  align-content: center;
  gap: var(--space-16);
}

.home-split__body a {
  width: fit-content;
  font-weight: 700;
}

@media (max-width: 700px) {
  .home-split {
    grid-template-columns: 1fr;
    gap: var(--space-16);
  }
}
</style>
