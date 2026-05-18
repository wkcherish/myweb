<script setup lang="ts">
import { CheckCircle2, CircleDot, Clock3, PauseCircle, Sigma } from 'lucide-vue-next'
import { computed, onMounted, watch } from 'vue'

type TodoStatus = 'planned' | 'in-progress' | 'done' | 'paused'

const props = defineProps<{
  counts: Record<TodoStatus, number>
  total: number
}>()

const labels: Record<TodoStatus, string> = {
  planned: '计划中',
  'in-progress': '进行中',
  done: '已完成',
  paused: '搁置',
}

const statusItems = computed(() => [
  { status: 'planned' as const, label: labels.planned, icon: Clock3 },
  { status: 'in-progress' as const, label: labels['in-progress'], icon: CircleDot },
  { status: 'done' as const, label: labels.done, icon: CheckCircle2 },
  { status: 'paused' as const, label: labels.paused, icon: PauseCircle },
])

function celebrateCompletedTodos(doneCount: number) {
  if (!import.meta.client || doneCount <= 0) {
    return
  }

  window.dispatchEvent(
    new CustomEvent('notebook:pet-celebrate', {
      detail: {
        message: doneCount > 1 ? `完成 ${doneCount} 项` : '完成啦',
      },
    }),
  )
}

onMounted(() => {
  if (props.counts.done > 0) {
    window.setTimeout(() => {
      celebrateCompletedTodos(props.counts.done)
    }, 720)
  }
})

watch(
  () => props.counts.done,
  (nextDoneCount, previousDoneCount) => {
    if (nextDoneCount > previousDoneCount) {
      celebrateCompletedTodos(nextDoneCount)
    }
  },
)
</script>

<template>
  <section class="todo-overview" aria-label="Todo 概览">
    <div class="todo-overview__main">
      <span class="todo-overview__icon">
        <Sigma :size="20" aria-hidden="true" />
      </span>
      <div>
        <span>总计</span>
        <strong>{{ total }}</strong>
      </div>
    </div>

    <div class="todo-overview__grid">
      <div
        v-for="item in statusItems"
        :key="item.status"
        class="todo-overview__item"
        :class="`is-${item.status}`"
      >
        <span class="todo-overview__status">
          <component :is="item.icon" :size="16" aria-hidden="true" />
          {{ item.label }}
        </span>
        <strong>{{ counts[item.status] }}</strong>
      </div>
    </div>
  </section>
</template>

<style scoped>
.todo-overview {
  display: grid;
  grid-template-columns: minmax(180px, 0.58fr) minmax(0, 2fr);
  gap: 10px;
  padding: 10px;
  border: 1px solid color-mix(in srgb, var(--color-border) 82%, transparent);
  border-radius: var(--radius-12);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--color-surface) 96%, white), var(--color-surface)),
    var(--color-surface);
  box-shadow: var(--shadow-soft);
}

.todo-overview__main,
.todo-overview__item {
  min-width: 0;
  border-radius: var(--radius-8);
}

.todo-overview__main {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
}

.todo-overview__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  border-radius: var(--radius-8);
  background: var(--color-surface);
  color: var(--color-primary);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-primary) 12%, transparent);
}

.todo-overview__main span {
  color: var(--color-text-weak);
  font-weight: 800;
}

.todo-overview strong {
  display: block;
  color: var(--color-fg);
  font-size: clamp(1.45rem, 3vw, 2.15rem);
  line-height: 1;
}

.todo-overview__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.todo-overview__item {
  display: grid;
  align-content: space-between;
  min-height: 92px;
  gap: 12px;
  padding: 12px;
  border: 1px solid color-mix(in srgb, var(--todo-tone) 24%, var(--color-border));
  background: color-mix(in srgb, var(--todo-tone) 8%, var(--color-surface));
}

.todo-overview__item.is-planned {
  --todo-tone: var(--color-warning);
}

.todo-overview__item.is-in-progress {
  --todo-tone: var(--color-primary);
}

.todo-overview__item.is-done {
  --todo-tone: var(--color-success);
}

.todo-overview__item.is-paused {
  --todo-tone: var(--color-text-weak);
}

.todo-overview__status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  color: color-mix(in srgb, var(--todo-tone) 76%, var(--color-fg));
  font-size: 0.86rem;
  font-weight: 800;
  line-height: 1.2;
}

@media (max-width: 860px) {
  .todo-overview {
    grid-template-columns: 1fr;
  }

  .todo-overview__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .todo-overview__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .todo-overview {
    padding: 8px;
    gap: 8px;
  }

  .todo-overview__main {
    min-height: 76px;
    padding: 12px;
  }

  .todo-overview__item {
    min-height: 82px;
    padding: 11px;
  }

  .todo-overview__status {
    font-size: 0.82rem;
  }
}
</style>
