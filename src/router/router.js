/**
 * Created by marszed on 16/11/10.
 */
// 加载核心库
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../vuex/store'
import Config from '../lib/config'
import Filter from '../lib/filter'

// 整个路由懒加载-异步加载组件,代码分块的语法，使用 AMD 风格的 require
const MyFamily = resolve => require(['../components/my/family'], resolve)
const Community = resolve => require(['../components/community/community'], resolve)
const CityBind = resolve => require(['../components/community/cityBind'], resolve)
const CommunityBind = resolve => require(['../components/community/communityBind'], resolve)
const CityAuth = resolve => require(['../components/authentication/cityAuth'], resolve)
const CommunityAuth = resolve => require(['../components/authentication/communityAuth'], resolve)
const FloorAuth = resolve => require(['../components/authentication/floorAuth'], resolve)
const HouseAuth = resolve => require(['../components/authentication/houseAuth'], resolve)
const OtherAuth = resolve => require(['../components/authentication/otherAuth'], resolve)
const MobileAuth = resolve => require(['../components/authentication/mobileAuth'], resolve)
const MsgAuth = resolve => require(['../components/authentication/msgAuth'], resolve)
const ResultAuth = resolve => require(['../components/authentication/resultAuth'], resolve)
const RoleAuth = resolve => require(['../components/authentication/roleAuth'], resolve)
const OpenDoor = resolve => require(['../components/open/door'], resolve)
const Login = resolve => require(['../components/login/login'], resolve)
const Services = resolve => require(['../components/property/services'], resolve)
const Notice = resolve => require(['../components/property/notice'], resolve)
const NoticeDetail = resolve => require(['../components/property/noticeDetail'], resolve)
const Authentication = resolve => require(['../components/authentication/index'], resolve)
const HomePage = resolve => require(['../components/my/homePage'], resolve)
const About = resolve => require(['../components/my/about'], resolve)
const PersDetails = resolve => require(['../components/my/persDetails'], resolve)
const UpdateName = resolve => require(['../components/my/updateName'], resolve)
const AddFamily = resolve => require(['../components/my/addFamily'], resolve)
const UserAgreement = resolve => require(['../components/extension/userAgreement'], resolve)
const RedPacketDetail = resolve => require(['../components/open/redPacketDetail'], resolve)
const RedPacket = resolve => require(['../components/my/redPacket'], resolve)
const MakeMoney = resolve => require(['../components/extension/makeMoney'], resolve)
const SpendMoney = resolve => require(['../components/extension/spendMoney'], resolve)
const MerchantIntroduce= resolve => require(['../components/extension/merchantIntroduce'], resolve)

// 模块化机制,此处要调用 Vue.use(VueRouter)
Vue.use(VueRouter)

// 创建一个路由器实例,并且配置路由规则
const routes = [
  // 路由入口
  {
    path: '/',
    redirect: '/services'
  },
  // =========微信绑定======
  {
    path: '/login',
    component: Login,
    meta: {
      wechatTitle: '绑定',
      showMenu: false
    }
  },
  // =========微信绑定======
  // =========小区选择======
  {
    path: '/community',
    component: Community,
    name: 'chooseCityCommunity',
    meta: {
      wechatTitle: '选择城市小区',
      showMenu: false
    }
  },
  {
    path: '/community/city-bind',
    history: false,
    component: CityBind,
    meta: {
      wechatTitle: '选择城市',
      showMenu: false
    }
  },
  {
    path: '/community/community-bind',
    history: false,
    component: CommunityBind,
    meta: {
      wechatTitle: '选择小区',
      showMenu: false
    }
  },
  // =========小区选择======
  // =========开门======
  {
    path: '/open-door',
    name: 'openDoor', // 路由别名
    component: OpenDoor,
    meta: {
      wechatTitle: '开门',
      showMenu: true,
      requiresAuth: true, // 是否认证
      requiresCommunity: true // 是否选择小区
    }
  },
  {
    path: '/open-door/redPacketDetail',
    name: 'redPacketDetail', // 路由别名
    component: RedPacketDetail,
    meta: {
      wechatTitle: '红包',
      showMenu: false
    }
  },
  // =========开门======
  // =========认证======
  {
    path: '/authentication',
    component: Authentication,
    meta: {
      wechatTitle: '认证',
      showMenu: false
    }
  },
  {
    path: '/authentication/mobile',
    component: MobileAuth,
    meta: {
      wechatTitle: '认证',
      showMenu: false
    }
  },
  {
    path: '/authentication/mobile/msg',
    component: MsgAuth,
    meta: {
      wechatTitle: '认证',
      showMenu: false
    }
  },
  {
    path: '/authentication/result/:resultId',
    component: ResultAuth,
    meta: {
      wechatTitle: '认证',
      showMenu: false
    }
  },
  {
    path: '/authentication/role-auth/:role',
    component: RoleAuth,
    meta: {
      wechatTitle: '认证',
      showMenu: false
    }
  },
  {
    path: '/authentication/city-auth',
    component: CityAuth,
    meta: {
      wechatTitle: '认证',
      showMenu: false
    }
  },
  {
    path: '/authentication/community-auth',
    component: CommunityAuth,
    meta: {
      wechatTitle: '认证',
      showMenu: false
    }
  },
  {
    path: '/authentication/floor-auth',
    component: FloorAuth,
    meta: {
      wechatTitle: '认证',
      showMenu: false
    }
  },
  {
    path: '/authentication/floor-auth/house-auth',
    component: HouseAuth,
    meta: {
      wechatTitle: '认证',
      showMenu: false
    }
  },
  {
    path: '/authentication/other-auth',
    component: OtherAuth,
    meta: {
      wechatTitle: '认证',
      showMenu: false
    }
  },
  // =========认证======
  // =========我的模块======
  {
    path: '/my',
    component: HomePage,
    name: 'my',
    meta: {
      wechatTitle: '我的',
      showMenu: true
    }
  },
  {
    path: '/my/redPacket',
    component: RedPacket,
    meta: {
      wechatTitle: '我的红包',
      showMenu: false
    }
  },
  {
    path: '/my/family',
    component: MyFamily,
    meta: {
      wechatTitle: '我的家庭',
      showMenu: false
    }
  },
  {
    path: '/my/addFamily',
    component: AddFamily,
    meta: {
      wechatTitle: '添加家庭成员',
      showMenu: false
    }
  },
  {
    path: '/my/persDetails',
    component: PersDetails,
    meta: {
      wechatTitle: '个人信息',
      showMenu: false,
      requiresBind: true // 是否绑定
    }
  },
  {
    path: '/my/PersDetails/updateName',
    component: UpdateName,
    meta: {
      wechatTitle: '个人信息',
      showMenu: false,
      requiresBind: true // 是否绑定
    }
  },
  {
    path: '/my/about',
    component: About,
    name: 'about',
    meta: {
      wechatTitle: '关于',
      showMenu: false
    }
  },
  // =========物业模块======
  {
    path: '/services',
    name: 'services',
    component: Services,
    meta: {
      showMenu: true,
      wechatTitle: '物业服务',
      requiresCommunity: true
    }
  },
  {
    path: '/services/notice',
    name: 'notice',
    component: Notice,
    meta: {
      showMenu: false,
      wechatTitle: '公告'
    }
  },
  {
    path: '/services/notice/noticeDetail/:index',
    name: 'noticeDetail',
    component: NoticeDetail,
    meta: {
      showMenu: false,
      wechatTitle: '公告'
    }
  },
  //------------静态页面---------------------
  {
    path: '/extension/userAgreement',
    component: UserAgreement,
    meta: {
      wechatTitle: '社区半径服务协议',
      showMenu: false
    }
  },
  {
    path: '/extension/makeMoney',
    component: MakeMoney,
    meta: {
      wechatTitle: '怎么领红包？',
      showMenu: false
    }
  },
  {
    path: '/extension/spendMoney',
    component: SpendMoney,
    meta: {
      wechatTitle: '怎么花红包？',
      showMenu: false
    }
  },
  {
    path: '/extension/merchantIntroduce',
    component: MerchantIntroduce,
    meta: {
      wechatTitle: '社区半径',
      showMenu: false
    }
  },
  //------------静态页面---------------------
  {
    path: '/no-wechat',
    component: {
      template: '<div>' +
      '<img src="data:image/png;base64,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" class="abnormal-img">'+
      '<h5 class="abnormal-tip">请关注社区半径微信公众号~</h5>'+
      '</div>'
    },
    meta: {
      showMenu: false,
      wechatTitle: '请关注社区半径微信公众号',
      noWechat: true
    }
  },
  {
    path: '/no-data',
    component: {
      template: '<div>' +
      '<img src="data:image/png;base64,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" class="abnormal-img">'+
      '<h5 class="abnormal-tip">暂无数据~</h5>'+
      '</div>'
    },
    meta: {
      showMenu: false,
      wechatTitle: '暂无数据'
    }
  },
  {
    path: '*',
    component: {
      template: '<div>' +
        '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYYAAAGGCAMAAABIXtbXAAAATlBMVEUAAACqqqqpqampqampqampqampqamoqKipqampqamurq61tbWpqampqampqamqqqq/v7+pqampqampqamoqKipqamoqKioqKioqKioqKicUdWLAAAAGXRSTlMAM4B/7Z2YGtx2JAsu+K5JBuTBimvNqrBbu+JlMwAABylJREFUeNrs10GKg0AURdFSwZ53yMD9bzQRUoMEMtFQeeGfs4L/vKDYAAAAAAAAAAAAAPiOZRtqacgQS4YI9wxzG2SWQYZoMkToGaYB1m1bp91fQ4ZAMkSQIYIMEWSIIMOnLGf8j81wXXeX5ZDsn47tlKEZTmrJZIiwP8nDvvNSmg/4gQwVPtEyyCCDDDLIIMODDDLI0MkggwydDDLI0MkgQ7kM48ggwysZZHhnGkQGGZ7IIIMMnQwyyNBFZsiXPjP9viIz0+8rMjP9viIz0+8rMjP9viIz0+8rMjP9viIz0+8rMjP9viIz0+8rMjP9viIz0++7kUcvJwhEUQBDFRQ3AyMuhNd/o35uC29xIKkgIZFM3S+SqftFMnW/SKbuF8nU/SKZul8kU/eLZOp+kUzdL5Kp+0Uydb9Ipu4XydT9Ipm6XyRT94tk6n6RTN0vkqn7RTJ1v0im7hfJ1P0imbpfJFP3i2TqfpFM3S+SqftFMnW/SKbuF8nU/SKZul8kU/eLZOp+kUzdL5Kp+0Uydb9Ipu4XydT9Ipm6XyRT94tk6n6RTN0vkqn7RTJ1v0im7hfJ1P0imbpfJFP3i2TqfpFM3S+SqftFMnW/SKbuF8nU/SKZul8kU/eLZOp+kcydfse5We5xPsHMH/CGY637Vrfrbb29zD/whnPNh40X1svL/ANvuNznw8YLtwPM/CFvmA87L1zJzC/0hvkAXohtmA/ehdqG+cBdyG2YD9qF3ob5gF0IbpgP1oXihvlAXUhumA/SheaG+QBdiG6YD86F6ob5wFzIbpgPyoXuhvmAXAhvmA/GhfKG+UBcSG+YD8KF9oYPufau2jAQBlGYhEBk4UtIEdj3f9FgVlO52H9BRmc0W7k8ow8sgdQdAArhDN3heIV0hu5wuEI8gxwmFexm4vvkMKXgNxPfJ4cZBcOZ+D45TCg4zsT3yaGuYDkT3yeHsoLnTHyfHKoKpjPxfXIoKrjOxPfJoaZgOxPfJ4eSgu9MfJ8cKgrGM/F9cigoOM/E98lhrGA9E98nh6GC90x8nxxGCuYz8X3dYajgPhPf93S4DxXsZ+L7ng5DBf+Z+L57a+02UDjBTHjfx1cbvxf1nwnveyrchg72M+F9/Rlp+H7afSa8T0+qIwfzmfA+KYwdrGfC+6RQcHCeCe+TQsXBeCa8TwolB9+Z8D4p1BxsZ8L7pFB0cJ0J75NC1cF0JrxPCmUHz5nwPinUHSxnwvukMOHgOBPeJ4UZB8OZ/ayXldknhTkHV4alLcg+KUw6uDK01oh9Uph0QFyc8zBIYdYBcXFOwyCFaQfExTkLgxQOd4hmkMLxDskMUgA4BDNIgeDwdob18tlPa237dVkJfVJAOLydYWmvZwH0SYHhkMogBYhD6J+SFCgOmbdoKWAcIhmkwHFIZJACyCGQQQokhzwGKaAc4hikwHJIY5ACzCHsJagUaA5ZnwRIAecQ9YGMFHgOSQxSADoEMUiB6JDDcN0UkA45DL9S2NfhAZvZD5fhTwr7OlxhM7eDZfh5fO+f97jSZm4Hy4A+9Jn0vpCZ9L6QmfS+kJn0vpCZ9L6QmfS+kJn0vpCZ9L6QmfS+kJn0vpCZ9L6QmfS+f/bNZUVhIIqCPQqSt8b4Ov//o7NxoQRpRzpjhXtq66aKg8RO4xczm6p6dbuP8Fshn2TWUv3iI4TfCvkkcyNtXnyE8FshngGBZ0DgGRB4BgSeAYFnQPCHzKbSjPk5zjMsnFlrzvwc5xn8bVgtfjYg8AwIPAMCz4DAMyDwDAg8AwLfviHwXTQCeibdL0gm3S9IJt0vSCbdL0gm3S9IJt0vSCbdL0gm3S9IJt0vSCbdL0gm3S9IJt0vSCbdL0gm3S9IJt0vSCbdL0gm3S9IJt0vSCbdL0gm3S9IJt3v3zLb22Xs+/Fya9M7eIZFMk+j7oyn9AaeYYHMdtADQ5uyeIbymYejpKru2rarK0nHQ8rhGcpn7iRNh/skk6RdyuIZSmd2kurn/yB2KYNnKJ45SNf0wFUaUg7PUDiz7aUmPdBIfe4p7RlKZ+6lc3riLO1TBs9QOPMk7WaP7NzhwTOUztxKU3pikrYpg2fwt2Gt+NmAwL+UEPjcgMCnaAR+p4TAb1gR+L4BgW/fEPguGgE9k+4XJJPuFyST7hckk+4XJJPuFyST7hckk+4XJJPuFyST7hckk+4XJJPuFyTzi34/i4HK9AyITM+AyPQMv+3RQQ3DQAADwVOL4vgTLYN+s5FnEHjlRKYbEpluSGS6IZHphkSmGxKZbkhkuiGR6YZEphsSmW5IZLohkVm/4Y+5zPq+kcz6vpHM+r6RzPq+kcz6vpHM+r6RzPq+kcz6vpHM+r6RzPq+kcz6vpHM+r6RzPq+kcz6vpHM+r6RzPq+kcz6vpHM+r6RzHvvZ8ALbhhxyu6MU/adcQAAAAAAAAAAAAAAAAAAAAB4yg/FkbI07YfeDQAAAABJRU5ErkJggg==" class="abnormal-img">'+
        '<h5 class="abnormal-tip">页面不存在~</h5>'+
        '</div>'
    },
    meta: {
      showMenu: false,
      wechatTitle: '页面不存在'
    }
  }
]

// 创建router实例，然后传 `routes` 配置
const router = new VueRouter({
  mode: 'hash', // hash 模式会有个uglify的# history
  routes: routes,
  scrollBehavior (to, from, savedPosition) { // 路由滚动行为,也可以通过路由元信息 meta 针对特定的路由做滚动行为
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  linkActiveClass: 'router-link-active'
})


router.beforeEach((to, from, next) => { // 注册一个全局的before钩子,按照创建顺序调用。钩子是异步解析执行，此时导航在所有钩子 resolve(释放) 完之前一直处于 等待中
   //console.log(`come from ${from.path}` + ` ${from.fullPath}`)
   //console.log(`come from ${from.query}` + ` ${from.fullPath}`)
   //console.log(`go to ${to.path}` + ` ${to.fullPath}`)
  var matched = to.matched[0]
  //console.log('========meta 元信息============')
  //alert(JSON.stringify(matched))
  //alert(JSON.stringify(matched2))
  //console.log('========meta 元信息============')

  // 处理第三方网页回退到微信公众号
  if(from.query.thirdPartyWebPage && from.query.thirdPartyWebPage == '1'){
    document.getElementById('SQBJLinkPage').remove()
  }

  // 非菜单栏访问的地址,一律屏蔽
  if((Config.detail.openId == 'undefined' || !Config.detail.openId) && matched.name != 'about'){
    try {
      if(!Filter.isWeiXin()){
        window.close()
        return false
      }
      var wxAuth = JSON.parse(Filter.cookie('wxAuth'))
      //注入配置信息
      wx.config({
        debug: false,//是否开启debug模式
        appId: wxAuth.appId,
        timestamp: wxAuth.timestamp,
        nonceStr: wxAuth.nonceStr,
        signature: wxAuth.signature,
        jsApiList: [
          'closeWindow'
        ]
      })
      wx.ready(function(){
        wx.closeWindow()
      })
      // 错误日志抛出
      wx.error(function (res) {
        //alert("微信JSSDK日志"+JSON.stringify(err))
      })
    } catch (e){
      //alert("微信JSSDK失败")
    }
    return false
  }

  // 微信浏览器拦截
  if(!Config.detail.isWeiXin && !matched.meta.noWechat){
    next({ path: '/no-wechat' })
    return false
  }

  // 页面初始化的时候,去拿微信的验证信息
  if (!store.state.wxAuth) {
    store.dispatch('getWxAuth');
  }

  // 需要选择小区
  if (matched.meta.requiresCommunity && (!store.state.switchLocation.communityId && !Config.detail.communityId)) {
    next({path: '/community'})
    return false
  }

  // 需要绑定
  if (matched.meta.requiresBind && (store.state.isRegister != 'Y' && Config.detail.isRegister != 'Y')) {
    next({path: '/login'})
    return false
  }

  // 菜单栏
  if (matched.meta.showMenu) {
    store.commit('setShowMenu', true)
  } else {
    store.commit('setShowMenu', false)
  }

  // title
  if (to.matched.some(record => record.meta.wechatTitle)) {
    document.getElementById('wechatTitle').innerHTML = matched.meta.wechatTitle
  }

  // 进行管道中的下一个钩子
  next()

  // next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。
})


/**
 * fix ios spa web-app title no change bug
 */

const iframeLoad = function (src) {
  let iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = src
  document.body.appendChild(iframe)
  iframe.addEventListener('load', function () {
    setTimeout(function () {
      iframe.remove()
    }, 0)
  })
}

router.afterEach((to, from) => {
  if (Config.detail.isIOS) {
    document.getElementById('wechatTitle').innerHTML = to.meta.wechatTitle || '社区半径'
    let src = 'static/fixIOSTitle.html?' + Math.random()
    iframeLoad(src)
  }
})

export default router
