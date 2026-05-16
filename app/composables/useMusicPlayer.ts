import { computed, watch } from 'vue'

import { usePetAssistant } from '~/composables/usePetAssistant'

export type MusicPlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

const EXPANDED_STORAGE_KEY = 'notebook:music-expanded'

export function useMusicPlayer() {
  const isOpen = useState<boolean>('music-player-open', () => false)
  const isExpanded = useState<boolean>('music-player-expanded', () => true)
  const playbackState = useState<MusicPlaybackState>('music-player-playback-state', () => 'idle')
  const currentTrackTitle = useState<string>('music-player-current-track-title', () => '')
  const errorMessage = useState<string>('music-player-error-message', () => '')
  const hasSyncedStorage = useState<boolean>('music-player-storage-synced', () => false)
  const { setMusicActive } = usePetAssistant()

  const isBusy = computed(() => playbackState.value === 'loading')
  const isPlaying = computed(() => playbackState.value === 'playing')
  const isErrored = computed(() => playbackState.value === 'error')

  watch(
    () => playbackState.value,
    (nextState) => {
      setMusicActive(nextState === 'playing')
    },
    { immediate: true },
  )

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function toggleOpen() {
    isOpen.value = !isOpen.value
  }

  function expand() {
    setExpandedState(true)
  }

  function collapse() {
    setExpandedState(false)
  }

  function toggleExpanded() {
    setExpandedState(!isExpanded.value)
  }

  function setPlaybackState(nextState: MusicPlaybackState) {
    playbackState.value = nextState

    if (nextState !== 'error') {
      errorMessage.value = ''
    }
  }

  function setCurrentTrackTitle(nextTitle: string) {
    currentTrackTitle.value = nextTitle.trim()
  }

  function setError(nextMessage: string) {
    errorMessage.value = nextMessage.trim()
    playbackState.value = 'error'
  }

  function clearError() {
    errorMessage.value = ''

    if (playbackState.value === 'error') {
      playbackState.value = 'idle'
    }
  }

  function syncMusicPlayerFromStorage() {
    if (!import.meta.client || hasSyncedStorage.value) {
      return
    }

    const rawExpandedState = localStorage.getItem(EXPANDED_STORAGE_KEY)

    if (rawExpandedState === 'true') {
      isExpanded.value = true
    } else if (rawExpandedState === 'false') {
      isExpanded.value = false
    }

    hasSyncedStorage.value = true
  }

  function setExpandedState(nextState: boolean) {
    isExpanded.value = nextState

    if (import.meta.client) {
      localStorage.setItem(EXPANDED_STORAGE_KEY, String(nextState))
    }
  }

  return {
    clearError,
    close,
    collapse,
    currentTrackTitle,
    errorMessage,
    expand,
    isBusy,
    isErrored,
    isExpanded,
    isOpen,
    isPlaying,
    open,
    playbackState,
    setCurrentTrackTitle,
    setError,
    setPlaybackState,
    syncMusicPlayerFromStorage,
    toggleExpanded,
    toggleOpen,
  }
}
