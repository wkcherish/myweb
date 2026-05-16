export interface SiteNavItem {
  label: string
  to: string
}

export const siteConfig = {
  name: "Cherish's Notebook",
  shortName: 'Notebook',
  author: 'Cherish',
  description: '这是我的主页，用于记录自己的学习、开发以及生活分享。',
  iconPath: '/icons/site-icon.svg',
  icons: {
    favicon: '/icons/favicon.ico',
    faviconPng: '/icons/icon-32.png',
    appleTouch: '/icons/apple-touch-icon.png',
    pwa192: '/icons/icon-192.png',
    pwa512: '/icons/icon-512.png',
  },
  socialLinks: [],
  nav: [
    { label: 'Blog', to: '/blog' },
    { label: 'Wiki', to: '/wiki' },
    { label: 'Todo', to: '/todo' },
    { label: '关于', to: '/about' },
  ] as SiteNavItem[],
}
