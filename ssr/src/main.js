import Vue from 'vue'
import App from './App.vue'
import createRouter from './router'
import createStore from './store'

Vue.config.productionTip = false

// 需要每个请求返回一个Vue实例
function createApp(context) {
  const router = createRouter()
  const store = createStore()
  const app = new Vue({
    router,
    store,
    context, // 用于和外面renderer交互
    render: h => {
      return h(App)
    }
  })

  return {app,router,store}
}


export default createApp