import fs from "fs";
import path from "path";

function getDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error(`Error: No path provided
Usage: pnpm new-post <path/to/filename>`);
  process.exit(1);
}

// 根目录统一为 ./src/content/posts/
const rootDir = path.resolve("src/content/posts");

// 解析传入的路径（可以是 xxx/yyy/filename 或 justfilename）
let relativePath = args[0];
let parsedPath = path.parse(relativePath);

// 确定完整目录和文件名
const targetDir = path.join(rootDir, parsedPath.dir);
let fileName = parsedPath.base;

// 如果没加扩展名，默认加 .md
if (!/\.(md|mdx)$/i.test(fileName)) {
  fileName += ".md";
}

const fullPath = path.join(targetDir, fileName);

// 创建目录（如果不存在）
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 防止覆盖已有文件
if (fs.existsSync(fullPath)) {
  console.error(`Error: File already exists at ${fullPath}`);
  process.exit(1);
}

// Frontmatter 模板
const content = `---
title: ${parsedPath.name}
published: ${getDate()}
description: ''
image: ''
tags: []
category: ''
draft: false
lang: ''
---
`;

fs.writeFileSync(fullPath, content);

console.log(`✅ Post created at ${fullPath}`);
