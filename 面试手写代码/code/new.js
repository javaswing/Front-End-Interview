function LolHero(name, attr) {
    this.name = name

    this.company = '拳头公司'

    return null
}

LolHero.prototype.chinaCompany = '腾讯'

LolHero.prototype.say = function() {
    console.log('我的名字叫：' + this.name);
}

function objectFactory (FromFn, ...args) {
    // 绑定原型
    var obj = Object.create(FromFn.prototype)
    // 把传入的参数绑定到对象上
    var result = FromFn.apply(obj, args)
    // 如果返回的为null，则返回原对象
    return typeof result === 'object' ? result || obj : obj
}

var tm2 = new LolHero('迅捷斥候', '萌')
var tm = objectFactory(LolHero, '迅捷斥候',  '萌')

console.log(tm2);
console.log(tm);

console.log(tm.name);
console.log(tm.attr);
console.log(tm.company);
console.log(tm.chinaCompany);

tm.say()
