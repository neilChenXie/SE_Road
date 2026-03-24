# 第五章：请求与响应

元信息：
* 知识点：请求体解析、文件上传、Cookie、Session
* 记录时间：2026-03-24
* 对应文件：无

---

## 1. 请求体解析

### koa-bodyparser（基础）

```bash
npm install koa-bodyparser
```

```javascript
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const app = new Koa();

app.use(bodyParser({
  enableTypes: ['json', 'form'],  // 支持的类型
  jsonLimit: '1mb',
  formLimit: '1mb',
  strict: true  // 仅解析 POST/PUT/PATCH 请求体
}));

app.use(async ctx => {
  // JSON 或表单数据
  console.log(ctx.request.body);
  ctx.body = { received: ctx.request.body };
});
```

### koa-body（支持文件上传）

```bash
npm install koa-body
```

```javascript
const { koaBody } = require('koa-body');

app.use(koaBody({
  multipart: true,          // 启用文件上传
  urlencoded: true,         // 启用表单解析
  json: true,               // 启用 JSON 解析
  formidable: {
    uploadDir: './uploads',     // 上传目录
    keepExtensions: true,       // 保留扩展名
    maxFileSize: 10 * 1024 * 1024,  // 最大 10MB
    onFileBegin: (name, file) => {
      // 文件上传前的处理
      console.log(`开始上传: ${name}`);
    }
  }
}));
```

---

## 2. 文件上传

### 单文件上传

```javascript
const Koa = require('koa');
const Router = require('@koa/router');
const { koaBody } = require('koa-body');
const path = require('path');
const fs = require('fs');

const app = new Koa();
const router = new Router();

// 确保上传目录存在
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir,
    keepExtensions: true
  }
}));

// 单文件上传
router.post('/upload', async ctx => {
  const file = ctx.request.files.file;

  if (!file) {
    ctx.status = 400;
    ctx.body = { error: '请选择文件' };
    return;
  }

  ctx.body = {
    success: true,
    file: {
      originalName: file.originalFilename,
      savedName: path.basename(file.filepath),
      size: file.size,
      mimeType: file.mimetype
    }
  };
});

app.use(router.routes());
app.listen(3000);
```

### 多文件上传

```javascript
router.post('/upload-multiple', async ctx => {
  const files = ctx.request.files.files;

  if (!files) {
    ctx.status = 400;
    ctx.body = { error: '请选择文件' };
    return;
  }

  // 单个文件时 files 不是数组
  const fileArray = Array.isArray(files) ? files : [files];

  const results = fileArray.map(file => ({
    originalName: file.originalFilename,
    savedName: path.basename(file.filepath),
    size: file.size
  }));

  ctx.body = {
    success: true,
    count: results.length,
    files: results
  };
});
```

### 前端上传示例

```html
<!-- 单文件 -->
<form action="/upload" method="post" enctype="multipart/form-data">
  <input type="file" name="file">
  <button type="submit">上传</button>
</form>

<!-- 多文件 -->
<form action="/upload-multiple" method="post" enctype="multipart/form-data">
  <input type="file" name="files" multiple>
  <button type="submit">上传</button>
</form>
```

```javascript
// Fetch API 上传
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/upload', {
  method: 'POST',
  body: formData
});

const result = await response.json();
```

---

## 3. Cookie

### 设置 Cookie

```javascript
// 基本设置
ctx.cookies.set('name', 'value');

// 带选项设置
ctx.cookies.set('token', 'abc123', {
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7天（毫秒）
  expires: new Date('2026-12-31'),  // 过期时间
  path: '/',                         // 路径
  domain: 'localhost',               // 域名
  secure: false,                     // 仅 HTTPS
  httpOnly: true,                    // 仅服务器访问
  sameSite: 'strict',                // 同站策略：strict | lax | none
  signed: true                       // 签名（需要配置 keys）
});
```

### 读取 Cookie

```javascript
// 读取
const name = ctx.cookies.get('name');

// 读取已签名的 Cookie
const token = ctx.cookies.get('token', { signed: true });
```

### Cookie 签名

```javascript
const Koa = require('koa');
const app = new Koa();

// 配置签名密钥
app.keys = ['secret-key-1', 'secret-key-2'];

app.use(async ctx => {
  // 设置签名 Cookie
  ctx.cookies.set('token', 'abc123', { signed: true });

  // 读取签名 Cookie（自动验证签名）
  const token = ctx.cookies.get('token', { signed: true });

  ctx.body = { token };
});
```

---

## 4. Session

Koa 默认不内置 Session，需要使用中间件。

### koa-session

```bash
npm install koa-session
```

```javascript
const Koa = require('koa');
const session = require('koa-session');

const app = new Koa();

// 配置签名密钥（必须）
app.keys = ['secret-key-1', 'secret-key-2'];

// Session 配置
const CONFIG = {
  key: 'koa:sess',           // Cookie 名称
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 过期时间
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,            // 每次请求刷新过期时间
  renew: false               // 快过期时自动续期
};

app.use(session(CONFIG, app));

// 使用 Session
app.use(async ctx => {
  // 读取
  let count = ctx.session.count || 0;

  // 写入
  ctx.session.count = ++count;

  // 删除
  // ctx.session = null;

  ctx.body = `访问次数: ${count}`;
});

app.listen(3000);
```

### 登录示例

```javascript
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');

const app = new Koa();
const router = new Router();

app.keys = ['secret-key'];
app.use(session({}, app));
app.use(bodyParser());

// 模拟用户数据
const users = {
  admin: { password: '123456', name: '管理员' },
  user: { password: '123456', name: '普通用户' }
};

// 登录
router.post('/login', async ctx => {
  const { username, password } = ctx.request.body;

  const user = users[username];
  if (!user || user.password !== password) {
    ctx.status = 401;
    ctx.body = { error: '用户名或密码错误' };
    return;
  }

  // 存储 Session
  ctx.session.user = {
    username,
    name: user.name
  };

  ctx.body = { message: '登录成功', user: ctx.session.user };
});

// 获取当前用户
router.get('/me', async ctx => {
  if (!ctx.session.user) {
    ctx.status = 401;
    ctx.body = { error: '未登录' };
    return;
  }

  ctx.body = { user: ctx.session.user };
});

// 登出
router.post('/logout', async ctx => {
  ctx.session = null;
  ctx.body = { message: '已登出' }
});

// 受保护的路由
router.get('/protected', async ctx => {
  if (!ctx.session.user) {
    ctx.status = 401;
    ctx.body = { error: '请先登录' };
    return;
  }

  ctx.body = { message: '受保护的内容', user: ctx.session.user };
});

app.use(router.routes());
app.listen(3000);
```

---

## 5. 响应类型

### JSON 响应

```javascript
ctx.body = {
  success: true,
  data: { id: 1, name: '张三' }
};

// 自动设置 Content-Type: application/json
```

### HTML 响应

```javascript
ctx.type = 'html';
ctx.body = `
  <!DOCTYPE html>
  <html>
    <head><title>Test</title></head>
    <body><h1>Hello Koa</h1></body>
  </html>
`;
```

### 文件下载

```javascript
const fs = require('fs');
const path = require('path');

router.get('/download/:filename', async ctx => {
  const filename = ctx.params.filename;
  const filepath = path.join(__dirname, 'files', filename);

  // 检查文件是否存在
  if (!fs.existsSync(filepath)) {
    ctx.status = 404;
    ctx.body = { error: '文件不存在' };
    return;
  }

  // 设置响应头
  ctx.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
  ctx.type = path.extname(filename);

  // 流式传输文件
  ctx.body = fs.createReadStream(filepath);
});
```

### 流式响应

```javascript
const fs = require('fs');

app.use(async ctx => {
  const stream = fs.createReadStream('./large-file.txt');
  ctx.type = 'text/plain';
  ctx.body = stream;
});
```

---

## 6. 实践：完整的文件上传 API

```javascript
const Koa = require('koa');
const Router = require('@koa/router');
const { koaBody } = require('koa-body');
const cors = require('@koa/cors');
const fs = require('fs');
const path = require('path');

const app = new Koa();
const router = new Router();

// 配置
const UPLOAD_DIR = './uploads';
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024;  // 5MB

// 确保上传目录存在
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// 中间件
app.use(cors());
app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: UPLOAD_DIR,
    keepExtensions: true
  }
}));

// 文件类型验证
const validateFile = (file) => {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return { valid: false, error: '不支持的文件类型' };
  }
  if (file.size > MAX_SIZE) {
    return { valid: false, error: '文件大小超过限制（5MB）' };
  }
  return { valid: true };
};

// 上传接口
router.post('/api/upload', async ctx => {
  const file = ctx.request.files.file;

  if (!file) {
    ctx.status = 400;
    ctx.body = { success: false, message: '请选择文件' };
    return;
  }

  // 验证
  const validation = validateFile(file);
  if (!validation.valid) {
    // 删除临时文件
    fs.unlinkSync(file.filepath);
    ctx.status = 400;
    ctx.body = { success: false, message: validation.error };
    return;
  }

  // 重命名文件
  const ext = path.extname(file.originalFilename);
  const newFilename = `${Date.now()}${ext}`;
  const newPath = path.join(UPLOAD_DIR, newFilename);
  fs.renameSync(file.filepath, newPath);

  ctx.body = {
    success: true,
    data: {
      url: `/uploads/${newFilename}`,
      originalName: file.originalFilename,
      size: file.size,
      type: file.mimetype
    }
  };
});

// 获取文件列表
router.get('/api/files', async ctx => {
  const files = fs.readdirSync(UPLOAD_DIR);
  ctx.body = {
    success: true,
    data: files.map(filename => ({
      name: filename,
      url: `/uploads/${filename}`
    }))
  };
});

// 删除文件
router.delete('/api/files/:filename', async ctx => {
  const filepath = path.join(UPLOAD_DIR, ctx.params.filename);

  if (!fs.existsSync(filepath)) {
    ctx.status = 404;
    ctx.body = { success: false, message: '文件不存在' };
    return;
  }

  fs.unlinkSync(filepath);
  ctx.body = { success: true, message: '删除成功' };
});

app.use(router.routes());
app.listen(3000);
```

---

## 我的总结

<!-- 在这里记录你的学习心得和疑问 -->

_待填写..._

---

## 下一章

[第六章：错误处理](koa_chapter_6.md) - 构建健壮的错误处理机制。
