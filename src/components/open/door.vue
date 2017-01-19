<template>
  <div style="height: 100%">
    <redPacket :config="config" ref="redPacket" v-on:toRedPacketDetail="toRedPacketDetail"></redPacket>
    <pull-to-refresh
      :disable-pullup="true"
      @on-pulldown='onPulldown'
      class="scroll-page">
      <div class="banner-header banner-open">
        <a class="banner-location" href="javascript:;" v-if="locationCommunityName" @click="setUserTargetKey">{{locationCommunityName}}</a>
        <router-link to="/my/about" class="banner-tip">了解刷手机开门 >></router-link>
      </div>
      <ul class="door-list" v-if="doorList.length">
        <li @click="openDoor(item)" v-for="(item, $index) in doorList" :key="item.id">
          <div class="door-box">
            <div class="door-img-box clearfix fl"
                 v-bind:class="{ 'door-img-box-active': (item.onlineStatus == 'Yes' ? true : false), 'door-img-box-default' : (item.onlineStatus != 'Yes' ? true : false)}">
              <div class="door-img" v-bind:class="{ 'door-img-open': item.open }">
                <div class="door-left fl"></div>
                <div class="door-right fr"></div>
                <i class="iconfont" v-if="!item.open" v-bind:class="{'swing': item.swing,'iconfont-active': item.onlineStatus == 'Yes' ? true : false}">&#xe66c;</i>
                <i class="iconfont" v-if="item.open">&#xe66b;</i>
              </div>
            </div>
            <div class="door-content fl">
              <h5>{{item.displayName}}</h5>
              <p>{{item.lastOpenTime | timeFormat}}</p>
            </div>
          </div>
        </li>
      </ul>
      <unauthorized :config="config"></unauthorized>
      <div class="door-position"></div>
    </pull-to-refresh>
    <div>
      <loading :show="showLoading" :text="textLoading"></loading>
      <toast type="text" :show="showToast" :text="textToast"></toast>
    </div>
  </div>
</template>

<script>
  import Config from '../../lib/config'
  import Filter from '../../lib/filter'
  import Unauthorized from '../common/unauthorized'
  import RedPacket from '../common/redPacket'
  import Loading from 'vux-components/Loading'
  import Toast from 'vux-components/Toast'
  import PullToRefresh from '../common/scroll/pull-to-refresh.vue'

  export default {
    name: 'door',
    components: {
      Unauthorized,
      RedPacket,
      Loading,
      Toast,
      PullToRefresh
    },
    data () {
      return {
        showLoading: true,
        textLoading: '加载中...',
        showToast: false,
        textToast: '异常',
        height: window.innerHeight,
        config: {
          showRedPacket: false,
          showUnauthorized: false,
          content1: '无法使用开门',
          content2: '成为小区认证用户后即可体验社区半径开门功能',
          linkFlag: true
        },
        isVisitor: '',//访客标示
        doorList: '',
        locationCommunityId: this.$store.state.switchLocation.communityId
      }
    },
    computed: {
      locationCommunityName: function () {
        return this.$store.state.switchLocation.communityName
      }
    },
    methods: {
      onPulldown(finshCallback) {
        if(this.$store.state.isRegister != 'Y' && Config.detail.isRegister != 'Y'){ // 未绑定
          finshCallback()
          return false
        }
        this.init(finshCallback,'reload')
      },
      setUserTargetKey: function () {
        this.$store.commit('setUserTargetKey','open-door')
        this.$router.push('community')
      },
      toCityList: function () {
        this.$router.push('community/city-list')
      },
      openDoor: function(obj){
        // 离线门禁提示
        if(obj.onlineStatus != 'Yes'){
          this.showToast = true
          this.textToast = '此门目前不可开'
          setTimeout(() => {
            this.showToast = false
            this.textToast = ''
          },1000)
          return false
        }
        // 正在开门的门禁屏蔽频繁操作
        if(obj.open == true){
          return false
        }
        // 锁loading动画开启
        obj.swing = true;
        // 调远程开门接口
        this.$http.post(Config.host.map.apiWeChat+'/business/openRemoteDoor.do',{
          "userId": obj.isVisitor == "YES" ? obj.landlordUserId : '',
          "deviceId": obj.deviceId,
          "deviceNumber": obj.deviceUid,
          "communityId": this.$store.state.switchLocation.communityId,
          "isVisitor":obj.isVisitor
        }).then((response) => {
          // 开门成功
          if(response.body.rspCd == '00000'){
            // 此处的是否是访客标示用来通过路由传递到开门红包
            this.isVisitor = (obj.isVisitor == 'YES' ? 'Y' : 'N')
            // A:微信获取红包查询,判断当次开门是否有红包可领
            this.$http.post(Config.host.map.origin+'/mkt/getWeixinRpg.do',{
              "rpgGetChl": '5', // 领取渠道 2:APP 5:微信
              "communityId": this.$store.state.switchLocation.communityId,
              "isVisitor": obj.isVisitor == 'YES' ? 'Y' : 'N' // 是否访客 Y是 N否
            }).then((res) => {
              if(res.body.rspCd == '00000'){
                if(res.body.rpgId){
                  this.config.showRedPacket = true
                  //调用红包子组件方法
                  var redPacket = this.$refs.redPacket
                  redPacket.getRedPacket(res.body)
                }
              }else{
                Config.errorTips.call(this,response,'response')
              }
            },(err) => {
              Config.errorTips.call(this,err,'err','获取红包查询失败')
            })

            // B:展示开门动画,锁loading动画关闭,更新开门时间
            setTimeout(() => {
              obj.open = true
              obj.swing = false
              for(var i = 0, len = this.doorList.length; i < len; i++){
                if(this.doorList[i].deviceId == obj.deviceId){
                  var lastOpenTime = response.body.responseTm,
                      dateTime = ''
                  if(Config.detail.isIOS){
                    dateTime = lastOpenTime.substr(0,4)+'/'+lastOpenTime.substr(4,2)+'/'+lastOpenTime.substr(6,2)+' '+lastOpenTime.substr(8,2)+':'+lastOpenTime.substr(10,2)+':'+lastOpenTime.substr(12,2)
                  } else {
                    dateTime = lastOpenTime.substr(0,4)+'-'+lastOpenTime.substr(4,2)+'-'+lastOpenTime.substr(6,2)+' '+lastOpenTime.substr(8,2)+':'+lastOpenTime.substr(10,2)+':'+lastOpenTime.substr(12,2)
                  }
                  this.doorList[i].lastOpenTime = (new Date(dateTime)).getTime()
                  break
                }
              }
            },300)

            // C:3s之后关门
            setTimeout(() => {
              obj.open = false
            },3000)
          } else {
            // 开门失败
            obj.swing = false // 锁loading动画关闭
            Config.errorTips.call(this,response,'response')
          }
        }, (err) => {
          // 开门异常
          obj.open = false
          Config.errorTips.call(this,err,'err','远程开门失败')
        })
      },
      queryGuardList: function(finshCallback,type){
        this.$http.post(
            Config.host.map.apiWeChat+'/business/queryGuardList.do',
            {
              communityId: this.$store.state.switchLocation.communityId
            }).then((response) => {
              this.showLoading = false

              // 下拉刷新
              if(type == 'reload'){
                finshCallback()
              }
              // 门禁列表异常
              if(response.body.rspCd != '00000'){
                Config.errorTips.call(this,response,'response')
                return false
              }

              // 门禁列表为空
              if(!response.body.data || !response.body.data.length){
                this.config.showUnauthorized = true // 没有拉取到数据全部当做未认证处理
                this.config.linkFlag = false
                this.config.content2 = '该小区尚未安装门禁设备'
                this.doorList = ''
                this.$store.commit('delDoorList') // 更新store,清除本地缓存
                return false
              }


              var getterData = response.body.data,
                  doorListDataOnline = [],
                  doorListDataOffline = []
              for(var i = 0, len = getterData.length; i < len; i++){
                for(var j = 0, Len = getterData[i].deviceInfoList.length; j < Len; j++){
                  if(getterData[i].deviceInfoList[j].deviceType == 'NFC'){
                    getterData[i].deviceInfoList[j].open = false
                    getterData[i].deviceInfoList[j].swing = false
                    getterData[i].deviceInfoList[j].displayName = getterData[i].displayName
                    getterData[i].deviceInfoList[j].lastOpenTime = getterData[i].lastOpenTime
                    getterData[i].deviceInfoList[j].isVisitor = getterData[i].isVisitor
                    getterData[i].deviceInfoList[j].landlordUserId = getterData[i].landlordUserId
                    //在线状态的门禁靠前排列
                    if(getterData[i].deviceInfoList[j].onlineStatus == 'Yes'){
                      doorListDataOnline.push(getterData[i].deviceInfoList[j])
                    } else {
                      doorListDataOffline.push(getterData[i].deviceInfoList[j])
                    }
                    break
                  }
                }
              }

              // 有门禁列表关闭提示
              this.config.showUnauthorized = false
              this.doorList = doorListDataOnline.concat(doorListDataOffline)
                  this.$store.commit('setDoorList',this.doorList) // 更新store,更新本地缓存
              }, (err) => {
                Config.errorTips.call(this,err,'err','门禁列表获取失败')
              })

      },
      authFun: function(data){
        var flag = false // 默认未认证
        if(data && data.length){
          for(var i = 0, len = data.length; i < len; i++){
            if(data[i].communityId == this.$store.state.switchLocation.communityId){
              flag = true
              break
            }
          }
        }
        return flag
      },
      init: function(finshCallback,type){
        this.$http.post(Config.host.map.apiWeChat+'/business/queryHouseList.do',{}).then((response) => {
          if(response.body.items && response.body.items.length){
            // 更新本地房产列表缓存
            this.$store.commit('setHouseList',response.body.items) // 更新store,更新本地缓存
            // 判断此用户在当前小区有无房产,有房产即有认证,无房产即无认证
            if(!this.authFun(response.body.items)){
              if(type){
                finshCallback()
              }
              this.showLoading = false
              this.config.showUnauthorized = true
              this.config.linkFlag = true
              this.config.content2 = '成为小区认证用户后即可体验社区半径开门功能'
            } else {
              // 优先读取门禁列表本地缓存
              if(this.$store.state.doorList){
                this.doorList = this.$store.state.doorList
                this.showLoading = false
              }
              // 再次拉取新数据
              setTimeout(() => {
                if(type){
                  this.queryGuardList(finshCallback,type) // 下拉刷新的
                } else {
                  this.queryGuardList()
                }
              },0)
            }
          } else {
            this.showLoading = false
            this.$store.commit('delHouseList') // 更新store,清除本地缓存
            Config.errorTips.call(this,response,'response')
          }
        }, (err) => {
          if(type){
            finshCallback()
          }
          this.showLoading = false
          Config.errorTips.call(this,err,'err','获取房屋信息失败')
        })
      },
      // 红包子组件调用父组件
      toRedPacketDetail: function(rpgId){
        if(rpgId){
          this.$router.push({ path: '/open-door/redPacketDetail', query: { isVisitor: this.isVisitor } })
        } else {
          this.config.showRedPacket = false
          this.showToast = true
          this.textToast = '红包领取失败'
          setTimeout(() => {
            this.showToast = false
          this.textToast = ''
        },1000)
        }
      }
    },
    watch: {
      locationCommunityId: function(val ,oldVal){
        if(val != oldVal){ // 重新走验证是否认证过当前小区,当前小区门禁列表流程
          this.init()
        }
      }
    },
    filters: {
      timeFormat: function (value) {
        if(value){
          return '上次开门时间：'+Filter.timeFormat('YMDHIS',value-0)
        }else{
          return '暂无开门记录'
        }
      }
    },
    created: function(){
      if(this.$store.state.isRegister != 'Y' && Config.detail.isRegister != 'Y'){ // 未绑定
        this.showLoading = false
        this.config.showUnauthorized = true
        this.config.linkFlag2 = true
        this.config.linkFlag = false
        this.config.content2 = '请绑定账号'
        return false
      }
      // 查询用户的房产列表判断当前小区是否已认证
      if(!this.authFun(this.$store.state.houseList)){ // 缓存-当前小区未认证
        this.showLoading = false
        this.config.showUnauthorized = true
        this.config.linkFlag = true
        this.config.content2 = '成为小区认证用户后即可体验社区半径开门功能'
        this.init()
      } else { // 缓存-当前小区已认证
        // 优先读取门禁列表本地缓存
        if(this.$store.state.doorList){
          this.doorList = this.$store.state.doorList
          this.showLoading = false
        }
        // 再次拉取新数据
        setTimeout(() => {
          this.queryGuardList()
        },0)
      }
    }
  }
</script>

<style lang="scss">
  @import "../../../static/scss/base/_toRem.scss";
  @import "../../../static/scss/components/_banner.scss";

  @-webkit-keyframes swing {
    20%, 40%, 60%, 80%, 100% {
      -webkit-transform-origin: center center
    }
    20% {
      -webkit-transform: rotate(30deg)
    }
    40% {
      -webkit-transform: rotate(-30deg)
    }
    60% {
      -webkit-transform: rotate(5deg)
    }
    80% {
      -webkit-transform: rotate(-5deg)
    }
    100% {
      -webkit-transform: rotate(0deg)
    }
  }

  @keyframes swing {
    20%, 40%, 60%, 80%, 100% {
      -webkit-transform-origin: center center
    }
    20% {
      -webkit-transform: rotate(30deg)
    }
    40% {
      -webkit-transform: rotate(-30deg)
    }
    60% {
      -webkit-transform: rotate(5deg)
    }
    80% {
      -webkit-transform: rotate(-5deg)
    }
    100% {
      -webkit-transform: rotate(0deg)
    }
  }

  .swing {
    transform-origin: top center;
    animation-name: swing;
    -webkit-transform-origin: top center;
    -webkit-animation-name: swing;
  }
  .door-list{
    & > li{
      height: toRem(220);
      background: #FFFFFF;
      box-shadow: inset 0 -1px 0 0 #EFF0F0;
      padding: toRem(40) toRem(30);
      box-sizing: border-box;
    }
  }
  .door-img-box{
    margin-right: toRem(20);
  }
  .door-img{
    position: relative;
    width: toRem(71*2);
    height: toRem(140);
    overflow: hidden;
    .door-left, .door-right{
      position:relative;
      width: 50%;
      height: 100%;
      transition: all .5s ease;
      background: rgba(131,202,243,0.40);
      box-sizing: border-box;
    }
    .door-left{
      -webkit-transform-origin:0 0;
    }
    .door-right{
      -webkit-transform-origin:100% 0;
    }
    .iconfont{
      position: absolute;
      font-size: toRem(60);
      width: toRem(60);
      height: toRem(60);
      display: block;
      line-height: toRem(62);
      text-align: center;
      top: 50%;
      left: 50%;
      margin-top: toRem(-30);
      margin-left: toRem(-30);
      z-index: 5;
      animation-duration: 1.5s;
      animation-delay: 0.2s;
      animation-timing-function: ease;
      animation-fill-mode: both;
      animation-iteration-count: infinite;
      -webkit-animation-duration: 1.5s;
      -webkit-animation-delay: 0.2s;
      -webkit-animation-timing-function: ease;
      -webkit-animation-fill-mode: both;
      -webkit-animation-iteration-count: infinite;
    }
    .iconfont-active{
      background-color: #fff;
      border-radius: 100%;
    }
    &:before,&:after{
      content:' ';
      position:absolute;
      left:0;
      width:0;
      height:0;
      overflow:hidden;
      border-color:#fff transparent transparent transparent;
      border-style:solid;
      border-width:0 toRem(71);
      z-index:2;
      transition:all .8s ease;
      -webkit-transition:all .8s ease;
    },
    &:before{
       top: 0;
     },
    &:after{
      bottom:0;
      border-color:transparent transparent #fff transparent;
    }
  }
  .door-img-box-active{
    border: 1px solid #83CAF3;
    .door-left, .door-right{
      background: rgba(131,202,243,0.40);
    }
    .door-left,.door-right{
      position: relative;
      &:after{
         content: ' ';
         display: block;
         position: absolute;
         width: 1px;
         height: 200%;
         top: 0;
          z-index: 3;
         background-color: #83CAF3;
         -webkit-transform-origin: 0 0;
         transform-origin: 0 0;
         -webkit-transform: scale(.5,.5);
         transform: scale(.5,.5);
         -webkit-box-sizing: border-box;
         box-sizing: border-box
     }
    }
    .door-left{
    &:after{
       right: 0;
     }
    }
    .door-right{
    :after{
      left: 0;
    }
    }
    .iconfont{
      color: #83CAF3;
    }
  }
  .door-img-box-default{
    border: 1px solid #DCDCDC;
    .door-left, .door-right{
      background: rgba(220,220,220,0.40);
    }
    .door-left,.door-right{
      position: relative;
      &:after{
         content: ' ';
         display: block;
         position: absolute;
         width: 1px;
         height: 200%;
         top: 0;
         z-index: 3;
         background-color: #DCDCDC;
         -webkit-transform-origin: 0 0;
         transform-origin: 0 0;
         -webkit-transform: scale(.5,.5);
         transform: scale(.5,.5);
         -webkit-box-sizing: border-box;
         box-sizing: border-box
       }
    }
    .door-left{
    &:after{
       right: 0;
     }
    }
    .door-right{
    :after{
      left: 0;
    }
    }
    .iconfont{
      color: #DCDCDC;
    }
  }
  .door-img-open{
    .door-left{
      -webkit-transform:rotateY(-85deg);
      transition:all .8s ease-out;
    }
    .door-right{
      -webkit-transform:rotateY(85deg);
      transition:all .8s ease-out;
    }
    &:before, &:after{
       border-width:toRem(40) toRem(71);
     }
  }
  .door-content{
    h5{
      font-size: toRem(36);
      color: #3C3C3C;
      line-height: toRem(50);
      height: toRem(50);
      margin-bottom: toRem(20);
    }
    p{
      font-size: toRem(24);
      color: #a8a8a8;
      line-height: toRem(33);
    }
  }
  .door-position{
    height: toRem(100);
  }

  .scroll-page{
    height:100%;
    position: relative;
    /* Prevent native touch events on Windows */
    -ms-touch-action: none;
    /* Prevent the callout on tap-hold and text selection */
    -webkit-touch-callout: none;
    user-select: none;
    text-size-adjust: none;
  }

  /*scrollbar start*/
  .iScrollVerticalScrollbar {
    position: absolute;
    z-index: 9999;
    width: toRem(2);
    bottom: toRem(2);
    top: toRem(2);
    right: toRem(2);
    overflow: hidden;
  }

  .iScrollVerticalScrollbar.iScrollBothScrollbars {
    bottom: toRem(18);
  }

  .iScrollIndicator {
    position: absolute;
    background: #999;
    border-radius: toRem(6);
    opacity: .8;
  }

  .iScrollVerticalScrollbar .iScrollIndicator {
    width: 100%;
    background: #999;
  }
  /*scrollbar end*/
</style>

