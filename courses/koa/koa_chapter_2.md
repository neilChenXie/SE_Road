# 第二章：核心概念

元信息：
* 知识点：Context 对象、请求响应处理
* 记录时间：2026-03-24
* 对应文件：无

---

## 1. Context 对象 (ctx)

Koa 将 Node.js 的 `request` 和 `response` 对象封装到一个统一的 `ctx` (Context) 对象中，这是 Koa 最重要的设计之一。

### 与 Express 对比

```javascript
// Express - 分离的 req 和 res
app.get('/user', (req, res) => {
  const id = req.params.id;
  const name = req.query.name;
  res.json({ id, name });
});

// Koa - 统一的 ctx
app.use(async ctx => {
  const id = ctx.params.id;
  const name = ctx.query.name;
  ctx.body = { id, name };
});
```

### Context 结构图

```
ctx (Context)
├── request (Koa 封装的请求对象)
│   ├── header
│   ├── method
│   ├── url
│   ├── query
│   └── body (需中间件)
├── response (Koa 封装的响应对象)
│   ├── status
│   ├── body
│   └── header
├── state (自定义状态，用于中间件传递数据)
└── 直接代理 request/response 的常用属性
    ├── url
    ├── method
    ├── query
    ├── status
    └── body
```

---

## 2. 请求对象

### 常用请求属性

```javascript
app.use(async ctx => {
  // 基础信息
  console.log(ctx.url);           // 请求路径，如 '/users/123?page=1'
  console.log(ctx.path);          // 路径，如 '/users/123'
  console.log(ctx.method);        // 请求方法，如 'GET', 'POST'
  console.log(ctx.host);          // 主机名，如 'localhost:3000'
  console.log(ctx.protocol);      // 协议，如 'http' 或 'https'

  // 请求头
  console.log(ctx.headers);       // 所有请求头
  console.log(ctx.get('User-Agent')); // 获取特定请求头
  console.log(ctx.get('Content-Type'));

  // 查询参数
  // URL: /search?keyword=koa&page=1
  console.log(ctx.query);         // { keyword: 'koa', page: '1' }
  console.log(ctx.query.keyword); // 'koa'
  console.log(ctx.querystring);   // 'keyword=koa&page=1'

  // 路径参数（需要路由中间件）
  // URL: /users/123
  // router.get('/users/:id', ...)
  console.log(ctx.params);        // { id: '123' }
  console.log(ctx.params.id);     // '123'
});
```

### 请求体解析

Koa 默认不解析请求体，需要安装中间件：

```bash
npm install koa-bodyparser
```

```javascript
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const app = new Koa();

// 必须在路由之前注册
app.use(bodyParser());

app.use(async ctx => {
  // JSON 请求体
  // Content-Type: application/json
  // Body: {"name": "张三", "age": 25}
  console.log(ctx.request.body);  // { name: '张三', age: 25 }

  // 表单数据
  // Content-Type: application/x-www-form-urlencoded
  // Body: name=张三&age=25
  console.log(ctx.request.body);  // { name: '张三', age: '25' }

  ctx.body = { received: ctx.request.body };
});
```

---

## 3. 响应对象

### 设置响应

```javascript
app.use(async ctx => {
  // 设置状态码
  ctx.status = 200;  // 默认值
  ctx.status = 201;  // 创建成功
  ctx.status = 404;  // 未找到
  ctx.status = 500;  // 服务器错误

  // 设置响应体（自动设置 Content-Type）
  ctx.body = 'Hello World';                    // text/plain
  ctx.body = { message: 'success' };           // application/json
  ctx.body = '<h1>Hello</h1>';                 // text/html
  ctx.body = Buffer.from('binary data');       // application/octet-stream

  // 手动设置 Content-Type
  ctx.type = 'json';  // 等同于 'application/json'
  ctx.type = 'html';  // 等同于 'text/html'
  ctx.type = 'png';   // 等同于 'image/png'

  // 设置响应头
  ctx.set('X-Custom-Header', 'value');
  ctx.set('Cache-Control', 'no-cache');
  ctx.set('Access-Control-Allow-Origin', '*');

  // 批量设置响应头
  ctx.set({
    'X-Custom-Header': 'value',
    'Cache-Control': 'no-cache'
  });

  // 重定向
  ctx.redirect('/login');
  ctx.redirect('https://google.com');
});
```

### 响应状态码参考

| 状态码 | 含义 | 使用场景 |
|--------|------|----------|
| 200 | OK | 请求成功 |
| 201 | Created | 创建资源成功 |
| 204 | No Content | 删除成功（无返回内容） |
| 400 | Bad Request | 参数错误 |
| 401 | Unauthorized | 未登录 |
| 403 | Forbidden | 无权限 |
| 404 | Not Found | 资源不存在 |
| 500 | Internal Server Error | 服务器错误 |

---

## 4. state 属性

`ctx.state` 是推荐的命名空间，用于在中间件之间传递数据：

```javascript
// 认证中间件
app.use(async (ctx, next) => {
  // 模拟用户认证
  ctx.state.user = { id: 1, name: '张三' };
  await next();
});

// 业务中间件
app.use(async ctx => {
  // 获取认证信息
  const user = ctx.state.user;
  ctx.body = `Hello, ${user.name}`;
});
```

---

## 5. 实践：构建简单的 REST API

```javascript
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const app = new Koa();

// 模拟数据库
let users = [
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' }
];

app.use(bodyParser());

// 路由处理
app.use(async ctx => {
  const { method, path } = ctx;

  // GET /users - 获取用户列表
  if (method === 'GET' && path === '/users') {
    ctx.body = { success: true, data: users };
    return;
  }

  // GET /users/:id - 获取单个用户
  const match = path.match(/^\/users\/(\d+)$/);
  if (method === 'GET' && match) {
    const id = parseInt(match[1]);
    const user = users.find(u => u.id === id);
    if (user) {
      ctx.body = { success: true, data: user };
    } else {
      ctx.status = 404;
      ctx.body = { success: false, message: '用户不存在' };
    }
    return;
  }

  // POST /users - 创建用户
  if (method === 'POST' && path === '/users') {
    const { name, email } = ctx.request.body;
    if (!name || !email) {
      ctx.status = 400;
      ctx.body = { success: false, message: 'name 和 email 不能为空' };
      return;
    }
    const newUser = {
      id: users.length + 1,
      name,
      email
    };
    users.push(newUser);
    ctx.status = 201;
    ctx.body = { success: true, data: newUser };
    return;
  }

  // 404
  ctx.status = 404;
  ctx.body = { success: false, message: '路由不存在' };
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
```

测试命令：

```bash
# 获取用户列表
curl http://localhost:3000/users

# 获取单个用户
curl http://localhost:3000/users/1

# 创建用户
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"王五","email":"wangwu@example.com"}'
```

---

## 6. 与 CodeIgniter 对比

| 操作 | CodeIgniter | Koa |
|------|-------------|-----|
| 获取 GET 参数 | `$this->input->get('key')` | `ctx.query.key` |
| 获取 POST 参数 | `$this->input->post('key')` | `ctx.request.body.key` |
| 获取路径参数 | `$this->uri->segment(3)` | `ctx.params.id` |
| 返回 JSON | `$this->output->json($data)` | `ctx.body = data` |
| 设置状态码 | `$this->output->set_status_header(404)` | `ctx.status = 404` |
| 设置响应头 | `$this->output->set_header('X-Custom: value')` | `ctx.set('X-Custom', 'value')` |

---

## 我的总结

<!-- 在这里记录你的学习心得和疑问 -->

_待填写..._

---

## 下一章

[第三章：中间件机制](koa_chapter_3.md) - 深入理解 Koa 的核心特性——洋葱模型。
