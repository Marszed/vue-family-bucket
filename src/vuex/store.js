/**
 * Created by marszed on 16/11/10.
 */
// 加载核心库
import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'

import Filter from '../lib/filter'
import Config from '../lib/config'

Vue.use(Vuex)
Vue.use(VueResource)

const cityCommunityLocalStorage = Filter.getLocalStorage('cityCommunity')
const houseListLocalStorage = Filter.getLocalStorage('houseList')
const doorListLocalStorage = Filter.getLocalStorage('doorList')
const cityCommunity = (cityCommunityLocalStorage && cityCommunityLocalStorage != null) ? cityCommunityLocalStorage : ''

const store = new Vuex.Store({
  state: { // 元数据
    showMenu: false, // 是否展示底部悬浮菜单栏
    userTargetKey: Config.detail.userTargetKey, // 用户点击菜单栏关键字
    isRegister: Config.detail.isRegister, // 是否注册
    openId: Config.detail.openId, // 微信id
    switchLocationOld: { // 用户切换小区旧值
      cityId:  cityCommunity ? cityCommunity.cityId : '', // 城市ID
      cityName: cityCommunity ? cityCommunity.cityName : '', // 城市名
      communityId: Config.detail.communityId || (cityCommunity ? cityCommunity.communityId : ''), // 小区ID
      communityName: Config.detail.communityName || (cityCommunity ? cityCommunity.communityName : '') //小区名
    },
    switchLocation: { // 用户切换小区
      cityId:  cityCommunity ? cityCommunity.cityId : '', // 城市ID
      cityName: cityCommunity ? cityCommunity.cityName : '', // 城市名
      communityId: Config.detail.communityId || (cityCommunity ? cityCommunity.communityId : ''), // 小区ID
      communityName: Config.detail.communityName || (cityCommunity ? cityCommunity.communityName : '') //小区名
    },
    authLocation: { // 用户认证小区
      cityId:  cityCommunity ? cityCommunity.cityId : '', // 城市ID
      cityName: cityCommunity ? cityCommunity.cityName : '', // 城市名
      communityId: Config.detail.communityId || (cityCommunity ? cityCommunity.communityId : ''), // 小区ID
      communityName: Config.detail.communityName || (cityCommunity ? cityCommunity.communityName : ''), //小区名
      areaId: '', // 小区ID
      areaName: '', // 小区名
      floorName: '', // 楼栋名
      floorId: '', // 楼栋ID
      unitNo: '', // 单元名
      unitId: '', // 单元ID
      houseName: '', // 房间名
      houseId: '', // 房间id
      phone: '',
      name: '', // 认证用户姓名
      role: '' //认证角色 业主 owner 租户 tenant 其它 other
    },
    location: { // 经纬度
      latUde: '',
      lngUde: '',
      cityName: '',
      cityId: ''
    },
    redPacket: {},
    noticeList:"",//公告列表
    pageInfoObj:"",//公告分页数据
    houseId:"",//房子id
    setHouseObj:"",//房屋详情
    entifyMsg:"",//个人信息
    getLatLngCount: 0,
    cityItems: '', // 用户小区列表
    nearbyCityItems: '', // 用户附近小区列表
    wxAuth: '', // 微信验证签名
    doorList: (doorListLocalStorage && doorListLocalStorage != null) ? doorListLocalStorage : '', // 门禁列表缓存
    houseList: (houseListLocalStorage && houseListLocalStorage != null) ? houseListLocalStorage : '' // 房屋列表缓存
  },
  getters: { // 数据包装
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    },
    openId: state => {
      return state.openId
    }
  },
  mutations: { // 数据状态更改muta 实际改变 状态(state) 的唯一方式是通过 提交(commit) 一个 mutation 只能是同步操作
    updateCityCommunity (state){
      state.switchLocation.cityId = state.switchLocationOld.cityId
      state.switchLocation.cityName = state.switchLocationOld.cityName
      state.switchLocation.communityId = state.switchLocationOld.communityId
      state.switchLocation.communityName = state.switchLocationOld.communityName
    },
    setUserTargetKey (state, data) {
      if(data){
        state.userTargetKey = data
      }
    },
    setRedPacket (state, data) {
      if(data && data.rpgId){
        state.redPacket.rpgId = data.rpgId
        state.redPacket.formMyRedPacket = data.formMyRedPacket
      }
    },
    setCityCommunityStorage (state ,data) {
      if(data){
        var cityCommunity = Filter.getLocalStorage('cityCommunity') || {}
        if(data.cityId && data.cityName){
          cityCommunity.cityId = data.cityId
          cityCommunity.cityName = data.cityName
        }
        if(data.communityId && data.communityName){
          cityCommunity.communityId = data.communityId
          cityCommunity.communityName = data.communityName
        }
        Filter.setLocalStorage('cityCommunity',cityCommunity)
      }
    },
    setDoorList (state ,data) {
      if(data){
        state.doorList = data
        Filter.setLocalStorage('doorList',data)
      }
    },
    delDoorList (state) {
      state.doorList = ''
      Filter.delLocalStorage('doorList')
    },
    setHouseList (state ,data) {
      if(data){
        state.houseList = data
        Filter.setLocalStorage('houseList',data)
      }
    },
    delHouseList (state) {
      state.houseList = ''
      Filter.delLocalStorage('houseList')
    },
    setLocalSwitchLocationCity (state ,data) {
      if(data){
        Filter.setLocalStorage('localSwitchLocationCity',data)
      }
    },
    setLocalSwitchLocationCommunity (state ,data) {
      if(data){
        Filter.setLocalStorage('localSwitchLocationCommunity',data)
      }
    },
    setHouseObjStore (state ,data) {
      if(data){
        state.setHouseObj = data;
      }
    },
    setnNoticeList (state, data) { // 入参 类型, 值
      if(data){
        state.noticeList = data;
      }
    },
    setNoticePagecount (state, data) { // 入参 类型, 值
      if(data){
        state.pageInfoObj = data;
      }
    },
    setHouseIdStore (state, houseId) { // 入参 类型, 值
      if(houseId){
        state.houseId = houseId;
      }
    },
    setnEntifyMsg (state, entifyMsg) { // 入参 类型, 值
      if(entifyMsg){
        state.entifyMsg = entifyMsg;
      }
    },
    setnEntifyMsgIcon (state, entifyMsg) { // 入参 类型, 值
      if(entifyMsg){
        if(state.entifyMsg){
          state.entifyMsg.iconUrl = entifyMsg.iconUrl
        }else{
          state.entifyMsg = {iconUrl: entifyMsg.iconUrl}
        }
      }
    },
    setRegisterState (state, data) { // 入参 类型, 值
      if(data){
        if(data.isRegister) {
          state.isRegister = data.isRegister
          Config.detail.isRegister = data.isRegister
        }
      }
    },
    setShowMenu (state, flag) { // 入参 类型, 值
      state.showMenu = flag
    },
    setCityItems (state, data) {
      state.cityItems = data
    },
    setNearbyCityItems(state, data){
      state.nearbyCityItems = data
    },
    setSwitchLocationCity (state, data){
      if (data) {
        if(data.id) state.switchLocation.cityId = data.id
        if(data.name) state.switchLocation.cityName = data.name
        if(data.cityId) state.switchLocation.cityId = data.cityId
        if(data.cityName) state.switchLocation.cityName = data.cityName
        if(data.communityId) state.switchLocation.communityId = data.communityId
        if(data.communityName) state.switchLocation.communityName = data.communityName
      }
    },
    clearSwitchLocationCity (state,data){
      state.switchLocation.communityId = ''
      state.switchLocation.communityName = ''
    },
    setSwitchLocationCityOld (state, data){
      if (data) {
        if(data.cityId) state.switchLocationOld.cityId = data.cityId
        if(data.cityName) state.switchLocationOld.cityName = data.cityName
        if(data.communityId) state.switchLocationOld.communityId = data.communityId
        if(data.communityName) state.switchLocationOld.communityName = data.communityName
      }
    },
    clearSwitchLocationCityOld (state,data){
      state.switchLocationOld.communityId = ''
      state.switchLocationOld.communityName = ''
    },
    setSwitchLocationCommunity (state, data){
      if (data) {
        if(data.id) state.switchLocation.communityId = data.id
        if(data.name) state.switchLocation.communityName = data.name
      }
    },
    setSwitchLocationCommunityId (state, data){ // 通过url标示带过来的选择小区
      if (data) {
        state.switchLocation.communityId = data
      }
    },
    setGetLatLngCount (state,data){
      state.getLatLngCount = 1
      if(data){
        if(data.id) state.location.cityId = data.id
        if(data.name) state.location.cityName = data.name
        if(data.latUde) state.location.latUde = data.latUde
        if(data.lngUde) state.location.lngUde = data.lngUde
      }
    },
    setAuthLocationCity (state, data){
      if (data) {
        if(data.id) state.authLocation.cityId = data.id
        if(data.name) state.authLocation.cityName = data.name
      }
    },
    setAuthLocationRole (state, data){
      if (data) {
        state.authLocation.role = data
      }
    },
    setAuthLocationPhone (state, data){
      if (data) {
        state.authLocation.phone = data
      }
    },
    setAuthLocationName (state, data){
      if (data) {
        state.authLocation.name = data
      }
    },
    clearAuthLocationCity (state, data) {
      state.authLocation.communityId = '';
      state.authLocation.communityName = '';
      state.authLocation.floorId = '';
      state.authLocation.floorName = '';
      state.authLocation.areaId = '';
      state.authLocation.areaName = '';
      state.authLocation.unitId = '';
      state.authLocation.unitNo = '';
      state.authLocation.houseId = '';
      state.authLocation.houseName = '';
    },
    setAuthLocationCommunity (state, data){
      if (data) {
        if(data.id) state.authLocation.communityId = data.id
        if(data.name) state.authLocation.communityName = data.name
      }
    },
    clearAuthLocationCommunity (state, data) {
      state.authLocation.floorId = '';
      state.authLocation.floorName = '';
      state.authLocation.areaId = '';
      state.authLocation.areaName = '';
      state.authLocation.unitId = '';
      state.authLocation.unitNo = '';
      state.authLocation.houseId = '';
      state.authLocation.houseName = '';
    },
    setAuthLocationFloor (state, data){
      if (data) {
        if(data.id) state.authLocation.floorId = data.id
        if(data.name) state.authLocation.floorName = data.name
        if(data.areaId) state.authLocation.areaId = data.areaId
        if(data.areaName) state.authLocation.areaName = data.areaName
      }
    },
    clearAuthLocationFloor (state) {
      state.authLocation.unitId = '';
      state.authLocation.unitNo = '';
      state.authLocation.houseId = '';
      state.authLocation.houseName = '';
    },
    setAuthLocationHouse (state, data){
      if (data) {
        if(data.id) state.authLocation.houseId = data.id
        if(data.name) state.authLocation.houseName = data.name
        if(data.unitNo) state.authLocation.unitNo = data.unitNo
        if(data.unitId) state.authLocation.unitId = data.unitId
      }
    },
    setWxAuth (state, data){
      if(data){
        state.wxAuth = data
        // 缓存微信配置信息cookie一天
        Filter.cookie('wxAuth',JSON.stringify(data),{expires: 1})
        //注入配置信息
        wx.config({
          debug: false,//是否开启debug模式
          appId: data.appId,
          timestamp: data.timestamp,
          nonceStr: data.nonceStr,
          signature: data.signature,
          jsApiList: [
            'getLocation',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'hideMenuItems'
          ]
        })
        if(Config.detail.communityId && Config.detail.communityId != 'null'){ // 已选择过小区,直接根据小区id查所在城市
          Vue.http.get(Config.host.map.mobileAPI+'/community/user/getCurrentlyCity/'+Config.detail.communityId).then((response) => {
              state.switchLocation.cityId = response.body.data.id
              state.switchLocation.cityName = response.body.data.name
              state.location.cityId = response.body.data.id
              state.location.cityName = response.body.data.name
              state.authLocation.cityId = response.body.data.id
              state.authLocation.cityName = response.body.data.name
          }, (err) => {
            //alert("根据小区ID查询所在城市失败2"+JSON.stringify(err))
          })
          //配置验证通过
          wx.ready(function () {
            //隐藏部分功能按钮
            wx.hideMenuItems({// 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
              menuList: ['menuItem:share:timeline',
                'menuItem:share:appMessage',
                'menuItem:share:qq',
                'menuItem:share:weiboApp',
                'menuItem:favorite',
                'menuItem:share:facebook',
                'menuItem:share:QZone',
                'menuItem:copyUrl',
                'menuItem:originPage',
                'menuItem:openWithQQBrowser',
                'menuItem:openWithSafari'
              ],
              success: function (res) {
                //alert("隐藏");
              }
            })
          })
          //错误日志抛出
          wx.error(function (res) {
            //alert("微信JSSDK日志"+JSON.stringify(err))
          })
        }else{ // 调微信jssdk获取经纬度
          //配置验证通过
          wx.ready(function () {
            //隐藏部分功能按钮
            wx.hideMenuItems({// 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
              menuList: ['menuItem:share:timeline',
                'menuItem:share:appMessage',
                'menuItem:share:qq',
                'menuItem:share:weiboApp',
                'menuItem:favorite',
                'menuItem:share:facebook',
                '/menuItem:share:QZone',
                'menuItem:copyUrl',
                'menuItem:originPage',
                'menuItem:openWithQQBrowser',
                'menuItem:openWithSafari'
              ],
              success: function (res) {
                //alert("隐藏");
              }
            })
            //地理位置获取
            wx.getLocation({
              success: function (res) {

                state.location.latUde = res.latitude
                state.location.lngUde = res.longitude

                //获取地理位置
                if(!state.switchLocation.cityId && !state.location.cityId){
                  Vue.http.post(Config.host.map.api+'/region/getCurrentCity.do',{
                    longitude: res.longitude,
                    latitude: res.latitude
                  }).then((response) => {
                    if(response.body.rspCd != '00000'){
                      return false
                    }
                    state.location.cityId = response.data.cityId
                    state.location.cityName = response.data.cityName
                    state.switchLocation.cityId = response.data.cityId
                    state.switchLocation.cityName = response.data.cityName
                    state.authLocation.cityId = response.data.cityId
                    state.authLocation.cityName = response.data.cityName
                  }, (err) => {
                    //alert("地理位置获取失败"+JSON.stringify(err))
                  })
                }
              }
            })
          })
          //错误日志抛出
          wx.error(function (res) {
            //alert("微信JSSDK日志"+JSON.stringify(err))
          })
        }
      }
    }
  },
  actions: {  // action 不改变状态，只提交(commit) mutation 可以包含任意异步操作
    getWxAuth(context){
      Vue.http.post(Config.host.map.apiWeChat+'/weixin/getSignature.do',{
        requestUrl: window.location.href.split('#')[0]
      }).then((response) => {
        if(response.body.rspCd == '00000'){
          context.commit('setWxAuth', response.body.sign)
        }
      }, (err) => {
        // 微信签名失败
        if(Config.detail.communityId && Config.detail.communityId != 'undefined'){ // 已选择过小区,直接根据小区id查所在城市
          Vue.http.get(Config.host.map.mobileAPI+'/community/user/getCurrentlyCity/'+Config.detail.communityId).then((response) => {
            context.commit('setGetLatLngCount', {
              id: response.body.data.id,
              name: response.body.data.name
            })
            context.commit('setSwitchLocationCity', {
              cityId: response.body.data.id,
              cityName: response.body.data.name
            })
          }, (err) => {
            //alert("根据小区ID查询所在城市失败1"+JSON.stringify(err))
          })
        }
        //alert("获取微信验证签名信息失败"+JSON.stringify(err))
      })
    }
  }
})

export default store
