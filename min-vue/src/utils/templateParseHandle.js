import Parser from "../complier/index";
import parseProps from "../complier/parseProps";
const arr = []
const tag = []
let currentNode = null;
const handler = {
  startElement: function (sTagName, oAttrs) {
    //标签开始
    if (tag.length === 0) {
      currentNode = { tag: sTagName, attr: parseProps(oAttrs), children: [] }
      arr.push(currentNode)
    } else {
      const parentNode = arr[arr.length - 1]
      currentNode = { tag: sTagName, attr: parseProps(oAttrs), children: [] }
      parentNode.children.push(currentNode)
    }
    tag.push(sTagName) // 遇到开始标签，就入栈
    // console.log("startElement", sTagName, oAttrs);
  },
  endElement: function (sTagName) {
    // 标签解释
    tag.pop() // 遇到结束标签，就弹出去一个
    // console.log("endElement", sTagName);
  },
  characters: function (s) {
    // 表示的是获取的字符

    (currentNode && currentNode.children) && currentNode.children.push(s)
    // console.log("characters", s);
  },
  comment: function (s) {
    // 表示获取的注释
    currentNode.children.push({ tag: "comment", text: s })
    // console.log("comment", s);
  }
};

export function getVnode (tempStr) {
  const complier = new Parser()

  complier.parse(tempStr, handler)
  // console.log(arr);

  return arr
}