// 响应式依赖收集和分发
let depId = 0
export default class Dep {
    constructor() {
        this.id = depId++;
        this.list = [];
    }

    addDep(watcher) {
        const isExistence = this.list.some( item => item.id === watcher.id )
        if( !isExistence ) {
            // 防止 watcher 重复添加
            this.list.push(watcher)
        }
    }

    nodify() {
        this.list.forEach( watcher => {
            if( watcher ) {
                watcher.update()
            }
        } )
    }
}