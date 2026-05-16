export type MusicProvider = 'meting'
export type MusicServer = 'tencent'
export type MusicSourceType = 'playlist'

export interface MusicFallbackTrack {
  title: string
  artist: string
  src: string
  cover?: string
}

export interface MusicConfig {
  provider: MusicProvider
  server: MusicServer
  type: MusicSourceType
  playlistId: string
  api: string
  autoplay: boolean
  fallbackTracks: MusicFallbackTrack[]
}

export const musicConfig: MusicConfig = {
  provider: 'meting',
  server: 'tencent',
  type: 'playlist',
  playlistId: '8490098388',
  api: 'https://api.injahow.cn/meting/?server=:server&type=:type&id=:id&r=:r',
  autoplay: false,
  fallbackTracks: [],
}
