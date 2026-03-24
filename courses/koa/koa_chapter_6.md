# 第六章：错误处理

元信息：
* 知识点：错误捕获、全局错误处理、自定义错误类
* 记录时间：2026-03-24
* 对应文件：无

---

## 1. try-catch 错误捕获

### 基本方式

```javascript
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  try {
    // 可能出错的代码
    const data = await someAsyncOperation();
    ctx.body = { success: true, data };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message
    };
  }
});

app.listen(3000);
```

### 在中间件中捕获

```javascript
// 错误处理中间件（放在最前面）
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = {
      success: false,
      message: error.message
    };
  }
});

// 业务路由
router.get('/users/:id', async ctx => {
  const user = await findUser(ctx.params.id);
  if (!user) {
    const error = new Error('用户不存在');
    error.status = 404;
    throw error;
  }
  ctx.body = user;
});
```

---

## 2. 全局错误处理

### 错误事件监听

```javascript
const Koa = require('koa');
const app = new Koa();

// 全局错误监听
app.on('error', (err, ctx) => {
  console.error('服务器错误:');
  console.error('  URL:', ctx.url);
  console.error('  Method:', ctx.method);
  console.error('  Error:', err.message);
  console.error('  Stack:', err.stack);
});

// 错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { error: err.message };

    // 触发错误事件
    ctx.app.emit('error', err, ctx);
  }
});

// 业务代码
app.use(async ctx => {
  throw new Error('出错了！');
});

app.listen(3000);
```

### 区分生产/开发环境

```javascript
const isDev = process.env.NODE_ENV !== 'production';

// 错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;

    // 开发环境返回详细错误信息
    if (isDev) {
      ctx.body = {
        error: err.message,
        stack: err.stack
      };
    } else {
      // 生产环境隐藏敏感信息
      ctx.body = {
        error: err.status === 500 ? '服务器错误' : err.message
      };
    }

    ctx.app.emit('error', err, ctx);
  }
});
```

---

## 3. 自定义错误类

### 基础自定义错误

```javascript
// utils/errors.js

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
  }
}

class NotFoundError extends HttpError {
  constructor(message = '资源不存在') {
    super(404, message);
  }
}

class ValidationError extends HttpError {
  constructor(message = '参数验证失败') {
    super(400, message);
  }
}

class UnauthorizedError extends HttpError {
  constructor(message = '未授权') {
    super(401, message);
  }
}

class ForbiddenError extends HttpError {
  constructor(message = '禁止访问') {
    super(403, message);
  }
}

module.exports = {
  HttpError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError
};
```

### 使用自定义错误

```javascript
const { NotFoundError, ValidationError } = require('./utils/errors');

// 用户控制器
class UsersController {
  static async show(ctx) {
    const id = parseInt(ctx.params.id);

    if (isNaN(id)) {
      throw new ValidationError('无效的用户ID');
    }

    const user = await findUser(id);

    if (!user) {
      throw new NotFoundError('用户不存在');
    }

    ctx.body = { success: true, data: user };
  }
}

// 错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      success: false,
      message: err.message,
      code: err.code || err.status
    };
  }
});
```

---

## 4. 参数验证

### 手动验证

```javascript
const validate = (data, rules) => {
  const errors = [];

  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];

    // 必填验证
    if (rule.required && !value) {
      errors.push(`${field} 不能为空`);
      continue;
    }

    // 类型验证
    if (rule.type && typeof value !== rule.type) {
      errors.push(`${field} 类型错误`);
    }

    // 最小长度
    if (rule.minLength && value.length < rule.minLength) {
      errors.push(`${field} 长度不能小于 ${rule.minLength}`);
    }

    // 最大长度
    if (rule.maxLength && value.length > rule.maxLength) {
      errors.push(`${field} 长度不能超过 ${rule.maxLength}`);
    }
  }

  return errors;
};

// 使用
router.post('/users', async ctx => {
  const errors = validate(ctx.request.body, {
    name: { required: true, minLength: 2, maxLength: 50 },
    email: { required: true },
    age: { type: 'number' }
  });

  if (errors.length > 0) {
    ctx.status = 400;
    ctx.body = { success: false, errors };
    return;
  }

  // 创建用户...
});
```

### 使用 koa-validate

```bash
npm install koa-validate
```

```javascript
const validate = require('koa-validate');

app.use(validate());

router.post('/users', async ctx => {
  ctx.checkBody('name').notEmpty().len(2, 50);
  ctx.checkBody('email').isEmail();
  ctx.checkBody('age').optional().isInt({ min: 0, max: 150 });

  if (ctx.errors) {
    ctx.status = 400;
    ctx.body = { errors: ctx.errors };
    return;
  }

  // 创建用户...
});
```

---

## 5. 404 处理

### 默认 404

```javascript
// 404 处理（放在所有中间件之后）
app.use(async ctx => {
  ctx.status = 404;
  ctx.body = {
    success: false,
    message: '路由不存在'
  };
});
```

### 结合路由

```javascript
const Koa = require('koa');
const Router = require('@koa/router');

const app = new Koa();
const router = new Router();

// 业务路由
router.get('/users', async ctx => {
  ctx.body = '用户列表';
});

// 注册路由
app.use(router.routes());
app.use(router.allowedMethods());

// 404 处理
app.use(async ctx => {
  ctx.status = 404;
  ctx.body = {
    success: false,
    message: `路由 ${ctx.method} ${ctx.url} 不存在`
  };
});

app.listen(3000);
```

---

## 6. 完整的错误处理方案

### middlewares/errorHandler.js

```javascript
const isDev = process.env.NODE_ENV !== 'production';

class HttpError extends Error {
  constructor(status, message, code = null) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = this.constructor.name;
  }
}

const errorHandler = async (ctx, next) => {
  try {
    await next();

    // 处理 404
    if (ctx.status === 404 && !ctx.body) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: '路由不存在',
        code: 404
      };
    }
  } catch (err) {
    ctx.status = err.status || 500;

    ctx.body = {
      success: false,
      message: err.message,
      code: err.code || err.status,
      ...(isDev && { stack: err.stack })
    };

    // 记录错误日志
    ctx.app.emit('error', err, ctx);
  }
};

module.exports = {
  errorHandler,
  HttpError
};
```

### app.js

```javascript
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const { errorHandler, HttpError } = require('./middlewares/errorHandler');

const app = new Koa();
const router = new Router();

// 错误事件监听
app.on('error', (err, ctx) => {
  console.error(`[${new Date().toISOString()}] ${ctx.method} ${ctx.url}`);
  console.error(err.stack);
});

// 中间件注册顺序很重要！
app.use(errorHandler);  // 错误处理放最前面
app.use(bodyParser());

// 业务路由
router.get('/users/:id', async ctx => {
  const id = parseInt(ctx.params.id);

  if (isNaN(id)) {
    throw new HttpError(400, '无效的用户ID');
  }

  if (id > 100) {
    throw new HttpError(404, '用户不存在');
  }

  ctx.body = {
    success: true,
    data: { id, name: `用户${id}` }
  };
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

[第七章：实战项目](koa_chapter_7.md) - 完整的 Koa 项目实战。
