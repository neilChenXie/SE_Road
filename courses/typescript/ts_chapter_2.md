# 第二章：基础类型

元信息：
* 知识点：原始类型、数组、元组、any、unknown、类型推断
* 记录时间：2026-03-24
* 对应文件：无

---

## 1. 原始类型

TypeScript 支持 JavaScript 的所有原始类型：

```typescript
// 字符串
const name: string = '张三';
const greeting: string = `Hello, ${name}`;

// 数字（不区分整数和浮点数）
const age: number = 25;
const price: number = 99.99;
const hex: number = 0xff;      // 十六进制
const binary: number = 0b1010; // 二进制

// 布尔值
const isActive: boolean = true;
const hasPermission: boolean = false;

// 空值
const empty: void = undefined;
const nothing: null = null;
const notDefined: undefined = undefined;
```

### 与 C 语言对比

```c
// C 语言
int age = 25;
float price = 99.99;
char* name = "张三";
int active = 1;  // 没有真正的布尔类型
```

```typescript
// TypeScript
const age: number = 25;        // 整数和浮点数都是 number
const price: number = 99.99;
const name: string = '张三';
const active: boolean = true;  // 真正的布尔类型
```

---

## 2. 数组

### 两种定义方式

```typescript
// 方式1：类型[]
const numbers: number[] = [1, 2, 3, 4, 5];
const names: string[] = ['张三', '李四', '王五'];

// 方式2：Array<类型>（泛型语法）
const scores: Array<number> = [90, 85, 95];
const users: Array<string> = ['user1', 'user2'];
```

### 数组操作

```typescript
const nums: number[] = [1, 2, 3];

nums.push(4);        // 添加元素
nums.pop();          // 移除最后一个
nums.shift();        // 移除第一个
nums.unshift(0);     // 在开头添加

// 数组方法返回新数组，类型自动推断
const doubled: number[] = nums.map(n => n * 2);
const evens: number[] = nums.filter(n => n % 2 === 0);
const sum: number = nums.reduce((a, b) => a + b, 0);
```

### 只读数组

```typescript
const readonlyNums: readonly number[] = [1, 2, 3];
// 或
const readonlyNums2: ReadonlyArray<number> = [1, 2, 3];

readonlyNums.push(4);  // Error: 类型不存在 push 方法
readonlyNums[0] = 10;  // Error: 索引签名只允许读取
```

---

## 3. 元组（Tuple）

元组是**固定长度**、**固定类型**的数组：

```typescript
// 定义元组
const point: [number, number] = [10, 20];
const user: [string, number] = ['张三', 25];

// 访问元素（类型正确）
const x: number = point[0];
const name: string = user[0];
const age: number = user[1];

// 越界访问会报错
point[2];  // Error: 长度为 2 的元组在索引 2 处没有元素
```

### 可选元素

```typescript
// 第二个元素可选
const tuple: [string, number?] = ['hello'];
// 或
const tuple2: [string, number?] = ['hello', 123];
```

### 带标签的元组

```typescript
// 标签仅用于文档目的，不影响类型检查
const range: [start: number, end: number] = [0, 100];
const httpStatus: [code: number, message: string] = [200, 'OK'];
```

### 实际应用

```typescript
// React useState 返回值
const [count, setCount]: [number, (n: number) => void] = useState(0);

// Object.entries 返回值
const entries: [string, any][] = Object.entries({ name: '张三', age: 25 });
```

---

## 4. 对象类型

### 基本对象类型

```typescript
// 内联类型注解
const user: { name: string; age: number } = {
  name: '张三',
  age: 25
};

// 可选属性
const config: {
  host: string;
  port: number;
  timeout?: number;  // 可选
} = {
  host: 'localhost',
  port: 3000
  // timeout 可省略
};
```

### 索引签名

```typescript
// 字符串索引
const scores: { [key: string]: number } = {
  math: 90,
  english: 85,
  chinese: 95
};

// 数字索引（通常用于类数组）
const arrayLike: { [index: number]: string } = {
  0: 'a',
  1: 'b',
  length: 2
};
```

---

## 5. any、unknown、never

### any - 关闭类型检查

```typescript
// any 类型可以赋任何值
let anything: any = 'hello';
anything = 123;
anything = { name: '张三' };
anything = [1, 2, 3];

// 可以调用任何方法（运行时可能报错）
anything.toUpperCase();     // 编译通过
anything.nonExistent();     // 编译通过，运行报错

// ⚠️ 尽量避免使用 any，它关闭了类型检查
```

### unknown - 类型安全的 any

```typescript
let value: unknown = 'hello';

value = 123;
value = { name: '张三' };

// 不能直接使用，必须先检查类型
value.toUpperCase();  // Error: 'value' is of type 'unknown'

// 正确用法：类型守卫
if (typeof value === 'string') {
  console.log(value.toUpperCase());  // OK
}

// 类型断言
(value as string).toUpperCase();
```

### any vs unknown

```typescript
let anyValue: any = 'hello';
let unknownValue: unknown = 'hello';

// any 可以赋给任何类型（危险！）
const str: string = anyValue;
const num: number = anyValue;  // 编译通过，运行可能出错

// unknown 不能直接赋给其他类型
const str2: string = unknownValue;  // Error
const str3: string = unknownValue as string;  // OK，需要断言
```

### never - 永不存在的类型

```typescript
// 1. 函数永不返回
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}

// 2. 类型收窄到最后
function checkType(value: string | number) {
  if (typeof value === 'string') {
    // value 是 string
  } else if (typeof value === 'number') {
    // value 是 number
  } else {
    // value 是 never（不可能到达这里）
    const _exhaustive: never = value;
  }
}
```

---

## 6. 类型推断

TypeScript 会自动推断类型，大多数情况下不需要显式注解：

```typescript
// 自动推断为 string
let name = '张三';
name = 123;  // Error: 不能将 number 赋给 string

// 自动推断为 number
let age = 25;

// 自动推断为 number[]
const nums = [1, 2, 3];

// 自动推断返回值类型
function add(a: number, b: number) {
  return a + b;  // 返回值自动推断为 number
}

// 对象自动推断
const user = {
  name: '张三',
  age: 25
};
// user.name 自动推断为 string，user.age 自动推断为 number
```

### 何时需要显式注解？

```typescript
// 1. 函数参数
function greet(name: string) {  // 必须注解
  return `Hello, ${name}`;
}

// 2. 复杂类型
interface User {
  name: string;
  age: number;
}
const user: User = { name: '张三', age: 25 };

// 3. 无法推断的情况
let value: string | number;  // 联合类型需要显式声明
```

---

## 7. 字面量类型

```typescript
// 字符串字面量
const name: '张三' = '张三';
let direction: 'up' | 'down' | 'left' | 'right';
direction = 'up';
direction = 'forward';  // Error

// 数字字面量
const one: 1 = 1;
let dice: 1 | 2 | 3 | 4 | 5 | 6;
dice = 3;
dice = 7;  // Error

// 布尔字面量
const yes: true = true;
const no: false = false;

// 实际应用
type HttpStatus = 200 | 404 | 500;
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

function request(url: string, method: Method) {
  // ...
}
```

---

## 8. 类型断言

### 语法

```typescript
// 尖括号语法
let value: any = 'hello';
const length: number = (<string>value).length;

// as 语法（推荐，TSX 中只能用这个）
const length2: number = (value as string).length;
```

### 常见场景

```typescript
// 1. DOM 元素
const input = document.querySelector('input') as HTMLInputElement;
input.value = 'hello';

// 2. 类型收窄
const value: string | number = 'hello';
const str = value as string;

// 3. 绕过类型检查（不推荐）
const num = '123' as unknown as number;  // 危险！
```

### const 断言

```typescript
// 让 TypeScript 推断出更精确的字面量类型
const config = {
  host: 'localhost',
  port: 3000
} as const;

// 类型变为：
// { readonly host: "localhost"; readonly port: 3000 }

// 数组变为只读元组
const nums = [1, 2, 3] as const;
// 类型变为：readonly [1, 2, 3]
```

---

## 我的总结

<!-- 在这里记录你的学习心得和疑问 -->

_待填写..._

---

## 下一章

[第三章：接口与类型别名](ts_chapter_3.md) - 定义复杂的数据结构。
