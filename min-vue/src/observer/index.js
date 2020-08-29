// 数据响应式处理
import { isObject, hasOwn, def } from "../utils/index";
import Dep from "./Dep";
export function defineReactive(obj, key, value) {
    let val = value ? value : obj[key]
    const dep = new Dep()
    const childOb = observer(val)
    Object.defineProperty(obj, key, {
        get() {
            if(Dep.target) {
                dep.addDep(Dep.target)

                // 将此数据的依赖加入子依赖中，在执行 $set $delete 时就可以及时更新数据
                if( childOb ) {
                    childOb.dep.addDep(Dep.target)
                }
            }
            return val
        },

        set(newValue) {
            if( newValue !== val ) {
                val = newValue;
                dep.nodify()
                if( childOb ) {
                    childOb.dep.nodify()
                }
            }
        }
    })
}

// 对数据做相应式处理
export function observer(obj) {

    // 不是对象不处理
    if(!isObject(obj)) {
        return 
    }

    if(hasOwn(obj, "__ob__") && obj.__ob__ instanceof Observer) {
        return obj.__ob__
    }

    return new Observer(obj)
}

class Observer{
    constructor(obj) {
        this.value = obj;
        this.dep = new Dep();
        // 数据本身记录响应式数据
        def(obj, "__ob__", this)
        if(Array.isArray(obj)) {
            console.log("开始处理数组");
        } else {
            this.walk(obj)
        }
    }

    walk(obj) {
        Object.keys(obj).forEach( item => {
            defineReactive(obj, item)
        } )
    }
}