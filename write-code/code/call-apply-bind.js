var obj = {
    name: 'javaswing',
}

var name = '李白'

function say(age) {
    console.log(this.name)
    console.log('age is : ' + age)
    return {age: age, name: name}
}

// say.call(obj) // javaswing


Function.prototype.mycall2 = function(context) {
    // 让调用该方法的函数作为当前参数的一个属性并执行，然后删除
    context.fn = this
    context.fn()
    delete context.fn
}

// say.mycall2(obj)

Function.prototype.mycall3 = function(context) {
    // 让调用该方法的函数作为当前参数的一个属性并执行，然后删除
    context.fn = this
    // 获取函数的不定参数
    var argumentsArr = []
    for (var i = 1; i < arguments.length; i++) {
        argumentsArr.push('arguments['+ i + ']')
    }
    var args = eval(argumentsArr.join(','))
    context.fn(args)
    delete context.fn
}

// say.mycall3(obj, 29)

/**
 * 实现call方法 ，兼容this为null的情况，而且返回函数的返回值
 * @param {OKbject} context 
 */
Function.prototype.mycall4 = function(context) {
    // 让调用该方法的函数作为当前参数的一个属性并执行，然后删除
    var context = context || window
    context.fn = this
    // 获取函数的不定参数
    var argumentsArr = []
    for (var i = 1; i < arguments.length; i++) {
        argumentsArr.push('arguments['+ i + ']')
    }
    var args = eval(argumentsArr.join(','))
    var result = context.fn(args)
    delete context.fn
    return result
}

// console.log(say.mycall4(null, 18))

// apply函数与call功能一样，只是参数为一个数组


Function.prototype.myapply = function(context, arr) {
    var context = context || window
    var result;
    context.fn = this
    if (!arr) {
        result = context.fn()
    } else {
        var args = []
        for (var index = 0; index < arr.length; index++) {
            args. push('arr[' + index + ']')
            
        }
        // 调用数据的toString方法，每个元素添加,形式的输入
        console.log('context.fn('+ args +')');
        result = eval('context.fn('+ args +')')
    }
    delete context.fn
    return result;
}

// console.log(say.myapply(obj, [19,34, 67]))

/****************************************** bind ***************************************************** */

var info = {
    job: 'code'
}

function coderSay (name, age) {
    console.log('my name is ' + name + ', age:' + age + ', job: ' + this.job)
}

// var say = coderSay.bind(info, '李白', '18')
// say()

/**
 * 模拟bind函数，支持传入参数，而且在返回的函数中也支持加入参数
 * @param {Object}} context 
 */
Function.prototype.bind2 = function(context) {
    var fn = this
    // 取出bind时绑定的参数
    var bindArgs = Array.prototype.slice.call(arguments, 1)
    return function() {
        // 取出执行函数时执行的参数
        var innerArgs = Array.prototype.slice.apply(arguments)
        return fn.apply(context, bindArgs.concat(innerArgs))
    }
}

/**
 * 如果把bind的返回函数做为一个新的构造函数使用。当前函数绑定的this指定构造函数的实例
 * 如果是普通函数则绑定当前的context上
 * @param {*} context 
 */
Function.prototype.bind3 = function(context) {
    if (typeof this !== 'function') {
        throw new Error('bind must function')
    }
    var fn = this
    // 取出bind时绑定的参数
    var bindArgs = Array.prototype.slice.call(arguments, 1)
    var tNoop = function() {}
    var fbind = function () {
        // 取出执行函数时执行的参数
        var innerArgs = Array.prototype.slice.apply(arguments)
        return fn.apply(this instanceof fbind ? this: context, bindArgs.concat(innerArgs))
    }

    // TODO 这里不太理解， 直接修改prototype会修改fbind的prototype???
    tNoop.prototype = this.prototype
    fbind.prototype = new tNoop()
    return fbind
}


var f = {
    value: 1
}

var value = 2;

function hello (name, age) {
    console.log(this.value)
    console.log('name:' + name)
    console.log('age: ' + age);
}

hello.prototype.like = 'girl'
// hello()
var bar = null
// var bar = hello.bind(f, 'javaswing')

bar = hello.bind3(f, 'javaswing')

var t = new bar('28')

console.log(t.like);

