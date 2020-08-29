// import a from "./code/patch";
// console.log(11111222, a);
import YYC from "./code/complier-create";
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
            this.$data.b = e.target.value
        }
    },
    template: `
        <div click="click">
            helloworld
            <span>这里是按钮啊{{a}}</span>
            <p>{{b}}</p>
            <input  type="text" v-model="b"/>
        </div>`
})

// v-modal 
/***
 * attrs:{value: value}
 * on:{input: function(event){ this.$data.a = event.target.value }}
 */

//  console.log(a);

a.$mount("#app")
setTimeout(() => {
    a.$data.a = 100
    a.$data.b = "我不是阿冰"
}, 1000)
