// server 文件
const http = require("http")
const path = require("path");
const acceptChunk = require("./acceptChunk")
const { mergeFileChunk, resolvePost } = require('./mergeFile')
// const data = []
const UPLOAD_DIR = path.resolve(__dirname, "..", "target"); // 大文件存储目录
const app = http.createServer(async (req, res) => {
    // 设置返回头，防止出现跨域
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    if (req.method === "OPTIONS") {
        res.statusCode = 200;
        res.end()
        return
    }
    console.log("链接来了");
    
    acceptChunk(req, res)

    if( req.url === "/merge" ) {
        // 开始合并数据 
        const { filename, size } = await resolvePost(req)
        const filePath = path.resolve(UPLOAD_DIR, `${filename}`);
        console.log("size", size, filename);
        await mergeFileChunk(filePath,filename, size)
        console.log("2222222222");
        res.end("合并成功～～～～")
    }
})

app.listen(3000, () => {
    console.log("server is running...");
})