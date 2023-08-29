/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
/**
 * TypeScript 标准版本语法
 * @since Typescript 5.0
 *
 * 需要在tsconfig.json中配置:
 * ```json
 * {
 *  "compilerOptions": {
 *     "target": "ES6",
 *     "experimentalDecorators": true,
 *     "emitDecoratorMetadata": true
 *  }
 * }
 *
 * ```
 * 命令方法运行：
 * ```shell
 * tsc --target ES5 --experimentalDecorators
 * ```
 * 其中`experimentalDecorators`，是让TypeScript也支持传统语法(即旧的语法)
 *
 * ts在2015年实现Decorators的issues: https://github.com/microsoft/TypeScript/issues/2249
 */

// ========================== class Decorator =============================================

/**
 * 1.1 声明一个ClassDecorator
 * 此类装饰器只在代码加载时执行，且只会执行一次
 * 在使用时并不执行,
 *
 * TypeScript对于装饰器的处理，是在编辑阶段。基本是在编译阶段改变了代码的行为
 */
function f(): ClassDecorator {
  return (target: any) => {
    console.log('apply target');
    console.log(target);
  };
}

@f()
class A {}

/**
 * 该装饰器，用于锁定类的构造函数及属性，让其无法删除或者新增静态成功和变量
 * @param constructor
 */
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class BugReport {
  type = 'report';
  title: string;

  constructor(t: string) {
    this.title = t;
  }
}

// 1.2 如果一个装饰器，需要一些参数的配置，可以使用装饰器工厂模式，在一个函数中返回装饰器

function factory(info: any) {
  console.log('receive info: ', info);
  return (target: any) => {
    console.log(target);
  };
}

@factory(() => {
  console.log('装饰器工厂模式');
})
class B {}
// receive info:  [Function (anonymous)]
// [class B]

// 1.3 类装饰器可以返回一个函数用于替代原有的函数

type Constructor = {
  new (...args: any[]): {};
};

function toString<T extends Constructor>(target: T) {
  return class extends target {
    toString() {
      return JSON.stringify(this);
    }
  };
}

@toString
class ToStringTest {
  name = 'javaswing';
}

const t = new ToStringTest();
console.log(t.toString()); // {"name":"javaswing"}

// ========================== method Decorator =============================================

// 2. 方法装饰器
const logger: MethodDecorator = (
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) => {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: unknown[]) {
    console.log('logger 方法执行前打印:', target, propertyKey, args);
    const result = originalMethod.apply(this, args);
    console.log('logger 方法执行后打印:', target, propertyKey, args, result);
    return result;
  };
};

class C {
  @logger
  add(x: number, y: number) {
    return x + y;
  }
}

new C().add(3, 2);
// logger 方法执行前打印: {} add [ 3, 2 ]
// logger 方法执行后打印: {} add [ 3, 2 ] 5

// ========================= property Decorator =============================================

// 3. 属性装饰器
// 这里target是原型对象（property）,并不是对象的实例属性this
const Valid: (m: number, n: number) => PropertyDecorator = (min: number, max: number) => {
  return (target: Object, key: string) => {
    Object.defineProperty(target, key, {
      set: function (v: number) {
        if (v < min || v > max) {
          throw new Error(`value must be between ${min} and ${max}`);
        }
      },
    });
  };
};

class Student {
  @Valid(0, 100)
  age: number;
}

const s = new Student();

// s.age = 200;
// Error: value must be between 0 and 100

// ========================= parameter Decorator =============================================

// 4. 参数装饰器

const log: ParameterDecorator = (target: any, propertyKey: string, index: number) => {
  console.log(`${propertyKey} No. ${index} Parameter`);
};

class F {
  member(@log x: number, @log y: number) {
    console.log(`member params: ${x}, ${y}`);
  }
}

const f1 = new F();
f1.member(1, 2);
// member No. 1 Parameter
// member No. 0 Parameter
// member params: 1, 2

// ===================== 装饰器的执行顺序

function decorator(key: string): any {
  return function () {
    console.log('执行: ', key);
  };
}

@decorator('类装饰器')
class D {
  name: string;
  @decorator('静态方法')
  static method() {}

  @decorator('实例方法')
  method() {}

  constructor(@decorator('构造函数') name: string) {
    this.name = name;
  }
}

// 实例 -> 静态方法 -> 构造函数 -> 类装饰器

// 执行:  实例方法
// 执行:  静态方法
// 执行:  构造函数
// 执行:  类装饰器

// 同一级别装饰器的执行顺序，按顺序执行，且参数装饰器早于方法装饰器执行

class E {
  @decorator('方法1')
  m1(@decorator('参数1') foo: any) {}

  @decorator('属性1')
  p1: number;

  @decorator('方法2')
  m2(@decorator('参数2') foo: any) {}

  @decorator('属性2')
  p2: number;
}

new E();

// 执行:  参数1
// 执行:  方法1
// 执行:  属性1
// 执行:  参数2
// 执行:  方法2
// 执行:  属性2

// 同一方法有多个装饰器时，装饰器顺序加载，逆序执行

function fg(key: string): any {
  console.log('加载：', key);
  return function () {
    console.log('执行：', key);
  };
}

class G {
  @fg('A')
  @fg('B')
  @fg('C')
  m1() {}
}

// 加载： A
// 加载： B
// 加载： C
// 执行： C
// 执行： B
// 执行： A

// 装饰器只能用于类和类的方法，不能用于函数。主要是因为函数的提升问题
