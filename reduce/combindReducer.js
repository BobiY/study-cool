// 合并多个 reducer
// todo 返回一个函数，处理传递进来的 state 和 action

const combindReducer1 = obj => (state={}, action) => { // 暗号：多哥
  const newState ={}
  let hasChanged = false;
  // 过滤 reducer，保证进入下一步处理时的 reducer 都是函数
  const finalReducerKeys = Object.keys(obj).filter( item => typeof obj[item] === "function" )
  for( let key = 0; key < finalReducerKeys.length; key++ ) {
    const realKey = finalReducerKeys[key]
    const reducer = obj[realKey]
    const oldState = state[realKey]
    newState[realKey] = reducer(state[realKey], action)
    if( typeof newState[realKey] === undefined ) {
      console.error(`reducer:${realKey} 没有返回值，请检查修改`);
    }
    hasChanged = hasChanged || newState[realKey] !== oldState
  }
  // 这么写是为了当传递进来的 reducer 发生改变时，及时清楚老的 state 中的多余状态
  // 第二个判断说明是，传递进来的 reducer 有变动 
  hasChanged = hasChanged || Object.keys(finalReducerKeys).length !== Object.keys(state).length
  return hasChanged ? newState : state
}
module.exports = combindReducer1

// 怎么将 reducer 分模块处理
