export interface SiteNavItem {
  label: string
  to: string
}

export const siteConfig = {
  name: 'Cherish Notebook',
  author: 'Cherish',
  description: '高级、克制、文件驱动的个人知识展示站。',
  iconPath: '/icons/favicon-placeholder.svg',
  socialLinks: [],
  nav: [
    { label: 'Blog', to: '/blog' },
    { label: 'Wiki', to: '/wiki' },
    { label: 'Todo', to: '/todo' },
    { label: '关于', to: '/about' },
  ] as SiteNavItem[],
}
