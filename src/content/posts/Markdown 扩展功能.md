---
title: Markdown 扩展功能
published: 2024-05-01
updated: 2024-11-29
description: '在 Fuwari 中阅读更多关于 Markdown 功能的内容'
image: ''
tags: [演示, 示例, Markdown, Fuwari]
category: '示例'
draft: false
---

GitHub 仓库卡片

你可以添加动态卡片来链接到 GitHub 仓库，在页面加载时，仓库信息会从 GitHub API 拉取。

::github{repo=“Fabrizz/MMM-OnSpotify”}

创建一个 GitHub 仓库卡片的代码为 ::github{repo="<owner>/<repo>"}。

::github{repo="saicaca/fuwari"}

提示块（Admonitions）

支持以下类型的提示块：note tip important warning caution

:::note
突出显示用户即使在快速浏览时也应注意的信息。
:::

:::tip
提供可选信息，帮助用户更成功。
:::

:::important
用户成功所必需的重要信息。
:::

:::warning
由于潜在风险，需要用户立即注意的关键信息。
:::

:::caution
某个操作可能带来的负面后果。
:::

基本语法

:::note
突出显示用户即使在快速浏览时也应注意的信息。
:::

:::tip
提供可选信息，帮助用户更成功。
:::

自定义标题

提示块的标题可以自定义。

:::note[我的自定义标题]
这是一个带有自定义标题的提示块。
:::

:::note[我的自定义标题]
这是一个带有自定义标题的提示块。
:::

GitHub 语法

[!TIP]
GitHub 语法 也是支持的。

> [!NOTE]
> 支持 GitHub 语法。

> [!TIP]
> 支持 GitHub 语法。
