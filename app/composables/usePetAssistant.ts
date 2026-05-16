import { computed } from 'vue'

export type PetAssistantStatus = 'idle' | 'hover' | 'open' | 'music' | 'thinking' | 'hidden'

interface PetPosition {
  x: number | null
  y: number | null
}

const HIDDEN_STORAGE_KEY = 'notebook:pet-hidden'
const POSITION_STORAGE_KEY = 'notebook:pet-position'

export function usePetAssistant() {
  const isMenuOpen = useState<boolean>('pet-menu-open', () => false)
  const isHidden = useState<boolean>('pet-hidden', () => false)
  const isHovering = useState<boolean>('pet-hovering', () => false)
  const isMusicActive = useState<boolean>('pet-music-active', () => false)
  const isThinking = useState<boolean>('pet-thinking', () => false)
  const position = useState<PetPosition>('pet-position', () => ({ x: null, y: null }))

  const status = computed<PetAssistantStatus>(() => {
    if (isHidden.value) {
      return 'hidden'
    }

    if (isThinking.value) {
      return 'thinking'
    }

    if (isMusicActive.value) {
      return 'music'
    }

    if (isMenuOpen.value) {
      return 'open'
    }

    if (isHovering.value) {
      return 'hover'
    }

    return 'idle'
  })

  function openMenu() {
    if (!isHidden.value) {
      isMenuOpen.value = true
    }
  }

  function closeMenu() {
    isMenuOpen.value = false
  }

  function toggleMenu() {
    if (isHidden.value) {
      show()
      return
    }

    isMenuOpen.value = !isMenuOpen.value
  }

  function hide() {
    isHidden.value = true
    isMenuOpen.value = false
    persistHiddenState()
  }

  function show() {
    isHidden.value = false
    persistHiddenState()
  }

  function setHovering(nextValue: boolean) {
    isHovering.value = nextValue
  }

  function setMusicActive(nextValue: boolean) {
    isMusicActive.value = nextValue
  }

  function setThinking(nextValue: boolean) {
    isThinking.value = nextValue
  }

  function setPosition(nextPosition: PetPosition) {
    position.value = nextPosition

    if (import.meta.client) {
      localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(nextPosition))
    }
  }

  function resetPosition() {
    position.value = { x: null, y: null }

    if (import.meta.client) {
      localStorage.removeItem(POSITION_STORAGE_KEY)
    }
  }

  function syncPetAssistantFromStorage() {
    if (!import.meta.client) {
      return
    }

    isHidden.value = localStorage.getItem(HIDDEN_STORAGE_KEY) === 'true'

    const rawPosition = localStorage.getItem(POSITION_STORAGE_KEY)

    if (!rawPosition) {
      return
    }

    try {
      const parsedPosition = JSON.parse(rawPosition) as PetPosition

      if (isFinitePosition(parsedPosition)) {
        position.value = parsedPosition
      }
    } catch {
      localStorage.removeItem(POSITION_STORAGE_KEY)
    }
  }

  function persistHiddenState() {
    if (import.meta.client) {
      localStorage.setItem(HIDDEN_STORAGE_KEY, String(isHidden.value))
    }
  }

  return {
    closeMenu,
    hide,
    isHidden,
    isHovering,
    isMenuOpen,
    isMusicActive,
    isThinking,
    openMenu,
    position,
    resetPosition,
    setHovering,
    setMusicActive,
    setPosition,
    setThinking,
    show,
    status,
    syncPetAssistantFromStorage,
    toggleMenu,
  }
}

function isFinitePosition(value: PetPosition): value is Required<PetPosition> {
  return typeof value.x === 'number' && Number.isFinite(value.x) && typeof value.y === 'number' && Number.isFinite(value.y)
}
