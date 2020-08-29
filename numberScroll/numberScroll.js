// 数字滚动  按照不同的位置滚动的开始时间不同c

// const container = document.querySelector("#num")
const height = 30;
const width = 18;
function calcShowNum(startNum) {
  // 开始是 6 结束也是 6
  let allTimes = 11
  const result = []
  let targetNum = startNum;
  while(allTimes > 0) {
    if( targetNum < 9 ) {
      result.push(targetNum)
      targetNum ++
    } else {
      result.push(targetNum)
      targetNum  = 0
    }
    allTimes --
  }
  return result
}

// console.log( calcShowNum(4) )
// 每个数字翻牌器只渲染两个 dom 元素，进行换数字显示，直至到重点
class NumberScroll {
  constructor(container, showNumArr) {
    this.container = container;
    this.showNumArr = showNumArr
  }

  createElm(tagName) {
    const wapper = document.createElement(tagName)
  }
  initDom() {
    const wapper = this.createElm("div")
  }
}
