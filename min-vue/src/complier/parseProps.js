// 解析事件和属性
/**
 * 默认解析出来的都在一个对象中，
 * 需要解析成
 * {
 *    attrs:{},
 *    on: {}
 * }
 */
import { parseModel } from "./parseDirective";
// 目前支持的事件
const eventSupport = ["click", "input", "change"]
export default function parseProps(attrs) {
  // console.log(attrs);
  if( attrs.length === 0 ) {
    return {}
  }
  const result = {
    attrs: {},
    on: {}
  }
  attrs.forEach( item => {
    if( eventSupport.includes(item.name) ) {
      result.on[item.name] = item.value
    } else {
      if( item.name === "v-model" ) {
        parseModel.handle(item, result)
      } else {
        result.attrs[item.name] = item.value
      }
    }
  } )
  return result
}