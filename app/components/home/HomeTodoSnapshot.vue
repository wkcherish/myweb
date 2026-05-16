<template>
  <section class="todo-snapshot" aria-labelledby="home-todo-title">
    <div>
      <p>Todo</p>
      <h2 id="home-todo-title">当前路线图</h2>
    </div>
    <dl>
      <div>
        <dt>Planning</dt>
        <dd>阶段 4</dd>
      </div>
      <div>
        <dt>Focus</dt>
        <dd>首页</dd>
      </div>
      <div>
        <dt>Next</dt>
        <dd>内容目录</dd>
      </div>
    </dl>
    <NuxtLink to="/todo">查看 Todo</NuxtLink>
  </section>
</template>

<style scoped>
.todo-snapshot {
  width: min(980px, 100%);
  margin: 0 auto;
  padding: 0 var(--space-16) var(--space-48);
  display: grid;
  gap: var(--space-24);
}

.todo-snapshot p {
  color: var(--color-primary);
  font-size: 0.78rem;
  font-weight: 800;
}

.todo-snapshot h2 {
  margin-top: var(--space-4);
  font-size: clamp(1.35rem, 3vw, 2rem);
}

.todo-snapshot dl {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-12);
  margin: 0;
}

.todo-snapshot div {
  padding: var(--space-16);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--color-surface) 72%, transparent);
}

.todo-snapshot dt {
  color: var(--color-text-weak);
  font-size: 0.85rem;
}

.todo-snapshot dd {
  margin: var(--space-4) 0 0;
  color: var(--color-fg);
  font-size: 1.3rem;
  font-weight: 800;
}

.todo-snapshot a {
  width: fit-content;
  font-weight: 700;
}

@media (max-width: 700px) {
  .todo-snapshot dl {
    grid-template-columns: 1fr;
  }
}
</style>
