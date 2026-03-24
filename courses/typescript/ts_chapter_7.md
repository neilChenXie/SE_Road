# 第七章：实战项目

元信息：
* 知识点：TypeScript + Koa 项目、类型声明文件、项目结构
* 记录时间：2026-03-24
* 对应文件：projects/ts-koa-demo/（示例）

---

## 1. 项目概述

我们将使用 TypeScript + Koa 构建一个完整的 REST API 项目，包含：
- 完整的类型定义
- 分层架构
- 错误处理
- 数据验证

---

## 2. 项目初始化

### 创建项目

```bash
mkdir ts-koa-demo
cd ts-koa-demo
npm init -y
```

### 安装依赖

```bash
# 运行时依赖
npm install koa @koa/router koa-body @koa/cors better-sqlite3

# 开发依赖
npm install -D typescript ts-node nodemon @types/node @types/koa @types/koa__router @types/koa__cors @types/better-sqlite3
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### package.json scripts

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "nodemon --exec ts-node src/index.ts"
  }
}
```

---

## 3. 项目结构

```
ts-koa-demo/
├── src/
│   ├── index.ts              # 入口文件
│   ├── app.ts                # Koa 应用配置
│   ├── types/                # 类型定义
│   │   ├── index.ts
│   │   └── user.ts
│   ├── routes/               # 路由
│   │   ├── index.ts
│   │   └── users.ts
│   ├── controllers/          # 控制器
│   │   └── users.ts
│   ├── services/             # 服务层
│   │   └── users.ts
│   ├── middlewares/          # 中间件
│   │   └── errorHandler.ts
│   └── db/                   # 数据库
│       └── index.ts
├── dist/                     # 编译输出
├── package.json
└── tsconfig.json
```

---

## 4. 类型定义

### src/types/index.ts

```typescript
// API 响应类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 分页参数
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### src/types/user.ts

```typescript
// 用户实体
export interface User {
  id: number;
  name: string;
  email: string;
  age: number | null;
  createdAt: string;
  updatedAt: string;
}

// 创建用户 DTO
export interface CreateUserDto {
  name: string;
  email: string;
  age?: number;
}

// 更新用户 DTO
export interface UpdateUserDto {
  name?: string;
  email?: string;
  age?: number;
}

// 用户查询参数
export interface UserQuery {
  name?: string;
  email?: string;
}
```

---

## 5. 数据库层

### src/db/index.ts

```typescript
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../data.db');
const db = new Database(dbPath);

// 启用外键约束
db.pragma('journal_mode = WAL');

// 创建表
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    age INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
```

---

## 6. 中间件

### src/middlewares/errorHandler.ts

```typescript
import { Context, Next } from 'koa';

// 自定义错误类
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

// 错误处理中间件
export async function errorHandler(ctx: Context, next: Next): Promise<void> {
  try {
    await next();

    // 404 处理
    if (ctx.status === 404 && !ctx.body) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: '路由不存在'
      };
    }
  } catch (err) {
    if (err instanceof HttpError) {
      ctx.status = err.status;
      ctx.body = {
        success: false,
        message: err.message
      };
    } else if (err instanceof Error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: err.message
      };
      ctx.app.emit('error', err, ctx);
    }
  }
}
```

---

## 7. 服务层

### src/services/users.ts

```typescript
import db from '../db';
import { User, CreateUserDto, UpdateUserDto } from '../types/user';

class UserService {
  // 获取所有用户
  findAll(): User[] {
    const stmt = db.prepare('SELECT * FROM users ORDER BY id DESC');
    return stmt.all() as User[];
  }

  // 根据 ID 获取用户
  findById(id: number): User | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User | undefined;
  }

  // 创建用户
  create(dto: CreateUserDto): User {
    const stmt = db.prepare(`
      INSERT INTO users (name, email, age)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(dto.name, dto.email, dto.age ?? null);

    return this.findById(result.lastInsertRowid as number)!;
  }

  // 更新用户
  update(id: number, dto: UpdateUserDto): User | undefined {
    const user = this.findById(id);
    if (!user) return undefined;

    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (dto.name !== undefined) {
      updates.push('name = ?');
      values.push(dto.name);
    }
    if (dto.email !== undefined) {
      updates.push('email = ?');
      values.push(dto.email);
    }
    if (dto.age !== undefined) {
      updates.push('age = ?');
      values.push(dto.age);
    }

    if (updates.length === 0) return user;

    updates.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`
      UPDATE users SET ${updates.join(', ')} WHERE id = ?
    `);
    stmt.run(...values);

    return this.findById(id);
  }

  // 删除用户
  delete(id: number): boolean {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

export default new UserService();
```

---

## 8. 控制器

### src/controllers/users.ts

```typescript
import { Context } from 'koa';
import userService from '../services/users';
import { HttpError } from '../middlewares/errorHandler';
import { CreateUserDto, UpdateUserDto } from '../types/user';
import { ApiResponse } from '../types';

class UserController {
  // GET /users
  async list(ctx: Context): Promise<void> {
    const users = userService.findAll();

    ctx.body = {
      success: true,
      data: users
    } as ApiResponse;
  }

  // GET /users/:id
  async show(ctx: Context): Promise<void> {
    const id = parseInt(ctx.params.id);
    if (isNaN(id)) {
      throw new HttpError(400, '无效的用户ID');
    }

    const user = userService.findById(id);
    if (!user) {
      throw new HttpError(404, '用户不存在');
    }

    ctx.body = {
      success: true,
      data: user
    } as ApiResponse;
  }

  // POST /users
  async create(ctx: Context): Promise<void> {
    const dto = ctx.request.body as CreateUserDto;

    // 验证
    if (!dto.name || !dto.email) {
      throw new HttpError(400, '姓名和邮箱不能为空');
    }

    const user = userService.create(dto);

    ctx.status = 201;
    ctx.body = {
      success: true,
      data: user,
      message: '创建成功'
    } as ApiResponse;
  }

  // PUT /users/:id
  async update(ctx: Context): Promise<void> {
    const id = parseInt(ctx.params.id);
    if (isNaN(id)) {
      throw new HttpError(400, '无效的用户ID');
    }

    const dto = ctx.request.body as UpdateUserDto;
    const user = userService.update(id, dto);

    if (!user) {
      throw new HttpError(404, '用户不存在');
    }

    ctx.body = {
      success: true,
      data: user,
      message: '更新成功'
    } as ApiResponse;
  }

  // DELETE /users/:id
  async delete(ctx: Context): Promise<void> {
    const id = parseInt(ctx.params.id);
    if (isNaN(id)) {
      throw new HttpError(400, '无效的用户ID');
    }

    const success = userService.delete(id);
    if (!success) {
      throw new HttpError(404, '用户不存在');
    }

    ctx.status = 204;
  }
}

export default new UserController();
```

---

## 9. 路由

### src/routes/users.ts

```typescript
import Router from '@koa/router';
import userController from '../controllers/users';

const router = new Router({ prefix: '/api/users' });

router.get('/', userController.list);
router.get('/:id', userController.show);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

export default router;
```

### src/routes/index.ts

```typescript
import Router from '@koa/router';
import usersRouter from './users';

const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = { message: 'Hello TypeScript + Koa' };
});

router.use(usersRouter.routes());

export default router;
```

---

## 10. 应用入口

### src/app.ts

```typescript
import Koa from 'koa';
import cors from '@koa/cors';
import { koaBody } from 'koa-body';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';

const app = new Koa();

// 错误事件
app.on('error', (err, ctx) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.message);
});

// 中间件
app.use(errorHandler);
app.use(cors());
app.use(koaBody());
app.use(routes.routes());
app.use(routes.allowedMethods());

export default app;
```

### src/index.ts

```typescript
import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

---

## 11. 运行项目

```bash
# 开发模式
npm run dev

# 编译
npm run build

# 生产运行
npm start
```

### 测试 API

```bash
# 获取用户列表
curl http://localhost:3000/api/users

# 创建用户
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"张三","email":"zhangsan@example.com","age":25}'

# 获取单个用户
curl http://localhost:3000/api/users/1

# 更新用户
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"李四"}'

# 删除用户
curl -X DELETE http://localhost:3000/api/users/1
```

---

## 12. 类型声明文件

### 第三方模块声明

如果使用的库没有类型声明，可以创建 `src/types/declarations.d.ts`：

```typescript
declare module 'some-library' {
  export function someFunction(arg: string): number;
  export interface SomeOptions {
    foo?: string;
    bar?: number;
  }
}
```

### 全局类型声明

```typescript
// src/types/global.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: string;
    }
  }
}

export {};
```

---

## 我的总结

<!-- 在这里记录你的学习心得和疑问 -->

_待填写..._

---

## 总结

恭喜你完成了 TypeScript 的学习！接下来可以：

1. **学习前端框架**：TypeScript + Vue/React
2. **学习 NestJS**：基于 TypeScript 的企业级 Node.js 框架
3. **深入类型体操**：掌握更复杂的类型操作
4. **贡献类型定义**：为 DefinitelyTyped 贡献类型声明

## 参考资源

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [TypeScript 中文手册](https://typescript.bootcss.com/)
- [TypeScript Deep Dive](https://jkchao.github.io/typescript-book-chinese/)
