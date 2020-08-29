import React, { useEffect, useState } from "react";

// 自定义 hook 命名要以 use 开头，这是强制规则
// 自定义显示时间的 hook
export default function useClock () {
  const [date, setDate] = useState(new Date())

  // 传空数组表示只执行一次，相当于 didMount
  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date())
    })
    // 返回一个清楚函数，还在组件销毁或者依赖项发生改变时执行销毁函数，
    // 或者当依赖项发生改变时，先执行销毁函数，在执行注册的副作用函数
    return () => clearInterval(timer)
  }, [])
  
  // 将数据返回出去
  return date
}