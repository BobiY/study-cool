const LinkList = require("../../linkList");

// 初始化
const linklist = new LinkList()
linklist.append(1)
linklist.append(2)
linklist.append(3)
linklist.append(4)

// 反转 从头开始，换位置
function reverse (linkList) {
  const curNode = linkList.head
  // 这个递归处理，传递进去的是哪个节点，最终返回出来的就是哪个节点
  const result = reverse_real(curNode)

  // 处理首尾节点，保证链表的功能正常
  result.next = null
  linkList.head = linkList.tail
  linkList.tail = result
}

function reverse_real (node) {
  if (!node.next) {
    // 说明处理到了尾节点了 就终结递归，开始计算
    return node // 将当前节点返回
  }
  const nextNode = reverse_real(node.next)
  nextNode.next = node
  return node
}

reverse(linklist)
linklist.print()
