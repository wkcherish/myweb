export type ThemeMode = 'light' | 'dark'
export type HomeBackgroundMode = 'light' | 'dark' | 'shared'

export interface HomeBackground {
  id: string
  name: string
  path: string
  appliesTo: HomeBackgroundMode
  overlayOpacity: number
}

export const DEFAULT_HOME_BACKGROUND_ID = 'school-girl-campus'

export const fallbackHomeBackgrounds: HomeBackground[] = []
