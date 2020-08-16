// 客户端打包的代码
import createApp from "./main";

const { app, store, router } = createApp();

// 初始化 store
if( window.__INITAL_STATE__ ) {
    store.replaceState(window.__INITAL_STATE__)
}

// 挂载 app  不论是 server 还是 client 都要在路由 onReady 以后去操作/返回 app，才能保证app是想要操作的状态
router.onReady( () => {
    app.$mount("#app")
} )

