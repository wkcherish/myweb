<template>
  <section class="home-list" aria-labelledby="home-posts-title">
    <div class="home-list__head">
      <div>
        <p>Blog</p>
        <h2 id="home-posts-title">最近会写的方向</h2>
      </div>
      <NuxtLink to="/blog">进入 Blog</NuxtLink>
    </div>

    <ul>
      <li>
        <time datetime="2026-05">2026.05</time>
        <strong>Nuxt 个人站搭建记录</strong>
        <span>开发 / 前端 / 个人网站</span>
      </li>
      <li>
        <time datetime="2026-05">2026.05</time>
        <strong>把学习过程整理成可检索知识</strong>
        <span>学习 / 知识管理</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.home-list {
  width: min(980px, 100%);
  margin: 0 auto;
  padding: 0 var(--space-16);
}

.home-list__head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-16);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--space-16);
}

.home-list__head p {
  color: var(--color-primary);
  font-size: 0.78rem;
  font-weight: 800;
}

.home-list__head h2 {
  margin-top: var(--space-4);
  font-size: clamp(1.35rem, 3vw, 2rem);
}

.home-list__head a {
  flex: 0 0 auto;
  font-weight: 700;
}

.home-list ul {
  display: grid;
  gap: var(--space-16);
  margin: var(--space-16) 0 0;
  padding: 0;
  list-style: none;
}

.home-list li {
  display: grid;
  grid-template-columns: 96px 1fr auto;
  gap: var(--space-16);
  align-items: baseline;
  padding-bottom: var(--space-16);
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 72%, transparent);
}

.home-list time,
.home-list span {
  color: var(--color-text-weak);
  font-size: 0.92rem;
}

.home-list strong {
  color: var(--color-fg);
  font-size: 1.05rem;
}

@media (max-width: 700px) {
  .home-list__head,
  .home-list li {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
}
</style>
