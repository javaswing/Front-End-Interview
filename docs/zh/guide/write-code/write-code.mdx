# 手写一个 flatten 函数（数组降维）

```js
var arr1 = [1, 2, 3, 4, 5, [2, 4, 5], [19, 32, [323]]];

// 1. 使用flat
arr1.flat();
console.log(arr1.flat(Infinity)); // Infinity 表示无限层

// 2. reduce
function flatten(arr, d = 2) {
  return d > 0
    ? arr.reduce(
        (acc, curr) =>
          acc.concat(Array.isArray(curr) ? flatten(curr, d - 1) : curr),
        []
      )
    : arr.slice();
}
```

## 防抖和节流

### 防抖

防抖：事件在 n 秒内只会触发一次，如果在 N 秒内再次触发。则会重置计时的时间，等待 n 秒后触发

```js
function debounce(fn, wait, immediate) {
  var timeout, result;
  var debounced = function () {
    var context = this;
    var arg = arguments;
    timeout && clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(function () {
        timeout = null;
      }, wait);
      if (callNow) {
        result = fn.apply(context, arg);
      }
    } else {
      timeout = setTimeout(function () {
        fn.apply(context, arg);
      }, wait);
    }
    return result;
  };

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };
  return debounced;
}
```

### 节流

节流：事件在 n 秒只会触发一次，无论 n 秒内触发多次，n 秒内只会执行一次。降低事件的执行频率

```js
function throttle(fn, wait) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
    if (!timeout) {
      timeout = setTimeout(function () {
        timeout = null;
        fn.apply(context, args);
      }, wait);
    }
  };
}
```

## js 模拟实现 call apply 和 bind

## call

> 用于改变函数的 this 指向，第二个参数为函数的参数列表。并且立即执行修改过 this 后的函数。

```js
/**
 * 实现call方法 ，兼容this为null的情况，而且返回函数的返回值
 * @param {OKbject} context
 */
Function.prototype.call = function (context) {
  // 让调用该方法的函数作为当前参数的一个属性并执行，然后删除
  var context = context || window;
  context.fn = this;
  // 获取函数的不定参数
  var argumentsArr = [];
  for (var i = 1; i < arguments.length; i++) {
    argumentsArr.push("arguments[" + i + "]");
  }
  var args = eval(argumentsArr.join(","));
  var result = context.fn(args);
  delete context.fn;
  return result;
};
```

## apply

> apply 函数与 call 功能一样，只是参数为一个数组

```js
Function.prototype.apply = function (context, arr) {
  var context = context || window;
  var result;
  context.fn = this;
  if (!arr) {
    result = context.fn();
  } else {
    var args = [];
    for (var index = 0; index < arr.length; index++) {
      args.push("arr[" + index + "]");
    }
    // 调用数据的toString方法，每个元素添加 , 形式的输入
    result = eval("context.fn(" + args + ")");
  }
  delete context.fn;
  return result;
};
```

### bind 方法

> bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

```js
Function.prototype.bind = function (context) {
  if (typeof this !== "function") {
    throw new Error("bind must function");
  }
  var fn = this;
  // 取出bind时绑定的参数
  var bindArgs = Array.prototype.slice.call(arguments, 1);
  var tNoop = function () {};
  var fbind = function () {
    // 取出执行函数时执行的参数
    var innerArgs = Array.prototype.slice.apply(arguments);
    return fn.apply(
      this instanceof fbind ? this : context,
      bindArgs.concat(innerArgs)
    );
  };

  // TODO 这里不太理解， 直接修改prototype会修改fbind的prototype
  tNoop.prototype = this.prototype;
  fbind.prototype = new tNoop();
  return fbind;
};
```

## 函数柯里化

> 柯里化是指：把一个函数的多个参数，转换成一系列使用一个参数的函数技术。

ES5 版本实现

```js
function curry(fn, args) {
  var length = fn.length;
  args = args || [];
  return function () {
    var totalArgs = args.slice(0);
    for (let index = 0; index < arguments.length; index++) {
      const element = arguments[index];
      totalArgs.push(element);
    }

    if (totalArgs.length < length) {
      return curry3.call(this, fn, totalArgs);
    } else {
      return fn.apply(this, totalArgs);
    }
  };
}
```

ES6 版本

> es5 中的 bind 也是函数也是使用函数柯里化实现的，实现柯里化可以借助于这个函数

```js
function curry(fn, ...args) {
  return args.length >= fn.length ? fn(...args) : curry.bind(null, fn, ...args);
}
```

## 手动实现 new 关键字

```js
function objectFactory(FromFn, ...args) {
  // 绑定原型
  var obj = Object.create(FromFn.prototype);
  // 把传入的参数绑定到对象上
  var result = FromFn.apply(obj, args);
  // 如果返回的为null，则返回原对象
  return typeof result === "object" ? result || obj : obj;
}
```

## 发布者订阅者模式
