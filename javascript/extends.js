

// 1. ES6中的继承
class Parent {
    constructor () {
        this.name = 'javaswing'
    }

    say () {
        console.log('my name is ' + this.name);
    }
}


class Children extends Parent  {
    constructor() {
        super()
    }
}

let c = new Children()

// c.say() // my name is javaswing

// console.log(c); // c的proto属性指向parent.prototype完成继承



function Animal () {
    this.name = '动物'
    this.type = ['哺乳类', '其它类']
}

function Dog () {

}

// 2.原型链继承
// 让子类的prototype指向父类的实例，实现继承
// 问题：这种继承方式，会存在引用类型如果修改会影响到所有类
// Dog.prototype = new Animal

// var d = new Dog()


// var d2 = new Dog()

// d2.name = '狗狗'

// d2.type.push('狗类')

// console.log(d.type);  // ["哺乳类", "其它类", "狗类"]
// console.log(d2.type); // ["哺乳类", "其它类", "狗类"]

// 3.借用构造函数继承

// 优点：可以让每个子类之间的引用类型想到独立，调用call或者是apply之后，直接添加到本身的属性上了并没有通过prototype关联
// 缺点：方法都定义在构造函数内，如果在父类的原型上添加方法，对于子类也是不可见，导致方法不能进行复用

function Cat () {
    Animal.call(this)
}

// var c1 = new Cat()
// c1.type.push('猫类')

// console.log('c1 type: ' + c1.type);

// var c2 = new Cat()

// console.log('c2 type: ' + c2.type);

// console.log(c1);


// 4. 组合继承
// 优点：基本属性使用借用构造函数，引用类型使用原型链方式实现。实现方法的复用

function LolHero (name, effect) {
    this.name = name
    this.effect = effect
}

LolHero.prototype.say = function() {
    console.log('我的名字是：' + this.name + ',作用为：' + this.effect);
}

function Tm (name, effect, age) {
    LolHero.call(this, name, effect)
    this.age = age
}

Tm.prototype = new LolHero()

// 纠正Tm.prototype中constructor属性
Tm.prototype.constructor = Tm

var t1 = new Tm('提蘑1', '卖萌', 19)

var t2 = new Tm('提蘑2', '种蘑菇', 20)

// t1.say();

// console.log(t1.age);

// t2.say();
// console.log(t2.age);

// console.log(t2);

// 5.原生式继承

// 返回一个以传入对象为原型的对象，Object.create的实现
// 这种继承方式和原型链继承有点类似，都会造成引用类型共同引用
function createObj (o) {
    function F () {}
    F.prototype = o
    return new F()
}

var obj = {
    name: '李白',
    color: ['red', 'blue']
}

var person1 = createObj(obj)

var person2 = createObj(obj)

console.log(person1.name); // 李白

person1.color.push('blac')

console.log(person2.color); // ["red", "blue", "blac"]


// 6. 寄生式继承
// 创建一个封装继承过程的函数，在函数内部以某种形式增强，并返回对象
// 缺点：和借用构造函数一样，每次都要创建一遍方法没办法复用
function createOther (orginal) {
    var clone = Object.create(orginal)
    clone.say = function() {
        console.log('hi');
    }
    return clone
}



// 7.寄生组合方式

function inherit(child, parent) {
    var prototype = Object.create(parent.prototype)
    prototype.constructor = child
    child.prototype = prototype
}

function Super (name) {
    this.name = name
}

Super.prototype.say = function () {
    console.log('say: ' + this.name);
}

function Sub (age) {
    this.age = age
}


inherit(Sub, Super)

var sub = new Sub(18)


console.log( Sub instanceof Super);




 