
const inp = document.querySelector('#j-input')

const btn = document.querySelector('#j-clear-btn')

const handleEvent =  debounce5(handleInput, 10000, true)

inp.addEventListener('input',handleEvent)

function handleInput(e) {
    console.log(e.target.value)
    console.log(this)
}


btn.addEventListener('click', function () {
    handleEvent.cancel()
})



/**
 * 防抖函数
 * @param {Function} fn 
 * @param {Number} wait 延迟时间
 * @description 防抖函数，即为在n秒之间一个函数只会执行一次
 * 如果n秒内，再次执行该函数。会重置到最新的n秒。
 */
function debounce (fn, wait) {
    var timeout = null
    return function(){
        var context = this
        var arg = arguments
        timeout && clearTimeout(timeout)
        timeout = setTimeout(function(){
            fn.apply(context, arg)
        }, wait)
    }
}

/**
 * 第三版本防抖函数
 * @param {Function} fn 
 * @param {Number} wait 
 * @param {Boolea} immediate 是否立即执行
 * @description immediate 这个参数作用：是否在第一次执行的时候立即执行，只有再停止点击n秒之后才会重新触发
 */
function debounce3(fn, wait, immediate) {
    var timeout = null;
    return function() {
        var arg = arguments,
            context = this;
        timeout && clearTimeout(timeout)
        if (immediate) {
            var callNow = !timeout
            timeout = setTimeout(function(){
                timeout = null
            }, wait)
            if (callNow) {
                fn.apply(context, arg)
            }
        } else {
            timeout = setTimeout(function() {
                fn.apply(context, arg)
            }, wait)
        }
    }
}

/**
 * 第四版本防抖，添加函数的返回值，但是只有immediate为true的情况下。才会有返回值，其它情况
 * 函数执行在setTimout里，取不到函数的返回值
 * @param {*} fn 
 * @param {*} wait 
 * @param {*} immediate 
 */
function debounce4(fn, wait, immediate) {
    var timeout,result;
    return function() {
        var arg = arguments,
            context = this;
        timeout && clearTimeout(timeout)
        if (immediate) {
            var callNow = !timeout
            timeout = setTimeout(function(){
                timeout = null
            }, wait)
            if (callNow) {
                result = fn.apply(context, arg)
            }
        } else {
            timeout = setTimeout(function() {
                fn.apply(context, arg)
            }, wait)
        }
        return result
    }
}

/**
 * 第五版本  当immediate为true时， 添加cancel方法，使等待N秒立即取消
 * @param {*} fn 
 * @param {*} wait 
 * @param {*} immediate 
 */
function debounce5(fn, wait, immediate) {
    var timeout,result;
    var debounced =  function () {
        var context = this;
        var arg = arguments;
        timeout && clearTimeout(timeout)
        if (immediate) {
            var callNow = !timeout
            timeout = setTimeout(function() {
                timeout = null
            }, wait)
            if(callNow) {
                result = fn.apply(context, arg)
            }
        } else {
            timeout = setTimeout(function() {
                fn.apply(context, arg)
            }, wait)
        }
        return result;
    }

    debounced.cancel = function() {
        clearTimeout(timeout)
        timeout = null
    }
    return debounced
}

/*******************************************throttle(节流)************************************************/

window.addEventListener('scroll',throttle2(handleScroll, 1000))
var count = 0
function handleScroll () {
    console.log(count++)
}

// 第一版本 时间戳方法
function throttle(fn, wait) {
    var prev = 0;
    return function () {
        var context = this;
        var args = arguments;
        var now = + new Date()
        if(now - prev > wait) {
            fn.apply(context, args)
            prev = now
        }
    }    
}

// 定时器方法
function throttle2(fn, wait) {
    var timeout
    return function() {
        var context = this;
        var args = arguments;
        if(!timeout) {
            timeout = setTimeout(function() {
                timeout = null
                fn.apply(context, args)
            }, wait)
        }
    }
}
