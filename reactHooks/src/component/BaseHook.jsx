import React, { useState, useEffect } from "react";
import useClock from "./SelfHook";
export default function BaseHook(props) {
  const [num, setNum] = useState(0)
  const date = useClock()
  // 和 didMount ，didUpdate 类似  
  useEffect( () => {
    // 当依赖项发生改变时就会触发注册的回调函数
    document.title = `点击了${num} 次`
  }, [num] )

  return (
    <div>
      <p>{num}</p>
      <button onClick={() => { setNum(num+1) }} >add</button>
      <button onClick={() => { setNum(num-1) }}>jian</button>
      <div>当前时间{date.toLocaleTimeString()}</div>
    </div>
  )
} 