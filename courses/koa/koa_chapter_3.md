# 第三章：中间件机制

元信息：
* 知识点：洋葱模型、中间件编写
* 记录时间：2026-03-24
* 对应文件：无

---

## 1. 洋葱模型

Koa 中间件采用"洋葱模型"，这是它与 Express 线性模型最大的区别。

### 模型图解

```
┌─────────────────────────────────────┐
│           Middleware 1              │
│   ┌─────────────────────────────┐   │
│   │       Middleware 2          │   │
│   │   ┌─────────────────────┐   │   │
│   │   │   Middleware 3      │   │   │
│   │   │                     │   │   │
│   │   │   → 请求 →          │   │   │
│   │   │   ← 响应 ←          │   │   │
│   │   └─────────────────────┘   │   │
│   └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### 与 Express 线性模型对比

```javascript
// Express - 线性模型（无法在响应后执行逻辑）
app.use((req, res, next) => {
  console.log('1. 请求进入');
  next();
  // 这里无法执行响应后的逻辑
});

// Koa - 洋葱模型（可以在响应后执行逻辑）
app.use(async (ctx, next) => {
  console.log('1. 请求进入');
  await next();
  console.log('4. 响应返回');  // 可以执行！
});
```

---

## 2. 中间件执行顺序

```javascript
const Koa = require('koa');
const app = new Koa();

// 中间件 1 - 计时器
app.use(async (ctx, next) => {
  console.log('1. 中间件1 - 请求开始');
  const start = Date.now();

  await next();  // 等待下游中间件执行完成

  const ms = Date.now() - start;
  console.log(`6. 中间件1 - 请求结束，耗时 ${ms}ms`);
  ctx.set('X-Response-Time', `${ms}ms`);
});

// 中间件 2 - 日志
app.use(async (ctx, next) => {
  console.log('2. 中间件2 - 记录请求');
  console.log(`   ${ctx.method} ${ctx.url}`);

  await next();

  console.log('5. 中间件2 - 记录响应');
});

// 中间件 3 - 业务处理
app.use(async ctx => {
  console.log('3. 中间件3 - 处理业务');

  // 模拟耗时操作
  await new Promise(resolve => setTimeout(resolve, 100));

  console.log('4. 中间件3 - 业务处理完成');
  ctx.body = 'Hello World';
});

app.listen(3000);

// 执行顺序: 1 → 2 → 3 → 4 → 5 → 6
```

---

## 3. 常用中间件模式

### 3.1 计时中间件

```javascript
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});
```

### 3.2 日志中间件

```javascript
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ctx.status} - ${ms}ms`);
});
```

### 3.3 认证中间件

```javascript
app.use(async (ctx, next) => {
  const token = ctx.get('Authorization');

  if (!token) {
    ctx.status = 401;
    ctx.body = { error: '未提供认证令牌' };
    return;  // 不调用 next()，终止请求
  }

  try {
    // 验证 token（示例）
    const user = verifyToken(token);
    ctx.state.user = user;  // 存储用户信息
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = { error: '无效的认证令牌' };
  }
});
```

### 3.4 权限检查中间件

```javascript
const requireAdmin = async (ctx, next) => {
  if (!ctx.state.user || ctx.state.user.role !== 'admin') {
    ctx.status = 403;
    ctx.body = { error: '需要管理员权限' };
    return;
  }
  await next();
};

// 使用方式
router.get('/admin/users', requireAdmin, async ctx => {
  ctx.body = { users: [] };
});
```

---

## 4. 常用第三方中间件

### 4.1 koa-logger（日志）

```bash
npm install koa-logger
```

```javascript
const logger = require('koa-logger');
app.use(logger());
```

### 4.2 koa-bodyparser（请求体解析）

```bash
npm install koa-bodyparser
```

```javascript
const bodyParser = require('koa-bodyparser');
app.use(bodyParser({
  enableTypes: ['json', 'form'],  // 支持的类型
  jsonLimit: '1mb',               // JSON 大小限制
  formLimit: '1mb'                // 表单大小限制
}));
```

### 4.3 koa-body（支持文件上传）

```bash
npm install koa-body
```

```javascript
const { koaBody } = require('koa-body');

app.use(koaBody({
  multipart: true,        // 支持文件上传
  formidable: {
    uploadDir: './uploads',   // 上传目录
    keepExtensions: true,     // 保留文件扩展名
    maxFileSize: 10 * 1024 * 1024  // 最大 10MB
  }
}));

// 处理文件上传
router.post('/upload', async ctx => {
  const file = ctx.request.files.avatar;
  ctx.body = {
    filename: file.originalFilename,
    size: file.size,
    path: file.filepath
  };
});
```

### 4.4 @koa/cors（跨域）

```bash
npm install @koa/cors
```

```javascript
const cors = require('@koa/cors');

app.use(cors({
  origin: '*',                    // 允许所有域名
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true               // 允许携带 Cookie
}));
```

### 4.5 koa-static（静态文件）

```bash
npm install koa-static
```

```javascript
const serve = require('koa-static');

// 静态文件目录
app.use(serve('./public'));

// 多个静态目录
app.use(serve('./public'));
app.use(serve('./uploads'));
```

---

## 5. 中间件组合

### 5.1 按功能分组

```javascript
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const serve = require('koa-static');

const app = new Koa();

// ===== 基础中间件 =====
app.use(logger());
app.use(cors());
app.use(bodyParser());
app.use(serve('./public'));

// ===== 自定义中间件 =====
app.use(async (ctx, next) => {
  // 计时
  const start = Date.now();
  await next();
  ctx.set('X-Response-Time', `${Date.now() - start}ms`);
});

// ===== 路由中间件 =====
// router 相关代码...

app.listen(3000);
```

### 5.2 条件中间件

```javascript
// 仅对特定路径应用中间件
app.use(async (ctx, next) => {
  if (ctx.path.startsWith('/api')) {
    // API 请求处理
    await next();
  } else {
    // 静态文件或其他处理
    await next();
  }
});

// 仅对已认证用户应用中间件
app.use(async (ctx, next) => {
  if (ctx.state.user) {
    // 已登录用户的额外处理
  }
  await next();
});
```

---

## 6. 实践：构建中间件栈

```javascript
const Koa = require('koa');
const app = new Koa();

// 1. 错误处理（最外层）
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      success: false,
      message: err.message
    };
    // 触发错误事件
    ctx.app.emit('error', err, ctx);
  }
});

// 2. 计时（第二层）
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  ctx.set('X-Response-Time', `${ms}ms`);
});

// 3. 业务处理（最内层）
app.use(async ctx => {
  // 模拟错误
  if (ctx.query.error === 'true') {
    throw new Error('模拟错误');
  }

  ctx.body = {
    success: true,
    message: 'Hello Koa'
  };
});

// 错误事件监听
app.on('error', (err, ctx) => {
  console.error('服务器错误:', err);
});

app.listen(3000);
```

---

## 我的总结

<!-- 在这里记录你的学习心得和疑问 -->

_待填写..._

---

## 下一章

[第四章：路由](koa_chapter_4.md) - 使用 @koa/router 构建 RESTful API。
