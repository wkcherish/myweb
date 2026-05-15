export type ThemeMode = 'system' | 'light' | 'dark'

export interface HomeBackground {
  id: string
  name: string
  path: string
  appliesTo: 'light' | 'dark' | 'shared'
  overlayOpacity: number
}

export const homeBackgrounds: HomeBackground[] = [
  {
    id: 'home-day-default',
    name: '主页白天默认背景',
    path: '/backgrounds/home/day/placeholder-day.jpg',
    appliesTo: 'light',
    overlayOpacity: 0.2,
  },
  {
    id: 'home-night-default',
    name: '主页黑夜默认背景',
    path: '/backgrounds/home/night/placeholder-night.jpg',
    appliesTo: 'dark',
    overlayOpacity: 0.4,
  },
]
