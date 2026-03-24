# 第一章：入门与环境搭建

元信息：
* 知识点：Koa 简介、安装部署、文件结构
* 记录时间：2026-03-24
* 对应文件：无

---

## 1. Koa 简介

Koa 是由 Express 原班人马打造的下一代 Node.js Web 框架。它的设计理念是：**更小、更富有表现力、更健壮**。

### Koa vs Express vs CodeIgniter

| 特性 | Koa | Express | CodeIgniter (PHP) |
|------|-----|---------|-------------------|
| 语言 | Node.js | Node.js | PHP |
| 体积 | ~1MB | ~6MB | ~2MB |
| 中间件模型 | 洋葱模型（可回溯） | 线性模型 | Hook 机制 |
| async/await | 原生支持 | 需要额外处理 | 不适用 |
| 内置功能 | 极简，按需添加 | 内置路由、静态文件等 | 内置 MVC、数据库等 |
| Context | 统一的 ctx 对象 | 分离的 req/res | $this->input/output |

### 选择建议

**选择 Koa 的场景**：
- 新项目，希望使用现代 JavaScript 特性
- 需要精细控制请求/响应流程
- 团队熟悉 async/await

**选择 Express 的场景**：
- 快速开发，需要成熟的开箱即用功能
- 生态依赖多，需要丰富的第三方中间件
- 团队更熟悉传统回调风格

**选择 CodeIgniter 的场景**：
- PHP 技术栈
- 需要完整的 MVC 框架
- 传统服务器部署

---

## 2. 安装与初始化

### 前置要求

- Node.js >= 18.0.0（推荐使用 LTS 版本）
- npm 或 yarn

### 创建项目

```bash
# 创建项目目录
mkdir my-koa-app
cd my-koa-app

# 初始化 package.json
npm init -y

# 安装 Koa
npm install koa
```

### Hello World

创建 `app.js` 文件：

```javascript
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello Koa';
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
```

运行：

```bash
node app.js
```

访问 http://localhost:3000，你将看到 "Hello Koa"。

---

## 3. 项目文件结构

Koa 本身非常精简，不强制任何目录结构。以下是推荐的项目结构：

### 简单项目结构

```
my-koa-app/
├── app.js            # 入口文件
├── package.json
└── node_modules/
```

### 中型项目结构

```
my-koa-app/
├── app.js            # 入口文件
├── config/           # 配置文件
│   └── index.js
├── routes/           # 路由目录
│   ├── index.js      # 路由汇总
│   ├── users.js      # 用户路由
│   └── posts.js      # 文章路由
├── middlewares/      # 自定义中间件
│   ├── auth.js       # 认证中间件
│   └── errorHandler.js
├── models/           # 数据模型
├── controllers/      # 控制器
├── public/           # 静态文件
├── utils/            # 工具函数
└── package.json
```

### 与 CodeIgniter 结构对比

| CodeIgniter | Koa (推荐) | 说明 |
|-------------|------------|------|
| application/controllers/ | controllers/ | 控制器 |
| application/models/ | models/ | 数据模型 |
| application/views/ | views/ 或前端项目 | 视图（Koa 主要做 API） |
| application/config/ | config/ | 配置文件 |
| system/ | node_modules/ | 框架核心 |

---

## 4. 常用依赖安装

```bash
# 路由
npm install @koa/router

# 请求体解析
npm install koa-bodyparser
# 或者更强大的 koa-body（支持文件上传）
npm install koa-body

# 跨域
npm install @koa/cors

# 静态文件
npm install koa-static

# 日志
npm install koa-logger

# 开发热重载
npm install -D nodemon
```

### package.json scripts 配置

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }
}
```

---

## 5. 实践练习

### 练习 1：创建基础项目

按照上面的步骤创建一个 Koa 项目，添加 nodemon 实现热重载。

### 练习 2：添加简单路由

```javascript
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  // 根据 URL 返回不同内容
  if (ctx.url === '/') {
    ctx.body = '首页';
  } else if (ctx.url === '/about') {
    ctx.body = '关于我们';
  } else {
    ctx.status = 404;
    ctx.body = '页面不存在';
  }
});

app.listen(3000);
```

### 练习 3：理解执行顺序

```javascript
const Koa = require('koa');
const app = new Koa();

// 中间件 1
app.use(async (ctx, next) => {
  console.log('1. 第一个中间件 - 开始');
  await next();
  console.log('4. 第一个中间件 - 结束');
});

// 中间件 2
app.use(async (ctx, next) => {
  console.log('2. 第二个中间件 - 开始');
  await next();
  console.log('3. 第二个中间件 - 结束');
});

// 响应
app.use(async ctx => {
  ctx.body = 'Hello Koa';
});

app.listen(3000);

// 访问后控制台输出：1 -> 2 -> 3 -> 4
```

---

## 我的总结

<!-- 在这里记录你的学习心得和疑问 -->

_待填写..._

---

## 下一章

[第二章：核心概念](koa_chapter_2.md) - 深入理解 Context 对象和请求响应处理。
