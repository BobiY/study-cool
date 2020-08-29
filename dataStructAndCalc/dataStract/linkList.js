// js 实现链表

const { threadId } = require("worker_threads");

class LinkNode{
    constructor(data) {
        this.value = data;
        // 下一个节点
        this.next = null;
    }
}

class LinkList {
    constructor() {
        this.head = null;
        this.tail = null;
        this._length = 0;
    }

    // 包装 length 属性，防止被篡改
    get length(){
        return this._length
    }

    // 添加一个新节点
    append(data) {
        const newNode = new LinkNode(data);
        if(!this.head) {
            this.head = newNode
        } else if(!this.tail) {
            this.head.next = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this._length+=1;
    }

    // 固定位置插入一个节点
    insert(index, data) {
        if( index < 0 || index > this.length )  {
            return false
        }
        const newNode = new LinkNode(data)
        // 获取传入位置的前一个节点
        const node = this.get(index-1);
        if( node ) {
            // 说明插入位置不是头节点
            const curNext = node.next
            node.next = newNode
            newNode.next = curNext
            if( this.length === index ) {
                // 从尾部插入，相当于 appeng，重置尾节点
                this.tail = newNode
            }
        } else {
            // 说明是头节点
            newNode.next = this.head
            this.head = newNode
        }
        this._length += 1
        return true
    }

    // 移除指定位置的节点
    remove(index) {
        if( index < 0 || index > this.length )  {
            return false
        }
        const node = this.get(index - 1)
        if( node ) {
            if( index === this.length ) {
                // 处理尾节点
                node.next = null
                this.tail = node
            } else {
                node.next = node.next.next
            }
        } else if (!node) {
            this.head = this.head.next
        }
        this._length-=1
    }

    // 获取固定位置元素的索引
    get(index) {
        if( index < 0 ) {
            return null;
        } else if( index > this._length ) {
            return null;
        } else {
            let i = 0;
            let curNode = this.head
            while( i<index ) {
                i++
                curNode = curNode.next
            }
            return curNode
        }
    }

    // 删除头节点
    remove_head() {
        this.remove(0)
    }
    // 删除尾节点
    remove_tail() {
        this.remove(this.length)
    }
    // 返回指定元素的索引
    indexOf(data) {
        let i = 0
        let curNode = this.head
        while( curNode.value !== data && i < this.length) {
            i++
            curNode = curNode.next
        }

        return i === this.length ? -1 : i
    }
    isEmpty() {
        return this.length === 0
    }
    clear() {
        this.head = this.tail = null
    }
    // print
    print() {
        let i = 0;
        let curNode = this.head
        while(i< this._length) {
            i++
            console.log(curNode.value);
            curNode = curNode.next
        }
    }
}

module.exports = LinkList