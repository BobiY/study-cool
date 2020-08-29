<template>
  <div id="app">
    <input type="file" @change="fileChange" ref="files" />
    <el-button @click="startUpload" ref="el-button">点击上传</el-button>
  </div>
</template>

<script>
import { createFileChunk, ajax, SIZE } from "./upload";
export default {
  name: "app",
  data () {
    return {
      file: null,
      chunk: [],
      flge: false
    };
  },
  mounted () {
    console.log("this.$children", this.$children);
    // 获取直接子组件的实例，和 $parent/$children 有异曲同工之处
    console.log("this.$refs", this.$refs["el-button"]);
  },
  methods: {
    async startUpload () {
      // alert("kaishile")
      const files = this.chunk.map((item, index) => {
        // 组装 formData 发送给后端
        const formData = new FormData();
        formData.append("chunk", item.file); // 追加切片内容
        formData.append("filename", this.file.name);
        formData.append("hash", index);
        return ajax({ data: formData, url: "http://localhost:3000/" });
      });
      await Promise.all(files);
      this.mergeRequest()
    },
    fileChange () {
      // 保存文件  文件内容在 input[type=file] 的目标元素上获取
      this.file = this.$refs.files.files[0];
      // 进行切片
      this.chunk = createFileChunk(this.file);
      console.log(this.chunk);
    },
    async mergeRequest () {
      await ajax({
        url: "http://localhost:3000/merge",
        headers: {
          "content-type": "application/json",
        },
        data: JSON.stringify({
          size: SIZE,
          filename: this.file.name,
        }),
      });
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
