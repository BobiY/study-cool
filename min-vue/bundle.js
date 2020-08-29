(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}((function () { 'use strict';

    function isObject(obj) {
        return obj !== null && typeof obj === "object"
    }

    function hasOwn(obj, key) {
        return Object.prototype.hasOwnProperty(obj, key)
    }


    function def(obj, key, value,enumerable) {
        Object.defineProperty( obj, key, {
            value,
            enumerable: !!enumerable,
            configurable: true,
            writable: true
        } );
    }

    // 响应式依赖收集和分发
    let depId = 0;
    class Dep {
        constructor() {
            this.id = depId++;
            this.list = [];
        }

        addDep(watcher) {
            const isExistence = this.list.some( item => item.id === watcher.id );
            if( !isExistence ) {
                // 防止 watcher 重复添加
                this.list.push(watcher);
            }
        }

        nodify() {
            this.list.forEach( watcher => {
                if( watcher ) {
                    watcher.update();
                }
            } );
        }
    }

    // 数据响应式处理
    function defineReactive(obj, key, value) {
        let val = value ? value : obj[key];
        const dep = new Dep();
        const childOb = observer(val);
        Object.defineProperty(obj, key, {
            get() {
                if(Dep.target) {
                    dep.addDep(Dep.target);

                    // 将此数据的依赖加入子依赖中，在执行 $set $delete 时就可以及时更新数据
                    if( childOb ) {
                        childOb.dep.addDep(Dep.target);
                    }
                }
                return val
            },

            set(newValue) {
                if( newValue !== val ) {
                    val = newValue;
                    dep.nodify();
                    if( childOb ) {
                        childOb.dep.nodify();
                    }
                }
            }
        });
    }

    // 对数据做相应式处理
    function observer(obj) {

        // 不是对象不处理
        if(!isObject(obj)) {
            return 
        }

        if(hasOwn(obj, "__ob__") && obj.__ob__ instanceof Observer) {
            return obj.__ob__
        }

        return new Observer(obj)
    }

    class Observer{
        constructor(obj) {
            this.value = obj;
            this.dep = new Dep();
            // 数据本身记录响应式数据
            def(obj, "__ob__", this);
            if(Array.isArray(obj)) {
                console.log("开始处理数组");
            } else {
                this.walk(obj);
            }
        }

        walk(obj) {
            Object.keys(obj).forEach( item => {
                defineReactive(obj, item);
            } );
        }
    }

    function vnode(sel, data, children, text, elm) {
        const key = data === undefined ? undefined : data.key;
        return { sel, data, children, text, elm, key };
    }

    const array = Array.isArray;
    function primitive(s) {
        return typeof s === 'string' || typeof s === 'number';
    }

    function addNS(data, children, sel) {
        data.ns = 'http://www.w3.org/2000/svg';
        if (sel !== 'foreignObject' && children !== undefined) {
            for (let i = 0; i < children.length; ++i) {
                const childData = children[i].data;
                if (childData !== undefined) {
                    addNS(childData, children[i].children, children[i].sel);
                }
            }
        }
    }
    function h(sel, b, c) {
        var data = {};
        var children;
        var text;
        var i;
        if (c !== undefined) {
            if (b !== null) {
                data = b;
            }
            if (array(c)) {
                children = c;
            }
            else if (primitive(c)) {
                text = c;
            }
            else if (c && c.sel) {
                children = [c];
            }
        }
        else if (b !== undefined && b !== null) {
            if (array(b)) {
                children = b;
            }
            else if (primitive(b)) {
                text = b;
            }
            else if (b && b.sel) {
                children = [b];
            }
            else {
                data = b;
            }
        }
        if (children !== undefined) {
            for (i = 0; i < children.length; ++i) {
                if (primitive(children[i]))
                    children[i] = vnode(undefined, undefined, undefined, children[i], undefined);
            }
        }
        if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
            (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
            addNS(data, children, sel);
        }
        return vnode(sel, data, children, text, undefined);
    }

    function createElement(tagName) {
        return document.createElement(tagName);
    }
    function createElementNS(namespaceURI, qualifiedName) {
        return document.createElementNS(namespaceURI, qualifiedName);
    }
    function createTextNode(text) {
        return document.createTextNode(text);
    }
    function createComment(text) {
        return document.createComment(text);
    }
    function insertBefore(parentNode, newNode, referenceNode) {
        parentNode.insertBefore(newNode, referenceNode);
    }
    function removeChild(node, child) {
        node.removeChild(child);
    }
    function appendChild(node, child) {
        node.appendChild(child);
    }
    function parentNode(node) {
        return node.parentNode;
    }
    function nextSibling(node) {
        return node.nextSibling;
    }
    function tagName(elm) {
        return elm.tagName;
    }
    function setTextContent(node, text) {
        node.textContent = text;
    }
    function getTextContent(node) {
        return node.textContent;
    }
    function isElement(node) {
        return node.nodeType === 1;
    }
    function isText(node) {
        return node.nodeType === 3;
    }
    function isComment(node) {
        return node.nodeType === 8;
    }
    const htmlDomApi = {
        createElement,
        createElementNS,
        createTextNode,
        createComment,
        insertBefore,
        removeChild,
        appendChild,
        parentNode,
        nextSibling,
        tagName,
        setTextContent,
        getTextContent,
        isElement,
        isText,
        isComment,
    };

    function isUndef(s) {
        return s === undefined;
    }
    function isDef(s) {
        return s !== undefined;
    }
    const emptyNode = vnode('', {}, [], undefined, undefined);
    function sameVnode(vnode1, vnode2) {
        return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
    }
    function isVnode(vnode) {
        return vnode.sel !== undefined;
    }
    function createKeyToOldIdx(children, beginIdx, endIdx) {
        var _a;
        const map = {};
        for (let i = beginIdx; i <= endIdx; ++i) {
            const key = (_a = children[i]) === null || _a === void 0 ? void 0 : _a.key;
            if (key !== undefined) {
                map[key] = i;
            }
        }
        return map;
    }
    const hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
    function init(modules, domApi) {
        let i;
        let j;
        const cbs = {
            create: [],
            update: [],
            remove: [],
            destroy: [],
            pre: [],
            post: []
        };
        const api = domApi !== undefined ? domApi : htmlDomApi;
        for (i = 0; i < hooks.length; ++i) {
            cbs[hooks[i]] = [];
            for (j = 0; j < modules.length; ++j) {
                const hook = modules[j][hooks[i]];
                if (hook !== undefined) {
                    cbs[hooks[i]].push(hook);
                }
            }
        }
        function emptyNodeAt(elm) {
            const id = elm.id ? '#' + elm.id : '';
            const c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
            return vnode(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
        }
        function createRmCb(childElm, listeners) {
            return function rmCb() {
                if (--listeners === 0) {
                    const parent = api.parentNode(childElm);
                    api.removeChild(parent, childElm);
                }
            };
        }
        function createElm(vnode, insertedVnodeQueue) {
            var _a, _b;
            let i;
            let data = vnode.data;
            if (data !== undefined) {
                const init = (_a = data.hook) === null || _a === void 0 ? void 0 : _a.init;
                if (isDef(init)) {
                    init(vnode);
                    data = vnode.data;
                }
            }
            const children = vnode.children;
            const sel = vnode.sel;
            if (sel === '!') {
                if (isUndef(vnode.text)) {
                    vnode.text = '';
                }
                vnode.elm = api.createComment(vnode.text);
            }
            else if (sel !== undefined) {
                // Parse selector
                const hashIdx = sel.indexOf('#');
                const dotIdx = sel.indexOf('.', hashIdx);
                const hash = hashIdx > 0 ? hashIdx : sel.length;
                const dot = dotIdx > 0 ? dotIdx : sel.length;
                const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
                const elm = vnode.elm = isDef(data) && isDef(i = data.ns)
                    ? api.createElementNS(i, tag)
                    : api.createElement(tag);
                if (hash < dot)
                    elm.setAttribute('id', sel.slice(hash + 1, dot));
                if (dotIdx > 0)
                    elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '));
                for (i = 0; i < cbs.create.length; ++i)
                    cbs.create[i](emptyNode, vnode);
                if (array(children)) {
                    for (i = 0; i < children.length; ++i) {
                        const ch = children[i];
                        if (ch != null) {
                            api.appendChild(elm, createElm(ch, insertedVnodeQueue));
                        }
                    }
                }
                else if (primitive(vnode.text)) {
                    api.appendChild(elm, api.createTextNode(vnode.text));
                }
                const hook = vnode.data.hook;
                if (isDef(hook)) {
                    (_b = hook.create) === null || _b === void 0 ? void 0 : _b.call(hook, emptyNode, vnode);
                    if (hook.insert) {
                        insertedVnodeQueue.push(vnode);
                    }
                }
            }
            else {
                vnode.elm = api.createTextNode(vnode.text);
            }
            return vnode.elm;
        }
        function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
            for (; startIdx <= endIdx; ++startIdx) {
                const ch = vnodes[startIdx];
                if (ch != null) {
                    api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
                }
            }
        }
        function invokeDestroyHook(vnode) {
            var _a, _b;
            const data = vnode.data;
            if (data !== undefined) {
                (_b = (_a = data === null || data === void 0 ? void 0 : data.hook) === null || _a === void 0 ? void 0 : _a.destroy) === null || _b === void 0 ? void 0 : _b.call(_a, vnode);
                for (let i = 0; i < cbs.destroy.length; ++i)
                    cbs.destroy[i](vnode);
                if (vnode.children !== undefined) {
                    for (let j = 0; j < vnode.children.length; ++j) {
                        const child = vnode.children[j];
                        if (child != null && typeof child !== 'string') {
                            invokeDestroyHook(child);
                        }
                    }
                }
            }
        }
        function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
            var _a, _b;
            for (; startIdx <= endIdx; ++startIdx) {
                let listeners;
                let rm;
                const ch = vnodes[startIdx];
                if (ch != null) {
                    if (isDef(ch.sel)) {
                        invokeDestroyHook(ch);
                        listeners = cbs.remove.length + 1;
                        rm = createRmCb(ch.elm, listeners);
                        for (let i = 0; i < cbs.remove.length; ++i)
                            cbs.remove[i](ch, rm);
                        const removeHook = (_b = (_a = ch === null || ch === void 0 ? void 0 : ch.data) === null || _a === void 0 ? void 0 : _a.hook) === null || _b === void 0 ? void 0 : _b.remove;
                        if (isDef(removeHook)) {
                            removeHook(ch, rm);
                        }
                        else {
                            rm();
                        }
                    }
                    else { // Text node
                        api.removeChild(parentElm, ch.elm);
                    }
                }
            }
        }
        function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
            let oldStartIdx = 0;
            let newStartIdx = 0;
            let oldEndIdx = oldCh.length - 1;
            let oldStartVnode = oldCh[0];
            let oldEndVnode = oldCh[oldEndIdx];
            let newEndIdx = newCh.length - 1;
            let newStartVnode = newCh[0];
            let newEndVnode = newCh[newEndIdx];
            let oldKeyToIdx;
            let idxInOld;
            let elmToMove;
            let before;
            while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
                if (oldStartVnode == null) {
                    oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
                }
                else if (oldEndVnode == null) {
                    oldEndVnode = oldCh[--oldEndIdx];
                }
                else if (newStartVnode == null) {
                    newStartVnode = newCh[++newStartIdx];
                }
                else if (newEndVnode == null) {
                    newEndVnode = newCh[--newEndIdx];
                }
                else if (sameVnode(oldStartVnode, newStartVnode)) {
                    patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                    oldStartVnode = oldCh[++oldStartIdx];
                    newStartVnode = newCh[++newStartIdx];
                }
                else if (sameVnode(oldEndVnode, newEndVnode)) {
                    patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                    oldEndVnode = oldCh[--oldEndIdx];
                    newEndVnode = newCh[--newEndIdx];
                }
                else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
                    patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                    api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
                    oldStartVnode = oldCh[++oldStartIdx];
                    newEndVnode = newCh[--newEndIdx];
                }
                else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
                    patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                    api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                    oldEndVnode = oldCh[--oldEndIdx];
                    newStartVnode = newCh[++newStartIdx];
                }
                else {
                    if (oldKeyToIdx === undefined) {
                        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                    }
                    idxInOld = oldKeyToIdx[newStartVnode.key];
                    if (isUndef(idxInOld)) { // New element
                        api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                    }
                    else {
                        elmToMove = oldCh[idxInOld];
                        if (elmToMove.sel !== newStartVnode.sel) {
                            api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                        }
                        else {
                            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                            oldCh[idxInOld] = undefined;
                            api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
                        }
                    }
                    newStartVnode = newCh[++newStartIdx];
                }
            }
            if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
                if (oldStartIdx > oldEndIdx) {
                    before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
                    addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
                }
                else {
                    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
                }
            }
        }
        function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
            var _a, _b, _c, _d, _e;
            const hook = (_a = vnode.data) === null || _a === void 0 ? void 0 : _a.hook;
            (_b = hook === null || hook === void 0 ? void 0 : hook.prepatch) === null || _b === void 0 ? void 0 : _b.call(hook, oldVnode, vnode);
            const elm = vnode.elm = oldVnode.elm;
            const oldCh = oldVnode.children;
            const ch = vnode.children;
            if (oldVnode === vnode)
                return;
            if (vnode.data !== undefined) {
                for (let i = 0; i < cbs.update.length; ++i)
                    cbs.update[i](oldVnode, vnode);
                (_d = (_c = vnode.data.hook) === null || _c === void 0 ? void 0 : _c.update) === null || _d === void 0 ? void 0 : _d.call(_c, oldVnode, vnode);
            }
            if (isUndef(vnode.text)) {
                if (isDef(oldCh) && isDef(ch)) {
                    if (oldCh !== ch)
                        updateChildren(elm, oldCh, ch, insertedVnodeQueue);
                }
                else if (isDef(ch)) {
                    if (isDef(oldVnode.text))
                        api.setTextContent(elm, '');
                    addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
                }
                else if (isDef(oldCh)) {
                    removeVnodes(elm, oldCh, 0, oldCh.length - 1);
                }
                else if (isDef(oldVnode.text)) {
                    api.setTextContent(elm, '');
                }
            }
            else if (oldVnode.text !== vnode.text) {
                if (isDef(oldCh)) {
                    removeVnodes(elm, oldCh, 0, oldCh.length - 1);
                }
                api.setTextContent(elm, vnode.text);
            }
            (_e = hook === null || hook === void 0 ? void 0 : hook.postpatch) === null || _e === void 0 ? void 0 : _e.call(hook, oldVnode, vnode);
        }
        return function patch(oldVnode, vnode) {
            let i, elm, parent;
            const insertedVnodeQueue = [];
            for (i = 0; i < cbs.pre.length; ++i)
                cbs.pre[i]();
            if (!isVnode(oldVnode)) {
                oldVnode = emptyNodeAt(oldVnode);
            }
            if (sameVnode(oldVnode, vnode)) {
                patchVnode(oldVnode, vnode, insertedVnodeQueue);
            }
            else {
                elm = oldVnode.elm;
                parent = api.parentNode(elm);
                createElm(vnode, insertedVnodeQueue);
                if (parent !== null) {
                    api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
                    removeVnodes(parent, [oldVnode], 0, 0);
                }
            }
            for (i = 0; i < insertedVnodeQueue.length; ++i) {
                insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
            }
            for (i = 0; i < cbs.post.length; ++i)
                cbs.post[i]();
            return vnode;
        };
    }

    function updateClass(oldVnode, vnode) {
        var cur;
        var name;
        var elm = vnode.elm;
        var oldClass = oldVnode.data.class;
        var klass = vnode.data.class;
        if (!oldClass && !klass)
            return;
        if (oldClass === klass)
            return;
        oldClass = oldClass || {};
        klass = klass || {};
        for (name in oldClass) {
            if (oldClass[name] &&
                !Object.prototype.hasOwnProperty.call(klass, name)) {
                // was `true` and now not provided
                elm.classList.remove(name);
            }
        }
        for (name in klass) {
            cur = klass[name];
            if (cur !== oldClass[name]) {
                elm.classList[cur ? 'add' : 'remove'](name);
            }
        }
    }
    const classModule = { create: updateClass, update: updateClass };

    function updateProps(oldVnode, vnode) {
        var key;
        var cur;
        var old;
        var elm = vnode.elm;
        var oldProps = oldVnode.data.props;
        var props = vnode.data.props;
        if (!oldProps && !props)
            return;
        if (oldProps === props)
            return;
        oldProps = oldProps || {};
        props = props || {};
        for (key in props) {
            cur = props[key];
            old = oldProps[key];
            if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
                elm[key] = cur;
            }
        }
    }
    const propsModule = { create: updateProps, update: updateProps };

    // Bindig `requestAnimationFrame` like this fixes a bug in IE/Edge. See #360 and #409.
    var raf = (typeof window !== 'undefined' && (window.requestAnimationFrame).bind(window)) || setTimeout;
    var nextFrame = function (fn) {
        raf(function () {
            raf(fn);
        });
    };
    var reflowForced = false;
    function setNextFrame(obj, prop, val) {
        nextFrame(function () {
            obj[prop] = val;
        });
    }
    function updateStyle(oldVnode, vnode) {
        var cur;
        var name;
        var elm = vnode.elm;
        var oldStyle = oldVnode.data.style;
        var style = vnode.data.style;
        if (!oldStyle && !style)
            return;
        if (oldStyle === style)
            return;
        oldStyle = oldStyle || {};
        style = style || {};
        var oldHasDel = 'delayed' in oldStyle;
        for (name in oldStyle) {
            if (!style[name]) {
                if (name[0] === '-' && name[1] === '-') {
                    elm.style.removeProperty(name);
                }
                else {
                    elm.style[name] = '';
                }
            }
        }
        for (name in style) {
            cur = style[name];
            if (name === 'delayed' && style.delayed) {
                for (const name2 in style.delayed) {
                    cur = style.delayed[name2];
                    if (!oldHasDel || cur !== oldStyle.delayed[name2]) {
                        setNextFrame(elm.style, name2, cur);
                    }
                }
            }
            else if (name !== 'remove' && cur !== oldStyle[name]) {
                if (name[0] === '-' && name[1] === '-') {
                    elm.style.setProperty(name, cur);
                }
                else {
                    elm.style[name] = cur;
                }
            }
        }
    }
    function applyDestroyStyle(vnode) {
        var style;
        var name;
        var elm = vnode.elm;
        var s = vnode.data.style;
        if (!s || !(style = s.destroy))
            return;
        for (name in style) {
            elm.style[name] = style[name];
        }
    }
    function applyRemoveStyle(vnode, rm) {
        var s = vnode.data.style;
        if (!s || !s.remove) {
            rm();
            return;
        }
        if (!reflowForced) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            vnode.elm.offsetLeft;
            reflowForced = true;
        }
        var name;
        var elm = vnode.elm;
        var i = 0;
        var compStyle;
        var style = s.remove;
        var amount = 0;
        var applied = [];
        for (name in style) {
            applied.push(name);
            elm.style[name] = style[name];
        }
        compStyle = getComputedStyle(elm);
        var props = compStyle['transition-property'].split(', ');
        for (; i < props.length; ++i) {
            if (applied.indexOf(props[i]) !== -1)
                amount++;
        }
        elm.addEventListener('transitionend', function (ev) {
            if (ev.target === elm)
                --amount;
            if (amount === 0)
                rm();
        });
    }
    function forceReflow() {
        reflowForced = false;
    }
    const styleModule = {
        pre: forceReflow,
        create: updateStyle,
        update: updateStyle,
        destroy: applyDestroyStyle,
        remove: applyRemoveStyle
    };

    function invokeHandler(handler, vnode, event) {
        if (typeof handler === 'function') {
            // call function handler
            handler.call(vnode, event, vnode);
        }
        else if (typeof handler === 'object') {
            // call handler with arguments
            if (typeof handler[0] === 'function') {
                // special case for single argument for performance
                if (handler.length === 2) {
                    handler[0].call(vnode, handler[1], event, vnode);
                }
                else {
                    var args = handler.slice(1);
                    args.push(event);
                    args.push(vnode);
                    handler[0].apply(vnode, args);
                }
            }
            else {
                // call multiple handlers
                for (var i = 0; i < handler.length; i++) {
                    invokeHandler(handler[i], vnode, event);
                }
            }
        }
    }
    function handleEvent(event, vnode) {
        var name = event.type;
        var on = vnode.data.on;
        // call event handler(s) if exists
        if (on && on[name]) {
            invokeHandler(on[name], vnode, event);
        }
    }
    function createListener() {
        return function handler(event) {
            handleEvent(event, handler.vnode);
        };
    }
    function updateEventListeners(oldVnode, vnode) {
        var oldOn = oldVnode.data.on;
        var oldListener = oldVnode.listener;
        var oldElm = oldVnode.elm;
        var on = vnode && vnode.data.on;
        var elm = (vnode && vnode.elm);
        var name;
        // optimization for reused immutable handlers
        if (oldOn === on) {
            return;
        }
        // remove existing listeners which no longer used
        if (oldOn && oldListener) {
            // if element changed or deleted we remove all existing listeners unconditionally
            if (!on) {
                for (name in oldOn) {
                    // remove listener if element was changed or existing listeners removed
                    oldElm.removeEventListener(name, oldListener, false);
                }
            }
            else {
                for (name in oldOn) {
                    // remove listener if existing listener removed
                    if (!on[name]) {
                        oldElm.removeEventListener(name, oldListener, false);
                    }
                }
            }
        }
        // add new listeners which has not already attached
        if (on) {
            // reuse existing listener or create new
            var listener = vnode.listener = oldVnode.listener || createListener();
            // update vnode for listener
            listener.vnode = vnode;
            // if element changed or added we add all needed listeners unconditionally
            if (!oldOn) {
                for (name in on) {
                    // add listener if element was changed or new listeners added
                    elm.addEventListener(name, listener, false);
                }
            }
            else {
                for (name in on) {
                    // add listener if new listener added
                    if (!oldOn[name]) {
                        elm.addEventListener(name, listener, false);
                    }
                }
            }
        }
    }
    const eventListenersModule = {
        create: updateEventListeners,
        update: updateEventListeners,
        destroy: updateEventListeners
    };

    // v-modal 解析

    function vModal(vnode, vm) {
        // 解析表单元素的双向绑定
        /***
         * 将 v-modal 指令解析为两项
         * 1. 解析值，然后赋值
         * 2. 解析表达式，然后生成函数赋值
         */
        if(!vnode.data || !vnode.data.directive || !vm) {
            return
        }
        const { value, exp } = vnode.data.directive;
        // input 而言
        const fun = `${exp} = event.target.value`;
        // 生成 on 和 attrs 并重新设置 vnode 的对应属性
        vnode.data.on = {...vnode.data.on, input: new Function(fun).bind(vm)};
        vnode.data.attrs = {...vnode.data.attrs, value: value};
    }

    const vModalModule = { create: vModal, update: vModal };

    const xlinkNS = 'http://www.w3.org/1999/xlink';
    const xmlNS = 'http://www.w3.org/XML/1998/namespace';
    const colonChar = 58;
    const xChar = 120;
    function updateAttrs(oldVnode, vnode) {
        var key;
        var elm = vnode.elm;
        var oldAttrs = oldVnode.data.attrs;
        var attrs = vnode.data.attrs;
        if (!oldAttrs && !attrs)
            return;
        if (oldAttrs === attrs)
            return;
        oldAttrs = oldAttrs || {};
        attrs = attrs || {};
        // update modified attributes, add new attributes
        for (key in attrs) {
            const cur = attrs[key];
            const old = oldAttrs[key];
            if (old !== cur) {
                if (cur === true) {
                    elm.setAttribute(key, '');
                }
                else if (cur === false) {
                    elm.removeAttribute(key);
                }
                else {
                    if (key.charCodeAt(0) !== xChar) {
                        elm.setAttribute(key, cur);
                    }
                    else if (key.charCodeAt(3) === colonChar) {
                        // Assume xml namespace
                        elm.setAttributeNS(xmlNS, key, cur);
                    }
                    else if (key.charCodeAt(5) === colonChar) {
                        // Assume xlink namespace
                        elm.setAttributeNS(xlinkNS, key, cur);
                    }
                    else {
                        elm.setAttribute(key, cur);
                    }
                }
            }
        }
        // remove removed attributes
        // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
        // the other option is to remove all attributes with value == undefined
        for (key in oldAttrs) {
            if (!(key in attrs)) {
                elm.removeAttribute(key);
            }
        }
    }
    const attributesModule = { create: updateAttrs, update: updateAttrs };

    const patch = init([
        classModule,
        propsModule,
        styleModule,
        eventListenersModule,
        vModalModule,
        attributesModule
    ]);

    // nextTick 实现
    const callback = [];
    let padding = false; // 是否正在刷新 callback

    function flushCallbacks () {
      // 刷新 callback 数组
      padding = false;
      const copies = callback.slice(0);
      for (let i = 0; i < copies.length; i++) {
        copies[i]();
      }
    }


    // 获取 timeFun
    let timerFun;
    // 优先使用 promise
    if (typeof Promise === "function") {
      timerFun = () => {
        Promise.resolve().then(flushCallbacks);
      };
    } else if (typeof MutationObserver !== 'undefined') {
      // 接口提供了监视对DOM树所做更改的能力
      let counter = 1;
      const observer = new MutationObserver(flushCallbacks);
      const textNode = document.createTextNode(String(counter));
      observer.observe(textNode, {
        characterData: true
      });
      timerFunc = () => {
        counter = (counter + 1) % 2;
        textNode.data = String(counter);
      };
    } else {
      timerFunc = () => {
        setTimeout( () => {
          flushCallbacks();
        },0  );
      };
    }


    function nextTick (cb) {
      callback.push(() => {
        try {
          cb();
        } catch (error) {
          console.log(error);
        }
      });
      if (!padding) {
        padding = true;
        timerFun();
      }
    }

    // vue 的简易调度模式
    const queue = []; // 待执行事件队列
    let flushing = false; // 标记是否正在刷新队列 
    let wating = false; //标记 flushSchedulerQueue 是否已经进入微任务队列，等待刷新
    let hasID = {};
    let i = 0;  // 表示当前正在执行的 watcher 在队列中的位置 
    // 刷新任务队列
    function flushSchedulerQueue() {
      flushing = true;

      // 将 watcher 按照创建顺序排列
      queue.sort( (a,b) =>a.id -b.id );
      for( i = 0; i < queue.length; i++ ) {
        queue[i].run();
      }
      // 刷新完毕更新状态
      queue.length = 0;  
      flushing = false; 
      wating = false;
      hasID = {};
    }

    // watcher 入队函数
    function queueWatcher(watcher) {
      if( !hasID[watcher.id] ) {
        hasID[watcher.id] = true;
        if ( !flushing ) {
          // 尚未开始刷新
          queue.push(watcher);
        } else {
          // 已经开始刷新
          let index = queue.length - 1;
          /**
           * 这里的思想是
           * 1. index > i 表示的是新来的 watcher 插入的位置一定是在未执行的队列中的位置
           * 2. 就 watcher.id 来讲，父元素的 watcher.id 一定比 子元素的 watcher.id 小
           * 遵循这个原则，子元素的 watcher 执行一定在父元素之后，所以插入是，
           * 要保证新加的 watcher 在 id 比他小的 wactcher 以后， 这个是为了保证更新时的组件按照正确的方式更新
           */
          if( index > i && queue[index].id > watcher.id ) {
            index--;
          }
          queue.splice(index+1, 0, watcher );
        }
      } 

      if( !wating ) {
        wating = true; // 表示刷新函数已经入队。不要重复入队

        // 加入刷新队列等待刷新
        nextTick(flushSchedulerQueue);
      }
    }

    // 依赖收集
    let ids = 0;
    class Watcher {
        constructor(vm, expOrFn, options={}) {
            this.vm = vm;
            this.getter = expOrFn;
            this.lazy = !!options.lazy;
            this.dirty = false;
            Dep.target = this;
            this.value = this.lazy ? undefined : this.get();
            Dep.target = null;
            this.id = ids++;
        }

        get() {
            this.getter.call(this.vm, this.vm);
        }

        update() {
            if( this.lazy ) {
                // 表示数据有变化
                this.dirty = true;
            } else {
                // 将 watcher 加入异步队列等待更新
                queueWatcher(this);
            }
        }

        run() {
            // console.log(`我正在执行，我是 ${this.id} watcher`);
            this.get.call(this);
        }

        evaluate() {
            this.value = this.get();
            this.dirty = false;
        }
    }

    // 支持 $on $off $once $emit

    function initEvents(YYC) {

        // 事件的注册方法
        YYC.prototype.$on = function(name, eventFn) {
            const vm = this;
            if( !vm._events ) {
                vm._events = {};
            }
            if( Array.isArray(name) ) {
                // 说明是多个事件对应一个监听函数
                for( let i = 0; i< name.length; i++ ) {
                    vm.$on(name[i], eventFn);
                } 
            } else {
                (vm._events[name] || (vm._events[name] = [])).push(fn);
            }

            // 可以支持组件生命周期钩子的支持 待完善
        };

        // 事件的触发
        YYC.prototype.$emit = function(name, ...rest) {
            // name 是方法名称 rest 是传递的参数
            const vm = this;
            const events = vm._events[name];
            if( !events ) {
                // 不存在就返回
                return ;
            }
            if(Array.isArray(events)) {
                for( let i = 0; i< events.length; i++ ) {
                    vm.$emit(name, ...rest);
                }
            } else {
                // on 和 emit 是在同一个 vm 实例上触发的，所以 $on 传递进来的 fn 都是绑定过 this 的
                events.apply(vm, rest);
            }
        };

        // 事件的移除
        YYC.prototype.$off = function(...rest) {
            const vm = this;
            if( rest.length === 0 ) {
                // 无参数，则移除所有事件监听
                vm._events = null;
            }

            const [name, fn] = rest;
            const event = vm._events[name];
            if(!event) {
                return vm
            }

            if(!fn) {
                vm._events[name] = null;
            }

            for( let i = 0; i< event.length; i++ ){
                if( event[i] === fn ) {
                    event.splice(i, 1);
                }
            }
        };

        // 只执行一次 $once
        YYC.prototype.$once = function(name, eventFn) {
            const vm = this;
            function on(...rest) {
                vm.$off(name, eventFn);
                eventFn.apply(vm, rest);
            }

            vm.$on(name, on);
        };
    }

    // 初始化 render 函数
    function initRender(YYC) {

      // 暴露出去给使用者用
      YYC.prototype.$createElement = h;

      // 挂载身上给自己用
      YYC.prototype._createElement = h;

      // 用于显然节点中出现的数据
      YYC.prototype._s = function(name){
        return this.$data[name]
      };

    }

    // 入口文件
    class YYC {
        constructor(options) {
            this.$options = options;
            this._vnode = null;
            this.$el = null;
            this.observerData();

            // 代理 methods，使 this 可以访问到
            Object.keys(this.$options.methods).forEach( item => {
                this.$options.methods[item] = this.$options.methods[item].bind(this);
                Object.defineProperty(this, item, {
                    get() {
                        // console.log(this._data)
                        return this.$options.methods[item]
                    }
                });
            } );
        }

        observerData() {
            const data = this.$options.data;

            this._data = observer(data);

            Object.defineProperty(this, "$data", {
                get() {
                    // console.log(this._data)
                    return this._data.value
                }
            });
        }

        mount(el) {
            let newEl = el;
            if (typeof el === "string") {
                newEl = document.querySelector(el);
            }
            this.$el = newEl;
            new Watcher(this, this.update());
        }

        _render() {
            // h(first) first 是可以是自定义标签名的，这是是否可以进行自定义组件的设置
            const vnode = this.$options.render.call(this, h);
            const vm = this;
            // 这里做了很傻的操作，因为无法在 patch 中处理，所以这里先额外处理，然后后面在考虑移到 patch 中
            // 先支持原生组件的 v-modal，再支持自定义组件的 v-modal
            function getNode(vnode, parent, i) {
                // 支持自定义组件的渲染过程，很傻的操作方式 哈哈哈
                if( vnode.data&&vnode.data.directive ) {
                    if(vnode.data.directive.name === "modal") {
                        vModalModule.create(vnode, vm);
                    }
                    console.log(vnode);
                }
                if(vnode.sel === "ddd") {
                    // 发现自定义组件就替换为自定义组件的 vnode
                    // vnode = YYC.b._render(h)
                    parent.splice(i, 1, YYC.b._render(h));
                    // console.log(vnode);
                }
                if( vnode.children && vnode.children.length > 0 ) {
                    vnode.children.forEach( (item, index) => {
                        getNode(item, vnode.children, index);
                    } );
                }
            }
            getNode(vnode);
            return vnode
        }
        update() {
            // 生成 watcher 更新函数
            const updateComponent = function() {
                this.$el = this._update(this._render());
            };
            return updateComponent;
        }
        _update(vnode) {
            let el = null;
            if (!this._vnode) {
                el = patch(this.$el, vnode);
            } else {
                el = patch(this._vnode, vnode);
            }
            this._vnode = vnode;
            return el
        }
    }

    // 添加事件系统的初始化操纵
    initEvents(YYC);
    initRender(YYC);

    /*
    var handler ={
    	startElement:   function (sTagName, oAttrs) {},
    	endElement:     function (sTagName) {},
        characters:		function (s) {},
        comment:		function (s) {}
    };
    */

    const startTagRe = /^<([^>\s\/]+)((\s+[^=>\s]+(\s*=\s*((\"[^"]*\")|(\'[^']*\')|[^>\s]+))?)*)\s*\/?\s*>/m;
    const endTagRe = /^<\/([^>\s]+)[^>]*>/m;
    const attrRe = /([^=\s]+)(\s*=\s*((\"([^"]*)\")|(\'([^']*)\')|[^>\s]+))?/gm;
    class Parser {
      constructor() {
        this.handler = null;
        this.startTagRe = startTagRe;
        this.endTagRe = endTagRe;
        this.attrRe = attrRe;
      }

      parse (string, oHandler) {
        // 除去传递的字符串的格式数据
        let s = string.replace(/\r?\n/g,"");
        if (oHandler)
          this.contentHandler = oHandler;
        var lm, rc, index;
        var treatAsChars = false;
        var oThis = this;
        while (s.length > 0) {
          // Comment
          if (s.substring(0, 4) == "<!--") {
            index = s.indexOf("-->");
            if (index != -1) {
              this.contentHandler.comment(s.substring(4, index));
              s = s.substring(index + 3);
              treatAsChars = false;
            }
            else {
              treatAsChars = true;
            }
          }

          // end tag
          else if (s.substring(0, 2) == "</") {
            if (this.endTagRe.test(s)) {
              lm = RegExp.lastMatch;
              rc = RegExp.rightContext;

              lm.replace(this.endTagRe, function () {
                return oThis.parseEndTag.apply(oThis, arguments);
              });

              s = rc;
              treatAsChars = false;
            }
            else {
              treatAsChars = true;
            }
          }
          // start tag
          else if (s.charAt(0) == "<") {
            if (this.startTagRe.test(s)) {
              lm = RegExp.lastMatch;
              rc = RegExp.rightContext;

              lm.replace(this.startTagRe, function () {
                return oThis.parseStartTag.apply(oThis, arguments);
              });

              s = rc;
              treatAsChars = false;
            }
            else {
              treatAsChars = true;
            }
          }

          if (treatAsChars) {
            index = s.indexOf("<");
            if (index == -1) {
              this.contentHandler.characters(s);
              s = "";
            }
            else {
              this.contentHandler.characters(s.substring(0, index));
              s = s.substring(index);
            }
          }

          treatAsChars = true;
        }
      }
      parseStartTag (sTag, sTagName, sRest) {
        var attrs = this.parseAttributes(sTagName, sRest);
        this.contentHandler.startElement(sTagName, attrs);
      }

      parseEndTag (sTag, sTagName) {
        this.contentHandler.endElement(sTagName);
      }

      parseAttributes (sTagName, s) {
        var oThis = this;
        var attrs = [];
        s.replace(this.attrRe, function (a0, a1, a2, a3, a4, a5, a6) {
          attrs.push(oThis.parseAttribute(sTagName, a0, a1, a2, a3, a4, a5, a6));
        });
        return attrs;
      }

      parseAttribute (sTagName, sAttribute, sName) {
        var value = "";
        if (arguments[7])
          value = arguments[8];
        else if (arguments[5])
          value = arguments[6];
        else if (arguments[3])
          value = arguments[4];

        var empty = !value && !arguments[3];
        return { name: sName, value: empty ? null : value };
      }
    }

    // 根据 vnode 生成对应的 render 函数
    /**
     *  处理纯文本节点 eg：我是中国人 
     */
    function createRender (vnode, vm) {
      let result = "";
      vnode.forEach((item, index) => {
        if (typeof item !== "object" && item !== null) {
          // 说明是一段纯文本。直接放进 children 数组即可
          // lastNode 为 true时说明文本节点是子元素的最后一个节点
          result += `'${handleData(item)}',`;
        } else {
          // 正常的元素节点
          // console.log(translateObject(item.attr));
          // JSON.stringify(item.attr)
          result += `h("${item.tag}",${translateObject(item.attr, vm)},[`;
          if (item.children && item.children.length > 0) {
            result += `${createRender(item.children, vm)},`;
            result += "]";
            result += index === vnode.length - 1 ? ")" : "),";
          }
        }
      });
      return result
    }

    // 将 obj 转换为字符串 这样子就能直接访问事件
    function translateObject (obj, vm) {
      let result = "{";
      Object.keys(obj).forEach(item => {
        result += `${item}`;
        if (typeof obj[item] === "object") {
          // 最多只有两层对象
          result += `:${translateObject(obj[item], vm)},`;
        } else {
          if (typeof obj[item] === "function") {
            result += `:${obj[item]},`;
          } else {
            result += isInstanceProps(obj[item], vm) ? `:${obj[item]},` : `:'${obj[item]}',`;
          }
        }
      });
      return result + "}"
    }

    // 如果是数据。则不做字符串化处理
    const reg = /\{\{((?:.|\n)+?)\}\}/g;
    function handleData (string = "") {
      return string.replace(reg, (value, index) => {
        // console.log(value, RegExp.$1, index);
        return `'+_s("${RegExp.$1}")+'`
      })
    }

    // 判断一个属性是否存在在 YYC 实例上
    function isInstanceProps (value, vm) {
      // 这个方法只检测data和方法 methods
      return !!vm.$data[value] || !!vm[value]
    }

    // 解析一部分指令的代码
    function parseVmodel(vmodel, result) {
      // 精髓所在，解析 v-model
      const eventName = "input";
      const value = vmodel.value;
      const funBody = `$data.${value} = event.target.value`;
      result.on[eventName] = new Function(event, funBody);
      result.attrs.value = handleData(`{{${value}}}`);
    }

    // 解析双向绑定
    const parseModel = {
      handle: parseVmodel,
      name: "v-model"
    };

    // 解析事件和属性
    // 目前支持的事件
    const eventSupport = ["click", "input", "change"];
    function parseProps(attrs) {
      // console.log(attrs);
      if( attrs.length === 0 ) {
        return {}
      }
      const result = {
        attrs: {},
        on: {}
      };
      attrs.forEach( item => {
        if( eventSupport.includes(item.name) ) {
          result.on[item.name] = item.value;
        } else {
          if( item.name === "v-model" ) {
            parseModel.handle(item, result);
          } else {
            result.attrs[item.name] = item.value;
          }
        }
      } );
      return result
    }

    const arr = [];
    const tag = [];
    let currentNode = null;
    const handler = {
      startElement: function (sTagName, oAttrs) {
        //标签开始
        if (tag.length === 0) {
          currentNode = { tag: sTagName, attr: parseProps(oAttrs), children: [] };
          arr.push(currentNode);
        } else {
          const parentNode = arr[arr.length - 1];
          currentNode = { tag: sTagName, attr: parseProps(oAttrs), children: [] };
          parentNode.children.push(currentNode);
        }
        tag.push(sTagName); // 遇到开始标签，就入栈
        // console.log("startElement", sTagName, oAttrs);
      },
      endElement: function (sTagName) {
        // 标签解释
        tag.pop(); // 遇到结束标签，就弹出去一个
        // console.log("endElement", sTagName);
      },
      characters: function (s) {
        // 表示的是获取的字符

        (currentNode && currentNode.children) && currentNode.children.push(s);
        // console.log("characters", s);
      },
      comment: function (s) {
        // 表示获取的注释
        currentNode.children.push({ tag: "comment", text: s });
        // console.log("comment", s);
      }
    };

    function getVnode (tempStr) {
      const complier = new Parser();

      complier.parse(tempStr, handler);
      // console.log(arr);

      return arr
    }

    // 重写 mount
    const mount = YYC.prototype.mount;

    // 确保 render 函数一定存在
    YYC.prototype.$mount = function (el) {
      let vnode = null;
      if (!this.$options.render) {
        // render 不存在就解析 template
        if (this.$options.template) {
          const tempStr = this.$options.template;
          // 编译标签属性时，需要确定哪些时数据，哪些是固定的属性值
          vnode = getVnode(tempStr);
          // console.log(vnode);
          // console.log("createRender(vnode, this)",createRender(vnode, this));
          const render = new Function("h",
            `
          with(this){
            // 限定在 this 范围内
            return ${createRender(vnode, this)}
          }
        `
          );
          // console.log("render", render);
          this.$options.render = render;
          // vnode 转换成  h(tagname, props, children 的形式)
          // 然后使用字符串拼接的方式生成 render 函数
        } else {
          const elm = document.querySelector(el);
          const temp = getOuterHTML(elm);
          vnode = getVnode(tempStr);
        }
      }
      mount.call(this, el);
    };

    function getOuterHTML (el) {
      if (el.outerHTML) {
        return el.outerHTML // 带自己都给获取了
      } else {
        // 获取不到就包一层元素再返回出去
        const container = document.createElement('div');
        container.appendChild(el.cloneNode(true));
        return container.innerHTML
      }
    }

    // import a from "./code/patch";
    // import { b } from "./code/test";
    // YYC.b = b
    const a = new YYC({
        el: "#app",
        data: {
            a: 1,
            b: "我是阿冰"
        },
        methods: {
            click() {
                console.log("我被点击了");
            },
            input(e) {
                this.$data.b = e.target.value;
            }
        },
        template: `
        <div click="click">
            helloworld
            <span>这里是按钮啊{{a}}</span>
            <p>{{b}}</p>
            <input  type="text" v-model="b"/>
        </div>`
    });

    // v-modal 
    /***
     * attrs:{value: value}
     * on:{input: function(event){ this.$data.a = event.target.value }}
     */

    //  console.log(a);

    a.$mount("#app");
    setTimeout(() => {
        a.$data.a = 100;
        a.$data.b = "我不是阿冰";
    }, 1000);

})));
