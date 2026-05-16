import { computed } from 'vue'

import type { HomeBackground } from '~/config/backgrounds'
import { homeBackgrounds } from '~/config/backgrounds'

const STORAGE_KEY = 'notebook:home-background'
const DEFAULT_BACKGROUND_ID = 'plain-white'
const DEFAULT_BACKGROUND: HomeBackground = {
  id: DEFAULT_BACKGROUND_ID,
  name: '纯白',
  path: '',
  appliesTo: 'shared',
  overlayOpacity: 0,
}

export function useHomeBackground() {
  const selectedBackgroundId = useState<string>('home-background-id', () => DEFAULT_BACKGROUND_ID)

  const availableBackgrounds = computed(() =>
    homeBackgrounds.filter((item) => item.appliesTo === 'shared' || item.appliesTo === 'light'),
  )

  const selectedBackground = computed<HomeBackground>(() => {
    return (
      availableBackgrounds.value.find((item) => item.id === selectedBackgroundId.value) ??
      availableBackgrounds.value[0] ??
      DEFAULT_BACKGROUND
    )
  })

  function setHomeBackground(id: string) {
    const nextBackground = availableBackgrounds.value.find((item) => item.id === id)
    selectedBackgroundId.value = nextBackground?.id ?? DEFAULT_BACKGROUND_ID

    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, selectedBackgroundId.value)
    }
  }

  function syncHomeBackgroundFromStorage() {
    if (!import.meta.client) {
      return
    }

    const savedId = localStorage.getItem(STORAGE_KEY)

    if (savedId) {
      setHomeBackground(savedId)
    }
  }

  return {
    availableBackgrounds,
    selectedBackground,
    selectedBackgroundId,
    setHomeBackground,
    syncHomeBackgroundFromStorage,
  }
}
