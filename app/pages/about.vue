<script setup lang="ts">
import { BookOpenText, Bot, Code2, GraduationCap, NotebookPen, PawPrint, Rocket, UserRound } from 'lucide-vue-next'
import BaseTag from '~/components/ui/BaseTag.vue'

const focusItems = [
  {
    title: '具身智能',
    desc: '围绕机器人如何在环境中感知、决策与执行动作持续学习。',
    icon: Bot,
  },
  {
    title: '算法复现',
    desc: '记录 LeRobot、ACT、强化学习和模仿学习相关实验过程。',
    icon: Rocket,
  },
  {
    title: '工程实践',
    desc: '把 Linux、Docker、Nuxt、内容管理等工具沉淀成长期可用的工作流。',
    icon: Code2,
  },
]

const timelineItems = [
  {
    label: '本科',
    title: '山东理工大学 · 机械电子工程',
    desc: '机器人方向，建立机械、电子、控制与机器人系统基础。',
  },
  {
    label: '硕士',
    title: '东华大学 · 机械工程',
    desc: '具身智能方向，关注机器人学习、仿真训练和智能体任务执行。',
  },
  {
    label: '现在',
    title: '持续建设个人知识库',
    desc: '用 Markdown 记录学习、项目、实验和路线图，让知识可以被复盘和复用。',
  },
]
</script>

<template>
  <section class="about-page">
    <header class="about-hero card-stagger">
      <div class="about-hero__orb" aria-hidden="true" />
      <div class="about-hero__text">
        <span class="about-hero__bar" aria-hidden="true" />
        <BaseTag tone="accent">About</BaseTag>
        <h1>关于我和这个站</h1>
        <p>
          这里是 Cherish 的个人 Notebook，用来记录具身智能、机器人学习、工程开发和生活思考。
          它不是一次性展示页，而是一个会随着学习和项目持续生长的知识库。
        </p>
        <div class="about-hero__actions">
          <NuxtLink to="/resume" class="about-hero__link">查看简历</NuxtLink>
          <NuxtLink to="/wiki" class="about-hero__link is-muted">浏览 Wiki</NuxtLink>
        </div>
      </div>

    </header>

    <div class="about-grid">
      <article v-for="item in focusItems" :key="item.title" class="about-card card-stagger">
        <span class="about-card__icon">
          <component :is="item.icon" :size="20" aria-hidden="true" />
        </span>
        <h2>{{ item.title }}</h2>
        <p>{{ item.desc }}</p>
      </article>
    </div>

    <section class="about-section about-identity card-stagger">
      <div class="about-section__head">
        <span>
          <UserRound :size="20" aria-hidden="true" />
        </span>
        <div>
          <h2>名字与域名</h2>
          <p>我叫王凯，网名一直使用 Cherish，所以这个站也延续了这个名字。</p>
        </div>
      </div>

      <div class="about-identity__grid">
        <div>
          <strong>Cherish</strong>
          <p>这是我长期使用的网名，也代表“珍惜记录、珍惜热爱、珍惜过程”。</p>
        </div>
        <div>
          <strong>cherish.wang</strong>
          <p>
            域名里的 cherish 对应我的网名，wang 对应我的姓氏“王”。它简单、好记，也更像一个属于自己的长期入口。
          </p>
        </div>
        <div>
          <strong>Cherish's Notebook</strong>
          <p>这个名字更接近网站的定位：不是作品集外壳，而是持续记录学习、研究和生活的个人笔记本。</p>
        </div>
      </div>
    </section>

    <section class="about-section about-pet card-stagger">
      <div class="about-section__head">
        <span>
          <PawPrint :size="20" aria-hidden="true" />
        </span>
        <div>
          <h2>宠物猴子</h2>
          <p>站点右下角的小猴子，是这个 Notebook 里的陪伴型小助手。</p>
        </div>
      </div>

      <div class="about-pet__body">
        <div class="about-pet__avatar" aria-hidden="true">猴</div>
        <div>
          <strong>它负责让这个站不只是冷冰冰的笔记页。</strong>
          <p>
            我把它设计成一个常驻在页面里的小伙伴，用来承载轻量互动、状态提示和一点个人风格。
            这个网站记录的是学习和长期积累，小猴子则像一个陪我一起整理内容、完成 Todo、打磨页面体验的虚拟宠物。
          </p>
        </div>
      </div>
    </section>

    <section class="about-section card-stagger">
      <div class="about-section__head">
        <span>
          <BookOpenText :size="20" aria-hidden="true" />
        </span>
        <div>
          <h2>这个网站记录什么</h2>
          <p>内容以 Markdown 为核心，围绕学习、研究、项目和复盘组织。</p>
        </div>
      </div>

      <div class="about-note-grid">
        <div>
          <NotebookPen :size="18" aria-hidden="true" />
          <strong>Blog</strong>
          <p>阶段性文章、开发记录、想法整理。</p>
        </div>
        <div>
          <BookOpenText :size="18" aria-hidden="true" />
          <strong>Wiki</strong>
          <p>长期笔记、算法复现、技术学习和工程备忘。</p>
        </div>
        <div>
          <Rocket :size="18" aria-hidden="true" />
          <strong>Todo</strong>
          <p>近期计划、功能路线和学习任务。</p>
        </div>
      </div>
    </section>

    <section class="about-section card-stagger">
      <div class="about-section__head">
        <span>
          <GraduationCap :size="20" aria-hidden="true" />
        </span>
        <div>
          <h2>学习轨迹</h2>
          <p>从机器人系统基础，到具身智能与机器人学习。</p>
        </div>
      </div>

      <div class="about-timeline">
        <article v-for="item in timelineItems" :key="item.label">
          <span>{{ item.label }}</span>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>

<style scoped>
.about-page {
  width: min(1120px, 100%);
  margin: 0 auto;
  display: grid;
  gap: var(--space-24);
}

.about-hero {
  --page-accent: var(--color-accent);
  position: relative;
  overflow: hidden;
  min-height: 330px;
  display: flex;
  align-items: flex-end;
  padding: clamp(1.35rem, 3.2vw, 2.4rem);
  border: 1px solid color-mix(in srgb, var(--color-accent) 20%, var(--color-border));
  border-radius: var(--radius-12);
  background:
    radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--color-fg) 14%, transparent) 1px, transparent 1.6px),
    radial-gradient(circle at 12% 12%, color-mix(in srgb, var(--color-primary) 18%, transparent), transparent 30%),
    radial-gradient(circle at 92% 6%, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 34%),
    linear-gradient(135deg, var(--color-surface), color-mix(in srgb, var(--color-surface-soft) 86%, transparent));
  background-size: 24px 24px, auto, auto, auto;
  box-shadow: var(--shadow-soft);
  transition: border-color var(--motion-240) ease;
}

.about-hero:hover {
  border-color: color-mix(in srgb, var(--color-accent) 36%, var(--color-border));
}

.about-hero__orb {
  position: absolute;
  top: -40%;
  right: -10%;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--color-accent) 10%, transparent), transparent 70%);
  pointer-events: none;
  animation: about-orb-drift 8000ms ease-in-out infinite alternate;
}

.about-hero__bar {
  display: block;
  width: 48px;
  height: 3px;
  margin-bottom: var(--space-12);
  border-radius: var(--radius-pill);
  background: linear-gradient(90deg, var(--color-accent), color-mix(in srgb, var(--color-accent) 40%, transparent));
  animation: about-bar-grow 680ms 120ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.about-hero::before {
  content: '';
  position: absolute;
  inset: 18% auto auto -80px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  filter: blur(8px);
}

.about-hero::after {
  content: '';
  position: absolute;
  right: clamp(1.2rem, 5vw, 4rem);
  bottom: clamp(1.1rem, 3vw, 2rem);
  width: clamp(92px, 13vw, 150px);
  height: clamp(92px, 13vw, 150px);
  border: 1px solid color-mix(in srgb, var(--color-accent) 18%, transparent);
  border-radius: 38% 62% 44% 56%;
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent 64%),
    color-mix(in srgb, var(--color-surface) 36%, transparent);
  opacity: 0.76;
  transform: rotate(-8deg);
}

.about-hero__text {
  position: relative;
  z-index: 1;
  width: min(760px, 100%);
}

.about-hero h1 {
  margin-top: var(--space-12);
  max-width: 680px;
  font-size: clamp(2rem, 5vw, 3.6rem);
  letter-spacing: 0;
}

.about-hero__text > p {
  margin-top: var(--space-16);
  max-width: 720px;
  font-size: clamp(1rem, 2vw, 1.14rem);
}

.about-hero__actions {
  margin-top: var(--space-24);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
}

.about-hero__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 var(--space-16);
  border: 1px solid color-mix(in srgb, var(--color-primary) 36%, transparent);
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--color-primary) 90%, var(--color-fg));
  color: #fff;
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 800;
  white-space: nowrap;
}

.about-hero__link.is-muted {
  background: color-mix(in srgb, var(--color-surface) 80%, transparent);
  color: var(--color-fg);
}

.about-card__icon,
.about-section__head > span {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-12);
  color: var(--color-accent);
  background: color-mix(in srgb, var(--color-accent) 13%, transparent);
}

.about-identity {
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--color-surface) 94%, white), color-mix(in srgb, var(--color-surface-soft) 74%, transparent));
}

.about-identity__grid {
  margin-top: var(--space-20, 20px);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-12);
}

.about-identity__grid > div {
  position: relative;
  min-height: 132px;
  display: grid;
  align-content: start;
  gap: var(--space-8);
  padding: var(--space-16);
  border: 1px solid color-mix(in srgb, var(--color-border) 74%, transparent);
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--color-surface) 72%, transparent);
  transition:
    border-color var(--motion-180) ease,
    transform var(--motion-240) cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow var(--motion-240) ease;
}

.about-identity__grid > div:hover {
  border-color: color-mix(in srgb, var(--color-accent) 36%, var(--color-border));
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(18, 24, 38, 0.06);
}

.about-identity__grid > div:nth-child(2)::before {
  content: '';
  width: 34px;
  height: 34px;
  position: absolute;
  top: var(--space-16);
  right: var(--space-16);
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--color-accent) 12%, transparent);
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'/%3E%3Cpath d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'/%3E%3C/svg%3E") center / 18px 18px no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'/%3E%3Cpath d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'/%3E%3C/svg%3E") center / 18px 18px no-repeat;
}

.about-identity__grid strong {
  color: var(--color-fg);
  font-size: 1rem;
}

.about-pet {
  overflow: hidden;
  background:
    radial-gradient(circle at 94% 8%, color-mix(in srgb, var(--color-accent) 16%, transparent), transparent 28%),
    var(--color-surface);
}

.about-pet__body {
  margin-top: var(--space-20, 20px);
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: var(--space-16);
  align-items: center;
  padding: var(--space-16);
  border: 1px solid color-mix(in srgb, var(--color-border) 72%, transparent);
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--color-surface-soft) 58%, transparent);
}

.about-pet__avatar {
  width: 88px;
  height: 88px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 28px;
  color: color-mix(in srgb, var(--color-accent) 84%, var(--color-fg));
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--color-accent) 16%, transparent), color-mix(in srgb, var(--color-primary) 10%, transparent)),
    var(--color-surface);
  font-size: 1.35rem;
  font-weight: 900;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-accent) 18%, transparent);
}

.about-pet__body strong {
  color: var(--color-fg);
}

.about-pet__body p {
  margin-top: var(--space-8);
}

.about-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-16);
}

.about-card,
.about-section {
  position: relative;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-12);
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
  transition:
    border-color var(--motion-180) ease,
    transform var(--motion-240) cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow var(--motion-240) ease;
}

.about-card:hover,
.about-section:hover {
  border-color: color-mix(in srgb, var(--color-accent) 36%, var(--color-border));
  transform: translateY(-3px);
  box-shadow:
    0 12px 32px rgba(18, 24, 38, 0.08),
    0 0 0 1px color-mix(in srgb, var(--color-accent) 12%, transparent);
}

.about-card {
  display: grid;
  gap: var(--space-10, 10px);
  padding: var(--space-20, 20px);
}

.about-card h2 {
  font-size: 1.05rem;
  transition: color var(--motion-180) ease;
}

.about-card:hover h2 {
  color: var(--color-accent);
}

.about-card__icon {
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
}

.about-section {
  padding: clamp(1rem, 2.2vw, 1.5rem);
}

.about-section__head {
  display: flex;
  gap: var(--space-12);
  align-items: flex-start;
}

.about-section__head h2 {
  font-size: 1.2rem;
}

.about-note-grid {
  margin-top: var(--space-20, 20px);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-12);
}

.about-note-grid > div {
  display: grid;
  gap: 6px;
  padding: var(--space-16);
  border-radius: var(--radius-8);
  background: color-mix(in srgb, var(--color-surface-soft) 62%, transparent);
  border: 1px solid transparent;
  transition:
    border-color var(--motion-180) ease,
    transform var(--motion-240) cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow var(--motion-240) ease;
}

.about-note-grid > div:hover {
  border-color: color-mix(in srgb, var(--color-primary) 30%, var(--color-border));
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(18, 24, 38, 0.06);
}

.about-note-grid svg {
  color: var(--color-primary);
}

.about-timeline {
  margin-top: var(--space-20, 20px);
  display: grid;
  gap: var(--space-12);
}

.about-timeline article {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: var(--space-12);
  align-items: start;
  padding: var(--space-8) 0;
  transition: transform var(--motion-180) ease;
}

.about-timeline article:hover {
  transform: translateX(4px);
}

.about-timeline article:not(:last-child) {
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 60%, transparent);
  padding-bottom: var(--space-12);
}

.about-timeline article > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  color: color-mix(in srgb, var(--color-primary) 82%, var(--color-fg));
  font-size: 0.82rem;
  font-weight: 800;
}

.about-timeline h3 {
  font-size: 1rem;
}

@media (max-width: 900px) {
  .about-grid,
  .about-identity__grid,
  .about-note-grid {
    grid-template-columns: 1fr;
  }

  .about-hero {
    min-height: auto;
  }
}

@media (max-width: 640px) {
  .about-page {
    gap: var(--space-16);
  }

  .about-hero {
    min-height: 300px;
    padding: var(--space-20, 20px);
  }

  .about-hero::after {
    right: -24px;
    bottom: -26px;
    width: 118px;
    height: 118px;
    opacity: 0.5;
  }

  .about-hero h1 {
    font-size: 2rem;
  }

  .about-hero__actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .about-hero__link {
    padding: 0 var(--space-12);
    font-size: 0.88rem;
  }

  .about-pet__body {
    grid-template-columns: 1fr;
  }

  .about-pet__avatar {
    width: 72px;
    height: 72px;
    border-radius: var(--radius-12);
  }

  .about-timeline article {
    grid-template-columns: 58px minmax(0, 1fr);
  }
}

@keyframes about-orb-drift {
  from {
    transform: translate(0, 0) scale(1);
  }

  to {
    transform: translate(-24px, 16px) scale(1.08);
  }
}

@keyframes about-bar-grow {
  from {
    opacity: 0;
    transform: scaleX(0);
    transform-origin: left;
  }

  to {
    opacity: 1;
    transform: scaleX(1);
    transform-origin: left;
  }
}

@media (prefers-reduced-motion: reduce) {
  .about-hero__orb,
  .about-hero__bar {
    animation: none;
  }
}
</style>
