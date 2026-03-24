# 第七章：实战项目

元信息：
* 知识点：项目结构、SQLite 集成、完整 CRUD API
* 记录时间：2026-03-24
* 对应文件：projects/koa-demo/（示例）

---

## 1. 项目概述

我们将构建一个完整的工作记录管理系统，包含：
- 项目类型管理（增删改查）
- 工作记录管理
- 数据统计
- 代理 API（转发外部请求）

### 技术栈

- Koa 2.x
- @koa/router
- koa-bodyparser
- @koa/cors
- better-sqlite3（SQLite 数据库）

---

## 2. 项目结构

```
koa-demo/
├── app.js                 # 入口文件
├── config/
│   └── index.js           # 配置
├── db/
│   ├── index.js           # 数据库连接
│   └── schema.sql         # 数据库结构
├── middlewares/
│   ├── errorHandler.js    # 错误处理
│   └── auth.js            # 认证中间件（可选）
├── routes/
│   ├── index.js           # 路由汇总
│   ├── projectTypes.js    # 项目类型路由
│   └── records.js         # 工作记录路由
├── controllers/
│   ├── projectTypes.js    # 项目类型控制器
│   └── records.js         # 工作记录控制器
├── services/
│   └── statistics.js      # 统计服务
├── uploads/               # 上传目录
└── package.json
```

---

## 3. 初始化项目

### package.json

```json
{
  "name": "koa-demo",
  "version": "1.0.0",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "dependencies": {
    "@koa/cors": "^5.0.0",
    "@koa/router": "^12.0.1",
    "better-sqlite3": "^11.0.0",
    "koa": "^2.15.0",
    "koa-body": "^6.0.1",
    "koa-bodyparser": "^4.4.1",
    "koa-logger": "^3.2.1",
    "koa-static": "^5.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
```

### 安装依赖

```bash
npm install
```

---

## 4. 数据库设计

### db/schema.sql

```sql
-- 项目类型表
CREATE TABLE IF NOT EXISTS project_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 工作性质表
CREATE TABLE IF NOT EXISTS project_natures (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 工作记录表
CREATE TABLE IF NOT EXISTS work_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_type_id TEXT,
  project_nature_id TEXT,
  hours REAL DEFAULT 0,
  description TEXT,
  work_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_type_id) REFERENCES project_types(id),
  FOREIGN KEY (project_nature_id) REFERENCES project_natures(id)
);
```

### db/index.js

```javascript
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// 数据库文件路径
const dbPath = path.join(__dirname, '..', 'data.db');
const db = new Database(dbPath);

// 执行建表语句
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');
db.exec(schema);

// 初始化示例数据
const initTypes = db.prepare(`
  INSERT OR IGNORE INTO project_types (id, name) VALUES (?, ?)
`);
const initNatures = db.prepare(`
  INSERT OR IGNORE INTO project_natures (id, name) VALUES (?, ?)
`);

// 初始化项目类型
initTypes.run('DEV', '开发');
initTypes.run('TEST', '测试');
initTypes.run('OPS', '运维');

// 初始化工作性质
initNatures.run('NEW', '新项目');
initNatures.run('MAINTAIN', '维护');
initNatures.run('SUPPORT', '支持');

module.exports = db;
```

---

## 5. 中间件

### middlewares/errorHandler.js

```javascript
const isDev = process.env.NODE_ENV !== 'production';

class HttpError extends Error {
  constructor(status, message, code = null) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const errorHandler = async (ctx, next) => {
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
    ctx.status = err.status || 500;
    ctx.body = {
      success: false,
      message: err.message,
      ...(isDev && { stack: err.stack })
    };
    ctx.app.emit('error', err, ctx);
  }
};

module.exports = { errorHandler, HttpError };
```

---

## 6. 路由与控制器

### routes/projectTypes.js

```javascript
const Router = require('@koa/router');
const db = require('../db');
const { HttpError } = require('../middlewares/errorHandler');

const router = new Router({ prefix: '/api/project-types' });

// 获取列表
router.get('/', async ctx => {
  const types = db.prepare(`
    SELECT id, name, created_at FROM project_types ORDER BY name
  `).all();

  ctx.body = { success: true, data: types };
});

// 添加
router.post('/', async ctx => {
  const { id, name } = ctx.request.body;

  if (!id || !name) {
    throw new HttpError(400, 'ID和名称不能为空');
  }

  try {
    db.prepare(`
      INSERT INTO project_types (id, name) VALUES (?, ?)
    `).run(id, name);

    ctx.body = { success: true, message: '添加成功' };
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
      throw new HttpError(400, 'ID已存在');
    }
    throw err;
  }
});

// 删除
router.delete('/:id', async ctx => {
  const result = db.prepare(`
    DELETE FROM project_types WHERE id = ?
  `).run(ctx.params.id);

  if (result.changes === 0) {
    throw new HttpError(404, '项目类型不存在');
  }

  ctx.body = { success: true, message: '删除成功' };
});

module.exports = router;
```

### routes/records.js

```javascript
const Router = require('@koa/router');
const db = require('../db');
const { HttpError } = require('../middlewares/errorHandler');

const router = new Router({ prefix: '/api/records' });

// 获取列表
router.get('/', async ctx => {
  const { startDate, endDate } = ctx.query;

  let sql = `
    SELECT r.*,
           pt.name as project_type_name,
           pn.name as project_nature_name
    FROM work_records r
    LEFT JOIN project_types pt ON r.project_type_id = pt.id
    LEFT JOIN project_natures pn ON r.project_nature_id = pn.id
    WHERE 1=1
  `;
  const params = [];

  if (startDate) {
    sql += ' AND r.work_date >= ?';
    params.push(startDate);
  }
  if (endDate) {
    sql += ' AND r.work_date <= ?';
    params.push(endDate);
  }

  sql += ' ORDER BY r.work_date DESC, r.id DESC';

  const records = db.prepare(sql).all(...params);
  ctx.body = { success: true, data: records };
});

// 添加
router.post('/', async ctx => {
  const { project_type_id, project_nature_id, hours, description, work_date } = ctx.request.body;

  if (!work_date) {
    throw new HttpError(400, '日期不能为空');
  }

  const result = db.prepare(`
    INSERT INTO work_records
      (project_type_id, project_nature_id, hours, description, work_date)
    VALUES (?, ?, ?, ?, ?)
  `).run(project_type_id, project_nature_id, hours || 0, description, work_date);

  ctx.body = {
    success: true,
    message: '添加成功',
    data: { id: result.lastInsertRowid }
  };
});

// 更新
router.put('/:id', async ctx => {
  const { project_type_id, project_nature_id, hours, description, work_date } = ctx.request.body;

  const result = db.prepare(`
    UPDATE work_records SET
      project_type_id = ?,
      project_nature_id = ?,
      hours = ?,
      description = ?,
      work_date = ?
    WHERE id = ?
  `).run(project_type_id, project_nature_id, hours, description, work_date, ctx.params.id);

  if (result.changes === 0) {
    throw new HttpError(404, '记录不存在');
  }

  ctx.body = { success: true, message: '更新成功' };
});

// 删除
router.delete('/:id', async ctx => {
  const result = db.prepare(`
    DELETE FROM work_records WHERE id = ?
  `).run(ctx.params.id);

  if (result.changes === 0) {
    throw new HttpError(404, '记录不存在');
  }

  ctx.body = { success: true, message: '删除成功' };
});

// 统计
router.get('/statistics', async ctx => {
  const { startDate, endDate } = ctx.query;

  let sql = `
    SELECT
      pt.name as project_type,
      SUM(r.hours) as total_hours,
      COUNT(*) as record_count
    FROM work_records r
    LEFT JOIN project_types pt ON r.project_type_id = pt.id
    WHERE 1=1
  `;
  const params = [];

  if (startDate) {
    sql += ' AND r.work_date >= ?';
    params.push(startDate);
  }
  if (endDate) {
    sql += ' AND r.work_date <= ?';
    params.push(endDate);
  }

  sql += ' GROUP BY r.project_type_id ORDER BY total_hours DESC';

  const stats = db.prepare(sql).all(...params);

  // 计算总工时
  const totalHours = stats.reduce((sum, s) => sum + (s.total_hours || 0), 0);

  ctx.body = {
    success: true,
    data: {
      items: stats,
      totalHours,
      recordCount: stats.reduce((sum, s) => sum + s.record_count, 0)
    }
  };
});

module.exports = router;
```

---

## 7. 入口文件

### app.js

```javascript
const Koa = require('koa');
const logger = require('koa-logger');
const cors = require('@koa/cors');
const { koaBody } = require('koa-body');
const serve = require('koa-static');

const { errorHandler } = require('./middlewares/errorHandler');
const projectTypesRouter = require('./routes/projectTypes');
const recordsRouter = require('./routes/records');

const app = new Koa();
const PORT = process.env.PORT || 3001;

// 初始化数据库
require('./db');

// 全局错误事件
app.on('error', (err, ctx) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.message);
});

// 中间件
app.use(errorHandler);
app.use(logger());
app.use(cors());
app.use(koaBody({ multipart: true }));
app.use(serve('./public'));

// 路由
app.use(projectTypesRouter.routes()).use(projectTypesRouter.allowedMethods());
app.use(recordsRouter.routes()).use(recordsRouter.allowedMethods());

// 启动
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
```

---

## 8. 测试 API

```bash
# 获取项目类型列表
curl http://localhost:3001/api/project-types

# 添加项目类型
curl -X POST http://localhost:3001/api/project-types \
  -H "Content-Type: application/json" \
  -d '{"id":"DOC","name":"文档"}'

# 删除项目类型
curl -X DELETE http://localhost:3001/api/project-types/DOC

# 添加工作记录
curl -X POST http://localhost:3001/api/records \
  -H "Content-Type: application/json" \
  -d '{
    "project_type_id": "DEV",
    "project_nature_id": "NEW",
    "hours": 4,
    "description": "开发用户模块",
    "work_date": "2026-03-24"
  }'

# 获取工作记录列表
curl http://localhost:3001/api/records

# 获取统计
curl "http://localhost:3001/api/records/statistics?startDate=2026-03-01&endDate=2026-03-31"
```

---

## 9. 与 Express 版本对比

| 特性 | Express 版本 | Koa 版本 |
|------|--------------|----------|
| 中间件 | `app.use((req, res, next) => {...})` | `app.use(async (ctx, next) => {...})` |
| 错误处理 | 4个参数 `(err, req, res, next)` | try-catch + `ctx.app.emit('error')` |
| 请求响应 | `req` / `res` 分离 | 统一的 `ctx` |
| 路由 | 内置 `express.Router()` | 需要 `@koa/router` |
| 请求体 | 内置 `express.json()` | 需要 `koa-bodyparser` |

---

## 我的总结

<!-- 在这里记录你的学习心得和疑问 -->

_待填写..._

---

## 总结与扩展

恭喜你完成了 Koa 框架的学习！接下来可以尝试：

1. **添加认证功能**：使用 JWT 或 Session 实现用户登录
2. **添加日志系统**：集成 winston 或 log4js
3. **添加单元测试**：使用 Jest 或 Mocha
4. **部署到生产环境**：使用 PM2 管理 Node.js 进程
5. **学习 NestJS**：基于 Koa 的企业级框架

## 参考资源

- [Koa 官方文档](https://koajs.com/)
- [Koa GitHub](https://github.com/koajs/koa)
- [better-sqlite3 文档](https://github.com/WiseLibs/better-sqlite3)
