type ThemeMode = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'notebook:theme-mode'
const THEME_OPTIONS: ThemeMode[] = ['system', 'light', 'dark']

function resolveMode(mode: ThemeMode): 'light' | 'dark' {
  if (mode !== 'system') {
    return mode
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement
  const resolvedMode = resolveMode(mode)

  root.dataset.theme = resolvedMode
  root.classList.remove('theme-system', 'theme-light', 'theme-dark')
  root.classList.add(`theme-${mode}`)
  root.style.colorScheme = resolvedMode
}

function parseTheme(input: string | null): ThemeMode {
  if (input && THEME_OPTIONS.includes(input as ThemeMode)) {
    return input as ThemeMode
  }

  return 'system'
}

export default defineNuxtPlugin(() => {
  const savedMode = parseTheme(localStorage.getItem(STORAGE_KEY))
  applyTheme(savedMode)

  const media = window.matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener('change', () => {
    if (parseTheme(localStorage.getItem(STORAGE_KEY)) === 'system') {
      applyTheme('system')
    }
  })
})
