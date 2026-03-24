# 第四章：函数

元信息：
* 知识点：函数类型定义、参数类型、函数重载
* 记录时间：2026-03-24
* 对应文件：无

---

## 1. 函数类型定义

### 函数声明

```typescript
// 完整类型注解
function add(a: number, b: number): number {
  return a + b;
}

// 返回值类型可省略（自动推断）
function add2(a: number, b: number) {
  return a + b;  // 自动推断为 number
}

// 无返回值
function log(message: string): void {
  console.log(message);
}
```

### 函数表达式

```typescript
// 函数表达式
const add = function(a: number, b: number): number {
  return a + b;
};

// 箭头函数
const add2 = (a: number, b: number): number => a + b;

// 定义函数类型
type AddFunction = (a: number, b: number) => number;

const add3: AddFunction = (a, b) => a + b;
```

### 接口定义函数

```typescript
interface MathOperation {
  (a: number, b: number): number;
}

const add: MathOperation = (a, b) => a + b;
const subtract: MathOperation = (a, b) => a - b;
const multiply: MathOperation = (a, b) => a * b;
```

---

## 2. 参数类型

### 可选参数

```typescript
// 可选参数必须放在最后
function greet(name: string, greeting?: string): string {
  return greeting ? `${greeting}, ${name}!` : `Hello, ${name}!`;
}

greet('张三');              // 'Hello, 张三!'
greet('张三', '早上好');    // '早上好, 张三!'
```

### 默认参数

```typescript
// 默认参数可以不在最后
function greet(name: string, greeting: string = 'Hello'): string {
  return `${greeting}, ${name}!`;
}

greet('张三');              // 'Hello, 张三!'
greet('张三', '早上好');    // '早上好, 张三!'

// 默认参数在前面时
function createUrl(path: string = '/', host: string): string {
  return `http://${host}${path}`;
}

createUrl(undefined, 'localhost');  // 'http://localhost/'
```

### 剩余参数

```typescript
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

sum(1, 2, 3, 4, 5);  // 15

// 混合使用
function log(level: string, ...messages: string[]): void {
  console.log(`[${level}]`, ...messages);
}

log('INFO', '用户登录', '张三');  // '[INFO] 用户登录 张三'
```

### 解构参数

```typescript
// 对象解构
function createUser({ name, age }: { name: string; age: number }): User {
  return { name, age };
}

createUser({ name: '张三', age: 25 });

// 数组解构
function getFirstTwo([first, second]: number[]): [number, number] {
  return [first, second];
}

getFirstTwo([1, 2, 3, 4]);  // [1, 2]

// 结合接口更清晰
interface UserOptions {
  name: string;
  age: number;
  email?: string;
}

function createUser2(options: UserOptions): User {
  return options;
}
```

---

## 3. 函数重载

函数重载允许一个函数接受不同类型或数量的参数：

### 基本示例

```typescript
// 重载签名
function getLength(str: string): number;
function getLength(arr: any[]): number;

// 实现签名
function getLength(value: string | any[]): number {
  return value.length;
}

getLength('hello');      // 返回 number
getLength([1, 2, 3]);    // 返回 number
getLength(123);          // Error: 没有匹配的重载
```

### 实际应用

```typescript
// 创建用户（不同参数）
interface User {
  id: number;
  name: string;
  email: string;
}

// 重载：根据参数不同返回不同类型
function createUser(name: string, email: string): User;
function createUser(data: { name: string; email: string }): User;
function createUser(nameOrData: string | { name: string; email: string }, email?: string): User {
  if (typeof nameOrData === 'string') {
    return {
      id: Date.now(),
      name: nameOrData,
      email: email!
    };
  } else {
    return {
      id: Date.now(),
      ...nameOrData
    };
  }
}

// 使用
const user1 = createUser('张三', 'zhangsan@example.com');
const user2 = createUser({ name: '李四', email: 'lisi@example.com' });
```

### 事件处理器

```typescript
// DOM 事件处理器
type MouseEventHandler = (event: MouseEvent) => void;
type KeyboardEventHandler = (event: KeyboardEvent) => void;

function on(element: HTMLElement, event: 'click', handler: MouseEventHandler): void;
function on(element: HTMLElement, event: 'keydown', handler: KeyboardEventHandler): void;
function on(element: HTMLElement, event: string, handler: (event: Event) => void): void {
  element.addEventListener(event, handler);
}

// 使用 - 类型安全
on(document.body, 'click', (e) => {
  console.log(e.clientX);  // MouseEvent 属性
});

on(document.body, 'keydown', (e) => {
  console.log(e.key);  // KeyboardEvent 属性
});
```

---

## 4. this 类型

### 指定 this 类型

```typescript
interface User {
  name: string;
  greet(this: User): void;
}

const user: User = {
  name: '张三',
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

user.greet();  // OK

const greet = user.greet;
greet();  // Error: this 必须是 User 类型
```

### 箭头函数与 this

```typescript
class Counter {
  count = 0;

  // 普通方法 - this 可能丢失
  increment() {
    this.count++;
  }

  // 箭头函数 - this 绑定到实例
  decrement = () => {
    this.count--;
  };
}

const counter = new Counter();
const inc = counter.increment;
const dec = counter.decrement;

dec();   // OK
inc();   // Error: this 是 undefined
```

---

## 5. 类型守卫

### typeof 类型守卫

```typescript
function process(value: string | number) {
  if (typeof value === 'string') {
    // 这里 value 是 string 类型
    return value.toUpperCase();
  } else {
    // 这里 value 是 number 类型
    return value.toFixed(2);
  }
}
```

### instanceof 类型守卫

```typescript
class Dog {
  bark() { console.log('汪汪'); }
}

class Cat {
  meow() { console.log('喵喵'); }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}
```

### in 操作符

```typescript
interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

function move(animal: Bird | Fish) {
  if ('fly' in animal) {
    animal.fly();
  } else {
    animal.swim();
  }
}
```

### 自定义类型守卫

```typescript
interface User {
  name: string;
  email: string;
}

// isUser 是类型谓词
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'email' in value
  );
}

function processUser(value: unknown) {
  if (isUser(value)) {
    // value 被收窄为 User 类型
    console.log(value.name);
    console.log(value.email);
  }
}
```

---

## 6. 实践：类型安全的工具函数

```typescript
// 防抖函数
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return function(this: any, ...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 节流函数
function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastTime = 0;
  return function(this: any, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// 使用
const logSearch = debounce((query: string) => {
  console.log('搜索:', query);
}, 300);

logSearch('TypeScript');
```

---

## 我的总结

<!-- 在这里记录你的学习心得和疑问 -->

_待填写..._

---

## 下一章

[第五章：类与面向对象](ts_chapter_5.md) - TypeScript 的面向对象编程。
