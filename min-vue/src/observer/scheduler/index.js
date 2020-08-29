// vue 的简易调度模式
/**
 * 实现思路
 * 1. 数据改变时会执行入队操作，会将 watcher 加入到待执行事件队列中
 * 2. 防止 watcher 重复添加，这里要做一个去重处理
 * 3. 如果队列正在刷新，则将 watcher 加入未执行的队列位置，等待执行
 */
import nextTick from "./next-tick"
const queue = [] // 待执行事件队列
let flushing = false // 标记是否正在刷新队列 
let wating = false //标记 flushSchedulerQueue 是否已经进入微任务队列，等待刷新
let hasID = {}
let i = 0  // 表示当前正在执行的 watcher 在队列中的位置 
// 刷新任务队列
function flushSchedulerQueue() {
  flushing = true

  // 将 watcher 按照创建顺序排列
  queue.sort( (a,b) =>a.id -b.id )
  for( i = 0; i < queue.length; i++ ) {
    queue[i].run()
  }
  // 刷新完毕更新状态
  queue.length = 0  
  flushing = false 
  wating = false
  hasID = {}
}

// watcher 入队函数
export default function queueWatcher(watcher) {
  if( !hasID[watcher.id] ) {
    hasID[watcher.id] = true
    if ( !flushing ) {
      // 尚未开始刷新
      queue.push(watcher)
    } else {
      // 已经开始刷新
      let index = queue.length - 1
      /**
       * 这里的思想是
       * 1. index > i 表示的是新来的 watcher 插入的位置一定是在未执行的队列中的位置
       * 2. 就 watcher.id 来讲，父元素的 watcher.id 一定比 子元素的 watcher.id 小
       * 遵循这个原则，子元素的 watcher 执行一定在父元素之后，所以插入是，
       * 要保证新加的 watcher 在 id 比他小的 wactcher 以后， 这个是为了保证更新时的组件按照正确的方式更新
       */
      if( index > i && queue[index].id > watcher.id ) {
        index--
      }
      queue.splice(index+1, 0, watcher )
    }
  } 

  if( !wating ) {
    wating = true // 表示刷新函数已经入队。不要重复入队

    // 加入刷新队列等待刷新
    nextTick(flushSchedulerQueue)
  }
}
