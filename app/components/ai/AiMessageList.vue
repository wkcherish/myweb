<script setup lang="ts">
import { Bot, Code2, Lightbulb, Sparkles, User } from 'lucide-vue-next'
import type { AiMessage } from '~/composables/useAiChat'

const props = defineProps<{
  messages: AiMessage[]
  isLoading: boolean
}>()

const emit = defineEmits<{
  suggestion: [text: string]
}>()

const listRef = ref<HTMLElement | null>(null)
const hasMessages = computed(() => props.messages.length > 0)

const suggestions = [
  { text: '介绍一下你自己', icon: Sparkles },
  { text: '帮我写一段代码', icon: Code2 },
  { text: '解释一个概念', icon: Lightbulb },
]

function renderContent(text: string) {
  return text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/\n/g, '<br>')
}

function scrollToBottom() {
  void nextTick(() => {
    if (listRef.value) {
      listRef.value.scrollTop = listRef.value.scrollHeight
    }
  })
}

watch(() => props.messages.length, scrollToBottom)
watch(() => props.isLoading, (v) => { if (v) scrollToBottom() })
</script>

<template>
  <div ref="listRef" class="msg-list" :class="{ 'is-empty': !hasMessages && !isLoading }">
    <!-- Welcome — top aligned -->
    <div v-if="!hasMessages && !isLoading" class="welcome">
      <div class="welcome__avatar">
        <Bot :size="34" aria-hidden="true" />
      </div>
      <div class="welcome__copy">
        <h2 class="welcome__title">有什么我可以帮你的？</h2>
        <p class="welcome__desc">我是 Cherish 的笔记本助手，可以帮你查资料、整理想法和解释代码。</p>
      </div>
      <div class="welcome__grid">
        <button
          v-for="s in suggestions"
          :key="s.text"
          class="welcome__card"
          type="button"
          @click="emit('suggestion', s.text)"
        >
          <span class="welcome__card-icon">
            <component :is="s.icon" :size="17" aria-hidden="true" />
          </span>
          <span class="welcome__card-text">{{ s.text }}</span>
        </button>
      </div>
    </div>

    <!-- Messages -->
    <template v-for="(msg, index) in messages" :key="index">
      <div class="msg" :class="`msg--${msg.role}`">
        <div class="msg__avatar">
          <Bot v-if="msg.role !== 'user'" :size="16" aria-hidden="true" />
          <User v-else :size="16" aria-hidden="true" />
        </div>
        <div class="msg__body">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="msg__text" v-html="renderContent(msg.content)" />
        </div>
      </div>
    </template>

    <!-- Loading -->
    <div v-if="isLoading" class="msg msg--assistant">
      <div class="msg__avatar">
        <Bot :size="16" aria-hidden="true" />
      </div>
      <div class="msg__body">
        <div class="msg__text msg__text--loading">
          <span class="typing"><i /><i /><i /></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.msg-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: var(--space-18, 18px);
  background:
    radial-gradient(circle at 20% 0%, color-mix(in srgb, var(--color-primary) 8%, transparent), transparent 28%),
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface-soft) 40%, transparent), transparent 38%);
  scroll-behavior: smooth;
}

.msg-list.is-empty {
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome {
  display: grid;
  justify-items: center;
  align-content: center;
  gap: var(--space-16);
  text-align: center;
  width: min(100%, 372px);
  min-height: 100%;
  padding: var(--space-24) 0;
}

.welcome::before {
  content: "";
  width: 52px;
  height: 3px;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--color-primary) 28%, transparent);
  opacity: 0.75;
  order: 10;
}

.welcome__copy {
  display: grid;
  gap: var(--space-8);
  width: 100%;
}

.welcome__avatar {
  position: relative;
  display: grid;
  place-items: center;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--color-primary) 16%, white 84%), color-mix(in srgb, var(--color-accent) 10%, white 90%));
  color: var(--color-primary);
  box-shadow:
    0 18px 46px color-mix(in srgb, var(--color-primary) 15%, transparent),
    inset 0 0 0 1px rgb(255 255 255 / 0.78);
}

.welcome__avatar::after {
  content: "";
  position: absolute;
  inset: -9px;
  border: 1px solid color-mix(in srgb, var(--color-primary) 10%, transparent);
  border-radius: inherit;
}

.welcome__title {
  margin: 0;
  color: var(--color-fg);
  font-size: 1.18rem;
  font-weight: 760;
  letter-spacing: 0;
}

.welcome__desc {
  margin: 0;
  max-width: 300px;
  color: var(--color-text-weak);
  font-size: 0.86rem;
  line-height: 1.55;
  justify-self: center;
}

.welcome__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
  width: 100%;
  margin-top: var(--space-4);
}

.welcome__card {
  display: flex;
  align-items: center;
  gap: var(--space-10);
  min-height: 44px;
  padding: var(--space-8) var(--space-12);
  border: 1px solid color-mix(in srgb, var(--color-border) 74%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, var(--color-surface) 86%, transparent);
  box-shadow: 0 8px 20px rgb(16 24 40 / 0.045);
  text-align: left;
  transition:
    border-color 160ms,
    background 160ms,
    box-shadow 160ms,
    transform 160ms;
}

.welcome__card:hover {
  border-color: color-mix(in srgb, var(--color-primary) 38%, var(--color-border));
  background: var(--color-surface);
  box-shadow: 0 12px 28px rgb(16 24 40 / 0.07);
  transform: translateY(-1px);
}

.welcome__card-icon {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 9px;
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  color: var(--color-primary);
  flex: 0 0 auto;
}

.welcome__card-text {
  color: var(--color-fg);
  font-size: 0.84rem;
  font-weight: 620;
  line-height: 1.35;
}

/* Messages */
.msg {
  display: flex;
  gap: var(--space-10);
  margin-bottom: var(--space-18, 18px);
  animation: msg-in 200ms ease-out;
}

.msg--user {
  flex-direction: row-reverse;
}

.msg__avatar {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.36);
}

.msg--assistant .msg__avatar,
.msg--system .msg__avatar {
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
  color: var(--color-primary);
}

.msg--user .msg__avatar {
  background: color-mix(in srgb, var(--color-fg) 10%, transparent);
  color: var(--color-fg);
}

.msg__body {
  min-width: 0;
  max-width: 78%;
}

.msg__text {
  padding: var(--space-10) var(--space-14);
  border-radius: var(--radius-16);
  font-size: 0.88rem;
  line-height: 1.68;
  color: var(--color-fg);
  word-break: break-word;
}

.msg--assistant .msg__text,
.msg--system .msg__text {
  border: 1px solid color-mix(in srgb, var(--color-border) 76%, transparent);
  background: color-mix(in srgb, var(--color-surface) 90%, transparent);
  border-top-left-radius: 4px;
  box-shadow: 0 8px 22px rgb(16 24 40 / 0.045);
}

.msg--user .msg__text {
  background: linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 78%, var(--color-accent)));
  color: #fff;
  border-top-right-radius: 4px;
  box-shadow: 0 10px 26px color-mix(in srgb, var(--color-primary) 22%, transparent);
}

@media (min-width: 460px) {
  .welcome__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .welcome__card {
    display: grid;
    justify-items: center;
    align-content: center;
    min-height: 86px;
    padding: var(--space-12) var(--space-8);
    text-align: center;
  }
}

.msg__text--loading {
  padding: var(--space-10) var(--space-16);
}

.msg__text :deep(code) {
  padding: 1px 6px;
  border-radius: 4px;
  background: rgb(0 0 0 / 0.08);
  font-size: 0.84em;
  font-family: 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
}

.msg--user .msg__text :deep(code) {
  background: rgb(255 255 255 / 0.16);
}

.msg__text :deep(strong) {
  font-weight: 650;
}

.msg__text :deep(ul) {
  margin: var(--space-4) 0;
  padding-left: var(--space-16);
}

.msg__text :deep(li) {
  margin-bottom: var(--space-2);
}

/* Typing */
.typing {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 0;
}

.typing i {
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-text-weak);
  animation: dot 1.4s ease-in-out infinite;
}

.typing i:nth-child(2) { animation-delay: 0.2s; }
.typing i:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot {
  0%, 60%, 100% { transform: scale(0.5); opacity: 0.3; }
  30% { transform: scale(1); opacity: 1; }
}

@keyframes msg-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
