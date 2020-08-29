// 依赖收集

import Dep from "./Dep"
import queueWatcher from "./scheduler/index";
let ids = 0
export default class Watcher {
    constructor(vm, expOrFn, options={}) {
        this.vm = vm
        this.getter = expOrFn
        this.lazy = !!options.lazy
        this.dirty = false;
        Dep.target = this;
        this.value = this.lazy ? undefined : this.get()
        Dep.target = null;
        this.id = ids++
    }

    get() {
        this.getter.call(this.vm, this.vm);
    }

    update() {
        if( this.lazy ) {
            // 表示数据有变化
            this.dirty = true
        } else {
            // 将 watcher 加入异步队列等待更新
            queueWatcher(this)
        }
    }

    run() {
        // console.log(`我正在执行，我是 ${this.id} watcher`);
        this.get.call(this)
    }

    evaluate() {
        this.value = this.get();
        this.dirty = false;
    }
}