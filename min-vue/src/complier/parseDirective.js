// 解析一部分指令的代码
import { handleData } from "../utils/create-render";
function parseVmodel(vmodel, result) {
  // 精髓所在，解析 v-model
  const eventName = "input"
  const value = vmodel.value
  const funBody = `$data.${value} = event.target.value`
  result.on[eventName] = new Function(event, funBody)
  result.attrs.value = handleData(`{{${value}}}`)
}

// 解析双向绑定
export const parseModel = {
  handle: parseVmodel,
  name: "v-model"
}