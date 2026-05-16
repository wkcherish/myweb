export type ThemeMode = 'light' | 'dark'

export interface HomeBackground {
  id: string
  name: string
  path: string
  appliesTo: 'light' | 'dark' | 'shared'
  overlayOpacity: number
}

export const homeBackgrounds: HomeBackground[] = [
  {
    id: 'plain-white',
    name: '纯白',
    path: '',
    appliesTo: 'shared',
    overlayOpacity: 0,
  },
  {
    id: 'school-girl-campus',
    name: '校园背景',
    path: '/backgrounds/home/day/school-girl-campus.jpg',
    appliesTo: 'light',
    overlayOpacity: 0,
  },
  {
    id: 'dark-plain',
    name: '深色纯色',
    path: '',
    appliesTo: 'dark',
    overlayOpacity: 0,
  },
]
