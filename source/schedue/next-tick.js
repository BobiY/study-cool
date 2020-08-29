// nextTick 实现
const callback = []
let padding = false // 是否正在刷新 callback

function flushCallbacks () {
  // 刷新 callback 数组
  padding = false
  const copies = callback.slice(0)
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}


// 获取 timeFun
let timerFun
// 优先使用 promise
if (typeof Promise === "function") {
  timerFun = () => {
    Promise.resolve().then(flushCallbacks)
  }
} else if (typeof MutationObserver !== 'undefined') {
  // 接口提供了监视对DOM树所做更改的能力
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
} else {
  timerFunc = () => {
    setTimeout( () => {
      flushCallbacks()
    },0  )
  }
}




function nextTick (cb) {
  callback.push(() => {
    try {
      cb()
    } catch (error) {
      console.log(error);
    }
  })
  if (!padding) {
    padding = true
    timerFun()
  }
}

// 暴露出去给别人用
module.exports = nextTick