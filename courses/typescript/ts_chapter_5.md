# 第五章：类与面向对象

元信息：
* 知识点：类的基本语法、访问修饰符、抽象类、接口实现
* 记录时间：2026-03-24
* 对应文件：无

---

## 1. 类的基本语法

### 定义类

```typescript
class User {
  // 属性
  name: string;
  age: number;

  // 构造函数
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  // 方法
  greet(): string {
    return `Hello, I'm ${this.name}`;
  }
}

const user = new User('张三', 25);
console.log(user.greet());  // "Hello, I'm 张三"
```

### 属性简写

```typescript
// 构造函数参数自动成为属性
class User {
  constructor(
    public name: string,
    public age: number
  ) {}
}

// 等价于
class User2 {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}
```

### 只读属性

```typescript
class User {
  readonly id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

const user = new User(1, '张三');
user.name = '李四';  // OK
user.id = 2;        // Error: 只读属性不能修改
```

---

## 2. 访问修饰符

### public（默认）

```typescript
class User {
  public name: string;  // 公开，任何地方可访问

  constructor(name: string) {
    this.name = name;
  }
}

const user = new User('张三');
console.log(user.name);  // OK
```

### private

```typescript
class User {
  private password: string;  // 私有，仅类内部可访问

  constructor(password: string) {
    this.password = password;
  }

  checkPassword(input: string): boolean {
    return this.password === input;
  }
}

const user = new User('secret');
console.log(user.password);      // Error: 私有属性
console.log(user.checkPassword('secret'));  // OK
```

### protected

```typescript
class Animal {
  protected name: string;  // 受保护，类及其子类可访问

  constructor(name: string) {
    this.name = name;
  }
}

class Dog extends Animal {
  constructor(name: string) {
    super(name);
  }

  bark(): string {
    return `${this.name} says: Woof!`;  // OK，子类可访问
  }
}

const dog = new Dog('旺财');
console.log(dog.name);   // Error: 受保护属性
console.log(dog.bark()); // OK
```

### 修饰符对比

| 修饰符 | 类内部 | 子类 | 类外部 |
|--------|--------|------|--------|
| public | ✓ | ✓ | ✓ |
| protected | ✓ | ✓ | ✗ |
| private | ✓ | ✗ | ✗ |

---

## 3. 存取器（Getter/Setter）

```typescript
class User {
  private _email: string = '';

  // Getter
  get email(): string {
    return this._email;
  }

  // Setter
  set email(value: string) {
    if (!value.includes('@')) {
      throw new Error('无效的邮箱地址');
    }
    this._email = value;
  }
}

const user = new User();
user.email = 'test@example.com';  // 调用 setter
console.log(user.email);          // 调用 getter
user.email = 'invalid';           // Error: 无效的邮箱地址
```

### 只读属性（只有 getter）

```typescript
class Circle {
  constructor(private _radius: number) {}

  get radius(): number {
    return this._radius;
  }

  get area(): number {
    return Math.PI * this._radius ** 2;
  }
}

const circle = new Circle(5);
console.log(circle.radius);  // 5
console.log(circle.area);    // 78.54
circle.radius = 10;          // Error: 没有 setter
```

---

## 4. 静态成员

```typescript
class User {
  // 静态属性
  static count: number = 0;

  // 静态方法
  static getCount(): number {
    return User.count;
  }

  constructor(public name: string) {
    User.count++;
  }
}

const user1 = new User('张三');
const user2 = new User('李四');

console.log(User.count);      // 2
console.log(User.getCount()); // 2
```

### 单例模式

```typescript
class Database {
  private static instance: Database;

  private constructor() {
    // 私有构造函数，防止外部 new
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

// const db = new Database();  // Error: 构造函数是私有的
const db = Database.getInstance();  // OK
```

---

## 5. 抽象类

抽象类不能被实例化，用于定义子类的公共结构：

```typescript
// 抽象类
abstract class Animal {
  constructor(public name: string) {}

  // 抽象方法 - 子类必须实现
  abstract makeSound(): string;

  // 具体方法 - 子类继承
  move(): string {
    return `${this.name} is moving`;
  }
}

// 子类
class Dog extends Animal {
  constructor(name: string) {
    super(name);
  }

  makeSound(): string {
    return 'Woof!';
  }
}

class Cat extends Animal {
  constructor(name: string) {
    super(name);
  }

  makeSound(): string {
    return 'Meow!';
  }
}

// const animal = new Animal('xxx');  // Error: 抽象类不能实例化
const dog = new Dog('旺财');
console.log(dog.makeSound());  // 'Woof!'
console.log(dog.move());       // '旺财 is moving'
```

---

## 6. 接口实现

### 类实现接口

```typescript
interface IAnimal {
  name: string;
  makeSound(): string;
}

class Dog implements IAnimal {
  constructor(public name: string) {}

  makeSound(): string {
    return 'Woof!';
  }
}
```

### 实现多个接口

```typescript
interface Serializable {
  serialize(): string;
}

interface Comparable {
  compareTo(other: this): number;
}

class User implements Serializable, Comparable {
  constructor(
    public id: number,
    public name: string
  ) {}

  serialize(): string {
    return JSON.stringify({ id: this.id, name: this.name });
  }

  compareTo(other: User): number {
    return this.id - other.id;
  }
}
```

### 接口继承类

```typescript
class Control {
  private state: any;

  protected setState(state: any) {
    this.state = state;
  }
}

// 接口继承类，包含 private 成员
interface SelectableControl extends Control {
  select(): void;
}

// 只有 Control 的子类才能实现此接口
class Button extends Control implements SelectableControl {
  select() {}
}
```

---

## 7. 泛型类

```typescript
class Container<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  getAll(): T[] {
    return [...this.items];
  }
}

// 使用
const numbers = new Container<number>();
numbers.add(1);
numbers.add(2);
console.log(numbers.getAll());  // [1, 2]

const strings = new Container<string>();
strings.add('hello');
strings.add('world');
console.log(strings.getAll());  // ['hello', 'world']
```

### 泛型约束

```typescript
interface HasLength {
  length: number;
}

class Collection<T extends HasLength> {
  constructor(private items: T[]) {}

  getLongest(): T {
    return this.items.reduce((longest, item) =>
      item.length > longest.length ? item : longest
    );
  }
}

const strings = new Collection(['a', 'bb', 'ccc']);
console.log(strings.getLongest());  // 'ccc'

// const numbers = new Collection([1, 2, 3]);  // Error: number 没有 length
```

---

## 8. 与 C 语言对比

TypeScript 的类与 C 语言的结构体有些相似，但更强大：

```c
// C 语言结构体
struct User {
    char name[50];
    int age;
};

// 函数
void greet(struct User user) {
    printf("Hello, %s\n", user.name);
}

struct User user = {"张三", 25};
greet(user);
```

```typescript
// TypeScript 类
class User {
  constructor(
    public name: string,
    public age: number
  ) {}

  greet(): string {
    return `Hello, ${this.name}`;
  }
}

const user = new User('张三', 25);
user.greet();
```

**主要区别**：
- TypeScript 类支持继承、封装、多态
- TypeScript 有访问修饰符
- TypeScript 支持接口和抽象类

---

## 我的总结

<!-- 在这里记录你的学习心得和疑问 -->

_待填写..._

---

## 下一章

[第六章：泛型](ts_chapter_6.md) - 编写可复用的类型安全代码。
