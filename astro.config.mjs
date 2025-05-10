import sitemap from "@astrojs/sitemap"; // 生成 sitemap
import svelte from "@astrojs/svelte"; // 支持 Svelte
import tailwind from "@astrojs/tailwind"; // 集成 TailwindCSS
import swup from "@swup/astro"; // 页面转场动画
import icon from "astro-icon"; // 图标支持
import { defineConfig } from "astro/config"; // 定义 Astro 配置
import rehypeAutolinkHeadings from "rehype-autolink-headings"; // 自动给标题添加锚点
import rehypeComponents from "rehype-components"; // 支持自定义组件
import rehypeKatex from "rehype-katex"; // 数学公式渲染
import rehypeSlug from "rehype-slug"; // 给标题生成 slug
import remarkDirective from "remark-directive"; // 支持 Markdown 指令
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives"; // 将 GitHub 风格提示块转换为指令
import remarkMath from "remark-math"; // 支持数学语法
import remarkSectionize from "remark-sectionize"; // 自动按 section 包裹内容
import { AdmonitionComponent } from "./src/plugins/rehype-component-admonition.mjs"; // 自定义提示块组件
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs"; // GitHub 卡片组件
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js"; // 自定义指令解析器
import { remarkExcerpt } from "./src/plugins/remark-excerpt.js"; // 自动生成摘要
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs"; // 计算阅读时长

import vue from "@astrojs/vue"; // 支持 Vue

// https://astro.build/config
export default defineConfig({
    site: "https://fuwari.vercel.app/", // 站点地址
    base: "/", // 基础路径
    trailingSlash: "always", // URL 结尾始终加 /
    integrations: [
        tailwind({
            nesting: true, // 支持嵌套语法
        }),
        swup({
            theme: false,
            animationClass: "transition-swup-", // 动画类名前缀，避免和 Tailwind 冲突
            containers: ["main", "#toc"], // 参与转场的容器
            smoothScrolling: true, // 平滑滚动
            cache: true, // 开启缓存
            preload: true, // 预加载
            accessibility: true, // 提升可访问性
            updateHead: true, // 更新 head 标签
            updateBodyClass: false, // 不更新 body class
            globalInstance: true, // 全局实例
        }),
        icon({
            include: {
                "preprocess: vitePreprocess(),": ["*"],
                "fa6-brands": ["*"],
                "fa6-regular": ["*"],
                "fa6-solid": ["*"],
            },
        }),
        svelte(), // Svelte 集成
        sitemap(), // 自动生成 sitemap
        vue(), // Vue 集成
    ],
    markdown: {
        remarkPlugins: [
            remarkMath, // 支持 $ 数学语法
            remarkReadingTime, // 计算阅读时长
            remarkExcerpt, // 自动生成摘要
            remarkGithubAdmonitionsToDirectives, // 支持 GitHub 风格提示块
            remarkDirective, // 支持 ::note 等指令
            remarkSectionize, // 自动 section 包裹
            parseDirectiveNode, // 自定义指令处理
        ],
        rehypePlugins: [
            rehypeKatex, // 数学公式渲染
            rehypeSlug, // 标题生成 slug
            [
                rehypeComponents,
                {
                    components: {
                        github: GithubCardComponent, // 自定义 <github> 标签
                        note: (x, y) => AdmonitionComponent(x, y, "note"),
                        tip: (x, y) => AdmonitionComponent(x, y, "tip"),
                        important: (x, y) => AdmonitionComponent(x, y, "important"),
                        caution: (x, y) => AdmonitionComponent(x, y, "caution"),
                        warning: (x, y) => AdmonitionComponent(x, y, "warning"),
                    },
                },
            ],
            [
                rehypeAutolinkHeadings,
                {
                    behavior: "append", // 锚点追加到标题后
                    properties: {
                        className: ["anchor"],
                    },
                    content: {
                        type: "element",
                        tagName: "span",
                        properties: {
                            className: ["anchor-icon"],
                            "data-pagefind-ignore": true, // 忽略搜索索引
                        },
                        children: [
                            {
                                type: "text",
                                value: "#", // 锚点内容
                            },
                        ],
                    },
                },
            ],
        ],
    },
    vite: {
        build: {
            rollupOptions: {
                onwarn(warning, warn) {
                    // 临时抑制动态导入 + 静态导入的警告
                    if (
                        warning.message.includes("is dynamically imported by") &&
                        warning.message.includes("but also statically imported by")
                    ) {
                        return;
                    }
                    warn(warning);
                },
            },
        },
    },
});
