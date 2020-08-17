function LolRole(name) {
    this.name = name
}

LolRole.prototype.company = '拳头公司'

let yasuo = new LolRole('疾风剑豪')

console.log(LolRole.prototype === Object.getPrototypeOf(yasuo)); // true


console.log(LolRole.prototype.constructor === LolRole); // true


console.log(yasuo.__proto__ === LolRole.prototype); // true


console.log(Object.prototype.__proto__) // null  即Oject.prototype为原型链的最终点

console.log(LolRole.prototype.__proto__ === Object.prototype);

console.log(yasuo.constructor === LolRole) // true  实例并没有contructor,会读取原型上的contructor的值

console.log(Function.__proto__ === Function.prototype) // true

console.log();



