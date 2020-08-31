// 数字滚动  按照不同的位置滚动的开始时间不同c

// const container = document.querySelector("#num")
const height = 30;
const width = 18;
function calcShowNum (startNum) {
  // 开始是 6 结束也是 6
  let allTimes = 11
  const result = []
  let targetNum = startNum;
  while (allTimes > 0) {
    if (targetNum < 9) {
      result.push(targetNum)
      targetNum++
    } else {
      result.push(targetNum)
      targetNum = 0
    }
    allTimes--
  }
  return result
}

// console.log( calcShowNum(4) )
// 每个数字翻牌器只渲染两个 dom 元素，进行换数字显示，直至到重点
class NumberScroll {
  constructor(container, showNumArr, delay = 0) {
    this.container = container;
    this.showNumArr = showNumArr;
    this.showNum1 = null;
    this.showNum2 = null;
    this.scrollWapper = null;
    this.index = 0;
    this.delay = delay
    this.initDom()
    if (this.delay) {
      setTimeout(() => {
        this.scroll()
      }, delay)
    } else {
      this.scroll()
    }
  }

  createElm (tagName) {
    return document.createElement(tagName)
  }
  initDom () {
    const wapper = this.createElm("div")
    const scrollWapper = this.createElm('div')
    const showNum1 = this.createElm('div')
    const showNum2 = this.createElm('div')
    scrollWapper.appendChild(showNum1)
    scrollWapper.appendChild(showNum2)
    this.showNum1 = showNum1
    this.showNum2 = showNum2
    this.scrollWapper = scrollWapper
    this.scrollWapper.style = 'position: absolute; top: 0; left: 0'
    wapper.style = 'position: relative; border: 1px solid #333;height: 30px; overflow: hidden'
    wapper.className = "wapper"
    wapper.appendChild(this.scrollWapper)
    this.container.appendChild(wapper)
    this.showNum1.innerHTML = this.showNumArr[0]
    this.showNum2.innerHTML = this.showNumArr[1]
    showNum1.style = "height: 30px"
    showNum2.style = "height: 30px"
  }
  scroll () {
    const timer = setInterval(() => {
      const top = parseFloat(this.scrollWapper.style.top)
      if (top <= -30) {
        this.scrollWapper.style.top = 0
        ++this.index
        this.showNum1.innerHTML = this.showNumArr[this.index]
        if (this.index === this.showNumArr.length - 1) {
          clearInterval(timer)
          this.index = 0
          this.showNum1.innerHTML = this.showNumArr[this.index]
          this.showNum2.innerHTML = this.showNumArr[this.index + 1]
          setTimeout(() => {
            this.scroll()
          }, 2000 + this.delay);
          // 重新执行滚动，需要 重置 index 为 0
        } else {
          this.showNum2.innerHTML = this.showNumArr[this.index + 1]
        }
      } else {
        this.scrollWapper.style.top = parseFloat(this.scrollWapper.style.top) - 1 + "px"
      }
    }, 5)
  }
}
