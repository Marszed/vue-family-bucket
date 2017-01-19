<template>
    <div class="my-red-packet-box">
      <pull-to-refresh
        :disable-pulldown="true"
        @on-pullup="onPullup"
        class="scroll-page">
        <div class="my-banner">
          <div class="my-logo">
            <img class="banner-logo" v-bind:src="(personInfo && personInfo.iconUrl) ? personInfo.iconUrl : '../../../wechat/static/img/common/user_default_pic_bg@3x.png'" alt="社区半径">
          </div>
          <div class="clearfix">
            <div class="my-total fl">
              <h5>领到红包<span>{{collRpgCount}}</span>个</h5>
              <router-link tag="p" exact to="/extension/makeMoney"><i class="iconfont">&#xe66d;</i>怎么领</router-link>
            </div>
            <div class="my-sum fr">
              <h5>共领到<span>{{(collRpgAmt/100).toFixed(2)}}</span>元</h5>
              <router-link tag="p" exact to="/extension/spendMoney"><i class="iconfont">&#xe66d;</i>怎么花</router-link>
            </div>
          </div>
        </div>
        <div class="my-history">
          <div class="no-record" v-if="!resultList || !resultList.length">
            <p>暂无红包明细~</p>
            <router-link to="/extension/makeMoney" exact tag="div" class="how-to-make">如何领红包？</router-link>
          </div>
          <ul class="red-packet-history" v-if="resultList && resultList.length">
            <li v-for="(temp,$index) in resultList" @click="toRedPacketDetail(temp)" :key="temp.rpgId">
              <div class="clearfix red-packet-history-box">
                <div class="fl red-packet-history-content">
                  <h5>{{temp.attMerchantName}}</h5>
                  <p>{{temp.tmCreate | timeFormat}}</p>
                </div>
                <div class="fr red-packet-history-sum">{{(temp.rpgGetAmt/100).toFixed(2)}}<span>元</span></div>
              </div>
            </li>
          </ul>
        </div>
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
  import Loading from 'vux-components/Loading'
  import Toast from 'vux-components/Toast'
  import PullToRefresh from '../common/scroll/pull-to-refresh.vue'
  export default{
        name: 'myRedPacket',
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
                collRpgCount: 0,
                collRpgAmt: 0,
                resultList: '',
                pageNum: 0,
                pages: 1,
                personInfo: this.$store.state.entifyMsg
            }
        },
        methods: {
          onPullup(finshCallback) {
            this.myRpgInfo(finshCallback)
          },
          myRpgInfo: function(finshCallback){
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
            this.$http.post(Config.host.map.origin+'/mkt/myRpgInfo.do',{
              "pageNum": this.pageNum,
              "pageSizeEnum": 1
            }).then((response) => {
              this.showLoading = false
              if(finshCallback){
                finshCallback()
              }
              if(response.body.rspCd == '00000'){
                this.pages = response.body.pages
                this.collRpgCount = response.body.collRpgCount
                this.collRpgAmt = response.body.collRpgAmt
                this.resultList = (this.resultList.length && this.resultList != null) ? this.resultList.concat(response.body.resultList) : response.body.resultList
              } else {
                Config.errorTips.call(this,response,'response')
              }
            },(err) => {
                Config.errorTips.call(this,err,'err','获取我的红包失败')
            })
          },
          toRedPacketDetail: function(obj){
            // 缓存红包Id
            this.$store.commit('setRedPacket',{rpgId: obj.rpgId,formMyRedPacket: true})
            // 跳转红包详情页
            this.$router.push('/open-door/redPacketDetail')
          }
        },
        filters: {
          timeFormat: function (value) {
            if(value){
              return Filter.todayFormat(value-0)
            }else{
              return ''
            }
          }
        },
        created: function(){
          this.myRpgInfo()
        }
    }
</script>
<style lang="scss">
  @import "../../../static/scss/base/_toRem.scss";
  .my-red-packet-box{
    background-color: #f8f8f8;
    height: 100%;
  }
  .my-banner{
    background: #FF6B6C;
    height: toRem(376);
    .my-logo{
      text-align: center;
      font-size: 0;
      padding-top: toRem(60);
      margin-bottom: toRem(40);
      & > img{
        width: toRem(120);
        height: toRem(120);
        border-radius: 100%;
        border: toRem(6) solid #fff;
      }
    }
  }
  .my-total,.my-sum{
    width: 50%;
    text-align: center;
    color: #FFFFFF;
    & > h5{
      font-size: toRem(28);
      line-height: toRem(62);
      height: toRem(62);
      margin-bottom: toRem(10);
      & > span{
        font-size: toRem(44);
        color: #FFF9B2;
        vertical-align: toRem(-4);
        margin: 0 toRem(10);
      }
    }
    & > p{
      font-size: toRem(24);
      line-height: toRem(32);
      height: toRem(32);
      color: rgba(255,255,255,0.8);
      & > .iconfont{
        font-size: toRem(28);
        margin-right: toRem(10);
        vertical-align: toRem(-2);
      }
    }
  }
  .my-history{
    margin-top: toRem(20);
  }
  .no-record{
    text-align: center;
    color: #A8A8A8;
    & > p{
      font-size: toRem(28);
      line-height: toRem(40);
    }
    .how-to-make{
      margin: toRem(30) auto 0;
      background: #FFFFFF;
      border: toRem(2) solid #A8A8A8;
      border-radius: toRem(8);
      width: toRem(160);
      height: toRem(68);
      box-sizing: border-box;
      font-size: toRem(24);
      line-height: toRem(68);
    }
  }
  .red-packet-history{
    background-color: #fff;
    border-top: 1px solid #DCDBE4;
    border-bottom: 1px solid #DCDBE4;
    & > li{
      padding-left: toRem(30);
    }
    li:nth-last-child(1) > .red-packet-history-box{
      border-bottom: none;
    }
  }
  .red-packet-history-box{
    padding: toRem(24) toRem(30) toRem(23) 0;
    border-bottom: 1px solid #DCDBE4;
  }
  .red-packet-history-content{
    & > h5{
      font-size: toRem(28);
      color: #3C3C3C;
      height: toRem(40);
      line-height: toRem(40);
    }
    & > p{
      font-size: toRem(24);
      color: #A8A8A8;
      line-height: toRem(33);
    }
  }
  .red-packet-history-sum{
    font-size: toRem(40);
    color: #595959;
    line-height: toRem(48);
    & > span{
      font-size: toRem(32);
      margin-left: toRem(5);
      vertical-align: toRem(3);
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
