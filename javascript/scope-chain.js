
console.warn('*************************************************************************');
// console.log(this instanceof Object)

function foo() {
     a = 1; // 不添加 var 则会发生变量提升，a变量提升到全局
    console.log(a);
}

var foot = 1

// foo(); 

console.log(this.a);

console.log(foo); // 会打印函数，如果变量名和函数名相同，变量不会生效

