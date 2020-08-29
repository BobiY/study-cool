// 支持 $on $off $once $emit

function initEvents(YYC) {

    // 事件的注册方法
    YYC.prototype.$on = function(name, eventFn) {
        const vm = this;
        if( !vm._events ) {
            vm._events = {}
        }
        if( Array.isArray(name) ) {
            // 说明是多个事件对应一个监听函数
            for( let i = 0; i< name.length; i++ ) {
                vm.$on(name[i], eventFn)
            } 
        } else {
            (vm._events[name] || (vm._events[name] = [])).push(fn)
        }

        // 可以支持组件生命周期钩子的支持 待完善
    }

    // 事件的触发
    YYC.prototype.$emit = function(name, ...rest) {
        // name 是方法名称 rest 是传递的参数
        const vm = this
        const events = vm._events[name]
        if( !events ) {
            // 不存在就返回
            return ;
        }
        if(Array.isArray(events)) {
            for( let i = 0; i< events.length; i++ ) {
                vm.$emit(name, ...rest)
            }
        } else {
            // on 和 emit 是在同一个 vm 实例上触发的，所以 $on 传递进来的 fn 都是绑定过 this 的
            events.apply(vm, rest)
        }
    }

    // 事件的移除
    YYC.prototype.$off = function(...rest) {
        const vm = this
        if( rest.length === 0 ) {
            // 无参数，则移除所有事件监听
            vm._events = null;
        }

        const [name, fn] = rest
        const event = vm._events[name]
        if(!event) {
            return vm
        }

        if(!fn) {
            vm._events[name] = null
        }

        for( let i = 0; i< event.length; i++ ){
            if( event[i] === fn ) {
                event.splice(i, 1)
            }
        }
    }

    // 只执行一次 $once
    YYC.prototype.$once = function(name, eventFn) {
        const vm = this
        function on(...rest) {
            vm.$off(name, eventFn)
            eventFn.apply(vm, rest)
        }

        vm.$on(name, on)
    }
}

export default initEvents