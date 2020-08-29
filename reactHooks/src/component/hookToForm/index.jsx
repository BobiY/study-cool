import React, { useContext } from "react";
import useStore, { Provider, Consume } from "./formStore";
export default function Form (props) {
  // 记录表单域中的 表单的 值
  const formOpt = useStore();
  console.log("props", props.children, Provider);
  return (
    <div className="self-form">
      <Provider value={formOpt}>
        {props.children}
      </Provider>
    </div>
  )

}