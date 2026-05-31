export type ThemeMode = 'light' | 'dark'
export type HomeBackgroundMode = 'light' | 'dark' | 'shared'
export type HomeBackgroundMediaType = 'image' | 'video'

const HOME_BACKGROUND_VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.ogg', '.ogv', '.m4v'])

export interface HomeBackground {
  id: string
  name: string
  path: string
  appliesTo: HomeBackgroundMode
  mediaType: HomeBackgroundMediaType
  overlayOpacity: number
}

export const DEFAULT_HOME_BACKGROUND_ID = 'school-girl-campus'

export const fallbackHomeBackgrounds: HomeBackground[] = []

export function inferHomeBackgroundMediaType(path: string): HomeBackgroundMediaType {
  const normalizedPath = path.split('#', 1)[0]?.split('?', 1)[0] ?? ''
  const extension = normalizedPath.slice(normalizedPath.lastIndexOf('.')).toLowerCase()

  return HOME_BACKGROUND_VIDEO_EXTENSIONS.has(extension) ? 'video' : 'image'
}
