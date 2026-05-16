# 个人博客开发 Todo 清单

本清单基于 `docs/blog-development-plan.md` 拆分，目标是可以直接按顺序开发。默认技术路线为 Nuxt.js 4、TypeScript、Tailwind CSS 或 UnoCSS、Nuxt Content、Pinia、lucide-vue-next、APlayer + MetingJS、静态生成部署。

## 使用方式

- [ ] 每完成一个任务就勾选，并在必要时补充实现备注。
- [ ] 每个阶段完成后先跑本地验证，再进入下一阶段。
- [ ] 所有私密配置只写入 `.env.local` 或服务器环境变量，不能提交真实 Key。
- [ ] QQ 音乐歌单 ID 等到实际开发音乐模块时再补充。
- [ ] 如果发现实现和规划冲突，优先更新 `docs/blog-development-plan.md`，再同步本清单。
- [ ] 每次新增交互前先判断它是“浏览偏好”还是“正式内容写入”；第一版只允许前者。
- [ ] 所有页面完成后检查是否误出现 `新建`、`编辑`、`保存`、`发布`、`提交` 等写入型文案。
- [ ] 每次写代码前先确认职责边界，宁可拆组件、拆 composable、拆配置，也不要把复杂逻辑塞进一个大块。
- [ ] 本清单里的“每部分不超过 200 行”指组件分区、逻辑模块、样式分区、配置数组等可维护单元，不是要求整个文件绝对不超过 200 行。
- [ ] 单个函数、方法、watch 回调、computed getter 原则上不超过 100 行，超过就拆成命名清楚的小函数。

## 阶段 0：开发前确认

### 环境确认

- [x] 确认本机 Node.js 版本满足 Nuxt 4 要求。
- [x] 确认包管理器，默认使用 `npm`；如果改用 `pnpm` 或 `yarn`，统一更新文档命令。
- [x] 确认项目目录为 `/home/cherish/project/notebook`。
- [x] 确认后续部署方式为静态生成，即 `nuxi generate` 输出 `.output/public`。
- [x] 确认第一版不做登录、不做数据库、不做在线编辑后台。
- [x] 确认网站不能在网页端写笔记、编辑 Wiki、修改 Todo、发布文章，因为纯前端无法安全保存到后端。
- [x] 确认博客和 Wiki 正式内容只来自 `content/` 目录里的 Markdown 文件。
- [x] 确认 Todo 正式内容只来自 `content/todo/` 目录里的 Markdown 或 JSON 文件。
- [x] 确认网页端只提供阅读、搜索、筛选、导航、播放、问答和偏好设置。
- [x] 确认 `localStorage` 只保存主题、背景、播放器、小狗和面板等偏好，不保存正式笔记或 Todo。
- [x] 确认 Todo 是路线图和规划展示，不是网页端可持久化任务管理器。
- [x] 确认 Wiki 是阅读和检索型知识库，不是在线 Notion、Obsidian 或 CMS。
- [x] 确认 AI 面板第一版不能提供“保存到 Wiki”“生成新文章并发布”“写入 Todo”等按钮。
- [x] 确认 AI 第一版优先做 UI 和安全配置预留，不在前端硬编码私密 Key。
- [x] 确认音乐第一版采用 APlayer + MetingJS 解析 QQ 音乐公开歌单。

环境确认记录（2026-05-15）：
- Node.js: `v20.20.2`
- npm: `10.8.2`
- 工作目录: `/home/cherish/project/notebook`

### 设计确认

- [x] 首页视觉参考 Xiaomi MiMo 官网构图，但不使用 Xiaomi 品牌 Logo、文案和素材。
- [x] 首页标题替换为个人博客身份，例如博客名称或 `你好，我是 Cherish`。
- [x] 界面关键词确定为高级、克制、干净、有层次、有个人识别度。
- [x] 内容页优先阅读体验，不沿用首页强视觉动效。
- [x] 全站固定元素包括小狗助手、音乐面板、设置入口，必须避开正文和移动端安全区。
- [x] 高级界面目标确认：像个人知识产品，不像后台管理页、模板站或无法保存的假编辑器。
- [x] 确认 Blog、Wiki、Todo 的主操作是浏览和定位内容，不是创建和管理内容。
- [x] 确认界面不能有明显 AI 味：不使用廉价炫光、模板化卡片堆叠、空泛口号、过度解释型文案。
- [x] 确认页面文案像真人写给自己的网站，而不是生成器默认文案。
- [x] 确认图标、背景、小狗、音乐面板都服务于个人识别度，不做没有意义的装饰。

### 品牌确认

- [x] 图标、favicon、站点标识不在前置阶段提前定稿，到品牌图标阶段再集中处理。
- [x] 图标方向优先高级、克制、有深意，不做普通头像、不做廉价皇冠、不做网红 Logo。
- [x] 图标概念到品牌图标阶段再生成候选图，确认合适后再落为 favicon 和站点标识资源。
- [x] 图标命名、含义和视觉符号只写抽象原则，不在文档中写入真实姓名。

## 阶段 0.5：工程规范与维护约束

### 代码结构原则

- [x] 页面文件只负责组织数据和布局，不承载大量业务逻辑。
- [x] 复杂 UI 拆成 `components/`，复杂状态拆成 `composables/`，固定配置拆成 `config/`。
- [x] Nuxt 页面组件的 `template`、`script setup`、`style` 每个分区尽量不超过 200 行。
- [x] 普通 Vue 组件的单个逻辑分区不超过 200 行；超过时拆子组件或 composable。
- [x] 单个函数不超过 100 行。
- [x] 单个 computed、watch、事件处理函数不超过 100 行。
- [x] 单个配置对象数组不超过 200 行；超过时按领域拆文件，例如 `backgrounds.ts`、`nav.ts`、`music.ts`。
- [x] 单个 CSS 分区不超过 200 行；复杂样式按 `base`、`layout`、`components`、`prose`、`utilities` 拆分。
- [x] 不把 API 配置、视觉 token、静态文案和业务逻辑混在一个文件里。

### 命名与职责

- [x] 组件使用 PascalCase，例如 `MimoInspiredHero.vue`、`PetDogAssistant.vue`。
- [x] composable 使用 `useXxx.ts`，只暴露必要状态和方法。
- [x] 配置文件使用领域名，例如 `backgrounds.ts`、`site.ts`、`music.ts`、`ai.ts`。
- [x] 工具函数命名表达结果或动作，例如 `formatDate`、`getReadingTime`、`groupTasksByStatus`。
- [x] 布尔变量使用 `is`、`has`、`can`、`should` 开头。
- [x] 事件处理函数使用 `handle` 开头，例如 `handleThemeChange`。
- [x] 不使用 `data1`、`list2`、`temp`、`foo`、`bar` 这类无法维护的命名。

### TypeScript 规范

- [x] 为 Blog、Wiki、Todo、背景、音乐、AI 消息定义明确类型。
- [x] 避免使用 `any`；确实无法避免时写清楚原因并尽快收敛类型。
- [x] 对 frontmatter 建立类型或 schema，避免页面里到处猜字段。
- [x] 对状态枚举使用 union type，例如 `ThemeMode = 'system' | 'light' | 'dark'`。
- [x] 对 Todo 状态和优先级使用固定 union type，不散落字符串。
- [x] 对外部库对象做好空值判断，避免静态生成和客户端挂载阶段报错。

### Vue 与 Nuxt 规范

- [x] 所有访问 `window`、`document`、`localStorage` 的逻辑只在客户端执行。
- [x] 第三方播放器、AI 面板等浏览器依赖组件使用 `<ClientOnly>` 或 mounted 状态保护。
- [x] 页面级数据读取使用 Nuxt Content 的约定 API，不在多个页面重复写复杂查询。
- [x] 列表渲染必须使用稳定 key，不使用数组 index 作为长期 key。
- [x] 弹层、抽屉、菜单都支持关闭按钮、点击外部关闭和 Escape 关闭。
- [x] 组件 props 要有清晰类型，必要时提供默认值。
- [x] emit 事件命名保持明确，例如 `update:open`、`select-background`。

### 样式规范

- [x] 所有颜色优先来自 CSS token，不在组件里散落硬编码颜色。
- [x] 间距、圆角、阴影、动效时间优先使用统一 token。
- [x] 不使用负字距。
- [x] 不用大面积渐变、光斑、霓虹、毛玻璃堆叠制造“高级感”。
- [x] 每个固定定位元素都要有移动端和安全区策略。
- [x] 组件 hover 不做大幅移动，避免廉价浮动感。
- [x] 图标按钮优先使用 lucide 图标，并补充 `aria-label`。

### 文案规范

- [x] 页面文案短、具体、有人味，不写空泛口号。
- [x] 避免 `探索无限可能`、`开启智慧之旅`、`赋能创作`、`灵感宇宙` 等 AI 味强的模板句。
- [x] 空状态说明下一步，但不暗示网页端可以新增或保存正式内容。
- [x] 错误状态说明发生了什么、用户能做什么，不甩锅给“系统繁忙”。
- [x] 关于页文案保持真实、克制，可以有个性，但不过度包装。

### 注释与可维护性

- [x] 代码只在复杂逻辑前写简短注释，不写“把 A 赋值给 B”这类无效注释。
- [x] 复杂计算拆函数，并用函数名表达意图。
- [x] 组件顶部保持结构清楚：imports、types、props、state、computed、methods、lifecycle。
- [x] 每个 composable 只解决一个领域问题，不做万能状态中心。
- [x] 新增依赖前确认现有工具无法满足需求。
- [x] 不为一次性需求过度抽象。

### 提交前自检

- [x] 运行类型检查或构建命令。
- [x] 检查控制台没有关键错误。
- [x] 检查新增文件没有真实 Key、隐私信息和本地绝对路径。
- [x] 检查函数长度和组件分区长度是否超过约束。
- [x] 检查新增 UI 是否符合高级、克制、无 AI 味的方向。
- [x] 检查网页端没有新增正式内容写入能力。

阶段 0.5 规范生效记录（2026-05-15）：
- 本阶段作为团队开发约束基线，即日起用于后续所有代码实现与提交自检。

## 阶段 1：初始化 Nuxt 项目

### 项目脚手架

- [x] 在仓库根目录初始化 Nuxt 4 项目。
- [x] 创建或更新 `package.json`。
- [x] 安装 Nuxt、Vue、TypeScript 相关基础依赖。
- [x] 安装 Nuxt Content。
- [x] 安装 Pinia。
- [x] 安装 Tailwind CSS 或 UnoCSS，优先选择一种，不同时引入两套原子 CSS。
- [x] 安装 `lucide-vue-next`。
- [x] 安装或通过 CDN 引入 APlayer 和 MetingJS，实际方案在音乐阶段最终确认。
- [x] 创建 `.gitignore`，忽略 `node_modules`、`.output`、`.nuxt`、`.env.local`。
- [x] 创建 `.env.example`，只写占位配置，不写真实 Key。

### 推荐初始文件

- [x] 创建 `nuxt.config.ts`。
- [x] 创建 `app/app.vue` 或 Nuxt 约定入口文件。
- [x] 创建 `app/layouts/default.vue`。
- [x] 创建 `app/pages/index.vue`。
- [x] 创建 `app/pages/blog/index.vue`。
- [x] 创建 `app/pages/wiki/index.vue`。
- [x] 创建 `app/pages/todo/index.vue`。
- [x] 创建 `app/pages/about.vue`。
- [x] 创建 `app/assets/css/main.css`。
- [x] 创建 `content/blog/README.md`。
- [x] 创建 `content/wiki/README.md`。
- [x] 创建 `content/todo/README.md`。
- [x] 在 `content/README.md` 或项目 README 中说明内容只能通过本地文件维护。
- [x] 创建 `public/backgrounds/`。
- [x] 创建 `public/backgrounds/home/`。
- [x] 创建 `public/backgrounds/home/day/`，用于后续放入博客主页白天模式背景。
- [x] 创建 `public/backgrounds/home/night/`，用于后续放入博客主页黑夜模式背景。
- [x] 创建 `public/backgrounds/shared/`，用于多个页面可复用的通用背景。
- [x] 创建 `public/pet/`。
- [x] 创建 `public/music/`。
- [x] 创建 `public/images/`。
- [x] 创建 `public/icons/`，用于存放站点图标、favicon、PWA 图标和候选稿。
- [x] 创建 `app/config/backgrounds.ts`，集中维护背景路径、名称、适用主题和遮罩强度。
- [x] 创建 `app/config/site.ts`，集中维护站点名称、作者名、描述、导航、图标路径和社交链接。

### Nuxt 基础配置

- [x] 在 `nuxt.config.ts` 启用 TypeScript 严格模式。
- [x] 配置全局 CSS 入口。
- [x] 配置 Nuxt Content 模块。
- [x] 配置 Pinia 模块或插件。
- [x] 配置站点 `head` 基础信息，包括 title、description、viewport。
- [x] 配置 favicon 占位路径，最终图标确认后替换。
- [x] 配置 Apple touch icon 和 PWA icon 的预留位置。
- [x] 配置静态生成所需选项。
- [x] 配置深色模式 class 或 data attribute 策略。
- [x] 配置白天/黑夜主题切换策略，支持 system、light、dark。
- [x] 确认 light 对应白天模式，dark 对应黑夜模式。
- [x] 预留 APlayer/MetingJS 的 head script/link 配置位置。
- [x] 配置 Vue compiler，把 `meting-js` 识别为自定义元素。
- [x] 不配置任何网页端写文件、提交表单到后端或在线 CMS 的入口。

### 阶段验收

- [x] `npm install` 成功。
- [x] `npm run dev` 能启动。
- [x] 首页、博客、Wiki、Todo、关于路由能访问。
- [x] 页面没有明显控制台错误。
- [x] `.env.local` 没有被提交。

阶段 1 验收记录（2026-05-15）：
- 依赖安装完成，技术栈锁定为 Nuxt 4（`nuxt@4.4.5`）。
- `npm run dev` 已启动并提供本地访问地址（`127.0.0.1:5176`）。
- 首页、Blog、Wiki、Todo、关于路由均返回 `HTTP 200`。
- `npm run generate` 成功，静态产物输出到 `.output/public`。

## 阶段 2：设计系统与高级界面基础

### 设计 Token

- [x] 在 `app/assets/css/main.css` 中定义浅色主题 CSS 变量。
- [x] 定义深色主题 CSS 变量。
- [x] 定义白天模式主页背景遮罩 token，例如 `--home-bg-overlay-light`。
- [x] 定义黑夜模式主页背景遮罩 token，例如 `--home-bg-overlay-dark`。
- [x] 定义颜色 token：背景、前景、弱文本、边框、主色、强调色、危险色、成功色、警告色。
- [x] 定义间距 token：`4px`、`8px`、`12px`、`16px`、`24px`、`32px`、`48px`、`64px`。
- [x] 定义圆角 token：`4px`、`8px`、`12px`、`999px`。
- [x] 定义阴影 token：轻阴影、中阴影、浮层阴影。
- [x] 定义动效 token：`120ms`、`180ms`、`240ms`、`280ms`。
- [x] 定义布局宽度：正文宽度、内容区宽度、宽屏区宽度。
- [x] 定义 `prefers-reduced-motion` 下的动效降级规则。

### 全局基础样式

- [x] 设置 `html`、`body`、`#__nuxt` 的高度和基础背景。
- [x] 设置全局字体栈，包含中文系统字体。
- [x] 设置正文行高、默认字体大小、文本渲染。
- [x] 设置链接默认样式、hover 样式、focus-visible 样式。
- [x] 设置按钮、输入框、textarea 的基础 reset。
- [x] 设置图片、视频、canvas 的响应式规则。
- [x] 设置滚动条样式，保证深浅色主题一致。
- [x] 设置选中文本颜色。

### 基础 UI 组件

- [x] 创建 `app/components/ui/BaseButton.vue`。
- [x] `BaseButton` 支持 primary、secondary、ghost、danger 四种 variant。
- [x] `BaseButton` 支持 loading、disabled、icon-only 状态。
- [x] `BaseButton` 保证移动端触控高度不低于 `44px`。
- [x] 创建 `app/components/ui/IconButton.vue`。
- [x] `IconButton` 使用 lucide 图标插槽或 prop。
- [x] `IconButton` 支持 tooltip 或 aria-label。
- [x] 创建 `app/components/ui/BasePanel.vue`。
- [x] `BasePanel` 统一浮层边框、阴影、背景模糊和圆角。
- [x] 创建 `app/components/ui/BaseTag.vue`。
- [x] `BaseTag` 支持分类、状态、优先级样式。
- [x] 创建 `app/components/ui/EmptyState.vue`。
- [x] 创建 `app/components/ui/ErrorState.vue`。
- [x] 创建 `app/components/ui/LoadingState.vue`。

### 高级感检查

- [x] 检查页面没有使用浏览器默认蓝色按钮。
- [x] 检查卡片没有过大圆角和过重阴影。
- [x] 检查没有大面积霓虹、渐变光斑或装饰性浮球。
- [x] 检查文本没有负字距。
- [x] 检查按钮文字不会挤出容器。
- [x] 检查深色模式不是纯黑铺底。
- [x] 检查白天模式背景不影响深色标题可读性。
- [x] 检查黑夜模式背景不出现刺眼高亮区域。
- [x] 检查首页背景、字母矩阵、圆形和标题在两种主题下层级清楚。
- [x] 检查首页有强识别度，内容页保持克制阅读体验。
- [x] 检查组件状态完整，包括 hover、focus、active、disabled、loading、empty、error。
- [x] 检查固定元素不遮挡正文、目录、代码块、播放器和移动端底部安全区。
- [x] 检查 UI 文案没有暗示网页端可以保存正式内容。
- [x] 检查 Todo、Wiki、Blog 没有使用后台管理风格的工具栏。

### 无 AI 味检查

- [x] 检查页面是否出现模板站常见的大而空 hero 文案。
- [x] 检查是否使用过多发光边框、渐变网格、玻璃卡片和悬浮装饰。
- [x] 检查插图、图标和背景是否有廉价生成感，例如细节脏、光源混乱、符号无意义。
- [x] 检查文案是否像真人个人博客，而不是 SaaS 营销页。
- [x] 检查每个模块是否有真实信息价值，不用装饰性内容填满页面。
- [x] 检查 AI 面板的语气克制，不自称“智能助手为你赋能创作”。
- [x] 检查小狗助手有个人记忆点，但不使用过度拟人和夸张台词。

阶段 2 验收记录（2026-05-16）：
- 首页 Nuxt 技术标签改为读取运行时真实版本（当前显示 `Nuxt 4.4.5`）。
- 首页补充低透明字母矩阵与圆形视觉锚点，浅色/深色模式下层级和可读性通过检查。
- 按钮、卡片、空状态、错误状态、加载状态及浮动入口的交互状态完成核对。

## 阶段 2.5：品牌图标与站点标识

### 图标概念生成

- [x] 到本阶段再生成站点图标概念图，供人工查看是否合适。
- [x] 图标要体现个人识别度、稳定感和记忆点。
- [x] 图标可以从姓名含义、博客气质、知识库属性或个人偏好中提取符号，但文档不固定具体姓名。
- [x] 图标整体要高级、克制、有深意，不做直白廉价皇冠。
- [x] 图标避免明显 AI 味，不使用混乱纹理、过度发光、无意义复杂细节。
- [x] 图标候选图先作为预览，不直接替换 favicon。
- [x] 如果候选图不满意，记录不满意原因，例如太商业、太普通、太复杂、太像游戏图标。

### 图标资产整理

- [x] 选定图标后放入 `public/icons/`。
- [x] 保留原始大图，例如 `public/icons/site-icon-source.png`。
- [x] 导出 `favicon.ico`。
- [x] 导出 `icon-32.png`。
- [x] 导出 `icon-192.png`。
- [x] 导出 `apple-touch-icon.png`。
- [x] 深色背景和浅色背景各检查一次图标识别度。
- [x] 小尺寸 16px、32px 下检查是否仍能识别主要形状。
- [x] 如果图标包含文字，确认小尺寸不会糊成噪点；不适合时改为抽象符号。

### 站点接入

- [x] 在 `nuxt.config.ts` 中配置 favicon。
- [x] 在 `nuxt.config.ts` 中配置 Apple touch icon。
- [x] 在 `app/config/site.ts` 中维护图标路径。
- [x] Header 左侧可以使用图标 + 站点名，移动端可只显示图标或短名称。
- [x] 图标在白天模式、黑夜模式和背景图上都保持清晰。
- [x] 图标不和小狗助手、音乐播放器视觉风格冲突。

### 阶段验收

- [x] 图标能体现个人识别度，不是随机生成的抽象图。
- [x] 图标有深意但不过度解释。
- [x] 图标小尺寸可识别。
- [x] favicon 在浏览器标签页显示正常。
- [x] 图标在浅色和深色模式下都不突兀。

阶段 2.5 验收记录（2026-05-16）：
- 站点图标已按用户提供的图标方向替换为“纸页 + 钢笔 + 字母 B”的透明底标识，更贴近博客、书写和个人品牌气质。
- 源 SVG 保存在 `public/icons/site-icon.svg`，源 PNG 保存在 `public/icons/site-icon-source.png`。
- 已导出 `favicon.ico`、`icon-16.png`、`icon-32.png`、`icon-192.png`、`icon-512.png` 和 `apple-touch-icon.png`。
- 已在浅色、深色背景下预览，并放大检查 16px、32px 小尺寸识别度。
- 已按透明底要求导出 PNG 和 favicon 资源，空白区域保留 alpha 通道。
- `nuxt.config.ts`、`public/site.webmanifest` 和 `app/config/site.ts` 已接入正式图标路径。

## 阶段 3：全站布局与导航

### 布局组件

- [x] 创建 `app/components/layout/AppHeader.vue`。
- [x] 创建 `app/components/layout/AppFooter.vue`。
- [x] 创建 `app/components/layout/MobileNav.vue`。
- [x] 创建 `app/components/layout/PageShell.vue`。
- [x] 在 `default.vue` 中挂载 Header、主内容、Footer、小狗助手、音乐面板、设置面板、AI 面板入口。
- [x] Header 左侧展示站点名称或 Logo。
- [x] Header 右侧展示 Blog、Wiki、Todo、About 导航。
- [x] Header 提供主题切换入口或设置入口。
- [x] 移动端 Header 使用紧凑菜单，不让导航挤满顶部。
- [x] Footer 展示版权、站点说明、备案号占位。

### 路由与导航状态

- [x] 高亮当前路由。
- [x] 导航 hover、active、focus 状态一致。
- [x] 移动端菜单打开后可关闭。
- [x] 点击路由后移动端菜单自动关闭。
- [x] 键盘 Tab 可以访问导航。
- [x] Escape 可以关闭移动端菜单。

### 阶段验收

- [x] 桌面端 Header 不遮挡首页首屏标题。
- [x] 移动端 Header 不遮挡内容。
- [x] Footer 在内容少时贴近底部，在内容多时自然跟随。
- [x] 主题切换或设置入口位置稳定。

阶段 3 验收记录（2026-05-16）：
- 已完成全站 Header、Footer、移动端导航、PageShell 和右下角快捷入口的基础挂载。
- 全站外层布局已统一为 `width: 100%`，页面、Header、Footer 不再使用固定最大宽度收窄。
- 主内容、Header 和 Footer 改用全宽容器加水平内边距，保证桌面端和移动端都有稳定留白。
- 移动端菜单支持打开、点击路由关闭和 Escape 关闭，当前路由高亮可用。
- 主题切换入口位置固定在 Header 右侧，并已改为白天/黑夜直接切换。

## 阶段 4：首页 MiMo 风格首屏

### 组件拆分

- [x] 创建 `app/components/home/HomeLetterField.vue`。
- [x] 创建 `app/components/home/MimoInspiredHero.vue`。
- [x] 创建 `app/components/home/HomeOverview.vue`。
- [x] 创建 `app/components/home/HomeRecentPosts.vue`。
- [x] 创建 `app/components/home/HomeKnowledgePanel.vue`。
- [x] 创建 `app/components/home/HomeTodoSnapshot.vue`。
- [x] 在 `app/pages/index.vue` 组合上述组件。

### MiMo 官网首页参考落实

- [x] 以 Xiaomi MiMo 官网作为首页首屏主要视觉参考。
- [x] 确认首页不是文章列表页或导航页，而是有完整首屏、下一屏内容和个人博客识别度的首页。
- [x] 拆解 MiMo 官网的浅色背景、重复字母矩阵、中央圆形、大标题穿插和滚动动效。
- [x] 只学习 MiMo 官网的构图、层级和动效节奏，不使用 Xiaomi 或 MiMo 的 Logo、品牌文案和素材。
- [x] 把 MiMo 构图替换为个人博客身份，例如站点名、个人简介、最近内容入口和知识库入口。
- [x] 明确博客模板或文章列表不能作为首页首屏视觉参考。
- [x] 记录 MiMo 风格中哪些元素需要降级，例如过强动效、过大标题遮挡、移动端圆形裁切或文字溢出。

### HomeLetterField

- [x] 接收字符源，例如 `NOTEBOOK`、`BLOG` 或站点英文名。
- [x] 生成多行重复字母矩阵。
- [x] 设置 `aria-hidden="true"`。
- [x] 字母使用低透明度和大字距。
- [x] 白天模式下字母矩阵使用低透明度深色。
- [x] 黑夜模式下字母矩阵使用低透明度浅色。
- [x] 支持根据容器宽度调整行数和字号。
- [x] 深色模式下调整透明度，避免背景过亮。
- [x] 减少动效模式下保持静态。

### MimoInspiredHero

- [x] 首屏高度使用 `min-height: min(760px, 100svh)` 或等价方案。
- [x] 支持读取 `app/config/backgrounds.ts` 中的主页背景配置。
- [x] 白天模式优先使用 `public/backgrounds/home/day/` 背景。
- [x] 黑夜模式优先使用 `public/backgrounds/home/night/` 背景。
- [x] 没有背景图片时使用高级纯色或轻纹理兜底。
- [x] 背景图使用 `background-size: cover` 或等价实现，并检查移动端裁切。
- [x] 背景上方叠加可读性遮罩，遮罩强度随主题变化。
- [x] 中央圆形尺寸使用 `clamp(220px, 42vw, 520px)`。
- [x] 移动端圆形尺寸使用 `clamp(220px, 72vw, 520px)`。
- [x] 大标题使用语义化 `h1`。
- [x] 标题桌面端横向穿过圆形。
- [x] 标题移动端拆成两行或三行。
- [x] 实现圆形内文字反相效果。
- [x] 优先尝试双文本叠层或 `mix-blend-mode`，保证兼容性。
- [x] 鼠标移动时圆形轻微位移。
- [x] 鼠标移动时背景字母有轻微视差。
- [x] 滚动时圆形轻微缩放或淡出。
- [x] 减少动效模式下禁用鼠标跟随和滚动视差。
- [x] 首屏底部露出下一屏内容。
- [x] 首页首屏不使用 Xiaomi Logo 或 Xiaomi 文案。

### 首页内容区

- [x] HomeOverview 展示站点一句话定位。
- [x] HomeOverview 承接 MiMo 首屏，展示个人信息摘要和站点定位。
- [x] HomeRecentPosts 展示最近博客文章。
- [x] HomeRecentPosts 展示日期、分类、标签和简短摘要，但不抢首页首屏视觉。
- [x] HomeKnowledgePanel 展示 Wiki 入口和最近更新。
- [x] HomeTodoSnapshot 展示当前计划、进行中、已完成数量。
- [x] 首页内容区预留博客、Wiki、Todo 的清晰入口，方便从首屏继续浏览。
- [x] 内容区避免卡片堆满，优先使用清楚的分区和列表。
- [x] 首页 CTA 使用图标按钮或文本按钮，风格统一。

### 阶段验收

- [x] 首页桌面端第一屏有强识别度。
- [x] 首页明确参考 MiMo 官网构图，但已经替换成个人博客表达，不像仿站。
- [x] 首页移动端不溢出、不遮挡导航。
- [x] 大标题、黑圆、背景字母层级清晰。
- [x] 白天模式首页背景、标题和圆形对比度清晰。
- [x] 黑夜模式首页背景、标题和圆形对比度清晰。
- [x] 背景目录为空时首页仍有高级兜底视觉。
- [x] 减少动效模式可以正常浏览。
- [x] 下一屏内容在首屏底部可见。

阶段 4 验收记录（2026-05-16）：
- 首页已拆成 `HomeLetterField`、`MimoInspiredHero`、`HomeOverview`、`HomeRecentPosts`、`HomeKnowledgePanel`、`HomeTodoSnapshot`，`app/pages/index.vue` 只负责组合。
- 首屏保留系统鼠标，圆形只作为跟随视觉层，避免鼠标消失；鼠标跟随、滚动视差均使用轻量状态和 `requestAnimationFrame`。
- 背景配置会读取 `app/config/backgrounds.ts`，但 placeholder 图片不存在时不发起图片请求，直接使用主题遮罩、径向光和纯色兜底。
- 修正首页标题为 `你好,我是Cherish`，并将页面中的首屏组件标签改为 Nuxt 自动注册名 `HomeMimoInspiredHero`，避免匿名组件渲染警告。
- 根据反馈暂时将首页背景改为纯白，取消首屏方框线；标题改为单行 `你好,我是cherish`；首页鼠标改为跟随屏幕坐标的小灰圈，悬停标题时放大为放大镜效果，中央文案和按钮随鼠标中幅度摆动。
- 根据反馈删除首屏 `CHERISH NOTEBOOK` 小字；首页首屏改为占满导航栏下方的整屏，下一屏内容需要下滑才出现；将新增背景图移动到 `public/backgrounds/home/day/school-girl-campus.png`，设置面板支持在纯白背景和该图片之间切换，并用 `localStorage` 保存偏好。
- 根据反馈将首页鼠标圈改为更大的黑色波纹圈；默认保留系统箭头并让箭头位于圈中心，悬停标题时隐藏箭头并在圈内显示放大的局部标题文字；背景图改为正确的 `.jpg` 扩展名并去掉图片模式下的白色遮罩，避免水印文件名和清晰度损失。
- 根据反馈将首页主标题改为英文 `hello,I'm cherish`；取消标题整体 hover 放大，只保留黑色圈圈遮挡区域内的局部放大；纯白背景下不再渲染 `NOTEBOOK`、`BLOG`、`WIKI`、`TODO` 字母水印。
- 根据反馈彻底移除首页首屏 `HomeLetterField` 调用，所有背景下都不再渲染 `NOTEBOOK`、`BLOG`、`WIKI`、`TODO` 字母层；执行 `npm run cleanup` 修复 `.nuxt/dev/index.mjs` worker entry 缺失后，dev 首页访问返回 `200`。
- 根据反馈继续放大首页放大镜，标题字号轻微下调；悬停标题时用圆形遮罩盖住原文字区域，只在黑圈内显示白色放大的局部标题文字；鼠标静止时黑圈保持稳定圆形，移动时才播放波纹动效。
- 修复放大镜悬停标题时右下方额外显示异常内容的问题：移除额外 `title-mask` 节点，改为直接在原标题文字上使用圆形 CSS mask 挖空。
- `npm run generate` 已通过，首页和现有路由均可静态生成。

## 阶段 5：内容目录与 Nuxt Content

### 内容结构

- [x] 在 `content/blog/` 添加 Markdown 示例文章。
- [x] 在 `content/wiki/` 添加 Markdown 示例 Wiki 文档。
- [x] 在 `content/todo/` 添加示例 Roadmap 文档。
- [x] 每个 Markdown 文件包含 frontmatter。
- [x] 博客文章统一使用 `.md` 文件，不使用 MDX。
- [x] Wiki 文档统一使用 `.md` 文件，不使用 MDX。
- [x] Markdown 文件名采用 `YYYY-MM-DD-笔记名.md`，前端从文件名解析笔记日期。
- [x] 博客 frontmatter 包含 title、description、tags、category、draft。
- [x] Wiki frontmatter 包含 title、description、category、tags。
- [x] Todo frontmatter 包含 title、status、priority、targetDate。

### 内容工具

- [x] 创建 `app/utils/content.ts` 或 composable 封装内容读取逻辑。
- [x] 统一处理日期格式。
- [x] 统一处理标签颜色。
- [x] 统一处理草稿过滤。
- [x] 统一处理空结果。
- [x] 统一处理内容加载错误。

### Markdown 样式

- [x] 创建 `app/assets/css/prose.css` 或在主 CSS 中定义文章样式。
- [x] 设置 h1、h2、h3、p、ul、ol、blockquote、code、pre、table 样式。
- [x] 代码块支持横向滚动。
- [x] 行内代码和代码块视觉区分清楚。
- [x] 表格在移动端可横向滚动。
- [x] 图片有最大宽度、圆角和说明文字样式。
- [x] 外链有清晰样式。

### 阶段验收

- [x] 示例 Markdown 能被页面读取。
- [x] Markdown 长文阅读舒适。
- [x] 代码块不撑破页面。
- [x] 缺少内容时有空状态。
- [x] 页面没有出现 `新建文章`、`编辑文章`、`保存笔记`、`发布` 等写入型入口。
- [x] 文档中说明新增内容流程：本地编辑 `content/`、预览、提交、构建、部署。
- [x] 空状态文案引导回到本地 `content/` 添加文件，不引导网页端创建内容。
- [x] 所有内容读取失败只展示错误状态和返回入口，不提供在线修复或在线编辑入口。

阶段 5 验收记录（2026-05-16）：
- 已补齐 Blog、Wiki、Todo 示例 Markdown 的 frontmatter，示例正文覆盖标题、段落、列表、引用、代码块和表格。
- 新增 `app/utils/content.ts`，统一从 `YYYY-MM-DD-笔记名.md` 文件名解析笔记日期，并处理日期格式、标签 tone、草稿过滤、空结果和错误结果结构。
- 新增 `app/assets/css/prose.css` 并接入 Nuxt 全局 CSS，详情页 Markdown 具备代码块横向滚动、表格横向滚动、行内代码和外链样式。
- Blog、Wiki、Todo 列表页已复用内容工具，并显式区分错误状态和空状态。
- `content/README.md` 已说明本地编辑、预览、提交、构建、部署的内容维护流程。
- `npm run generate` 已通过，静态生成包含 `/blog/2026-05-16-nuxt-notebook`、`/wiki/2026-05-16-content-workflow` 和 `/todo/2026-05-16-home-polish`。

## 阶段 6：博客模块

### 博客列表

- [ ] 创建 `app/pages/blog/index.vue`。
- [ ] 创建 `app/components/blog/BlogList.vue`。
- [ ] 创建 `app/components/blog/BlogListItem.vue`。
- [ ] 创建 `app/components/blog/BlogFilterBar.vue`。
- [ ] 展示文章标题、摘要、日期、标签、分类。
- [ ] 支持按分类筛选。
- [ ] 支持按标签筛选。
- [ ] 支持搜索标题和摘要。
- [ ] 支持归档入口或按年月分组的浏览方式。
- [ ] 预留标签云或热门标签入口，保持克制，不做满屏装饰。
- [ ] 支持草稿过滤。
- [ ] 列表项 hover 状态高级克制，不做大幅位移。
- [ ] 空列表显示 EmptyState。
- [ ] 不提供网页端新建、编辑、删除、发布文章按钮。

### 博客详情

- [ ] 创建博客详情动态路由。
- [ ] 创建 `app/components/blog/ArticleHeader.vue`。
- [ ] 创建 `app/components/blog/ArticleToc.vue`。
- [ ] 创建 `app/components/blog/ReadingProgress.vue`。
- [ ] 展示标题、描述、日期、标签、分类。
- [ ] 展示 Markdown 正文。
- [ ] 生成目录导航。
- [ ] 支持目录当前标题高亮。
- [ ] 支持阅读进度条。
- [ ] 支持上一篇、下一篇。
- [ ] 移动端目录默认折叠。
- [ ] 文章详情不提供在线编辑入口。

### 阶段验收

- [ ] 博客列表可扫描，信息密度适中。
- [ ] 博客列表服务阅读和筛选，不承担首页首屏视觉任务。
- [ ] 文章详情正文宽度舒适。
- [ ] 目录不遮挡正文。
- [ ] 移动端长标题不溢出。
- [ ] 博客模块是只读发布系统，内容修改必须回到本地文件。
- [ ] 博客模块没有 `写文章`、`保存草稿`、`发布文章`、`编辑本页` 等按钮。
- [ ] 博客搜索和筛选只改变浏览结果，不改变内容源。

## 阶段 7：Wiki 知识库模块

### Wiki 总览

- [ ] 创建 `app/pages/wiki/index.vue`。
- [ ] 创建 `app/components/wiki/WikiTree.vue`。
- [ ] 创建 `app/components/wiki/WikiSearch.vue`。
- [ ] 创建 `app/components/wiki/WikiDocList.vue`。
- [ ] 按目录或 category 展示 Wiki 分类。
- [ ] 展示文档标题、摘要、更新时间、标签。
- [ ] 支持关键词搜索。
- [ ] 支持分类筛选。
- [ ] 搜索无结果时显示 EmptyState。
- [ ] 不提供网页端新增 Wiki、编辑 Wiki、删除 Wiki 按钮。

### Wiki 详情

- [ ] 创建 Wiki 文档动态路由。
- [ ] 创建 `app/components/wiki/WikiBreadcrumb.vue`。
- [ ] 创建 `app/components/wiki/WikiDocHeader.vue`。
- [ ] 创建 `app/components/wiki/WikiSideToc.vue`。
- [ ] 展示面包屑。
- [ ] 展示文档更新时间。
- [ ] 展示正文。
- [ ] 支持侧边目录。
- [ ] 移动端目录折叠为抽屉。
- [ ] Wiki 详情不提供在线编辑入口。

### 高级体验

- [ ] Wiki 页面保持高密度但不拥挤。
- [ ] 当前选中文档在目录树中高亮。
- [ ] 目录树滚动区域不影响正文滚动。
- [ ] 搜索框聚焦态清楚。
- [ ] 文档标签与博客标签视觉统一。

### 阶段验收

- [ ] Wiki 像知识库，不像普通文章列表。
- [ ] 搜索、分类、目录能快速定位文档。
- [ ] 移动端可以顺畅阅读 Wiki。
- [ ] Wiki 模块只读，内容修改必须回到本地 `content/wiki/`。
- [ ] Wiki 没有在线 Markdown 编辑器、富文本工具栏、上传附件、保存页面等入口。
- [ ] Wiki 空状态只说明本地文件维护流程，不提供网页端新增文档按钮。

## 阶段 8：Todo 规划模块

### Todo 数据

- [ ] 决定第一版 Todo 使用 Markdown frontmatter 还是 `tasks.json`。
- [ ] 如果使用 Markdown，创建 `content/todo/roadmap.md`。
- [ ] 如果使用 JSON，创建 `content/todo/tasks.json`。
- [ ] 定义任务字段：title、description、status、priority、startDate、targetDate、tags。
- [ ] 定义 status：planned、in-progress、done、paused。
- [ ] 定义 priority：high、medium、low。

### Todo 页面

- [ ] 创建 `app/pages/todo/index.vue`。
- [ ] 创建 `app/components/todo/TodoOverview.vue`。
- [ ] 创建 `app/components/todo/TodoBoard.vue`。
- [ ] 创建 `app/components/todo/TodoItem.vue`。
- [ ] 创建 `app/components/todo/TodoTimeline.vue`。
- [ ] 展示计划中、进行中、已完成、搁置数量。
- [ ] 支持按状态分组。
- [ ] 支持按优先级筛选。
- [ ] 支持按时间范围展示。
- [ ] 任务卡片展示标题、描述、状态、优先级、目标日期。
- [ ] Todo 状态使用只读标签、徽标或图标展示，不使用可勾选保存的 checkbox。
- [ ] Todo 列表不支持拖拽改状态、行内编辑、网页新增任务或删除任务。
- [ ] Todo 页面可提供折叠、筛选、搜索，但这些都只作为浏览状态。
- [ ] Todo 空状态提示回到本地 `content/todo/` 添加 Markdown 或 JSON。

### 阶段验收

- [ ] Todo 状态一眼可辨。
- [ ] 页面不是玩具化看板，要像个人规划仪表盘。
- [ ] 移动端单列布局可读。
- [ ] 无任务时有空状态。
- [ ] Todo 模块不会误导用户以为网页端修改可以持久保存。
- [ ] Todo 页面没有 `新增任务`、`保存任务`、`提交计划`、`拖到完成` 等写入型交互。

## 阶段 9：小狗宠物助手

### 状态管理

- [ ] 创建 `app/composables/usePetAssistant.ts`。
- [ ] 定义状态：idle、hover、open、music、thinking、hidden。
- [ ] 保存隐藏状态到 `localStorage`。
- [ ] 暴露 openMenu、closeMenu、toggleMenu、hide、show 方法。
- [ ] 和音乐播放状态联动。
- [ ] 和 AI thinking 状态联动。

### 组件实现

- [ ] 创建 `app/components/pet/PetDogAssistant.vue`。
- [ ] 创建 `app/components/pet/PetActionMenu.vue`。
- [ ] 小狗固定在右下角或左下角。
- [ ] 桌面端点击后菜单向上展开。
- [ ] 移动端点击后菜单使用紧凑浮层或底部弹层。
- [ ] 菜单项包括 AI 问答、音乐播放、换个背景、设置、回到顶部。
- [ ] 菜单项不包括写笔记、新建 Wiki、新增 Todo、发布文章等写入动作。
- [ ] 每个菜单项使用 lucide 图标。
- [ ] 小狗 hover 有轻微反馈。
- [ ] 音乐播放中小狗有轻微律动。
- [ ] AI 思考中小狗显示思考状态。
- [ ] 减少动效模式下关闭律动和弹跳。

### 遮挡与可访问性

- [ ] 小狗不遮挡正文滚动条。
- [ ] 小狗不遮挡文章目录。
- [ ] 小狗不遮挡移动端底部按钮。
- [ ] 菜单支持键盘访问。
- [ ] 菜单打开后点击外部关闭。
- [ ] Escape 可以关闭菜单。

### 阶段验收

- [ ] 小狗全站可见且不干扰阅读。
- [ ] 快捷菜单可用。
- [ ] 小狗状态能反映音乐和 AI。

## 阶段 10：设置与背景系统

### 状态管理

- [ ] 创建 `app/composables/useSiteSettings.ts`。
- [ ] 管理主题模式：system、light、dark。
- [ ] light 显示为白天模式，dark 显示为黑夜模式。
- [ ] 管理背景选择。
- [ ] 管理主页背景模式：跟随主题、指定白天背景、指定黑夜背景、随机。
- [ ] 从 `app/config/backgrounds.ts` 读取背景分组。
- [ ] 管理字体密度：standard、comfortable、compact。
- [ ] 管理动效强度：normal、reduced。
- [ ] 管理小狗显示状态。
- [ ] 设置保存到 `localStorage`。
- [ ] 初始化时读取系统主题。

### 设置面板

- [ ] 创建 `app/components/settings/SettingsPanel.vue`。
- [ ] 创建 `app/components/settings/ThemeSegmentedControl.vue`。
- [ ] 创建 `app/components/settings/BackgroundPicker.vue`。
- [ ] 创建 `app/components/settings/MotionToggle.vue`。
- [ ] 设置面板桌面端使用右侧抽屉。
- [ ] 设置面板移动端使用底部弹层。
- [ ] 主题切换展示白天、黑夜、跟随系统三个选项。
- [ ] 背景缩略图可以选中。
- [ ] 背景选择按白天背景、黑夜背景、通用背景分组展示。
- [ ] 背景缩略图来自 `public/backgrounds/home/day/`、`public/backgrounds/home/night/` 和 `public/backgrounds/shared/` 的配置。
- [ ] 当前主题不适合所选背景时显示轻提示或自动使用默认背景。
- [ ] 换背景功能可以随机切换背景。
- [ ] 设置变更即时生效。

### 阶段验收

- [ ] 刷新页面后设置保留。
- [ ] 浅色和深色主题都高级一致。
- [ ] 白天模式和黑夜模式可以手动切换。
- [ ] system 模式可以跟随系统偏好切换主题和背景组。
- [ ] 背景不会降低正文可读性。
- [ ] 主页背景更换只影响视觉偏好，不影响内容数据。

## 阶段 11：音乐播放器 APlayer + MetingJS

### 配置

- [ ] 创建 `app/config/music.ts`。
- [ ] 配置 `provider: 'meting'`。
- [ ] 配置 `server: 'tencent'`。
- [ ] 配置 `type: 'playlist'`。
- [ ] 配置 `playlistId: '待补充'`。
- [ ] 配置 `api: '默认或待配置'`。
- [ ] 配置 `autoplay: false`。
- [ ] 配置 `fallbackTracks: []`。
- [ ] 等开发时填入你的 QQ 音乐公开歌单 ID。
- [ ] 如果歌单无法公开访问，准备本地备用曲目。

### Nuxt 接入

- [ ] 在 `nuxt.config.ts` 加载 APlayer CSS。
- [ ] 在 `nuxt.config.ts` 加载 APlayer 脚本。
- [ ] 在 `nuxt.config.ts` 加载 MetingJS 脚本。
- [ ] 配置 `meting-js` 为 Vue 自定义元素。
- [ ] 确保播放器只在客户端渲染。
- [ ] 网络资源失败时页面不崩溃。

### 播放器状态

- [ ] 创建 `app/composables/useMusicPlayer.ts`。
- [ ] 管理播放器打开/关闭。
- [ ] 管理播放器展开/收起。
- [ ] 管理播放中、暂停、加载、错误状态。
- [ ] 管理当前歌曲标题。
- [ ] 保存展开/收起状态到 `localStorage`。
- [ ] 向小狗助手同步 music 状态。

### 组件实现

- [ ] 创建 `app/components/music/MusicPlayer.vue`。
- [ ] 创建 `app/components/music/MiniMusicPlayer.vue`。
- [ ] `MusicPlayer` 内部渲染 `<meting-js>`。
- [ ] `MusicPlayer` 外层使用自己的高级面板样式。
- [ ] 重写 APlayer 默认皮肤为暗色玻璃或浅色浮层风格。
- [ ] 播放器展开时展示列表。
- [ ] 播放器收起时展示迷你条。
- [ ] 移动端播放器贴近底部但避开安全区。
- [ ] 播放失败时显示错误提示。
- [ ] QQ 音乐不可用时展示 fallbackTracks 或空状态。

### 阶段验收

- [ ] 点击小狗菜单的音乐播放可以打开播放器。
- [ ] APlayer/MetingJS 能读取配置。
- [ ] QQ 音乐歌单 ID 填入后能尝试解析。
- [ ] 播放器不会遮挡正文和小狗。
- [ ] 深色模式下播放器不突兀。

## 阶段 12：AI 问答面板与安全配置

### 配置与安全

- [ ] 创建 `app/config/ai.ts`。
- [ ] 创建 `.env.example` 中的 AI 配置占位。
- [ ] 添加 `AI_BASE_URL=http://3stooges.chat:4036` 占位。
- [ ] 添加 `AI_MODEL=minimax-m2.7-awq` 占位。
- [ ] 添加 `AI_API_KEY=不要提交真实 Key` 占位。
- [ ] 确认真实 Key 不进入前端代码。
- [ ] 确认真实 Key 不进入 Git。
- [ ] 如果纯静态部署，真实调用必须使用外部安全代理或用户自填 Key。

### AI UI

- [ ] 创建 `app/composables/useAiChat.ts`。
- [ ] 创建 `app/components/ai/AiChatPanel.vue`。
- [ ] 创建 `app/components/ai/AiMessageList.vue`。
- [ ] 创建 `app/components/ai/AiComposer.vue`。
- [ ] 创建 `app/components/ai/AiContextPicker.vue`。
- [ ] 支持空状态。
- [ ] 支持用户输入消息。
- [ ] 支持发送按钮 loading。
- [ ] 支持错误状态。
- [ ] 支持清空会话。
- [ ] 支持当前页面作为上下文占位。
- [ ] 支持展示本地 Wiki/博客/Todo 搜索推荐。
- [ ] 移动端 AI 面板使用全屏或接近全屏抽屉。
- [ ] AI 面板不提供保存回答到 Wiki、生成文章并发布、写入 Todo 等持久化动作。
- [ ] AI 面板如果提供复制按钮，只复制到剪贴板，不改变内容源。

### 本地知识库推荐

- [ ] 从 content 中读取标题、摘要、标签。
- [ ] 根据用户问题做关键词匹配。
- [ ] 展示相关文档标题、摘要和链接。
- [ ] 没有匹配时提示可以继续普通问答。
- [ ] 第一版不强依赖真实模型接口。

### 阶段验收

- [ ] 点击小狗菜单的 AI 问答可以打开面板。
- [ ] 输入消息后 UI 状态完整。
- [ ] 本地推荐结果可点击。
- [ ] 不会暴露真实 API Key。
- [ ] AI 问答不会突破纯前端只读内容边界。

## 阶段 13：移动端与响应式精修

### 断点检查

- [ ] 检查 375px 手机宽度。
- [ ] 检查 430px 手机宽度。
- [ ] 检查 768px 平板宽度。
- [ ] 检查 1024px 小桌面宽度。
- [ ] 检查 1440px 桌面宽度。

### 页面适配

- [ ] 首页标题在移动端不溢出。
- [ ] 首页圆形不遮挡导航。
- [ ] 博客列表移动端单列。
- [ ] 文章详情移动端目录折叠。
- [ ] Wiki 移动端目录折叠。
- [ ] Todo 移动端单列或横向滚动合理。
- [ ] 设置面板移动端底部弹层。
- [ ] 音乐播放器移动端迷你模式。
- [ ] AI 面板移动端输入框固定底部。
- [ ] 小狗助手移动端缩小并避开播放器。

### 触控与可读性

- [ ] 所有可点击元素不小于 `44px`。
- [ ] 图标按钮有 aria-label。
- [ ] 输入框不会被移动端键盘完全遮挡。
- [ ] 长中文标题自动换行。
- [ ] 长英文单词不会撑破布局。
- [ ] 固定元素不遮挡底部内容。

### 阶段验收

- [ ] 移动端没有横向滚动条。
- [ ] 移动端无文字重叠。
- [ ] 移动端核心功能都可用。

## 阶段 14：性能、可访问性与 SEO

### 性能

- [ ] 首屏避免加载过大的图片。
- [ ] 小狗资源使用 WebP、SVG、Lottie 或轻量序列帧。
- [ ] 非关键面板懒加载。
- [ ] APlayer/MetingJS 只在需要时渲染或客户端加载。
- [ ] 图片使用合适尺寸。
- [ ] 减少不必要的全局动画。
- [ ] 首页背景图准备桌面和移动端合适尺寸，避免直接加载超大原图。
- [ ] favicon 和图标资源使用合理尺寸，不把大图直接当 favicon。
- [ ] 重复列表组件避免不必要的深层响应式对象。
- [ ] 滚动监听、鼠标跟随和 resize 逻辑做节流或使用 requestAnimationFrame。
- [ ] 路由切换时不重复初始化全局播放器和小狗状态。

### 可访问性

- [ ] 页面有唯一 h1。
- [ ] 导航使用语义化 nav。
- [ ] 按钮不用 div 模拟。
- [ ] 弹层有关闭按钮。
- [ ] Escape 可关闭弹层。
- [ ] focus-visible 清晰。
- [ ] 字母背景使用 `aria-hidden`。
- [ ] 颜色对比度满足阅读需求。

### SEO

- [ ] 每个页面设置 title。
- [ ] 每个页面设置 description。
- [ ] 文章详情使用文章标题作为 title。
- [ ] 配置 favicon。
- [ ] 配置 apple-touch-icon。
- [ ] 配置基础 Open Graph title、description、image 占位。
- [ ] 生成站点基础 metadata。
- [ ] 后续可扩展 sitemap 和 RSS。

### 阶段验收

- [ ] 首页首屏加载体感流畅。
- [ ] 键盘可以完成主要操作。
- [ ] 页面基础 SEO 信息完整。
- [ ] 浏览器标签页图标显示正常。
- [ ] 生成后的静态资源路径正确。

## 阶段 15：构建与部署

### 构建检查

- [ ] 添加 `npm run dev` 脚本。
- [ ] 添加 `npm run build` 脚本。
- [ ] 添加 `npm run generate` 脚本。
- [ ] 添加 `npm run preview` 脚本。
- [ ] 执行本地开发启动检查。
- [ ] 执行静态生成检查。
- [ ] 检查 `.output/public` 是否生成。
- [ ] 检查深层路由刷新策略。

### 腾讯云部署

- [ ] 准备服务器目录，例如 `/var/www/blog`。
- [ ] 上传 `.output/public` 到服务器目录。
- [ ] 配置 Nginx root 指向静态目录。
- [ ] 配置 `try_files $uri $uri/ /index.html`。
- [ ] 配置 gzip 或 brotli。
- [ ] 绑定域名。
- [ ] 配置 HTTPS。
- [ ] 页脚补充备案号和链接。

### 上线前检查

- [ ] 首页可访问。
- [ ] 博客列表可访问。
- [ ] 文章详情可访问。
- [ ] Wiki 可访问。
- [ ] Todo 可访问。
- [ ] 关于页可访问。
- [ ] 刷新深层路由不 404。
- [ ] 资源路径正确。
- [ ] 控制台无关键错误。

## 阶段 16：最终体验验收

### 视觉验收

- [ ] 首页看起来高级、克制、有记忆点。
- [ ] 首页不像简单模板站。
- [ ] MiMo 风格是个人化改造，不像仿站。
- [ ] 站点图标有个人识别度。
- [ ] 内容页阅读舒适。
- [ ] 内容页像正式阅读产品，不像后台编辑器或半成品 CMS。
- [ ] 深色模式统一。
- [ ] 浅色模式统一。
- [ ] 白天模式主页背景清爽、明亮、可读。
- [ ] 黑夜模式主页背景低亮度、耐看、不刺眼。
- [ ] 小狗助手有趣但不喧宾夺主。
- [ ] 音乐播放器和站点风格一致。
- [ ] AI 面板像正式功能，不像临时弹窗。
- [ ] 全站没有明显 AI 生成站的套路感。
- [ ] 文案没有空泛、浮夸、过度营销的问题。

### 功能验收

- [ ] 路由完整。
- [ ] 内容读取完整。
- [ ] 背景切换可用。
- [ ] 主页背景资源从专用目录读取。
- [ ] 白天/黑夜模式切换时使用对应背景组或默认兜底。
- [ ] favicon 和站点图标加载正常。
- [ ] 设置保存可用。
- [ ] 小狗菜单可用。
- [ ] 音乐入口可用。
- [ ] AI 面板可用。
- [ ] 移动端可用。
- [ ] 静态生成可用。
- [ ] Blog、Wiki、Todo 的内容修改路径清楚：本地文件、预览、提交、构建、部署。
- [ ] 网页端没有任何正式内容写入能力。

### 代码质量验收

- [ ] 关键函数没有超过 100 行。
- [ ] 组件的 `template`、`script setup`、`style` 分区没有失控膨胀。
- [ ] 复杂组件已经拆成子组件或 composable。
- [ ] 主题、背景、音乐、AI、站点信息都有独立配置文件。
- [ ] 没有重复散落的魔法字符串和魔法颜色。
- [ ] 没有未处理的 TypeScript 明显类型漏洞。
- [ ] 没有把 `window`、`localStorage`、第三方播放器直接用于服务端渲染阶段。
- [ ] 新增代码方便后期维护，阅读时能快速找到入口、状态、配置和样式。

### 边界状态验收

- [ ] 无博客文章时显示空状态。
- [ ] 无 Wiki 文档时显示空状态。
- [ ] 无 Todo 时显示空状态。
- [ ] QQ 音乐歌单不可用时显示提示。
- [ ] AI 模型不可用时显示错误状态。
- [ ] 本地存储不可用时页面不崩溃。
- [ ] 减少动效模式可用。
- [ ] `localStorage` 清空后只影响偏好，不影响博客、Wiki、Todo 内容。
- [ ] 搜索、筛选、排序、折叠、展开刷新后恢复默认也不影响正式内容。

## 开发顺序建议

1. 先完成阶段 0 到阶段 0.5，统一产品边界、视觉方向和工程规范。
2. 再完成阶段 1 到阶段 2.5，让项目有骨架、设计系统和站点图标方向。
3. 接着完成阶段 3 到阶段 4，让网站有全站布局和首页气质。
4. 再完成阶段 5 到阶段 8，让博客、Wiki、Todo 可以真实承载内容。
5. 接着完成阶段 9 到阶段 12，把小狗、设置、音乐、AI 接进来。
6. 最后完成阶段 13 到阶段 16，集中做移动端、性能、部署和最终验收。

## 暂缓事项

- [ ] 暂缓登录系统。
- [ ] 暂缓数据库。
- [ ] 暂缓在线写文章。
- [ ] 暂缓在线写 Wiki 笔记。
- [ ] 暂缓在线新增或修改 Todo。
- [ ] 暂缓网页端保存正式内容。
- [ ] 暂缓评论系统。
- [ ] 暂缓文章阅读统计。
- [ ] 暂缓真实 AI 直连前端。
- [ ] 暂缓复杂 3D 小狗，先用轻量 2D、SVG、WebP 或 Lottie。
- [ ] 暂缓自动播放音乐，遵守浏览器限制，由用户点击触发。
