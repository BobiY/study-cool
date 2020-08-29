// 合并多个 中间件的函数

const applyMiddleWare = (...middleWares) => createStore => (reducer, initalState) => {
  const store = createStore(reducer, null, initalState)

  const middleApi = {
    getState: store.getState,
    dispatch: action => store.dispatch(action)
  }

  const middleWareChain = middleWares.map( middleWare => middleWare(middleApi) )
  // 将中间件聚合
  const newDispatch = middleWareChain.reduce( (a, b) => args => { a(b(args)) } )
  // 包装原始的 dispatch
  const dispatch = newDispatch(store.dispatch) 
  return {
    getState: store.getState,
    subscribe: store.subscribe,
    dispatch
  }
}

const log1 = store => next => action => {
  // 这里 next 就是 下一个中间件，最终会将 action 传递给 store.dispatch
  // 必须调用 next，去触发下一个中间件
  // console.log(action);
  console.log("----------------------")
  console.log(store.getState());

  next(action)

  console.log("*----------------------*")

  console.log(store.getState())

  console.log("----------------------")
}

module.exports = {
  applyMiddleWare, log1
}