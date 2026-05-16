export interface AiConfig {
  placeholderText: string
  welcomeMessage: string
  maxContextLength: number
  suggestions: string[]
}

export const aiConfig: AiConfig = {
  placeholderText: '输入你的问题，Enter 发送，Shift+Enter 换行',
  welcomeMessage: '你好，我是 Cherish 的笔记本助手。我可以帮你查找本站的博客、Wiki 和规划内容，也可以进行普通问答。',
  maxContextLength: 4096,
  suggestions: ['最近写了什么文章？', '项目有哪些规划？', '介绍一下这个网站'],
}
