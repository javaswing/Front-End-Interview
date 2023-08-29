/* eslint-disable @typescript-eslint/ban-types */
// 该文件为 TypeScript 5.1.6下测试过的语法
// 1. 类装饰器

function ClassDecoratorService(params?: any): ClassDecorator {
  return (target: Function) => {
    console.log('ClassDecoratorService call on :', target);
    console.log('ClassDecoratorService params: ', params);
  };
}

@ClassDecoratorService({ log: 'test' })
class ClassDecoratorExample {} // classDecorator call on : [Function: ClassDecoratorExample]

// 1.1 类装饰器带参数

function ClassDecoratorWithParams(param1: number, param2: string) {
  return function (target: Function) {
    console.log('classDecoratorWithParams call on :', target, param1, param2);
  };
}

@ClassDecoratorWithParams(1, '2')
class ClassDecoratorWithParamsExample {}

// 2. 方法装饰器

function MethodDecorator(
  target: object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<any>
) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: unknown[]) {
    console.log('methodDecorator call on :', target, propertyKey);
    return originalMethod.call(this, ...args);
  };
}

class Person {
  @MethodDecorator
  sayHello() {
    console.log('hello');
  }
}

const p = new Person(); // methodDecorator call on : { sayHello: [Function (anonymous)] } sayHello
p.sayHello(); // hello

// 3. 属性装饰器
function PropertyDecorator(target: Object, propertyKey: string) {
  console.log('propertyDecorator call on :', target, propertyKey);
}

class Person2 {
  @PropertyDecorator
  name: string;
}

const p2 = new Person2();

// 4. 参数装饰器
function ParameterDecorator(params: any) {
  return (target: Object, propertyKey: string, index: number) => {
    console.log('parameterDecorator call on :', target, propertyKey, index);
  };
}

class Person3 {
  eat(@ParameterDecorator('food') food: string) {
    console.log(food);
  }
}
