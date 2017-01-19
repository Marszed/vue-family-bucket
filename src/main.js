// 加载"容器"
import App from './App'

// 加载核心库
import MD5 from './lib/md5'
import Config from './lib/config'
import Filter from './lib/filter'
import Vue from 'vue'
import router from './router/router'
import store from './vuex/store'
import VueResource from 'vue-resource'
//import FastClick from 'fastclick'

//import VueTouch from 'vue-touch' // npm install --save git://github.com/vuejs/vue-touch.git#next 安装兼容vue2.0非发布版本
//import Validator from 'vue-validator'

// scss
import '../static/scss/common/global.scss'

// fix click 300ms delay
//FastClick.attach(document.body)

// 模块化机制,加载vue 插件
Vue.use(VueResource)
//Vue.use(VueTouch)


//在请求头中添加如下信息： 	clientOSVersion(微信版本号)，appVersion(当前系统版本)，appId(sqbj_weixin)，clientId(微信用户openId)，termId(微信用户openId)，SID(微信用户openId)，termTyp(weixin)

// http配置
Vue.http.interceptors.push((request, next)  => {

  // 验证签名
  request.headers.set('md5',MD5( JSON.stringify(request.body) + Filter.decode64(Config.host.map.keyByte) ) )

  // 全局设置请求头
  request.headers.set('API-Client-ID',Config.headers['API-Client-ID'])
  request.headers.set('API-APP-ID',Config.headers['API-APP-ID'])
  request.headers.set('API-Session-Token',Config.headers['API-Session-Token'])
  request.headers.set('API-User-OpenID',Config.headers['API-User-OpenID'])
  request.headers.set('SID',Config.headers['SID'])
  request.headers.set('GID',Config.headers['GID'])
  request.headers.set('clientOSVersion',Config.headers['clientOSVersion'])
  request.headers.set('appVersion',Config.headers['appVersion'])
  request.headers.set('appId',Config.headers['appId'])
  request.headers.set('clientId',Config.headers['clientId'])
  request.headers.set('termId',Config.headers['termId'])
  request.headers.set('termTyp',Config.headers['termTyp'])

  next();
});

// 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
new Vue({
  router: router, // 将 router 从根组件『注入』到每一个子组件中
  store: store, // 将 store 从根组件『注入』到每一个子组件中
  render: h => h(App) // 将 h 作为 createElement 的别名是一个通用惯例,在vue生态系统中,实际上必须用到jsx, 如果在作用域中h失去作用,在应用中会触发报错
}).$mount('#app')
