# JS Script Hook Website

<div align="right">
  <a href="README.md">English</a> | <a href="README.md">中文</a>
</div>

## About

This is the official website for the JS Script Hook project, featuring a React-based SPA that showcases the library's features, provides installation instructions, and offers community support resources.

The website is built with React, TypeScript, and supports full internationalization with both English and Chinese languages.

## Features

- Responsive design that works on all devices
- Comprehensive internationalization (i18n) support for English and Chinese
- Optimized SEO metadata with language-specific content
- Interactive UI components to demonstrate the library's capabilities
- Social sharing functionality

## Development

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/JSREI/js-script-hook.git
cd js-script-hook/script-hook-website

# Install dependencies
npm install
# or
yarn install
```

### Development Server

```bash
# Start the development server
npm start
# or
yarn start
```

The website will be available at `http://localhost:8080`.

### Building for Production

```bash
# Build for production
npm run build
# or
yarn build
```

The compiled website will be available in the `dist` directory.

## Internationalization

The website supports both English and Chinese languages. The language is automatically detected based on the user's browser settings, but can also be manually selected through the language switcher in the header.

Translation files are located in:
- `src/i18n/locales/en.json` (English)
- `src/i18n/locales/zh.json` (Chinese)

## Deployment

The website is deployed to GitHub Pages automatically via GitHub Actions when changes are pushed to the main branch.

---

<div align="center">
  <h1>JS Script Hook 网站</h1>
</div>

<div align="right">
  <a href="README.md">English</a> | <a href="README.md">中文</a>
</div>

## 简介

这是JS Script Hook项目的官方网站，基于React的单页应用程序，展示了该库的功能特性，提供安装指南，并提供社区支持资源。

该网站使用React和TypeScript构建，支持英文和中文的完整国际化。

## 特性

- 响应式设计，适用于所有设备
- 全面支持英文和中文的国际化(i18n)
- 针对不同语言优化的SEO元数据
- 交互式UI组件，展示库的功能
- 社交媒体分享功能

## 开发

### 环境要求

- Node.js (v14.0.0或更高版本)
- npm或yarn

### 安装

```bash
# 克隆仓库
git clone https://github.com/JSREI/js-script-hook.git
cd js-script-hook/script-hook-website

# 安装依赖
npm install
# 或
yarn install
```

### 开发服务器

```bash
# 启动开发服务器
npm start
# 或
yarn start
```

网站将在`http://localhost:8080`可访问。

### 生产环境构建

```bash
# 构建生产版本
npm run build
# 或
yarn build
```

编译后的网站将在`dist`目录中可用。

## 国际化

该网站支持英文和中文两种语言。语言会根据用户的浏览器设置自动检测，也可以通过页头的语言切换器手动选择。

翻译文件位于：
- `src/i18n/locales/en.json`（英文）
- `src/i18n/locales/zh.json`（中文）

## 部署

当更改推送到主分支时，网站会通过GitHub Actions自动部署到GitHub Pages。 