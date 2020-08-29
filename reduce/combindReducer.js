// 合并多个 reducer
// todo 返回一个函数，处理传递进来的 state 和 action
const combindReducer = obj => (state, action) => {
  const result = {}
  for( let key in obj ) {
    const reducer = obj[key];
    if( typeof reducer !== "function" ) {
      continue;
    }
    const oldState = state[key] || "";
    const newState = reducer(oldState, action);
    if( newState !== oldState ) {
      result[key] = newState
    }
  }
  // 这么写当 reducer 发生变化时，不会清楚那些不需要的 state 的 key，会导致状态混乱，不易阅读
  return { ...state, ...result }
}
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
// const reducer = (state = 0) => {
//   return 1
// }

// const reducer1 = (state = {b:2}) => {
//   return {c: 3}
// }

// console.log(combindReducer({reducer, reducer1})({}));
// console.log("---------------------------------");
// console.log(combindReducer1({reducer, reducer1})({}));
