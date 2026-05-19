export interface SiteNavItem {
  label: string
  to: string
  placeholder?: boolean
}

export type SiteContactIcon = 'website' | 'mail' | 'github' | 'gitee' | 'xiaohongshu'
export type SiteFooterNavIcon = 'about' | 'stats' | 'blog' | 'wiki' | 'friends' | 'more'

export interface SiteFooterNavItem extends SiteNavItem {
  icon: SiteFooterNavIcon
}

export interface SiteContactItem {
  label: string
  href: string
  icon: SiteContactIcon
  external?: boolean
  description?: string
}

export interface SiteFilingInfo {
  icpText?: string
  icpHref?: string
  policeText?: string
  policeHref?: string
  policeIcon?: string
  pendingText?: string
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
  filing: {
    pendingText: '网站备案审核中…',
    policeIcon: '/icons/police-badge.png',
    // 备案通过后填入以下信息：
    // icpText: 'XICP备XXXXXXXXXX号-1',
    // icpHref: 'https://beian.miit.gov.cn/',
    // policeText: 'X公网安备 XXXXXXXXXXXX号',
    // policeHref: 'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=XXXXXXXXXXXXXXXXXX',
  } as SiteFilingInfo,
  socialLinks: [
    {
      label: '个人网站',
      href: 'https://www.cherish.wang/',
      icon: 'website',
      external: true,
      description: 'https://www.cherish.wang/',
    },
    {
      label: '谷歌邮箱',
      href: 'mailto:wk20030118@gmail.com?subject=%E6%9D%A5%E8%87%AA%20Cherish%20Notebook%20%E7%9A%84%E8%81%94%E7%B3%BB',
      icon: 'mail',
      description: 'wk20030118@gmail.com',
    },
    {
      label: 'GitHub',
      href: 'https://github.com/wkcherish',
      icon: 'github',
      external: true,
      description: 'github.com/wkcherish',
    },
    {
      label: 'Gitee',
      href: 'https://gitee.com/hold-dear',
      icon: 'gitee',
      external: true,
      description: 'gitee.com/hold-dear',
    },
    {
      label: '小红书',
      href: 'https://www.xiaohongshu.com/user/profile/61220d550000000001008bd4?m_source=mengfanwetab',
      icon: 'xiaohongshu',
      external: true,
      description: 'xiaohongshu.com',
    },
  ] as SiteContactItem[],
  nav: [
    { label: 'Blog', to: '/blog' },
    { label: 'Wiki', to: '/wiki' },
    { label: 'Todo', to: '/todo' },
    { label: '关于', to: '/about' },
  ] as SiteNavItem[],
  moreNav: [
    { label: '数据统计分析', to: '/analytics' },
    { label: '个人简历', to: '/resume' },
    { label: '友情链接', to: '/links' },
  ] as SiteNavItem[],
  footerNav: [
    { label: '关于本站', to: '/about', icon: 'about' },
    { label: '数据统计', to: '/analytics', icon: 'stats' },
    { label: '博客', to: '/blog', icon: 'blog' },
    { label: 'Wiki', to: '/wiki', icon: 'wiki' },
    { label: '友情链接', to: '/links', icon: 'friends' },
    { label: '更多页面', to: '/resume', icon: 'more' },
  ] as SiteFooterNavItem[],
}
