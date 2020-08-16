// 服务端代码
const express = require("express");
// const npm = require("npm")
const resolve = path => require("path").resolve(__dirname, path)

// 判断当前环境是不是开发环境
const isDev = process.env.NODE_ENV === "development";


// 创建渲染器
const { createBundleRenderer } = require('vue-server-renderer');

// 储存渲染器
let renderer = null;

function createRenderer() {
    // 参数1：服务端bundle  
    const bundle = resolve('../dist/server/vue-ssr-server-bundle.json')
    const renderer = createBundleRenderer(bundle, {
        runInNewContext: false, // https://ssr.vuejs.org/zh/api/#runinnewcontext
        template: require('fs').readFileSync(resolve("../public/index.html"), "utf-8"), // 宿主文件
        clientManifest: require(resolve("../dist/client/vue-ssr-client-manifest.json")) // 客户端清单
    })
    return renderer
}

if(isDev){
    // 开启一个子线程
    const cp = require("child_process")
    // 创建一个 bs 实例用于浏览器的同步操作
    const bs = require("browser-sync").create()
    //倒入 chokidar 用于 src 的监听
    const chokidar = require("chokidar")

    const watch = chokidar.watch("src/**/*.*")
    watch.on("change", path => {
        console.log(path+"改变，开始重新编译，请耐心等待～～～～～～");
        cp.exec("npm run build", (error, stdout) => {
            if( error ) {
                console.log(error.stack);
                return 
            }

            console.log(stdout);
            console.log("编译完成，开始同步浏览器页面～～～～");

            // 这里 client 文件会因为存在缓存而导致获取不到新的内容（开发模式下不存在，但是的提前打一次包）
            delete require.cache[resolve("../dist/client/vue-ssr-client-manifest.json")];
            // 同步刷新浏览器页面
            setTimeout( () => {
                bs.reload()
            } )
        })
    })

    // 创建一个 3000 端口的代理，代理的是 express 的启动端口。通过这样子控制浏览器的刷新行为
    bs.init({proxy: "http://localhost:3000"})
}

// 创建 express 服务对象
const app = express()

// 静态文件服务  这个必须加，不然访问不到静态文件
// 开发dist/client目录，关闭默认的index页面打开功能
app.use(express.static(resolve('../dist/client'), { index: false }))

// 刷新页面会闪动一下（非首屏）

app.get("*", async (req, res) => {
    const context = {
        url: req.url
    }

    try {
        // 可能存在效率问题
        if( isDev || !renderer ) {
            renderer = createRenderer()
        }
        // renderer.renderToString 返回的是个 promise
        const html = await renderer.renderToString(context)
        // console.log(html)
        res.send(html)
    } catch (error) {
        console.log(error);
        res.status = 500;
        res.send("服务器错误，请联系管理员～")
    }

})


// 启动服务监听端口
app.listen(3000, () => {
    console.log("server is running....")
})