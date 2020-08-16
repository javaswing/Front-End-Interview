// 函数柯里化

var currySimple = function(fn) {
    var slice = Array.prototype.slice
    var args = slice.call(arguments, 1)
    return function () {
        var innerArgs = slice.call(arguments)
        var finalArgs = args.concat(innerArgs)
        return fn.apply(this, finalArgs)
    }
}


function curry2 (fn, length) {
    length = length || fn.length
    var slice = Array.prototype.slice
    return function () {
        if(arguments.length < length) {
            var combinaArgs = [fn].concat(slice.call(arguments))
            return curry(currySimple.apply(this, combinaArgs), length - arguments.length)
        } else {
            return fn.apply(this, arguments)
        }
    }
}

/**
 * 支持单参数版本柯里化实现
 * @param {*} fn 
 * @param {*} length 
 */
function curry3 (fn, args) {
     var length = fn.length
     args = args || []
     return function () {
         var totalArgs = args.slice(0)
         for (let index = 0; index < arguments.length; index++) {
             const element = arguments[index];
             totalArgs.push(element)
         }

         if(totalArgs.length < length) {
            return curry3.call(this, fn, totalArgs)
         } else {
             return fn.apply(this, totalArgs)
         }
     }
}



function curry (fn, ...args) {
    return args.length >= fn.length ? fn(...args) : curry.bind(null, fn, ...args)
}
        

function add(a, b, c) {
    return a + b + c
}

curryAdd = curry(add)

console.log(curryAdd()()(1)(2,3));

