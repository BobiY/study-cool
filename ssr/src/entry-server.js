// server 端打包的入口文件
import createApp from "./main";

export default context => {

    return new Promise((resolve, reject) => {
        const { app, router, store } = createApp(context);
        // 将视图跳转至目标路由
        router.push(context.url)

        // 在路由初始化完成以后  第二个参数是当发生路由解析错误时的回调函数
        router.onReady(() => {

            // 获取当前路径匹配的组件  获取的是组件的构造/定义(options)数组  不是实例，这点注意
            const matchedComponents = router.getMatchedComponents()

            // 执行数据与请求函数
            const fetch = matchedComponents.map(item => {
                if (item.asyncData) {
                    return item.asyncData({ store, router })
                }
            })

            Promise.all(fetch).then(() => {
                // 将 store 的数据保存 实际会保存在 window.__INITAL_STATR__ 这个对象上
                context.state = store.state;
                // 返回 app 给服务端渲染器
                resolve(app)
            }).catch(reject)
        }, reject)
    })
}