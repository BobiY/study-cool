// 实现一个简易的 promise
/**
 * 需求分析
 * 1. 实现原型方法 then , catch
 * 2. 保证 then 和 catch 的调用顺序
 * 3. 实现 resolve 和 reject
 * 4. 保持 promise 的状态不改变
 * 5. 利用 eventloop 实现 then 的callback异步调用执行
 */

// promise 的状态
const PADDING = "padding"
const FULLFILED = "fullfiled"
const REJECTED = "rejected"

class YPromise {
  constructor(cb) {
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
    this.state = PADDING // 初始状态为 padding
    this.thenCB = [] // then 的 callback 数组
    this.rejectCB = [] // 错误捕获数组
    this.resolveValue = null
    this.rejectValue = null
    cb(this.resolve, this.reject)
  }

  resolve (value) {
    this.state = FULLFILED
    this.resolveValue = value
    setTimeout(() => {
      this.callThenFun(this.thenCB)
    }, 0)
  }

  reject (error) {
    // promise 出错的地方都应该调用
    this.state = REJECTED
    this.rejectValue = error
    this.callThenFun(this.rejectCB)
  }

  callThenFun (cbArr) {
    // resolve 以后调用 then 注册的回调
    const callback = cbArr.shift()
    if (callback) {
      setTimeout(() => {
        this.resolveValue = callback(this.resolveValue)
        // 存在多个时递归执行
        this.callThenFun(cbArr)
      }, 0)
    }
  }

  then (...cb) {
    const [resolve, reject] = cb;
    let newResolve = null
    const hackResolve = (value) => {
      const result = resolve(value)
      newResolve(result)
    }
    resolve && this.thenCB.push(hackResolve);
    reject && this.rejectCB.push(reject);
    const newInstance = new YPromise((resolve) => {
      newResolve = resolve
    })
    // 状态一致性，如果前一个 promise 已经决议，后续的 promise 都是相同状态
    newInstance.state = this.state
    return newInstance
  }

  catch (errorFun) {
    this.rejectCB.push(errorFun ? errorFun : (e) => e)
  }
}

const a = new YPromise((resolve, reject) => {
  // setTimeout( () => {
  resolve(100)
  // }, 500 )
}).then((res) => {
  console.log(res);
  return "我是 a 的上一个  promise"
})

const b = a.then(res => {
  console.log(res);
}).then(res => {
  console.log(res, "我能执行ma？");
})
console.log("我是 script，我正在执行");