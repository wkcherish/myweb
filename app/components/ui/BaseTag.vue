<script setup lang="ts">
import { computed } from 'vue'

type TagKind = 'category' | 'status' | 'priority'
type TagTone =
  | 'default'
  | 'accent'
  | 'planned'
  | 'in-progress'
  | 'done'
  | 'paused'
  | 'high'
  | 'medium'
  | 'low'

interface Props {
  kind?: TagKind
  tone?: TagTone
}

const props = withDefaults(defineProps<Props>(), {
  kind: 'category',
  tone: 'default',
})

const classList = computed(() => ['base-tag', `base-tag--${props.kind}`, `is-${props.tone}`])
</script>

<template>
  <span :class="classList">
    <slot />
  </span>
</template>

<style scoped>
.base-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 1.75rem;
  padding: 0 var(--space-8);
  border-radius: var(--radius-pill);
  border: 1px solid transparent;
  font-size: 0.76rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.base-tag--category {
  border-color: color-mix(in srgb, var(--color-primary) 26%, transparent);
  color: color-mix(in srgb, var(--color-primary) 76%, var(--color-fg));
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
}

.base-tag--category.is-accent {
  border-color: color-mix(in srgb, var(--color-accent) 30%, transparent);
  color: color-mix(in srgb, var(--color-accent) 78%, var(--color-fg));
  background: color-mix(in srgb, var(--color-accent) 12%, transparent);
}

.base-tag--status.is-planned {
  color: color-mix(in srgb, var(--color-warning) 82%, var(--color-fg));
  border-color: color-mix(in srgb, var(--color-warning) 36%, transparent);
  background: color-mix(in srgb, var(--color-warning) 14%, transparent);
}

.base-tag--status.is-in-progress {
  color: color-mix(in srgb, var(--color-primary) 80%, var(--color-fg));
  border-color: color-mix(in srgb, var(--color-primary) 34%, transparent);
  background: color-mix(in srgb, var(--color-primary) 14%, transparent);
}

.base-tag--status.is-done {
  color: color-mix(in srgb, var(--color-success) 84%, var(--color-fg));
  border-color: color-mix(in srgb, var(--color-success) 34%, transparent);
  background: color-mix(in srgb, var(--color-success) 16%, transparent);
}

.base-tag--status.is-paused {
  color: color-mix(in srgb, var(--color-text-weak) 80%, var(--color-fg));
  border-color: color-mix(in srgb, var(--color-text-weak) 34%, transparent);
  background: color-mix(in srgb, var(--color-text-weak) 16%, transparent);
}

.base-tag--priority.is-high {
  color: color-mix(in srgb, var(--color-danger) 84%, var(--color-fg));
  border-color: color-mix(in srgb, var(--color-danger) 34%, transparent);
  background: color-mix(in srgb, var(--color-danger) 14%, transparent);
}

.base-tag--priority.is-medium {
  color: color-mix(in srgb, var(--color-warning) 84%, var(--color-fg));
  border-color: color-mix(in srgb, var(--color-warning) 34%, transparent);
  background: color-mix(in srgb, var(--color-warning) 12%, transparent);
}

.base-tag--priority.is-low {
  color: color-mix(in srgb, var(--color-success) 80%, var(--color-fg));
  border-color: color-mix(in srgb, var(--color-success) 34%, transparent);
  background: color-mix(in srgb, var(--color-success) 12%, transparent);
}
</style>
