---
title: Fuwari 修改图片
published: 2024-01-01
updated: 2025-05-10
description: '在图片下方添加标题，修改图片大小'
image: ''
tags: ["Fuwari", "教程"]
category: Fuwari
draft: false
lang: ''
---

本篇参考 [feat: add image-caption feature](https://github.com/saicaca/fuwari/pull/351)

# 效果展示

![山的那边 w-50%](https://keke0420-1330580499.cos.ap-shanghai.myqcloud.com/img/%E5%9C%A8%E5%B1%B1%E7%9A%84%E9%82%A3%E8%BE%B94K%E9%A3%8E%E6%99%AF%E5%A3%81%E7%BA%B83840x2160_%E5%BD%BC%E5%B2%B8%E5%9B%BE%E7%BD%91.jpg?imagevanblog "我是图片标题")

# 如何修改

## 新增`image-caption.css`



````
```js title="src/styles/image-caption.css"
figure.image-caption {
  inline-size: fit-content;
  margin-inline: auto;

  > a,
  > div {
    @apply flex flex-wrap justify-center gap-2 sm:gap-4;

    > figure {
      @apply m-0;

      inline-size: fit-content;
    }

    > img,
    > figure > img {
      @apply min-w-[150px] max-w-[150px] sm:max-w-[300px] m-0;
    }

    > img:only-of-type,
    > figure:only-of-type > img {
      @apply min-w-[300px] max-w-[300px] sm:max-w-[600px];
    }
  }

  > a:has(> img:nth-of-type(2)),
  > a:has(> figure:nth-of-type(2)) {
    @apply max-w-[316px] sm:max-w-[624px];
  }

  > div:has(> img:nth-of-type(2)),
  > div:has(> figure:nth-of-type(2)) {
    @apply max-w-[308px] sm:max-w-[616px];
  }
}

figure.image-caption > a img {
  @apply pointer-events-none;
}

figure.image-caption figcaption {
  @apply break-words;

  inline-size: 0;
  min-inline-size: fit-content;
  margin-inline: auto;
}
```
````



## 新增remark-image-caption.ts`

### `src/plugins/remark-image-caption.ts`

```
import deepmerge from "@fastify/deepmerge";
import { type Child, type Properties, h } from "hastscript";
import type {
    Image,
    Link,
    Paragraph,
    PhrasingContent,
    Root,
    RootContent,
} from "mdast";
import type { Plugin, Transformer } from "unified";
import { visit } from "unist-util-visit";
import type { Visitor } from "unist-util-visit";

type DeepPartial<T> = T extends object
    ? {
        [P in keyof T]?: DeepPartial<T[P]>;
    }
    : T;

interface LinkAttributes {
    target: string;
    rel: string;
}

interface Options {
    className: string;
    excludedPaths: (string | RegExp)[];
    lazyLoad: boolean;
    linkAttributes: LinkAttributes;
}

type UserOptions = DeepPartial<Options>;

const defaultOptions: Options = {
    className: "",
    excludedPaths: [],
    lazyLoad: false,
    linkAttributes: { target: "", rel: "" },
};

const remarkImageCaption: Plugin<[UserOptions?], Root> = (options) => {
    const mergedOptions = deepmerge()(defaultOptions, options ?? {}) as Options;

    const transformer: Transformer<Root> = async (tree) => {
        const visitor: Visitor<Paragraph> = (paragraphNode, index, parent) => {
            if (
                index === undefined ||
                parent === undefined ||
                parent.type !== "root" ||
                paragraphNode.data !== undefined
            )
                return;

            const customNodes = createCustomNodes(paragraphNode, mergedOptions);

            if (customNodes.length) {
                parent.children.splice(index, 1, ...customNodes);
            }
        };

        visit(tree, "paragraph", visitor);
    };

    return transformer;
};

const isExcluded = (input: string, patterns: (string | RegExp)[]): boolean => {
    for (const pattern of patterns) {
        if (typeof pattern === "string") {
            if (input.includes(pattern)) return true;
        } else if (pattern instanceof RegExp) {
            if (pattern.test(input)) return true;
        }
    }

    return false;
};

const isSoftBreak = (node: PhrasingContent): boolean => {
    return node.type === "text" && (node.value === "\n" || node.value === "\r\n");
};

const containsOnlyImageRelatedChildren = (
    node: Paragraph | Link,
    patterns: (string | RegExp)[],
): boolean => {
    return node.children.every(
        (child) =>
            (child.type === "image" && !isExcluded(child.url, patterns)) ||
            child.type === "break" ||
            isSoftBreak(child),
    );
};

const extractValidImageNodes = (
    paragraphNode: Paragraph,
    options: Options,
): Image[] => {
    const hasImages = containsOnlyImageRelatedChildren(
        paragraphNode,
        options.excludedPaths,
    );

    return hasImages
        ? paragraphNode.children.filter((child) => child.type === "image")
        : [];
};

const extractValidImageLinkNodes = (
    paragraphNode: Paragraph,
    options: Options,
): Link[] => {
    const hasImageLinks = paragraphNode.children.every(
        (child) =>
            child.type === "link" &&
            child.children.length &&
            containsOnlyImageRelatedChildren(child, options.excludedPaths),
    );

    return hasImageLinks
        ? ((paragraphNode.children as Link[]).map((child) => ({
            ...child,
            children: child.children.filter(
                (subChild) => subChild.type === "image",
            ),
        })) as Link[])
        : [];
};

const createImageProperties = (
    imageNode: Image,
    lazyLoad: boolean,
): Properties => {
    return {
        alt: imageNode.alt,
        src: imageNode.url,
        ...(lazyLoad && { loading: "lazy" }),
    };
};

const createFigureFromImages = (
    imageNodes: Image[],
    options: Options,
): RootContent => {
    const canNest = imageNodes.every((imageNode) => imageNode.title);

    let children: Child[];

    if (canNest) {
        children = imageNodes.map((imageNode) =>
            h("figure", {}, [
                h("img", createImageProperties(imageNode, options.lazyLoad), []),
                h("figcaption", {}, [imageNode.title]),
            ]),
        );
    } else {
        children = imageNodes.map((imageNode) =>
            h("img", createImageProperties(imageNode, options.lazyLoad), []),
        );
    }

    return {
        type: "text",
        value: "",
        data: {
            hName: "figure",
            hProperties: {
                ...(options.className ? { class: options.className } : {}),
            },
            hChildren: [
                h("div", {}, ...children),
                ...(!canNest && imageNodes[0].title
                    ? [h("figcaption", {}, [imageNodes[0].title])]
                    : []),
            ],
        },
    };
};

const isAbsoluteUrl = (url: string): boolean => {
    return /^[a-z][a-z\d+\-.]*:/i.test(url);
};

const createFigureFromLink = (
    linkNode: Link,
    options: Options,
): RootContent => {
    const imageNodes = linkNode.children as Image[];
    const canNest = imageNodes.some((imageNode) => imageNode.title);
    const target = options.linkAttributes.target;
    const rel = options.linkAttributes.rel;

    let children: Child[];

    if (canNest) {
        children = imageNodes.map((imageNode) =>
            h("figure", {}, [
                h("img", createImageProperties(imageNode, options.lazyLoad), []),
                ...(imageNode.title ? [h("figcaption", {}, [imageNode.title])] : []),
            ]),
        );
    } else {
        children = imageNodes.map((imageNode) =>
            h("img", createImageProperties(imageNode, options.lazyLoad), []),
        );
    }

    return {
        type: "text",
        value: "",
        data: {
            hName: "figure",
            hProperties: {
                ...(options.className ? { class: options.className } : {}),
            },
            hChildren: [
                h(
                    "a",
                    {
                        href: linkNode.url,
                        ...(isAbsoluteUrl(linkNode.url) && {
                            ...(target && { target }),
                            ...(rel && { rel }),
                        }),
                    },
                    ...children,
                ),
                ...(linkNode.title ? [h("figcaption", {}, [linkNode.title])] : []),
            ],
        },
    };
};

const createCustomNodes = (
    paragraphNode: Paragraph,
    options: Options,
): RootContent[] => {
    const nodes: RootContent[] = [];

    let extractedNodes: Image[] | Link[] = extractValidImageNodes(
        paragraphNode,
        options,
    );

    if (extractedNodes.length) {
        const newNode = createFigureFromImages(extractedNodes, options);
        nodes.push(newNode);
        return nodes;
    }

    extractedNodes = extractValidImageLinkNodes(paragraphNode, options);

    if (extractedNodes.length) {
        for (const extractedNode of extractedNodes) {
            const newNode = createFigureFromLink(extractedNode, options);
            nodes.push(newNode);
        }
        return nodes;
    }

    return [];
};

export default remarkImageCaption;
export type { UserOptions };

```



## 新增`remark-image-width.js'`

### `'/src/plugins/remark-image-width.js'`

```
import { visit } from "unist-util-visit";

export default function remarkImageWidth() {
    var regex = / w-([0-9]+)%/
    const transformer = async tree => {
        const visitor = (paragraphNode, index, parent) => {
            if (index === undefined || parent === undefined) return

            parent.children.forEach((node, index, parent) => {
                if (node.type === 'text' && node.data !== undefined && node.data.hName === 'figure') {
                    findImgNodes(node).forEach(img => {
                        const { parentNode, imgNode } = img
                        if (imgNode.properties.alt.search(regex) != -1) {
                            if (parentNode !== undefined && parentNode.tagName === 'figure') {
                                imgNode.properties.width = `${imgNode.properties.alt.match(regex)[1]}%`
                                parentNode.properties.style = `justify-items: center;`
                            }
                            imgNode.properties.alt = imgNode.properties.alt.replace(regex, "")
                        }
                    })
                }
            })
        }
        visit(tree, 'paragraph', visitor)
    }
    return transformer
}

function findImgNodes(node, parent = undefined, imgNodes = []) {
    if (node.tagName === 'img') {
        imgNodes.push({'parentNode': parent, 'imgNode': node})
    } else if (node.data !== undefined && node.data.hChildren !== undefined) {
        node.data.hChildren.forEach(child => findImgNodes(child, node, imgNodes))
    } else if (node.children !== undefined) {
        node.children.forEach(child => findImgNodes(child, node, imgNodes))
    }
    return imgNodes
}

```



## 修改`[...slug].astro`

### `src/pages/posts/[...slug].astro`

第102 行左右找到👇

```
<Markdown class="mb-6 markdown-content onload-animation">          
```

改成👇

```
 <Markdown class="mb-6 markdown-content onload-animation" basePath={path.join("content/posts/", getDir(entry.id))}>
```



## 修改`Markdown.astro`

### `src/components/misc/Markdown.astro`

添加依赖

```
import path from 'node:path'
import { getImage } from 'astro:assets'
import { parseHTML } from 'linkedom'
```



第7行左右找到👇

```
interface Props {
  class: string
}
```

改成👇

```
interface Props {
  class: string
  basePath?: string
}
```



第 11 行左右找到👇

```
const className = Astro.props.class
```

改成

```
const { class: className, basePath = '/' } = Astro.props
/*
 * Normally, relative paths under the `src` directory are handled by Astro.
 * However, paths that the plugin couldn't process may appear here and require separate handling.
 */
const html = await Astro.slots.render('default')
const { document } = parseHTML(html)
await (async () => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const modules: Record<string, any> = import.meta.glob(
    '../../**/*.{jpeg,jpg,png,tiff,webp,gif,svg,avif}',
  )
  const re = /^(?![a-zA-Z]+:\/|\/)/
  for (const img of document.querySelectorAll('img')) {
    const src = img.getAttribute('src')
    if (!src || !re.test(src)) continue
    const normalizedPath = path
      .normalize(path.join('../../', basePath, src))
      .replaceAll('\\', '/')
    const moduleLoader = modules[normalizedPath]
    if (!moduleLoader) continue
    try {
      const module = await moduleLoader()
      const result = await getImage({ src: module.default })
      img.setAttribute('src', result.src)
    } catch (error) {
      console.warn(
        `Skipping image "${normalizedPath}" due to processing error:`,
        error,
      )
    }
  }
})()
```



第 48 行左右找到👇

```
 <slot/>
```

改成👇

```
    <Fragment set:html={document.toString()} />
```



## 修改`astro.config.mjs`

### `astro.config.mjs`

添加👇

```
import remarkImageCaption from "./src/plugins/remark-image-caption.ts";//图片标题
import remarkImageWidth from './src/plugins/remark-image-width.js'图片大小
```

找到 `remarkPlugins`改成👇

```
  remarkPlugins: [
            remarkMath, // 支持 $ 数学语法
            remarkReadingTime, // 计算阅读时长
            remarkExcerpt, // 自动生成摘要
            remarkGithubAdmonitionsToDirectives, // 支持 GitHub 风格提示块
            remarkDirective, // 支持 ::note 等指令
            [
                remarkImageCaption,
                {
                    className: 'image-caption',
                },
            ],
            remarkImageWidth,
            remarkSectionize, // 自动 section 包裹
            parseDirectiveNode, // 自定义指令处理
        ],
```



# 用法

```
![山的那边 w-50%](url “你要修改的标题”)
```

