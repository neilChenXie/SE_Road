# TypeScript 教程

> 本教程已组织为分章节结构，请查看 [typescript 目录](typescript/) 获取完整内容。

TypeScript 是 JavaScript 的超集，添加了静态类型系统，让代码更安全、更易于维护。

## 课程目录

1. [学习计划](typescript/learning_structure.md) - 整体规划与学习路径
2. [第一章：入门与环境搭建](typescript/ts_chapter_1.md) - 安装配置、编译运行
3. [第二章：基础类型](typescript/ts_chapter_2.md) - 原始类型、数组、元组、类型推断
4. [第三章：接口与类型别名](typescript/ts_chapter_3.md) - interface、type、联合类型
5. [第四章：函数](typescript/ts_chapter_4.md) - 函数类型、参数、重载
6. [第五章：类与面向对象](typescript/ts_chapter_5.md) - 访问修饰符、抽象类
7. [第六章：泛型](typescript/ts_chapter_6.md) - 泛型函数、泛型类、工具类型
8. [第七章：实战项目](typescript/ts_chapter_7.md) - TypeScript + Koa 完整项目

## 快速开始

```bash
# 安装 TypeScript
npm install -g typescript

# 创建文件
cat > hello.ts << 'EOF'
const message: string = 'Hello TypeScript';
console.log(message);
EOF

# 编译运行
tsc hello.ts
node hello.js

# 或使用 ts-node 直接运行
npx ts-node hello.ts
```

## TypeScript vs JavaScript

| 特性 | JavaScript | TypeScript |
|------|------------|------------|
| 类型系统 | 动态类型 | 静态类型 |
| 类型检查 | 运行时 | 编译时 |
| IDE 支持 | 有限 | 完整智能提示 |
| 错误发现 | 运行时 | 编译时 |
| 学习曲线 | 低 | 中等 |

## 为什么学习 TypeScript？

- **大型项目必备**：Vue 3、React、NestJS 都用 TypeScript
- **更少的运行时错误**：编译时发现类型问题
- **更好的开发体验**：IDE 智能提示和自动补全
- **团队协作友好**：类型即文档
