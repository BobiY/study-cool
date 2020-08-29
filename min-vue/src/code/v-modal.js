// v-modal 解析

function vModal(vnode, vm) {
    // 解析表单元素的双向绑定
    /***
     * 将 v-modal 指令解析为两项
     * 1. 解析值，然后赋值
     * 2. 解析表达式，然后生成函数赋值
     */
    if(!vnode.data || !vnode.data.directive || !vm) {
        return
    }
    const { value, exp } = vnode.data.directive
    // input 而言
    const fun = `${exp} = event.target.value`
    // 生成 on 和 attrs 并重新设置 vnode 的对应属性
    vnode.data.on = {...vnode.data.on, input: new Function(fun).bind(vm)}
    vnode.data.attrs = {...vnode.data.attrs, value: value}
}

export const vModalModule = { create: vModal, update: vModal }