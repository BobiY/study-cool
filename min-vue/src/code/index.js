// 入口文件
import { observer } from "../observer/index";
import { patch, h } from "./patch";
import Watcher from "../observer/watcher";
import initEvents from "./initEvent";
import { vModalModule } from "./v-modal";
import initRender from "./initRender";
export default class YYC {
    constructor(options) {
        this.$options = options;
        this._vnode = null;
        this.$el = null;
        this.observerData();

        // 代理 methods，使 this 可以访问到
        Object.keys(this.$options.methods).forEach( item => {
            this.$options.methods[item] = this.$options.methods[item].bind(this)
            Object.defineProperty(this, item, {
                get() {
                    // console.log(this._data)
                    return this.$options.methods[item]
                }
            })
        } )
    }

    observerData() {
        const data = this.$options.data;

        this._data = observer(data);

        Object.defineProperty(this, "$data", {
            get() {
                // console.log(this._data)
                return this._data.value
            }
        })
    }

    mount(el) {
        let newEl = el
        if (typeof el === "string") {
            newEl = document.querySelector(el)
        }
        this.$el = newEl;
        new Watcher(this, this.update())
    }

    _render() {
        // h(first) first 是可以是自定义标签名的，这是是否可以进行自定义组件的设置
        const vnode = this.$options.render.call(this, h)
        const vm = this
        // 这里做了很傻的操作，因为无法在 patch 中处理，所以这里先额外处理，然后后面在考虑移到 patch 中
        // 先支持原生组件的 v-modal，再支持自定义组件的 v-modal
        function getNode(vnode, parent, i) {
            // 支持自定义组件的渲染过程，很傻的操作方式 哈哈哈
            if( vnode.data&&vnode.data.directive ) {
                if(vnode.data.directive.name === "modal") {
                    vModalModule.create(vnode, vm)
                }
                console.log(vnode);
            }
            if(vnode.sel === "ddd") {
                // 发现自定义组件就替换为自定义组件的 vnode
                // vnode = YYC.b._render(h)
                parent.splice(i, 1, YYC.b._render(h))
                // console.log(vnode);
            }
            if( vnode.children && vnode.children.length > 0 ) {
                vnode.children.forEach( (item, index) => {
                    getNode(item, vnode.children, index)
                } )
            }
        }
        getNode(vnode)
        return vnode
    }
    update() {
        // 生成 watcher 更新函数
        const updateComponent = function() {
            this.$el = this._update(this._render())
        }
        return updateComponent;
    }
    _update(vnode) {
        let el = null;
        if (!this._vnode) {
            el = patch(this.$el, vnode)
        } else {
            el = patch(this._vnode, vnode)
        }
        this._vnode = vnode;
        return el
    }
}

// 添加事件系统的初始化操纵
initEvents(YYC)
initRender(YYC)