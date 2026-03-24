# Koa 教程

> 本教程已重新组织为分章节结构，请查看 [koa 目录](koa/) 获取完整内容。

Koa 是由 Express 团队打造的下一代 Node.js Web 框架，更轻量、更现代化，全面支持 async/await。

## 课程目录

1. [学习计划](koa/learning_structure.md) - 整体规划与学习路径
2. [第一章：入门与环境搭建](koa/koa_chapter_1.md) - 安装部署、文件结构
3. [第二章：核心概念](koa/koa_chapter_2.md) - Context 对象、请求响应
4. [第三章：中间件机制](koa/koa_chapter_3.md) - 洋葱模型、中间件编写
5. [第四章：路由](koa/koa_chapter_4.md) - RESTful API、路由模块化
6. [第五章：请求与响应](koa/koa_chapter_5.md) - 文件上传、Cookie、Session
7. [第六章：错误处理](koa/koa_chapter_6.md) - 全局错误处理、自定义错误类
8. [第七章：实战项目](koa/koa_chapter_7.md) - 完整的 Koa 项目

## 快速开始

```bash
# 创建项目
mkdir my-koa-app && cd my-koa-app
npm init -y
npm install koa

# 创建入口文件
cat > app.js << 'EOF'
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello Koa';
});

app.listen(3000);
EOF

# 运行
node app.js
```

## Koa vs Express

| 特性 | Koa | Express |
|------|-----|---------|
| 体积 | ~1MB | ~6MB |
| 中间件模型 | 洋葱模型（可回溯） | 线性模型 |
| async/await | 原生支持 | 需要额外处理 |
| 内置功能 | 极简，按需添加 | 内置路由、静态文件等 |

**选择建议**：
- 新项目、需要现代 async/await → **Koa**
- 快速开发、生态成熟 → **Express**
