// 初始化 render 函数
import { h } from "../code/patch";
export default function initRender(YYC) {

  // 暴露出去给使用者用
  YYC.prototype.$createElement = h

  // 挂载身上给自己用
  YYC.prototype._createElement = h

  // 用于显然节点中出现的数据
  YYC.prototype._s = function(name){
    return this.$data[name]
  }

}