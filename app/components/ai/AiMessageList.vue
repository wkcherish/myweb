<script setup lang="ts">
import { Bot, User } from 'lucide-vue-next'
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
  { text: '介绍一下你自己', icon: '🤖' },
  { text: '帮我写一段代码', icon: '💻' },
  { text: '解释一个概念', icon: '💡' },
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
      <h2 class="welcome__title">有什么我可以帮你的？</h2>
      <p class="welcome__desc">我是 Cherish 的笔记本助手，随时为你解答问题。</p>
      <div class="welcome__grid">
        <button
          v-for="s in suggestions"
          :key="s.text"
          class="welcome__card"
          type="button"
          @click="emit('suggestion', s.text)"
        >
          <span class="welcome__card-icon">{{ s.icon }}</span>
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
  padding: var(--space-16);
  scroll-behavior: smooth;
}

/* Welcome — top-aligned */
.msg-list.is-empty {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.welcome {
  display: grid;
  justify-items: center;
  gap: var(--space-10);
  text-align: center;
  padding-top: var(--space-32);
  width: 100%;
}

.welcome__avatar {
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 16%, transparent), color-mix(in srgb, var(--color-primary) 6%, transparent));
  color: var(--color-primary);
  box-shadow: 0 0 0 8px color-mix(in srgb, var(--color-primary) 6%, transparent);
}

.welcome__title {
  margin: 0;
  color: var(--color-fg);
  font-size: 1.1rem;
  font-weight: 700;
}

.welcome__desc {
  margin: 0;
  max-width: 280px;
  color: var(--color-text-weak);
  font-size: 0.84rem;
  line-height: 1.55;
}

.welcome__grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--space-8);
  width: 100%;
  max-width: 340px;
  margin-top: var(--space-8);
}

.welcome__card {
  display: grid;
  justify-items: center;
  gap: var(--space-6);
  padding: var(--space-10) var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-12);
  background: color-mix(in srgb, var(--color-fg) 2%, transparent);
  transition: border-color 160ms, background 160ms;
}

.welcome__card:hover {
  border-color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 4%, transparent);
}

.welcome__card-icon {
  font-size: 1.3rem;
  line-height: 1;
}

.welcome__card-text {
  color: var(--color-fg);
  font-size: 0.76rem;
  font-weight: 500;
  line-height: 1.35;
}

/* Messages */
.msg {
  display: flex;
  gap: var(--space-10);
  margin-bottom: var(--space-20);
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
  background: color-mix(in srgb, var(--color-fg) 4%, transparent);
  border-top-left-radius: 4px;
}

.msg--user .msg__text {
  background: var(--color-primary);
  color: #fff;
  border-top-right-radius: 4px;
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
