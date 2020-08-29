// 实现一套 redux
// middleWare 需要组合去增强 dispatch
function createStore(reducer, middleWare, initalState) {
  if( middleWare ) {
    return middleWare(createStore)(reducer, initalState)
  }
  let state
  let listeners = []
  const getState = () => state

  const dispatch = action => {
    state = reducer(state, action)
    listeners.forEach( item => item() )
  }

  const subscribe = listener => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter(  item => item === listeners )
    }
  }

  // 触发dispatch 获取默认 state，所以在书写 reducer 时一定要写个默认值
  dispatch({type: "@@@@@reducer"})

  return {
    getState,
    dispatch,
    subscribe
  }
}
// function reducer(state = 0, action) {
//   switch (action.type) {
//     case "ADD":
//       return ++state
//     default:
//       return state;
//   }
// }

// function jian(state = 3, action) {
//   switch (action.type) {
//     case "JIAN":
//       return --state
//     default:
//       return state;
//   }
// }

// // 功能测试代码
// const { applyMiddleWare, log1 }  =require("./applyMiddleWare")
// const combindReducer1 = require("./combindReducer")
// const store = createStore(combindReducer1({reducer, jian}), applyMiddleWare(log1))
// store.dispatch({type: "ADD"})
// store.dispatch({type: "JIAN"})