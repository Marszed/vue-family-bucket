<template>
    <div class="red-packet-detail-box">
      <pull-to-refresh
        :disable-pulldown="true"
        @on-pullup="onPullup"
        class="scroll-page">
        <div class="red-packet-detail-banner">
          <img class="banner-logo" v-bind:src="attMerPicUrl" alt="社区半径">
          <h5 class="banner-title">获得{{attMerchantName}}的红包</h5>
          <h4 class="banner-sum" v-if="!tip">{{(rpgGetAmt/100).toFixed(2)}}<i>元</i></h4>
          <h4 class="banner-tip" v-if="tip">{{tip}}</h4>
          <router-link to="/my/redPacket" class="banner-link" v-if="!tip">我的红包 >></router-link>
        </div>
        <div class="red-packet-detail-body">
          <div class="body-container">
            <div class="body-container-img" v-if="rpgPicUrl">
              <img v-bind:src="rpgPicUrl" alt="社区半径" @click="toThirdPartyWebPage">
            </div>
            <div class="body-container-intro" v-if="rpgDesc">
              <h5>活动介绍</h5>
              <p v-html="rpgDesc"></p>
            </div>
          </div>
          <router-link :to="{ path: '/extension/merchantIntroduce', query: { attMerchantId: attMerchantId }}" class="body-link" tag="div" exact v-if="attMerchantId">
            <p class="clearfix"><span class="iconfont fl">&#xe66f;</span><span class="fl">去看看</span><span class="iconfont fr">&#xe65a;</span></p>
          </router-link>
        </div>
        <div class="red-packet-detail-footer">
          <p class="footer-title">{{footerTitle}}</p>
          <ul class="footer-list">
            <li v-for="(temp, $index) in resultList">
              <div class="footer-box clearfix">
                <div class="fl footer-logo"><img v-bind:src="temp.usrTitleUrl ? temp.usrTitleUrl : '../../../wechat/static/img/common/user_default_pic_bg@3x.png'" alt="社区半径"></div>
                <div class="footer-user fl">
                  <h5>{{temp.usrName}}</h5>
                  <p>{{temp.tmCreate | timeFormat}}</p>
                </div>
                <div class="footer-sum fr">
                  <h5>{{(temp.rpgGetAmt/100).toFixed(2)}}元</h5>
                  <span class="footer-sup" v-if="temp.isBest == 'Y' && isFinished == 'Y'">手气最佳</span>
                </div>
              </div>
            </li>
          </ul>
          <div class="red-packet-detail-position"></div>
        </div>
      </pull-to-refresh>
      <div>
        <loading :show="showLoading" :text="textLoading"></loading>
        <toast type="text" :show="showToast" :text="textToast"></toast>
      </div>
    </div>
</template>
<script>
    import Filter from '../../lib/filter'
    import Config from '../../lib/config'
    import Loading from 'vux-components/Loading'
    import Toast from 'vux-components/Toast'
    import PullToRefresh from '../common/scroll/pull-to-refresh.vue'
    export default{
        name: 'redPacketDetail',
        components: {
          Loading,
          Toast,
          PullToRefresh
        },
        data(){
            return {
                showLoading: true,
                textLoading: '加载中...',
                showToast: false,
                textToast: '异常',
                pageNum: 0, // 当前页面数
                pages: 1,
                isFinished: 'N', // 是否有下一页
                footerTitle: '',
                tip:'',
                attMerchantId: '',
                attMerchantName: '',
                attMerPicUrl: '../../../wechat/static/img/common/shop_default_pic.png',
                rpgGetAmt: '',
                rpgDesc: '',
                rpgPicUrl: '',
                rpgLinkUrl: '',
                rpgSnatchStatus: '',
                rpgTotalNum: '',
                rpgGetTotalNum: '',
                resultList: ''
            }
        },
        methods: {
          onPullup(finshCallback) {
            this.getRpgDetailInfo(this.$store.state.redPacket.rpgId,finshCallback)
          },
          toThirdPartyWebPage: function(){
            this.$router.push({ path: '/open-door/redPacketDetail', query: { thirdPartyWebPage: '1' }})
            Config.thirdPartyWebPage(this.rpgLinkUrl)
          },
          queryAppRpgInfo: function(rpgId){
            // 从我的红包列表中过来的->用户抢红包接口
            this.$http.post(Config.host.map.origin+'/mkt/queryAppRpgInfo.do',{
              "rpgId": rpgId || ''
            }).then((response) => {
              this.showLoading = false;
              if(response.body.rspCd == '00000'){
                // 用户领完红包,立即获取红包领取记录
                this.getRpgDetailInfo(rpgId)
                this.attMerchantName = response.body.attMerchantName
                this.attMerchantId = response.body.attMerchantId
                this.attMerPicUrl = (response.body.attMerPicUrl && response.body.attMerPicUrl != null && response.body.attMerPicUrl != 'null') ? response.body.attMerPicUrl : '../../../wechat/static/img/common/shop_default_pic.png'
                this.rpgGetAmt = response.body.rpgGetAmt
                this.rpgTotalAmt = response.body.rpgTotalAmt
                this.rpgDesc = response.body.rpgDesc.replace(/\r?\n/g,"<br/>").replace(/\s/g,"&nbsp;")
                this.rpgPicUrl = response.body.rpgPicUrl
                this.rpgLinkUrl = response.body.rpgLinkUrl
                this.rpgSnatchStatus = response.body.rpgSnatchStatus
                this.rpgTotalNum = response.body.rpgTotalNum
                this.rpgGetTotalNum = response.body.rpgGetTotalNum
                // 红包已领取
                if(this.rpgGetAmt){
                  // 已领取（不考虑是否已过期）：显示xx元，如：1.33元；
                  this.tip = ''
                  return false
                }
              }else{
                Config.errorTips.call(this,response,'response')
              }
            },(err) => {
                Config.errorTips.call(this,err,'err','抢红包失败')
            })
          },
          snatchRpg: function(rpgId){
            // 用户抢红包接口
            this.$http.post(Config.host.map.origin+'/mkt/snatchRpg.do',{
              "rpgId": rpgId || '',
              "rpgGetChl": '5',
              "isVisitor": this.$route.query ? this.$route.query.isVisitor : ''
            }).then((response) => {
              this.showLoading = false;
            if(response.body.rspCd == '00000'){
              // 用户领完红包,立即获取红包领取记录
              this.getRpgDetailInfo(rpgId)

              this.attMerchantName = response.body.attMerchantName
              this.attMerchantId = response.body.attMerchantId
              this.attMerPicUrl = (response.body.attMerPicUrl && response.body.attMerPicUrl != null && response.body.attMerPicUrl != 'null') ? response.body.attMerPicUrl : '../../../wechat/static/img/common/shop_default_pic.png'
              this.rpgGetAmt = response.body.rpgGetAmt
              this.rpgTotalAmt = response.body.rpgTotalAmt
              this.rpgDesc = response.body.rpgDesc.replace(/\r?\n/g,"<br/>").replace(/\s/g,"&nbsp;")
              this.rpgPicUrl = response.body.rpgPicUrl
              this.rpgLinkUrl = response.body.rpgLinkUrl
              this.rpgSnatchStatus = response.body.rpgSnatchStatus
              this.rpgTotalNum = response.body.rpgTotalNum
              this.rpgGetTotalNum = response.body.rpgGetTotalNum
              // 红包已领取
              if(this.rpgGetAmt){
                // 已领取（不考虑是否已过期）：显示xx元，如：1.33元；
                this.tip = ''
                return false
              }
            }else{
              Config.errorTips.call(this,response,'response')
            }
          },(err) => {
              Config.errorTips.call(this,err,'err','抢红包失败')
            })
          },
          getRpgDetailInfo: function(rpgId,finshCallback){
            this.pageNum += 1;
            if(this.pageNum > this.pages){
              if(finshCallback){
                finshCallback()
              }
              this.showToast = true
              this.textToast = '没有更多红包记录了'
              setTimeout(() => {
                this.showToast = false
                this.textToast = ''
              },1000)
              return false
            }
            this.$http.post(Config.host.map.origin+'/mkt/getRpgDetailInfo.do',{
              "pageNum": this.pageNum,
              "pageSizeEnum": 2,
              "rpgId": rpgId
            }).then((response) => {
              if(finshCallback){
                finshCallback()
              }
              if(response.body.rspCd == '00000'){
                this.isFinished = response.body.isFinished
                this.pages = response.body.pages
                this.resultList = this.resultList.length ? this.resultList.concat(response.body.resultList) : response.body.resultList
                if(this.rpgSnatchStatus == 2){// 红包已过期
                  if(!this.rpgGetAmt){
                    // 已过期&未领取：来晚了，红包已领完；
                    this.tip = '来晚了，红包已领完'
                  }else{
                    // 已过期&已领取（不考虑是否已过期）：显示xx元，如：1.33元；
                    this.tip = ''
                  }
                  if(this.rpgGetAmt && this.isFinished == 'N'){
                    // 已过期且已领取且未领完：n个红包已被领完；
                    this.footerTitle = this.rpgGetTotalNum+'个红包已被领完'
                  } else if (this.rpgGetAmt && this.isFinished == 'Y'){
                    // 已过期且已领取且已领完：N个红包已被领完；
                    this.footerTitle = this.rpgTotalNum+'个红包已被领完'
                  } else if (!this.rpgGetAmt && this.isFinished == 'N'){
                    // 已过期且未领取且未领完：n个红包已被领完；
                    this.footerTitle = this.rpgGetTotalNum+'个红包已被领完'
                  } else if (!this.rpgGetAmt && this.isFinished == 'Y'){
                    // 已过期且未领取且已领完：N个红包已被领完；
                    this.footerTitle = this.rpgTotalNum+'个红包已被领完'
                  }
                } else { // 红包未过期
                  if(this.rpgGetAmt){
                    // 已领取（不考虑是否已过期）：显示xx元，如：1.33元；
                    this.tip = ''
                  }else{
                    if(this.isFinished == 'Y'){
                      // 未过期&已领完：来晚了，红包已领完；
                      this.tip = '来晚了，红包已领完'
                    }
                  }

                  if(this.rpgGetAmt && this.isFinished == 'N'){
                    // 未过期且已领取且未领完：已领取n/N个；
                    this.footerTitle = '已领取'+this.rpgGetTotalNum+'/'+this.rpgTotalNum+'个'
                  } else if(this.rpgGetAmt && this.isFinished == 'Y'){
                    // 未过期且已领取且已领完：N个红包已被领完；
                    this.footerTitle = this.rpgTotalNum+'个红包已被领完'
                  } else if(!this.rpgGetAmt && this.isFinished == 'Y'){
                    // 未过期且未领取且已领完：N个红包已被领完；
                    this.footerTitle = this.rpgTotalNum+'个红包已被领完'
                  }
                }
              } else {
                Config.errorTips.call(this,response,'response')
              }
            },(err) => {
                Config.errorTips.call(this,err,'err','获取用户领取红包详情失败')
              })
            }
        },
        filters: {
          timeFormat: function (value) {
            if(value){
              return Filter.todayFormat(value-0,'YMDHI')
            }else{
              return ''
            }
          }
        },
        created: function(){
          if(this.$store.state.redPacket.formMyRedPacket == true){
            if(this.$store.state.redPacket.rpgId){
              this.queryAppRpgInfo(this.$store.state.redPacket.rpgId)
            }
          }else{
            if(this.$store.state.redPacket.rpgId){
              this.snatchRpg(this.$store.state.redPacket.rpgId)
            }
          }
        }
    }
</script>
<style lang="scss">
  @import "../../../static/scss/base/_toRem.scss";
  .red-packet-detail-box{
    background-color: #efefef;
    height: 100%;
  }
  .red-packet-detail-position{
    background-color: #efefef;
    height: toRem(70);
  }
  .red-packet-detail-banner{
    background: #E55150 url('../../../static/img/redPacket/banner_header.png') center top no-repeat;
    background-size: 100% auto;
    text-align: center;
    padding-top: toRem(65);
    .banner-logo{
      width: toRem(120);
      height: toRem(120);
      border-radius: 100%;
      border: toRem(6) solid #fff;
      margin-bottom: toRem(10);
    }
    .banner-title{
      font-size: toRem(28);
      color: #FFFFFF;
      line-height: toRem(40);
    }
    .banner-sum{
      font-size: toRem(60);
      color: #FFF9B2;
      height: toRem(84);
      line-height: toRem(84);
      margin-top: toRem(10);
      & > i{
        font-size: toRem(44);
        font-style: normal;
        vertical-align: toRem(6);
        margin-left: toRem(10);
      }
    }
    .banner-tip{
      font-size: toRem(44);
      color: #FFF9B2;
      line-height: toRem(62);
      padding-bottom: toRem(62);
    }
    .banner-link{
      display: block;
      font-size: toRem(24);
      color: #FFFFFF;
      line-height: toRem(33);
      padding-bottom: toRem(50);
    }
  }
  .body-container{
    padding: toRem(30) toRem(30) 0;
    background-color: #fff;
    .body-container-img{
      font-size: 0;
      padding-bottom: toRem(40);
      & > img{
        width: 100%;
        max-height: toRem(220);
      }
    }
    .body-container-intro{
      padding-bottom: toRem(50);
      & > h5{
        font-size: toRem(24);
        color: #A8A8A8;
        line-height: toRem(32);
        height: toRem(32);
        margin-bottom: toRem(20);
      }
      & > p {
        font-size: toRem(28);
        color: #3C3C3C;
        line-height: toRem(40);
      }
    }
  }
  .body-link{
    padding-left: toRem(30);
    background-color: #fff;
    & > p{
      padding: toRem(20) toRem(30) toRem(20) 0;
      border-top: 1px solid #DCDBE4;
      box-sizing: borer-box;
      & > *{
        display: block;
        height: toRem(50);
        line-height: toRem(50);
      }
      span:first-child{
        font-size: toRem(50);
        color: #C7C7CC;
        margin-right: toRem(10);
       }
      span:nth-child(2){
        font-size: toRem(32);
        color: #3C3C3C;
      }
      span:nth-child(3){
        font-size: toRem(16);
        color: #C7C7CC;
      }
    }
  }
  .red-packet-detail-footer{
    .footer-title{
      line-height: 28px;
      height: 28px;
      padding: toRem(21) toRem(30);
      font-size: toRem(24);
      color: #A8A8A8;
      background-color: #efefef;
    }
  }
  .footer-list{
    & > li{
      padding-left: toRem(30);
      background-color: #fff;
    }
    .footer-box{
      box-sizing: border-box;
      border-bottom: 1px solid #DCDBE4;
      padding: toRem(20) toRem(30) toRem(20) 0;
    }
    li:nth-last-child(1){
      .footer-box{
        border: none;
      }
    }
    .footer-logo{
      font-size: 0;
      margin-right: toRem(20);
      & > img{
        width: toRem(80);
        height: toRem(80);
        border-radius: 100%;
      }
    }
    .footer-user,.footer-sum{
      & > h5{
        font-size: toRem(28);
        color: #3C3C3C;
        height: toRem(40);
        line-height: toRem(40);
      }
    }
    .footer-user{
      & > p{
          font-size: toRem(24);
          color: #A8A8A8;
          height: toRem(32);
          line-height: toRem(32);
      }
    }
    .footer-sum{
      text-align: right;
      .footer-sup{
        display: block;
        font-size: toRem(20);
        color: #FFFFFF;
        line-height: toRem(36);
        height: toRem(36);
        width: toRem(100);
        background: #FFAA00;
        border-radius: 4px;
        text-align: center;
      }
    }
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
