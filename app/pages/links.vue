<script setup lang="ts">
import { ArrowUpRight, BookMarked, Globe2, HeartHandshake, Sparkles } from 'lucide-vue-next'
import BaseTag from '~/components/ui/BaseTag.vue'

const friendLinks = [
  {
    name: '朋友博客',
    url: 'https://www.tungchiahui.cn/',
    domain: 'tungchiahui.cn',
    desc: '朋友的个人博客，记录学习、技术和生活内容。',
    tags: ['Blog', 'Friend', 'Life'],
  },
]
</script>

<template>
  <section class="links-page">
    <header class="links-hero">
      <div class="links-hero__content">
        <BaseTag tone="accent">Friends</BaseTag>
        <h1>友情链接</h1>
        <p>这里放一些认真维护的个人站点。链接不追求多，优先留下真实、长期、值得回访的内容入口。</p>
      </div>

      <div class="links-hero__badge" aria-label="朋友站点">
        <HeartHandshake :size="26" aria-hidden="true" />
        <strong>{{ friendLinks.length }}</strong>
        <span>Friend Site</span>
      </div>
    </header>

    <div class="links-board">
      <div class="links-board__head">
        <span>
          <BookMarked :size="18" aria-hidden="true" />
        </span>
        <div>
          <h2>朋友站点</h2>
          <p>点击卡片会在新窗口打开。</p>
        </div>
      </div>

      <div class="friend-list">
        <a
          v-for="item in friendLinks"
          :key="item.url"
          class="friend-card"
          :href="item.url"
          target="_blank"
          rel="noreferrer"
        >
          <span class="friend-card__mark">
            <Globe2 :size="24" aria-hidden="true" />
          </span>

          <span class="friend-card__main">
            <span class="friend-card__topline">
              <strong>{{ item.name }}</strong>
              <span class="friend-card__domain">{{ item.domain }}</span>
            </span>
            <span class="friend-card__desc">{{ item.desc }}</span>
            <span class="friend-card__tags">
              <em v-for="tag in item.tags" :key="tag">{{ tag }}</em>
            </span>
          </span>

          <span class="friend-card__open">
            <ArrowUpRight :size="18" aria-hidden="true" />
          </span>
        </a>
      </div>
    </div>

    <aside class="links-note">
      <Sparkles :size="18" aria-hidden="true" />
      <p>如果后续有更多朋友站点，可以继续按当前卡片结构追加，页面会自动适配 PC 和移动端。</p>
    </aside>
  </section>
</template>

<style scoped>
.links-page {
  width: min(1040px, 100%);
  margin: 0 auto;
  display: grid;
  gap: var(--space-20, 20px);
}

.links-hero {
  position: relative;
  overflow: hidden;
  min-height: 250px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 180px;
  gap: var(--space-24);
  align-items: end;
  padding: clamp(1.25rem, 3vw, 2.15rem);
  border: 1px solid color-mix(in srgb, var(--color-accent) 22%, var(--color-border));
  border-radius: var(--radius-12);
  background:
    radial-gradient(circle at 12% 6%, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 34%),
    radial-gradient(circle at 94% 14%, color-mix(in srgb, var(--color-primary) 18%, transparent), transparent 36%),
    linear-gradient(135deg, color-mix(in srgb, var(--color-surface) 96%, white), color-mix(in srgb, var(--color-surface-soft) 82%, transparent));
  box-shadow: var(--shadow-soft);
}

.links-hero::after {
  content: '';
  position: absolute;
  inset: auto -8% -42% 32%;
  height: 72%;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  filter: blur(18px);
  transform: rotate(-7deg);
  pointer-events: none;
}

.links-hero__content,
.links-hero__badge {
  position: relative;
  z-index: 1;
}

.links-hero h1 {
  margin-top: var(--space-12);
  font-size: clamp(2.15rem, 5vw, 3.6rem);
  letter-spacing: 0;
}

.links-hero p {
  margin-top: var(--space-12);
  max-width: 640px;
  font-size: 1.02rem;
}

.links-hero__badge {
  min-height: 170px;
  display: grid;
  align-content: end;
  gap: var(--space-8);
  padding: var(--space-20, 20px);
  border: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
  border-radius: var(--radius-12);
  background: color-mix(in srgb, var(--color-surface) 68%, transparent);
  backdrop-filter: blur(12px);
}

.links-hero__badge svg {
  color: var(--color-accent);
}

.links-hero__badge strong {
  font-size: 2.2rem;
  line-height: 1;
}

.links-hero__badge span {
  color: var(--color-text-weak);
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
}

.links-board,
.links-note {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-12);
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
}

.links-board {
  padding: clamp(1rem, 2.3vw, 1.5rem);
}

.links-board__head {
  display: flex;
  align-items: flex-start;
  gap: var(--space-12);
}

.links-board__head > span {
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-12);
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
}

.links-board__head h2 {
  font-size: 1.18rem;
}

.friend-list {
  margin-top: var(--space-20, 20px);
  display: grid;
  gap: var(--space-12);
}

.friend-card {
  position: relative;
  overflow: hidden;
  min-height: 138px;
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr) 40px;
  gap: var(--space-16);
  align-items: center;
  padding: var(--space-20, 20px);
  border: 1px solid color-mix(in srgb, var(--color-border) 80%, transparent);
  border-radius: var(--radius-12);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--color-surface-soft) 44%, transparent), transparent 58%),
    color-mix(in srgb, var(--color-surface) 96%, transparent);
  color: var(--color-fg);
  text-decoration: none;
  transition:
    border-color var(--motion-180) ease,
    transform var(--motion-180) ease,
    box-shadow var(--motion-180) ease;
}

.friend-card:hover {
  border-color: color-mix(in srgb, var(--color-primary) 36%, var(--color-border));
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.friend-card__mark,
.friend-card__open {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-12);
}

.friend-card__mark {
  width: 58px;
  height: 58px;
  color: var(--color-accent);
  background: color-mix(in srgb, var(--color-accent) 13%, transparent);
}

.friend-card__main {
  min-width: 0;
  display: grid;
  gap: var(--space-8);
}

.friend-card__topline {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: var(--space-12);
}

.friend-card__topline strong {
  color: var(--color-fg);
  font-size: 1.16rem;
}

.friend-card__domain {
  overflow: hidden;
  color: var(--color-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.9rem;
  font-weight: 800;
}

.friend-card__desc {
  color: var(--color-text-weak);
  overflow-wrap: anywhere;
}

.friend-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
}

.friend-card__tags em {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 0 9px;
  border-radius: var(--radius-pill);
  color: color-mix(in srgb, var(--color-accent) 82%, var(--color-fg));
  background: color-mix(in srgb, var(--color-accent) 11%, transparent);
  font-size: 0.76rem;
  font-style: normal;
  font-weight: 800;
}

.friend-card__open {
  width: 40px;
  height: 40px;
  color: var(--color-text-weak);
  background: color-mix(in srgb, var(--color-surface-soft) 74%, transparent);
}

.friend-card:hover .friend-card__open {
  color: var(--color-primary);
}

.links-note {
  display: flex;
  align-items: center;
  gap: var(--space-10, 10px);
  padding: var(--space-16);
  color: var(--color-text-weak);
  background: color-mix(in srgb, var(--color-surface-soft) 54%, var(--color-surface));
}

.links-note svg {
  flex: 0 0 auto;
  color: var(--color-accent);
}

@media (max-width: 760px) {
  .links-page {
    gap: var(--space-16);
  }

  .links-hero {
    min-height: auto;
    grid-template-columns: 1fr;
    padding: var(--space-20, 20px);
  }

  .links-hero h1 {
    font-size: 2.05rem;
  }

  .links-hero__badge {
    min-height: auto;
    grid-template-columns: auto auto 1fr;
    align-items: center;
    align-content: center;
  }

  .links-hero__badge strong {
    font-size: 1.5rem;
  }

  .friend-card {
    grid-template-columns: 48px minmax(0, 1fr);
    min-height: 150px;
    padding: var(--space-16);
  }

  .friend-card__mark {
    width: 48px;
    height: 48px;
  }

  .friend-card__open {
    position: absolute;
    top: var(--space-16);
    right: var(--space-16);
  }

  .friend-card__topline {
    display: grid;
    gap: 2px;
    padding-right: 42px;
  }

  .links-note {
    align-items: flex-start;
  }
}
</style>
