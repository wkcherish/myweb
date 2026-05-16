<template>
  <section class="home-section" aria-labelledby="home-overview-title">
    <p class="home-section__eyebrow">Overview</p>
    <h2 id="home-overview-title">一个给自己长期使用的个人知识入口。</h2>
    <p>
      Blog 放阶段性的思考和记录，Wiki 放可反复查阅的知识，Todo 展示接下来要推进的路线。网页只负责阅读和定位内容，正式内容仍从本地文件维护。
    </p>
  </section>
</template>

<style scoped>
.home-section {
  width: min(980px, 100%);
  margin: 0 auto;
  padding: 0 var(--space-16);
}

.home-section__eyebrow {
  color: var(--color-primary);
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.home-section h2 {
  margin-top: var(--space-8);
  font-size: clamp(1.8rem, 4vw, 3.4rem);
  line-height: 1.08;
}

.home-section p:last-child {
  width: min(720px, 100%);
  margin-top: var(--space-16);
  font-size: 1.05rem;
}
</style>
