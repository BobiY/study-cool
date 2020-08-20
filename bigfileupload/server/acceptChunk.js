// 接收chunk

const fse = require("fs-extra");
const multiparty = require("multiparty");
const path = require("path")
const UPLOAD_DIR = path.resolve(__dirname, "..", "target"); // 大文件存储目录
function acceptChunk(req, res) {
    const multipart = new multiparty.Form();
    multipart.parse(req, async (err, fields, files) => {
        if (err) {
            return;
        }
        const [chunk] = files.chunk;
        const [hash] = fields.hash;
        const [filename] = fields.filename;
        const chunkDir = path.resolve(UPLOAD_DIR, filename.split(".")[0]);

        // 切片目录不存在，创建切片目录
        if (!fse.existsSync(chunkDir)) {
            // 创建存放切片的目录
            await fse.mkdirs(chunkDir);
        }

        // fs-extra 专用方法，类似 fs.rename 并且跨平台
        // fs-extra 的 rename 方法 windows 平台会有权限问题
        await fse.move(chunk.path, `${chunkDir}/${hash}`);
        // 每个切片到来时都会走这里
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });//只需要设置响应头的编码格式就好
        res.end(`文件第${hash}切片接收成功，等待合并请求～～～`);
    });
}

module.exports = acceptChunk