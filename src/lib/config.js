/**
 * Created by marszed on 16/11/9.
 */
import Filter from '../lib/filter'


var userAgent = window.navigator.userAgent,
    clientOSVersion = userAgent.match(/MicroMessenger\/([\d\.]+)/i),
    windowOrigin = window.location.origin

const Config = {}

const isRegister = Filter.getQueryString('isRegister')
const openId = Filter.getQueryString('openId')
const userOpenId = Filter.getQueryString('userOpenId')
const communityId = Filter.getQueryString('communityId')
const communityName = Filter.getQueryString('communityName')
const sessionToken = Filter.getQueryString('sessionToken')
const userTargetKey = Filter.getQueryString('state')

Config.detail = {
  isRegister: isRegister == 'Y' ? 'Y' : 'N',
  openId: (openId && openId != null && openId != 'null') ? openId : '',
  userOpenId: (userOpenId && userOpenId != null && openId != 'null') ? userOpenId : '',
  clientOSVersion: clientOSVersion ? clientOSVersion[1] : '',
  communityId: (communityId && communityId != null && openId != 'null') ? communityId : '',
  communityName: (communityName && communityName != null && openId != 'null') ? communityName : '',
  sessionToken: (sessionToken && sessionToken != null && openId != 'null') ? sessionToken : '',
  userTargetKey: (userTargetKey && userTargetKey != null && openId != 'null') ? userTargetKey : '',
  isWeiXin: Filter.isWeiXin(),
  isIOS: Filter.isIOS()
}

var hostConfig = {
  pro: {
    host: 'http://mapi-api.shequbanjing.com',
    static: 'http://static.m.shequbanjing.com',
    keyByte: 'Z2lnb2xkODg4QGNz', // gigold888@cs
    mobileAPI: 'http://wx.shequbanjing.com/api', //老系统地址 http://qa.mobile.api.shequbanjing.com
    apiWeChat: 'http://wx.shequbanjing.com', // 微信公众号接口地址
    api: 'http://wx.shequbanjing.com/mapi',// 新系统地址 http://qa.api.shequbanjing.com
    origin: 'http://wx.shequbanjing.com'
  },
  qa: {
    keyByte: 'Z2lnb2xkODg4QGNz', // gigold888@cs
    mobileAPI: 'http://qa.wx.shequbanjing.com/api', //老系统地址 http://qa.mobile.api.shequbanjing.com
    apiWeChat: 'http://qa.wx.shequbanjing.com', // 微信公众号接口地址
    api: 'http://qa.wx.shequbanjing.com/mapi',// 新系统地址 http://qa.api.shequbanjing.com
    origin: 'http://qa.wx.shequbanjing.com'
  },
  sit: {
    keyByte: 'MTIzNDU2', // 123456
    mobileAPI: 'http://cs-dev-api.shequbanjing.com/api', //老系统地址
    apiWeChat: 'http://cs-dev-api.shequbanjing.com/lehome-wechat', // 微信公众号接口地址
    api: 'http://cs-dev-api.shequbanjing.com/mapi',// 新系统地址
    origin: 'http://cs-dev-api.shequbanjing.com'
  }
}

Config.host = {
  map: (windowOrigin == 'http://wx.shequbanjing.com') ? hostConfig.pro : (windowOrigin == 'http://cs-dev-api.shequbanjing.com' ? hostConfig.sit : hostConfig.qa)
}

Config.headers = {
  'API-Client-ID': Config.detail.openId,
  'API-APP-ID': 'sqbj_weixin',
  'API-Session-Token': Config.detail.sessionToken,
  'API-User-OpenID': Config.detail.userOpenId,
  'SID': Config.detail.openId,
  'GID': Config.detail.openId,
  'clientOSVersion': Config.detail.clientOSVersion,
  'appVersion': 'dev-v2.2.2.0',
  'appId': 'sqbj_weixin',
  'clientId': Config.detail.openId,
  'termId':Config.detail.openId,
  'termTyp':'weixin'
}

Config.errorTips = function(res,type,log){
  if(type == 'response'){ // 接口完成响应
    if(res.body.rspCd){ // 新接口存在返回码
      if(res.body.rspCd != '00000'){
        this.showToast = true
        this.textToast = log || res.body.rspInf || res.statusText || res.url // 优先取设置的日志
        setTimeout(()=>{
          this.showToast = false
          this.textToast = ''
        },1000)
        //alert('新接口异常日志:'+JSON.stringify(res.body)+res.url)
        return false
      }
    } else { // 老接口不存在返回码
      if(!res.body){
        //alert('老接口异常日志:'+JSON.stringify(res))
      }
    }
  }
  if(type == 'err'){ // 接口出错
    this.showToast = true
    this.textToast = log || '接口异常'
    setTimeout(()=>{
      this.showToast = false
      this.textToast = ''
    },1000)
  }
}

/**
 * 处理跳转第三方网页,js内存缓存的数据丢失,造成不能正常浏览的问题
 */

Config.thirdPartyWebPage = function(src){
  if( !src.match(/(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g)){
    return false
  }
  let iframe = document.createElement('iframe')
  iframe.setAttribute("id", "SQBJLinkPage")
  iframe.src = src
  iframe.style.border = 'none'
  iframe.style.display = 'block'
  iframe.style.width = '100%'
  iframe.style.height = '100%'
  iframe.style.position = 'fixed'
  iframe.style.top = '0'
  iframe.style.left = '0'
  iframe.style.overflowY = 'scroll'
  iframe.style.zIndex = '9999999'
  document.body.appendChild(iframe)
  iframe.addEventListener('load', function () {
    setTimeout(function () {
      document.getElementById('wechatTitle').innerHTML = ''
    }, 0)
  })
}

export default Config
