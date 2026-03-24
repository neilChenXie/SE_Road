# 第四章：路由

元信息：
* 知识点：@koa/router、RESTful API、路由模块化
* 记录时间：2026-03-24
* 对应文件：无

---

## 1. 安装与基本使用

### 安装

```bash
npm install @koa/router
```

### 基本路由

```javascript
const Koa = require('koa');
const Router = require('@koa/router');

const app = new Koa();
const router = new Router();

// GET 请求
router.get('/', async ctx => {
  ctx.body = { message: '首页' };
});

// POST 请求
router.post('/users', async ctx => {
  const { name } = ctx.request.body;
  ctx.body = { message: `创建用户: ${name}` };
});

// 注册路由
app
  .use(router.routes())
  .use(router.allowedMethods());  // 自动处理 OPTIONS 请求

app.listen(3000);
```

---

## 2. RESTful API 设计

### HTTP 方法对应操作

| HTTP 方法 | 路径 | 操作 | 说明 |
|-----------|------|------|------|
| GET | /users | 列表 | 获取用户列表 |
| GET | /users/:id | 详情 | 获取单个用户 |
| POST | /users | 创建 | 创建新用户 |
| PUT | /users/:id | 更新 | 更新用户（完整） |
| PATCH | /users/:id | 更新 | 更新用户（部分） |
| DELETE | /users/:id | 删除 | 删除用户 |

### RESTful API 示例

```javascript
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

// 模拟数据库
let users = [
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' }
];

// 获取用户列表
router.get('/users', async ctx => {
  ctx.body = {
    success: true,
    data: users,
    total: users.length
  };
});

// 获取单个用户
router.get('/users/:id', async ctx => {
  const id = parseInt(ctx.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    ctx.status = 404;
    ctx.body = { success: false, message: '用户不存在' };
    return;
  }

  ctx.body = { success: true, data: user };
});

// 创建用户
router.post('/users', async ctx => {
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
});

// 更新用户（PUT - 完整更新）
router.put('/users/:id', async ctx => {
  const id = parseInt(ctx.params.id);
  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    ctx.status = 404;
    ctx.body = { success: false, message: '用户不存在' };
    return;
  }

  const { name, email } = ctx.request.body;
  users[index] = { id, name, email };
  ctx.body = { success: true, data: users[index] };
});

// 更新用户（PATCH - 部分更新）
router.patch('/users/:id', async ctx => {
  const id = parseInt(ctx.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    ctx.status = 404;
    ctx.body = { success: false, message: '用户不存在' };
    return;
  }

  const { name, email } = ctx.request.body;
  if (name) user.name = name;
  if (email) user.email = email;

  ctx.body = { success: true, data: user };
});

// 删除用户
router.delete('/users/:id', async ctx => {
  const id = parseInt(ctx.params.id);
  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    ctx.status = 404;
    ctx.body = { success: false, message: '用户不存在' };
    return;
  }

  users.splice(index, 1);
  ctx.status = 204;  // 无内容返回
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
```

---

## 3. 路由参数

### 路径参数

```javascript
// 单个参数
router.get('/users/:id', async ctx => {
  console.log(ctx.params.id);  // 路径参数
});

// 多个参数
router.get('/users/:userId/posts/:postId', async ctx => {
  console.log(ctx.params.userId);
  console.log(ctx.params.postId);
});

// 可选参数（使用正则）
router.get('/users/:id?', async ctx => {
  if (ctx.params.id) {
    ctx.body = `用户 ${ctx.params.id}`;
  } else {
    ctx.body = '用户列表';
  }
});
```

### 查询参数

```javascript
// URL: /search?keyword=koa&page=1&size=10
router.get('/search', async ctx => {
  const { keyword, page = 1, size = 10 } = ctx.query;

  console.log(ctx.query);          // { keyword: 'koa', page: '1', size: '10' }
  console.log(ctx.querystring);    // 'keyword=koa&page=1&size=10'

  ctx.body = {
    keyword,
    page: parseInt(page),
    size: parseInt(size)
  };
});
```

### 路由参数验证

```javascript
// 使用正则验证参数
router.get('/users/:id(\\d+)', async ctx => {
  // id 必须是数字
  const id = parseInt(ctx.params.id);
  ctx.body = { userId: id };
});

// 自定义验证中间件
const validateId = async (ctx, next) => {
  const id = parseInt(ctx.params.id);
  if (isNaN(id) || id <= 0) {
    ctx.status = 400;
    ctx.body = { error: '无效的 ID' };
    return;
  }
  ctx.state.id = id;
  await next();
};

router.get('/users/:id', validateId, async ctx => {
  ctx.body = { userId: ctx.state.id };
});
```

---

## 4. 路由前缀与分组

### 路由前缀

```javascript
const Router = require('@koa/router');

// API v1
const apiV1 = new Router({ prefix: '/api/v1' });

apiV1.get('/users', async ctx => {
  ctx.body = '用户列表';  // 实际路径: /api/v1/users
});

apiV1.get('/posts', async ctx => {
  ctx.body = '文章列表';  // 实际路径: /api/v1/posts
});

app.use(apiV1.routes());

// API v2
const apiV2 = new Router({ prefix: '/api/v2' });
// ...
```

### 路由分组

```javascript
const Router = require('@koa/router');

// 用户路由
const usersRouter = new Router();
usersRouter.get('/', async ctx => {
  ctx.body = '用户列表';
});
usersRouter.get('/:id', async ctx => {
  ctx.body = `用户 ${ctx.params.id}`;
});
usersRouter.post('/', async ctx => {
  ctx.body = '创建用户';
});

// 文章路由
const postsRouter = new Router();
postsRouter.get('/', async ctx => {
  ctx.body = '文章列表';
});
postsRouter.get('/:id', async ctx => {
  ctx.body = `文章 ${ctx.params.id}`;
});

// 主路由
const apiRouter = new Router({ prefix: '/api' });
apiRouter.use('/users', usersRouter.routes(), usersRouter.allowedMethods());
apiRouter.use('/posts', postsRouter.routes(), postsRouter.allowedMethods());

app.use(apiRouter.routes());
```

---

## 5. 路由模块化

### 目录结构

```
project/
├── app.js
├── routes/
│   ├── index.js      # 路由汇总
│   ├── users.js      # 用户路由
│   └── posts.js      # 文章路由
└── controllers/
    ├── users.js      # 用户控制器
    └── posts.js      # 文章控制器
```

### routes/users.js

```javascript
const Router = require('@koa/router');
const router = new Router({ prefix: '/users' });

// 获取列表
router.get('/', async ctx => {
  ctx.body = '用户列表';
});

// 获取详情
router.get('/:id', async ctx => {
  ctx.body = `用户 ${ctx.params.id}`;
});

// 创建
router.post('/', async ctx => {
  ctx.body = '创建用户';
});

// 更新
router.put('/:id', async ctx => {
  ctx.body = `更新用户 ${ctx.params.id}`;
});

// 删除
router.delete('/:id', async ctx => {
  ctx.body = `删除用户 ${ctx.params.id}`;
});

module.exports = router;
```

### routes/index.js

```javascript
const Router = require('@koa/router');
const usersRouter = require('./users');
const postsRouter = require('./posts');

const router = new Router();

router.use(usersRouter.routes());
router.use(postsRouter.routes());

module.exports = router;
```

### app.js

```javascript
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const routes = require('./routes');

const app = new Koa();

app.use(bodyParser());
app.use(routes.routes()).use(routes.allowedMethods());

app.listen(3000);
```

---

## 6. 实践：完整的模块化 API

### controllers/users.js

```javascript
// 模拟数据库
const users = [
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' }
];

class UsersController {
  // 列表
  static async list(ctx) {
    ctx.body = {
      success: true,
      data: users
    };
  }

  // 详情
  static async show(ctx) {
    const id = parseInt(ctx.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
      ctx.status = 404;
      ctx.body = { success: false, message: '用户不存在' };
      return;
    }

    ctx.body = { success: true, data: user };
  }

  // 创建
  static async create(ctx) {
    const { name, email } = ctx.request.body;

    if (!name || !email) {
      ctx.status = 400;
      ctx.body = { success: false, message: '参数不完整' };
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
  }
}

module.exports = UsersController;
```

### routes/users.js

```javascript
const Router = require('@koa/router');
const UsersController = require('../controllers/users');

const router = new Router({ prefix: '/users' });

router.get('/', UsersController.list);
router.get('/:id', UsersController.show);
router.post('/', UsersController.create);

module.exports = router;
```

---

## 我的总结

<!-- 在这里记录你的学习心得和疑问 -->

_待填写..._

---

## 下一章

[第五章：请求与响应](koa_chapter_5.md) - 文件上传、Cookie、Session 等。
