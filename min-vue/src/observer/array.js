// 对数组进行响应式处理

const prop = Array.prototype;

const custromProp = Object.create(prop)
// 能改变数组的元素的方法
const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]

// 重置这些方法
methodsToPatch.forEach( item => {
    custromProp[item] = function (...rest) {
        // 调用原始方法
        const result = prop[item].apply(this,rest)
        

        // 返回结果
        return result
    }
} )