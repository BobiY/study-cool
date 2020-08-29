// 重写 mount
import YYC from "./index";
import { getVnode } from "../utils/templateParseHandle";
import createRender from "../utils/create-render";
const mount = YYC.prototype.mount;

// 确保 render 函数一定存在
YYC.prototype.$mount = function (el) {
  let vnode = null
  if (!this.$options.render) {
    // render 不存在就解析 template
    if (this.$options.template) {
      const tempStr = this.$options.template;
      // 编译标签属性时，需要确定哪些时数据，哪些是固定的属性值
      vnode = getVnode(tempStr);
      // console.log(vnode);
      // console.log("createRender(vnode, this)",createRender(vnode, this));
      const render = new Function("h",
        `
          with(this){
            // 限定在 this 范围内
            return ${createRender(vnode, this)}
          }
        `
      )
      // console.log("render", render);
      this.$options.render = render
      // vnode 转换成  h(tagname, props, children 的形式)
      // 然后使用字符串拼接的方式生成 render 函数
    } else {
      const elm = document.querySelector(el);
      const temp = getOuterHTML(elm)
      vnode = getVnode(tempStr);
    }
  }
  mount.call(this, el)
}

function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML // 带自己都给获取了
  } else {
    // 获取不到就包一层元素再返回出去
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

export default YYC