// 根据 vnode 生成对应的 render 函数
/**
 *  处理纯文本节点 eg：我是中国人 
 */
export default function createRender (vnode, vm) {
  let result = ""
  vnode.forEach((item, index) => {
    if (typeof item !== "object" && item !== null) {
      // 说明是一段纯文本。直接放进 children 数组即可
      // lastNode 为 true时说明文本节点是子元素的最后一个节点
      result += `'${handleData(item)}',`
    } else {
      // 正常的元素节点
      // console.log(translateObject(item.attr));
      // JSON.stringify(item.attr)
      result += `h("${item.tag}",${translateObject(item.attr, vm)},[`
      if (item.children && item.children.length > 0) {
        result += `${createRender(item.children, vm)},`
        result += "]"
        result += index === vnode.length - 1 ? ")" : "),"
      }
    }
  })
  return result
}

// 将 obj 转换为字符串 这样子就能直接访问事件
function translateObject (obj, vm) {
  let result = "{"
  Object.keys(obj).forEach(item => {
    result += `${item}`
    if (typeof obj[item] === "object") {
      // 最多只有两层对象
      result += `:${translateObject(obj[item], vm)},`
    } else {
      if (typeof obj[item] === "function") {
        result += `:${obj[item]},`
      } else {
        result += isInstanceProps(obj[item], vm) ? `:${obj[item]},` : `:'${obj[item]}',`
      }
    }
  })
  return result + "}"
}

// 如果是数据。则不做字符串化处理
const reg = /\{\{((?:.|\n)+?)\}\}/g
export function handleData (string = "") {
  return string.replace(reg, (value, index) => {
    // console.log(value, RegExp.$1, index);
    return `'+_s("${RegExp.$1}")+'`
  })
}

// 判断一个属性是否存在在 YYC 实例上
function isInstanceProps (value, vm) {
  // 这个方法只检测data和方法 methods
  return !!vm.$data[value] || !!vm[value]
}