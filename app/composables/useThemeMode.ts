import { computed } from 'vue'

export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'notebook:theme-mode'
const THEME_ORDER: ThemeMode[] = ['light', 'dark']

function getSystemMode(): ThemeMode {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement

  root.dataset.theme = mode
  root.classList.remove('theme-system', 'theme-light', 'theme-dark')
  root.classList.add(`theme-${mode}`)
  root.style.colorScheme = mode
}

function parseMode(input: string | null): ThemeMode {
  if (input && THEME_ORDER.includes(input as ThemeMode)) {
    return input as ThemeMode
  }

  if (input === 'system' && import.meta.client) {
    return getSystemMode()
  }

  return 'light'
}

export function useThemeMode() {
  const mode = useState<ThemeMode>('theme-mode', () => 'light')
  const initialized = useState<boolean>('theme-mode-initialized', () => false)

  function syncFromStorage() {
    if (!import.meta.client || initialized.value) {
      return
    }

    const savedMode = parseMode(localStorage.getItem(STORAGE_KEY))
    mode.value = savedMode
    applyTheme(savedMode)
    initialized.value = true
  }

  function setMode(nextMode: ThemeMode) {
    mode.value = nextMode

    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, nextMode)
      applyTheme(nextMode)
    }
  }

  function cycleMode() {
    const currentIndex = THEME_ORDER.indexOf(mode.value)
    const nextIndex = (currentIndex + 1) % THEME_ORDER.length
    const nextMode = THEME_ORDER[nextIndex] ?? 'light'
    setMode(nextMode)
  }

  const modeLabel = computed(() => {
    if (mode.value === 'light') {
      return '浅色模式'
    }

    return '深色模式'
  })

  return {
    mode,
    modeLabel,
    setMode,
    cycleMode,
    syncFromStorage,
  }
}
