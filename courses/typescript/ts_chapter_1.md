# 第一章：入门与环境搭建

元信息：
* 知识点：TypeScript 简介、安装配置、编译运行
* 记录时间：2026-03-24
* 对应文件：无

---

## 1. TypeScript 简介

### 什么是 TypeScript？

TypeScript 是微软开发的开源编程语言，是 JavaScript 的**超集**。它在 JavaScript 基础上添加了：
- **静态类型系统**
- **接口（Interface）**
- **泛型（Generics）**
- **更完善的面向对象支持**

### TypeScript = JavaScript + 类型

```typescript
// JavaScript
function add(a, b) {
  return a + b;
}

add(1, 2);      // 3
add('1', '2');  // '12' - 意外的字符串拼接！
add(1, '2');    // '12' - 更意外！
```

```typescript
// TypeScript
function add(a: number, b: number): number {
  return a + b;
}

add(1, 2);      // ✓ 3
add('1', '2');  // ✗ 错误：类型不匹配
add(1, '2');    // ✗ 错误：类型不匹配
```

### 为什么需要 TypeScript？

| 问题 | JavaScript | TypeScript |
|------|------------|------------|
| 类型错误 | 运行时才发现 | 编译时发现 |
| IDE 支持 | 有限的自动补全 | 完整的智能提示 |
| 代码重构 | 容易遗漏 | 编译器帮你检查 |
| 大型项目 | 维护困难 | 结构清晰 |

### 与 C 语言的对比

你熟悉的 C 语言是**静态类型**语言：

```c
// C 语言
int add(int a, int b) {
    return a + b;
}

add(1, 2);     // 正确
add(1.5, 2);   // 编译警告或自动转换
add("1", "2"); // 编译错误
```

TypeScript 给 JavaScript 带来了类似 C 的类型安全性：

```typescript
// TypeScript
function add(a: number, b: number): number {
  return a + b;
}
```

---

## 2. 安装 TypeScript

### 全局安装

```bash
npm install -g typescript

# 验证安装
tsc --version
# 输出：Version 5.x.x
```

### 项目本地安装（推荐）

```bash
mkdir ts-demo
cd ts-demo
npm init -y
npm install typescript --save-dev
```

---

## 3. 第一个 TypeScript 程序

### 创建文件

创建 `hello.ts`：

```typescript
// hello.ts
const message: string = 'Hello TypeScript';

function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(message);
console.log(greet('World'));
```

### 编译运行

```bash
# 编译
npx tsc hello.ts

# 运行生成的 JavaScript
node hello.js
```

### 编译输出

编译后会生成 `hello.js`：

```javascript
// hello.js
var message = 'Hello TypeScript';
function greet(name) {
    return "Hello, ".concat(name, "!");
}
console.log(message);
console.log(greet('World'));
```

**注意**：类型注解在编译后被移除，最终运行的是纯 JavaScript。

---

## 4. tsconfig.json 配置

### 生成配置文件

```bash
npx tsc --init
```

### 常用配置详解

```json
{
  "compilerOptions": {
    /* 基础选项 */
    "target": "ES2020",              // 编译目标版本
    "module": "commonjs",            // 模块系统
    "outDir": "./dist",              // 输出目录
    "rootDir": "./src",              // 源码目录

    /* 严格类型检查 */
    "strict": true,                  // 启用所有严格检查
    "noImplicitAny": true,           // 禁止隐式 any
    "strictNullChecks": true,        // 严格空值检查

    /* 其他选项 */
    "esModuleInterop": true,         // 允许 CommonJS 模块导入
    "skipLibCheck": true,            // 跳过库文件检查
    "forceConsistentCasingInFileNames": true,

    /* 路径映射 */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 目标版本选择

| target | 说明 |
|--------|------|
| ES5 | 兼容性最好，代码最多 |
| ES2017 | 支持 async/await |
| ES2020 | 支持 ??、?. 等新特性 |
| ESNext | 最新特性 |

**建议**：Node.js 项目使用 `ES2020`，浏览器项目根据兼容需求选择。

---

## 5. 项目结构

### 基础项目结构

```
ts-demo/
├── src/
│   ├── index.ts          # 入口文件
│   ├── utils/
│   │   └── helpers.ts
│   └── types/
│       └── index.ts
├── dist/                  # 编译输出目录
├── node_modules/
├── package.json
└── tsconfig.json
```

### package.json scripts

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsc && node dist/index.js"
  }
}
```

---

## 6. 开发工具

### ts-node（开发时直接运行 TS）

```bash
npm install ts-node --save-dev
```

```bash
# 直接运行 TypeScript
npx ts-node src/index.ts
```

### nodemon + ts-node（热重载）

```bash
npm install nodemon --save-dev
```

```json
// package.json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts"
  }
}
```

### VS Code 配置

VS Code 内置 TypeScript 支持，创建 `.vscode/settings.json`：

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

---

## 7. 类型错误示例

TypeScript 编译时会捕获类型错误：

```typescript
// 类型不匹配
const age: number = '25';  // Error: Type 'string' is not assignable to type 'number'

// 缺少必需属性
interface User {
  name: string;
  age: number;
}

const user: User = { name: '张三' };  // Error: Property 'age' is missing

// 调用不存在的方法
const nums: number[] = [1, 2, 3];
nums.push('4');  // Error: Argument of type 'string' is not assignable to parameter of type 'number'
```

---

## 8. 实践练习

### 练习 1：创建项目

```bash
# 创建项目目录
mkdir ts-first-project
cd ts-first-project

# 初始化
npm init -y
npm install typescript ts-node @types/node --save-dev

# 创建配置
npx tsc --init

# 创建源码目录
mkdir src
```

### 练习 2：编写类型安全的计算器

```typescript
// src/calculator.ts

// 定义操作类型
type Operation = 'add' | 'subtract' | 'multiply' | 'divide';

// 计算函数
function calculate(a: number, b: number, op: Operation): number {
  switch (op) {
    case 'add':
      return a + b;
    case 'subtract':
      return a - b;
    case 'multiply':
      return a * b;
    case 'divide':
      if (b === 0) {
        throw new Error('除数不能为0');
      }
      return a / b;
  }
}

// 测试
console.log(calculate(10, 5, 'add'));      // 15
console.log(calculate(10, 5, 'divide'));   // 2
// console.log(calculate(10, 0, 'divide')); // Error: 除数不能为0
```

### 练习 3：配置编译选项

修改 `tsconfig.json`，尝试不同的 `target` 值，观察编译输出的差异。

---

## 我的总结

<!-- 在这里记录你的学习心得和疑问 -->

_待填写..._

---

## 下一章

[第二章：基础类型](ts_chapter_2.md) - 掌握 TypeScript 的类型系统基础。
