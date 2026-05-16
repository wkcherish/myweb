type ThemeMode = 'light' | 'dark'
type StoredThemeMode = ThemeMode | 'system'

const STORAGE_KEY = 'notebook:theme-mode'
const THEME_OPTIONS: ThemeMode[] = ['light', 'dark']

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

function parseTheme(input: string | null): ThemeMode {
  if (input && THEME_OPTIONS.includes(input as ThemeMode)) {
    return input as ThemeMode
  }

  if (input === 'system') {
    return getSystemMode()
  }

  return 'light'
}

export default defineNuxtPlugin(() => {
  const savedMode = parseTheme(localStorage.getItem(STORAGE_KEY))
  applyTheme(savedMode)

  const media = window.matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener('change', () => {
    if ((localStorage.getItem(STORAGE_KEY) as StoredThemeMode | null) === 'system') {
      applyTheme(getSystemMode())
    }
  })
})
