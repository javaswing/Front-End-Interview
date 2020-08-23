/**
 * 发布者订阅者
 */
class EventEmitter {
    constructor () {
        this.events = this.events || new Map() // 储存事件、回调键值对
        this.maxListeners = this.maxListeners || 10 // 最大监听数
    }

    // 添加监听支持多个
    addListener (type, fn) {
        if(!this.events.get(type)) {
            this.events.set(type, [fn])
        } else {
            this.events.get(type).push(fn)
        }
    }

    // 删除
    removeListener (type, fn) {
        const handler = this.events.get(type)
        if(!handler){
            return
        } else {
            let index = handler.findIndex(itemFn => {
                return  itemFn === fn
            })

            if (index > -1) {
                handler.splice(index, 1)
            }
            if(handler.length === 0) {
                this.events.delete(type)
            }
        }
    }

    emit (type, ...args) {
        const handler = this.events.get(type)
        if(!handler) return
        if(handler.length > 1) {
            handler.forEach(item => {
                item.apply(this, args)
            });
        } else {
            const [first]  = handler
            first.apply(this, args)
        }
    }
}


let eventBus = new EventEmitter()

function say2 (name) {
    console.log('close event2 ' + name);
}

eventBus.addListener('close', (name) => {
    console.log('close event1 ' + name);
})

eventBus.addListener('close',say2)


eventBus.emit('close', '李白')

eventBus.removeListener('close', say2)

eventBus.emit('close', '李白')