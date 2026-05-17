import { usePetAssistant } from '~/composables/usePetAssistant'

export interface AiMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

function resolveChatEndpoint(apiBase: string) {
  const normalized = apiBase.trim().replace(/^http:\/(?!\/)/, 'http://').replace(/^https:\/(?!\/)/, 'https://')

  if (!normalized) return ''

  try {
    const url = new URL(normalized)
    const path = url.pathname.replace(/\/+$/, '')

    if (!path || path === '/v1') {
      url.pathname = `${path || '/v1'}/chat/completions`
      return url.toString()
    }

    return url.toString()
  } catch {
    return normalized
  }
}

export function useAiChat() {
  const isOpen = useState<boolean>('ai-chat-open', () => false)
  const messages = useState<AiMessage[]>('ai-chat-messages', () => [])
  const inputText = useState<string>('ai-chat-input', () => '')
  const isLoading = useState<boolean>('ai-chat-loading', () => false)
  const errorMessage = useState<string>('ai-chat-error', () => '')
  const { setThinking } = usePetAssistant()

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function toggle() {
    isOpen.value = !isOpen.value
  }

  function setInput(next: string) {
    inputText.value = next
  }

  function setError(next: string) {
    errorMessage.value = next
    isLoading.value = false
    setThinking(false)
  }

  function clearError() {
    errorMessage.value = ''
  }

  function addMessage(role: AiMessage['role'], content: string) {
    messages.value.push({
      role,
      content: content.trim(),
      timestamp: Date.now(),
    })
  }

  function clearConversation() {
    messages.value = []
    errorMessage.value = ''
  }

  async function sendMessage(text?: string) {
    const content = (text ?? inputText.value).trim()

    if (!content || isLoading.value) {
      return
    }

    clearError()
    addMessage('user', content)
    inputText.value = ''
    isLoading.value = true
    setThinking(true)

    const runtimeConfig = useRuntimeConfig().public
    const apiBase = (runtimeConfig.aiApiBase as string) || ''
    const apiEndpoint = resolveChatEndpoint(apiBase)
    const apiKey = (runtimeConfig.aiApiKey as string) || ''
    const model = (runtimeConfig.aiModel as string) || (runtimeConfig.aiMode as string) || ''

    if (!apiEndpoint) {
      addMessage(
        'assistant',
        'AI 服务尚未配置。请在环境变量中设置 `NUXT_PUBLIC_AI_API_BASE` 指向安全代理地址，然后重新构建。\n\n当前为离线模式，你可以尝试以下本地功能：\n- 在博客中搜索相关文章\n- 浏览 Wiki 知识库\n- 查看项目规划',
      )
      isLoading.value = false
      setThinking(false)
      return
    }

    try {
      const response = await $fetch<{ choices?: Array<{ message?: { content?: string } }> }>(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        body: {
          model,
          messages: messages.value.map((m) => ({ role: m.role, content: m.content })),
          stream: false,
        },
        timeout: 30000,
      })

      const reply = response?.choices?.[0]?.message?.content

      if (reply) {
        addMessage('assistant', reply)
      } else {
        setError('AI 返回了空响应，请稍后重试。')
        return
      }
    } catch (error) {
      const status = typeof error === 'object' && error && 'status' in error ? (error as { status?: number }).status : undefined
      const statusText = typeof status === 'number' ? `（HTTP ${status}）` : ''
      setError(`请求失败${statusText}，请检查网络连接或 API 配置后重试。`)
      return
    }

    isLoading.value = false
    setThinking(false)
  }

  return {
    clearConversation,
    clearError,
    close,
    errorMessage,
    inputText,
    isLoading,
    isOpen,
    messages,
    open,
    sendMessage,
    setError,
    setInput,
    toggle,
  }
}
