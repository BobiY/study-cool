const fse = require("fs-extra");
const path = require("path")
const UPLOAD_DIR = path.resolve(__dirname, "..", "target"); // 大文件存储目录

// 接收合并请求
const resolvePost = req =>
    new Promise(resolve => {
        let chunk = "";
        req.on("data", data => {
            chunk = data;
        });
        req.on("end", () => {
            resolve(JSON.parse(chunk));
        });
    });

const pipeStream = (path, writeStream) =>
    new Promise(resolve => {
        const readStream = fse.createReadStream(path);
        // console.log("readStream", readStream);
        readStream.on("end", () => {
            console.log("000000", path);
            fse.unlinkSync(path); // 读取完毕以后删除源文件
            resolve();
        });
        readStream.pipe(writeStream);
    });

// 合并切片
const mergeFileChunk = async (filePath, filename, size) => {
    const chunkDir = path.resolve(UPLOAD_DIR, filename.split(".")[0]);
    const chunkPaths = await fse.readdir(chunkDir);
    // 根据切片下标进行排序
    // 否则直接读取目录的获得的顺序可能会错乱
    chunkPaths.sort((a, b) => a - b);
    await Promise.all(
        chunkPaths.map((chunkPath, index) =>
            pipeStream(
                path.resolve(chunkDir, chunkPath),
                // 指定位置创建可写流
                fse.createWriteStream(filePath, {
                    start: index * size,
                    end: (index + 1) * size
                })
            )
        )
    );
    fse.rmdirSync(chunkDir); // 合并后删除保存切片的目录
    // 处理完成后进行返回
    return Promise.resolve(1)
};

module.exports = {
    mergeFileChunk,
    resolvePost
}