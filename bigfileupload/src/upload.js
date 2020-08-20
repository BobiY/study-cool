// 大文件上传处理

// 切片默认大小
export const SIZE = 50000

// 生成文件切片
export const createFileChunk = (file, size = SIZE) => {
    if (!file) {
        return []
    }
    const chunk = []
    let cur = 0
    // 生成文件切片，这里储存一个对象，后面还要添加其他内容
    while (cur < file.size) {
        // 先截取，后加 cur
        chunk.push({ file: file.slice(cur, cur + size) })
        cur += size
    }
    return chunk;
}


// 简单的请求函数
export const ajax = ({
    url = "",
    methods = "post",
    data,
    headers={}
}) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(methods, url)
        Object.keys(headers).forEach(key =>
            xhr.setRequestHeader(key, headers[key])
        );
        xhr.send(data)
        xhr.onload = e => {
            resolve({
                data: e.target.response
            })
        }

        xhr.onerror = e => {
            reject(e)
        }
    })
}