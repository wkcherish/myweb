import { computed, watch } from 'vue'

import type { HomeBackground, HomeBackgroundMediaType, HomeBackgroundMode } from '~/config/backgrounds'
import { DEFAULT_HOME_BACKGROUND_ID, fallbackHomeBackgrounds, inferHomeBackgroundMediaType } from '~/config/backgrounds'

const STORAGE_KEY = 'notebook:home-background'

const DEFAULT_BACKGROUND: HomeBackground = fallbackHomeBackgrounds[0] ?? {
  id: DEFAULT_HOME_BACKGROUND_ID,
  name: '首页背景',
  path: '',
  appliesTo: 'light',
  mediaType: 'image',
  overlayOpacity: 0,
}

function isBackgroundMode(value: unknown): value is HomeBackgroundMode {
  return value === 'light' || value === 'dark' || value === 'shared'
}

function isBackgroundMediaType(value: unknown): value is HomeBackgroundMediaType {
  return value === 'image' || value === 'video'
}

function resolveRuntimeBackgrounds(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map<HomeBackground | null>((item) => {
      if (!item || typeof item !== 'object') {
        return null
      }

      const candidate = item as Partial<HomeBackground>
      const id = typeof candidate.id === 'string' ? candidate.id.trim() : ''
      const name = typeof candidate.name === 'string' ? candidate.name.trim() : ''
      const path = typeof candidate.path === 'string' ? candidate.path.trim() : ''
      const appliesTo = isBackgroundMode(candidate.appliesTo) ? candidate.appliesTo : 'light'
      const mediaType = isBackgroundMediaType(candidate.mediaType) ? candidate.mediaType : inferHomeBackgroundMediaType(path)
      const overlayOpacity =
        typeof candidate.overlayOpacity === 'number' && Number.isFinite(candidate.overlayOpacity)
          ? candidate.overlayOpacity
          : 0

      if (!id || !name || !path) {
        return null
      }

      return {
        id,
        name,
        path,
        appliesTo,
        mediaType,
        overlayOpacity,
      }
    })
    .filter((item): item is HomeBackground => Boolean(item))
}

function resolveDefaultBackgroundId(backgrounds: HomeBackground[], runtimeDefaultId: string) {
  return (
    backgrounds.find((item) => item.id === runtimeDefaultId)?.id ??
    backgrounds.find((item) => item.id === DEFAULT_HOME_BACKGROUND_ID)?.id ??
    backgrounds[0]?.id ??
    DEFAULT_BACKGROUND.id
  )
}

export function useHomeBackground() {
  const runtimeConfig = useRuntimeConfig()
  const runtimeBackgrounds = resolveRuntimeBackgrounds(runtimeConfig.public.homeDayBackgrounds)
  const configuredBackgrounds = useState<HomeBackground[]>('home-background-list', () => {
    if (runtimeBackgrounds.length > 0) {
      return runtimeBackgrounds
    }

    return fallbackHomeBackgrounds
  })
  const isRefreshingBackgrounds = useState<boolean>('home-background-refreshing', () => false)
  const runtimeDefaultId =
    typeof runtimeConfig.public.defaultHomeBackgroundId === 'string' ? runtimeConfig.public.defaultHomeBackgroundId.trim() : ''

  const availableBackgrounds = computed(() => {
    const availableBackgroundList = configuredBackgrounds.value.filter(
      (item) => item.path && (item.appliesTo === 'shared' || item.appliesTo === 'light'),
    )

    if (availableBackgroundList.length > 0) {
      return availableBackgroundList
    }

    return [DEFAULT_BACKGROUND]
  })

  const selectedBackgroundId = useState<string>('home-background-id', () =>
    resolveDefaultBackgroundId(availableBackgrounds.value, runtimeDefaultId),
  )
  const defaultBackgroundId = computed(() => resolveDefaultBackgroundId(availableBackgrounds.value, runtimeDefaultId))

  const selectedBackground = computed<HomeBackground>(() => {
    return (
      availableBackgrounds.value.find((item) => item.id === selectedBackgroundId.value) ??
      availableBackgrounds.value[0] ??
      DEFAULT_BACKGROUND
    )
  })

  function setHomeBackground(id: string) {
    const nextBackground = availableBackgrounds.value.find((item) => item.id === id)
    selectedBackgroundId.value = nextBackground?.id ?? defaultBackgroundId.value

    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, selectedBackgroundId.value)
    }
  }

  async function refreshHomeBackgrounds() {
    if (!import.meta.client || !import.meta.dev || isRefreshingBackgrounds.value) {
      return
    }

    isRefreshingBackgrounds.value = true

    try {
      const response = await $fetch<unknown>('/api/home-backgrounds/day')
      const liveBackgrounds = resolveRuntimeBackgrounds(response)
      configuredBackgrounds.value = liveBackgrounds
    } catch (error) {
      console.warn('[home-background] 刷新背景列表失败，继续使用当前配置。', error)
    } finally {
      isRefreshingBackgrounds.value = false
    }
  }

  function syncHomeBackgroundFromStorage() {
    if (!import.meta.client) {
      return
    }

    void refreshHomeBackgrounds()

    const savedId = localStorage.getItem(STORAGE_KEY)

    if (savedId) {
      setHomeBackground(savedId)
      return
    }

    setHomeBackground(defaultBackgroundId.value)
  }

  watch(
    availableBackgrounds,
    (nextBackgrounds) => {
      if (nextBackgrounds.some((item) => item.id === selectedBackgroundId.value)) {
        return
      }

      selectedBackgroundId.value = resolveDefaultBackgroundId(nextBackgrounds, runtimeDefaultId)

      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY, selectedBackgroundId.value)
      }
    },
    { immediate: true },
  )

  return {
    availableBackgrounds,
    selectedBackground,
    selectedBackgroundId,
    setHomeBackground,
    refreshHomeBackgrounds,
    syncHomeBackgroundFromStorage,
  }
}
