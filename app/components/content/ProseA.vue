<script setup lang="ts">
import { resolveWikiMarkdownHref, resolveWikiRouteAliasHref } from '~/utils/wikiPath'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  href?: string
  target?: string
  rel?: string
  title?: string
}>()

const attrs = useAttrs()
const route = useRoute()
const wikiRenderSourcePath = useState<string>('wiki-render-source-path', () => '')
const wikiRenderGroupRoutePath = useState<string>('wiki-render-group-route-path', () => '')
const wikiRenderLinkMap = useState<Record<string, string>>('wiki-render-link-map', () => ({}))

const resolvedHref = computed(() =>
  resolveWikiRouteAliasHref(
    resolveWikiMarkdownHref(props.href || '', wikiRenderSourcePath.value, route.path),
    wikiRenderGroupRoutePath.value,
    wikiRenderLinkMap.value,
  ),
)
const isExternal = computed(
  () => /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(resolvedHref.value) || /^(?:mailto|tel):/i.test(resolvedHref.value),
)
const shouldUseAnchor = computed(() => !resolvedHref.value || resolvedHref.value.startsWith('#') || isExternal.value)
</script>

<template>
  <a
    v-if="shouldUseAnchor"
    v-bind="attrs"
    :href="resolvedHref || href"
    :target="target"
    :rel="rel"
    :title="title"
  >
    <slot />
  </a>

  <NuxtLink
    v-else
    v-bind="attrs"
    :to="resolvedHref"
    :target="target"
    :rel="rel"
    :title="title"
  >
    <slot />
  </NuxtLink>
</template>
