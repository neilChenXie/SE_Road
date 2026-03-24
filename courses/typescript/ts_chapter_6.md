# 第六章：泛型

元信息：
* 知识点：泛型函数、泛型接口、泛型类、泛型约束
* 记录时间：2026-03-24
* 对应文件：无

---

## 1. 为什么需要泛型？

### 没有 泛型的问题

```typescript
// 方式1：使用 any（丢失类型信息）
function identity1(arg: any): any {
  return arg;
}

const result1 = identity1('hello');  // 返回 any，不是 string

// 方式2：为每种类型写一个函数（代码重复）
function identityString(arg: string): string {
  return arg;
}

function identityNumber(arg: number): number {
  return arg;
}
```

### 使用泛型

```typescript
// 泛型函数 - T 是类型参数
function identity<T>(arg: T): T {
  return arg;
}

// 使用时指定类型
const str = identity<string>('hello');  // 返回 string
const num = identity<number>(123);      // 返回 number

// 类型推断（自动推断）
const str2 = identity('hello');  // 自动推断为 string
const num2 = identity(123);      // 自动推断为 number
```

---

## 2. 泛型函数

### 基本语法

```typescript
// 函数声明
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

// 箭头函数
const getFirst2 = <T>(arr: T[]): T | undefined => {
  return arr[0];
};

// 使用
getFirst([1, 2, 3]);        // number | undefined
getFirst(['a', 'b', 'c']);  // string | undefined
```

### 多类型参数

```typescript
function pair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}

const p1 = pair('name', '张三');     // [string, string]
const p2 = pair('age', 25);          // [string, number]
const p3 = pair(1, { name: '张三' }); // [number, { name: string }]
```

### 泛型约束

```typescript
// 约束 T 必须有 length 属性
interface HasLength {
  length: number;
}

function getLength<T extends HasLength>(value: T): number {
  return value.length;
}

getLength('hello');      // OK，string 有 length
getLength([1, 2, 3]);    // OK，array 有 length
getLength({ length: 5 }); // OK，对象有 length
// getLength(123);        // Error，number 没有 length
```

### 使用 keyof 约束

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: '张三', age: 25 };

getProperty(user, 'name');  // OK，返回 string
getProperty(user, 'age');   // OK，返回 number
// getProperty(user, 'email');  // Error: 不存在的键
```

---

## 3. 泛型接口

### 基本用法

```typescript
// 泛型接口
interface Container<T> {
  value: T;
  getValue(): T;
  setValue(value: T): void;
}

// 实现
class Box<T> implements Container<T> {
  constructor(public value: T) {}

  getValue(): T {
    return this.value;
  }

  setValue(value: T): void {
    this.value = value;
  }
}

const box1 = new Box<string>('hello');
const box2 = new Box<number>(123);
```

### 函数类型接口

```typescript
interface Callback<T> {
  (data: T): void;
}

interface EventEmitter<T> {
  on(event: string, callback: Callback<T>): void;
  emit(event: string, data: T): void;
}

class MyEmitter<T> implements EventEmitter<T> {
  private listeners: Map<string, Callback<T>[]> = new Map();

  on(event: string, callback: Callback<T>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  emit(event: string, data: T): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(data));
  }
}
```

### API 响应类型

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface User {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
}

// 使用
const userResponse: ApiResponse<User> = {
  success: true,
  data: { id: 1, name: '张三' }
};

const postsResponse: ApiResponse<Post[]> = {
  success: true,
  data: [
    { id: 1, title: 'Hello', content: 'World' }
  ]
};
```

---

## 4. 泛型类

```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

// 使用
const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
console.log(numberStack.pop());  // 2

const stringStack = new Stack<string>();
stringStack.push('a');
stringStack.push('b');
console.log(stringStack.pop());  // 'b'
```

### 泛型类约束

```typescript
class SortedList<T extends { id: number }> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
    this.items.sort((a, b) => a.id - b.id);
  }

  getItems(): T[] {
    return [...this.items];
  }
}

interface User {
  id: number;
  name: string;
}

const list = new SortedList<User>();
list.add({ id: 3, name: '张三' });
list.add({ id: 1, name: '李四' });
list.add({ id: 2, name: '王五' });

console.log(list.getItems());
// [{ id: 1, name: '李四' }, { id: 2, name: '王五' }, { id: 3, name: '张三' }]
```

---

## 5. 泛型默认类型

```typescript
// 默认类型为 string
interface Result<T = string> {
  success: boolean;
  data: T;
}

const result1: Result = { success: true, data: 'hello' };
const result2: Result<number> = { success: true, data: 123 };

// 多个类型参数
interface Pair<T = string, U = number> {
  first: T;
  second: U;
}

const p1: Pair = { first: 'a', second: 1 };          // 默认类型
const p2: Pair<number> = { first: 1, second: 2 };    // 第一个使用 number，第二个使用默认
const p3: Pair<number, string> = { first: 1, second: 'a' };  // 两个都指定
```

---

## 6. 条件类型

### 基本语法

```typescript
// 条件类型
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

// 实际应用
type NonNullable<T> = T extends null | undefined ? never : T;

type C = NonNullable<string | null>;  // string
```

### infer 关键字

```typescript
// 提取函数返回值类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getName(): string { return '张三'; }
type Name = ReturnType<typeof getName>;  // string

// 提取 Promise 值类型
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type P = UnwrapPromise<Promise<string>>;  // string
type N = UnwrapPromise<number>;           // number
```

---

## 7. 实用工具类型

TypeScript 内置了很多实用的泛型工具类型：

### Partial - 所有属性可选

```typescript
interface User {
  name: string;
  age: number;
  email: string;
}

type PartialUser = Partial<User>;
// { name?: string; age?: number; email?: string; }
```

### Required - 所有属性必需

```typescript
interface Config {
  host?: string;
  port?: number;
}

type RequiredConfig = Required<Config>;
// { host: string; port: number; }
```

### Pick - 选取部分属性

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type PublicUser = Pick<User, 'id' | 'name' | 'email'>;
// { id: number; name: string; email: string; }
```

### Omit - 排除部分属性

```typescript
type SafeUser = Omit<User, 'password'>;
// { id: number; name: string; email: string; }
```

### Record - 创建对象类型

```typescript
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;
// { [key: string]: 'admin' | 'user' | 'guest'; }

const roles: UserRoles = {
  '张三': 'admin',
  '李四': 'user'
};
```

---

## 我的总结

<!-- 在这里记录你的学习心得和疑问 -->

_待填写..._

---

## 下一章

[第七章：实战项目](ts_chapter_7.md) - TypeScript + Koa 完整项目。
