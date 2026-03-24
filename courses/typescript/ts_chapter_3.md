# 第三章：接口与类型别名

元信息：
* 知识点：interface、type、联合类型、交叉类型
* 记录时间：2026-03-24
* 对应文件：无

---

## 1. 接口（interface）

接口用于定义对象的形状：

```typescript
// 基本接口
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: '张三',
  age: 25
};
```

### 可选属性

```typescript
interface Config {
  host: string;
  port: number;
  timeout?: number;  // 可选
}

const config1: Config = {
  host: 'localhost',
  port: 3000
};

const config2: Config = {
  host: 'localhost',
  port: 3000,
  timeout: 5000
};
```

### 只读属性

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}

const point: Point = { x: 10, y: 20 };
point.x = 30;  // Error: 只读属性不能修改
```

### 函数类型

```typescript
// 接口定义函数类型
interface Greet {
  (name: string): string;
}

const greet: Greet = (name) => `Hello, ${name}`;
greet('张三');  // 'Hello, 张三'
```

### 可索引类型

```typescript
// 字符串索引
interface StringMap {
  [key: string]: string;
}

const map: StringMap = {
  name: '张三',
  city: '北京'
};

// 数字索引
interface NumberArray {
  [index: number]: string;
}

const arr: NumberArray = ['a', 'b', 'c'];
```

---

## 2. 接口继承

### 单继承

```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

const dog: Dog = {
  name: '旺财',
  breed: '金毛'
};
```

### 多继承

```typescript
interface Flyable {
  fly(): void;
}

interface Swimmable {
  swim(): void;
}

interface Duck extends Flyable, Swimmable {
  name: string;
}

const duck: Duck = {
  name: '鸭子',
  fly() { console.log('飞'); },
  swim() { console.log('游'); }
};
```

---

## 3. 类型别名（type）

### 基本用法

```typescript
// 基本类型别名
type ID = string | number;
type Name = string;

// 对象类型
type User = {
  name: string;
  age: number;
};

// 函数类型
type Callback = (data: string) => void;
```

### 联合类型

```typescript
// 联合类型 - 或的关系
type Status = 'pending' | 'approved' | 'rejected';
type ID = string | number;

let status: Status = 'pending';
let id: ID = 'abc123';
id = 123;  // 也可以是数字

// 常见应用
type Direction = 'up' | 'down' | 'left' | 'right';
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
```

### 交叉类型

```typescript
// 交叉类型 - 且的关系
type Name = { name: string };
type Age = { age: number };
type User = Name & Age;

const user: User = {
  name: '张三',
  age: 25
};

// 合并多个类型
type BaseConfig = {
  host: string;
  port: number;
};

type SSLConfig = {
  ssl: boolean;
  cert?: string;
};

type ServerConfig = BaseConfig & SSLConfig;

const config: ServerConfig = {
  host: 'localhost',
  port: 443,
  ssl: true
};
```

---

## 4. interface vs type

### 相同点

```typescript
// 都可以定义对象类型
interface User1 { name: string }
type User2 = { name: string }

// 都可以继承
interface Animal { name: string }
interface Dog extends Animal { breed: string }

type Animal2 = { name: string };
type Dog2 = Animal2 & { breed: string };
```

### 不同点

| 特性 | interface | type |
|------|-----------|------|
| 声明合并 | ✓ 支持 | ✗ 不支持 |
| 联合类型 | ✗ 不支持 | ✓ 支持 |
| 元组类型 | ✗ 不支持 | ✓ 支持 |
| 原始类型别名 | ✗ 不支持 | ✓ 支持 |

```typescript
// 1. interface 支持声明合并
interface User {
  name: string;
}
interface User {
  age: number;
}
// User 现在包含 name 和 age

// type 不支持
type Person = { name: string };
type Person = { age: number };  // Error: 重复标识符

// 2. type 支持联合类型
type ID = string | number;  // OK
// interface ID = string | number;  // Error

// 3. type 支持元组
type Point = [number, number];  // OK
// interface Point = [number, number];  // Error

// 4. type 支持原始类型别名
type Name = string;  // OK
// interface Name = string;  // Error
```

### 选择建议

- **用 interface**：定义对象形状、需要声明合并
- **用 type**：联合类型、交叉类型、元组、原始类型别名

---

## 5. 实际应用

### API 响应类型

```typescript
// 通用响应类型
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 用户数据类型
interface User {
  id: number;
  name: string;
  email: string;
}

// 使用泛型
type UserResponse = ApiResponse<User>;
type UsersResponse = ApiResponse<User[]>;

// 实际使用
const response: UserResponse = {
  success: true,
  data: {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com'
  }
};
```

### 表单数据类型

```typescript
// 基础字段
type BaseFormData = {
  createdAt: Date;
  updatedAt: Date;
};

// 用户表单
type UserForm = {
  name: string;
  email: string;
  password: string;
} & BaseFormData;

// 创建表单（不含 id）
type CreateForm = Omit<UserForm, 'createdAt' | 'updatedAt'>;

// 更新表单（所有字段可选）
type UpdateForm = Partial<UserForm>;
```

---

## 6. 类型操作符

### typeof - 获取类型

```typescript
const user = {
  name: '张三',
  age: 25
};

// 从值获取类型
type User = typeof user;
// { name: string; age: number }

const user2: User = {
  name: '李四',
  age: 30
};
```

### keyof - 获取键的类型

```typescript
interface User {
  name: string;
  age: number;
  email: string;
}

// 获取所有键名
type UserKeys = keyof User;  // 'name' | 'age' | 'email'

// 实际应用
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = { name: '张三', age: 25, email: 'test@example.com' };
getValue(user, 'name');   // OK，返回 string
getValue(user, 'age');    // OK，返回 number
getValue(user, 'phone');  // Error: 不存在的键
```

### in - 遍历键名

```typescript
type Keys = 'a' | 'b' | 'c';

type Obj = {
  [K in Keys]: number;
};
// { a: number; b: number; c: number }
```

---

## 我的总结

<!-- 在这里记录你的学习心得和疑问 -->

_待填写..._

---

## 下一章

[第四章：函数](ts_chapter_4.md) - 编写类型安全的函数。
