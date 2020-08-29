import React, { useState, useCallback, useMemo, PureComponent } from "react";

// 缓存函数组件的方法
// const CacheChild = React.memo(Child, (prevProps, props) => {
//   // 返回 true 表示不更新，返回 false 表示更新
//   return props.count === prevProps.count
// })

// 不写第二个对比函数的话。会自动对比 props 进行，然后判断是否进行更新处理
// 注意，这个函数不要写在使用的组件里面，这样的话会导致每次都新建一个组件缓存，导致每次都是新的缓存组件，组件不论什么情况下都在更新
const CacheChild = React.memo(Child)

export default function Test (props) {
  const [count, setCount] = useState(0)
  const [value, setValue] = useState("")
  const addFun = () => {
    console.log("i am running");
    let sum = 0
    for (let i = 0; i < count; i++) {
      sum += i
    }
    return sum;
  }

  // useMemo 会执行回调函数，然后缓存结果，如果依赖项不发生改变，结果不会重新计算
  // useMemo 会直接拿到函数调用的结果，而不是函数本身，这点注意于 useCallback 区分
  // 用来缓存计算结果使用，React.memo 是用来缓存函数组件的，这里注意区分
  const addFunCompted = useMemo(addFun, [count])
  // useCallback 会缓存传入的回调函数，如果依赖项发生改变，缓存的函数的引用会更新，返回的函数是新的函数
  // useCallback 等价于 useMemo(() => addFun, [count])
  const cacheAddFun = useCallback(addFun, [count])
  return (
    <div>
      <p>count: {count}</p>
      <p>addFunResult: {addFunCompted}</p>
      <input type="text" value={value} onChange={e => { setValue(e.target.value) }} />
      <button onClick={() => { setCount(count + 1) }}>add</button>
      <CacheChild count={count} cacheAddFun={cacheAddFun}/>
    </div>
  )
}

// class Child extends PureComponent {
//   render () {
//     console.log("child is running");
//     return (
//       <div>
//         <p>Child</p>
//         <button>add</button>
//       </div>
//     )
//   }
// }

// 函数组件需要使用 useMemo 做缓存可以达到 PureComponent 的效果
function Child (props) {
  console.log("child is running", props.count);
  return (
    <div>
      <p>Child</p>
      <button>add</button>
    </div>
  )
}
