<template>
    <div class="merchant-introduce">
      <div class="content-header">
        <img v-bind:src="attach.merchantImage || '../../../wechat/static/img/common/shop_default_pic.png'" alt="社区半径">
        <p class="clearfix"><span class="fl">{{attach.merchantName}}</span><i class="fl outer-delivery" v-if="attach.outerDelivery && attach.outerDelivery != 0">{{attach.outerDelivery == '1' ? '外送' : '上门'}}</i><i class="fl code-payment-enable" v-if="attach.codePaymentEnable == 1">扫码</i></p>
      </div>
      <div class="content-line" v-if="attach.coupons && attach.coupons.length"><img src="../../../static/img/extension/share_line_pic@3x.png" alt="社区半径"></div>
      <div class="content-footer" id="typeContent">
        <div class="content-footer-line" v-if="attach.coupons && attach.coupons.length"><span>优惠券</span></div>
        <div class="content-footer-coupons" v-if="attach.coupons && attach.coupons.length">
          <div class="content-footer-coupon-list clearfix" v-for="(temp, $index) in attach.coupons">
            <div class="fl coupons-content">
              <h5>￥<span>{{temp.money}}</span></h5>
              <p>满{{temp.threshold}}可用</p>
            </div>
            <div class="fr">
              <h4>{{temp.name}}</h4>
              <p>{{temp.startTime}}-{{temp.endTime}}</p>
            </div>
          </div>
        </div>
        <div class="content-footer-line" v-if="attach.goods && attach.goods.length"><span>推荐商品</span></div>
        <div class="content-footer-goods" v-if="attach.goods && attach.goods.length">
          <ul class="content-footer-list clearfix">
            <li class="fl" v-for="(temp, $index) in attach.goods">
              <img v-bind:src="temp.goodImage || '../../../wechat/static/img/common/default_background_1024w.png'" alt="社区半径">
              <h5>{{temp.goodName}}</h5>
              <p>¥<span>{{temp.goodPrice}}</span></p>
            </li>
          </ul>
        </div>
        <div class="content-line"><img src="../../../static/img/extension/share_line_pic@3x.png" alt="社区半径"></div>
        <div class="to-look-box">
          <a class="to-look" @click="toThirdPartyWebPage" href="javascript:;">去看看</a>
        </div>
      </div>
      <div class="footer-download clearfix">
        <img src="../../../static/img/common/logo.png" alt="社区半径">
        <p>让社区生活更简单</p>
        <a @click="toThirdPartyWebPage" href="javascript:;">立即打开</a>
      </div>
      <div>
        <loading :show="showLoading" :text="textLoading"></loading>
        <toast type="text" :show="showToast" :text="textToast"></toast>
      </div>
    </div>
</template>
<script>
    import Config from '../../lib/config'
    import Loading from 'vux-components/Loading'
    import Toast from 'vux-components/Toast'
    export default{
        name: 'merchantIntroduce',
        components: {
          Loading,
          Toast
        },
        data () {
          return {
            showLoading: true,
            textLoading: '加载中...',
            showToast: false,
            textToast: '异常',
            attach: ''
          }
        },
        methods: {
          toThirdPartyWebPage: function(){
            this.$router.push({ path: '/extension/merchantIntroduce', query: { thirdPartyWebPage: '1' }})
            Config.thirdPartyWebPage('http://a.app.qq.com/o/simple.jsp?pkgname=cn.lejiayuan#opened')
          },
          queryShareContent: function(){
            this.$http.post(Config.host.map.origin+'/mkt/queryShareContent.do',{
              "shareId": '6',
              "queryId": this.$route.query.attMerchantId || ''
            }).then((response) => {
              this.showLoading = false
              if(response.body.rspCd == '00000'){
                this.attach = response.body.attach
              }else{
                Config.errorTips.call(this,response,'response')
              }
            },(err) => {
              Config.errorTips.call(this,err,'err','查询分享内容失败')
            })
          },
          toRedPacketDetail: function(){
            // 跳转红包详情页
            this.$router.push('/open-door/redPacketDetail')
          }
        },
        created: function(){
          this.queryShareContent()
        }
    }
</script>
<style lang="scss">
  @import "../../../static/scss/base/_toRem.scss";
  .merchant-introduce{
    background-color: #efefef;
    min-height: 100%;
    box-sizing: border-box;
    padding: toRem(30) toRem(30) toRem(183);
  }
  .content-header,.content-line,.content-footer{
    text-align: center;
    background-color: #fff;
  }
  .content-header{
    padding-top: toRem(30);
    padding-bottom: toRem(18);
    text-align: center;
    img{
      display: block;
      margin: 0 auto;
      width: toRem(120);
      height: toRem(120);
      border-radius: 100%;
    }
    p{
      display: inline-block;
      margin-top: toRem(20);
      & > *{
        display: block;
      }
      span{
        font-size: toRem(32);
        color: #3C3C3C;
        line-height: toRem(32);
      }
      i{
        font-style: normal;
        text-align: center;
        height: toRem(32);
        line-height: toRem(32);
        width: toRem(60);
        font-size: toRem(20);
        color: #FFFFFF;
        border-radius: toRem(4);
        margin-left: toRem(10);
      }
      .outer-delivery{
        background-color: #389D38;
      }
      .code-payment-enable{
        background-color: #458FE5;
      }
    }
  }

  .content-line{
    img{
      width: 100%;
    }
  }

  .content-footer{
    padding-top: toRem(18);
  }

  .content-footer-line{
    font-size: toRem(24);
    color: #7C797A;
    line-height: toRem(24);
    text-align: center;
    span{
      position: relative;
      display: inline-block;
      &:before, &:after{
        display: block;
        width: toRem(100);
        height: toRem(2);
        background-color: #DCDBE4;
        content: ' ';
        position: absolute;
        top: toRem(11);
      }
      &:before{
         left: toRem(-130);
       }
       &:after{
         right: toRem(-130);
       }
    }
  }
  .content-footer-coupon-list{
    padding-bottom: 20px;
  }
  .content-footer-coupons{
    width: toRem(500);
    margin: toRem(30) auto;
    .fr{
      width: toRem(360);
      height: toRem(140);
      padding: toRem(30) toRem(20);
      box-sizing: border-box;
      background: rgba(255,107,108,0.1);
      text-align: left;
      & > h4{
        font-size: toRem(28);
        color: #3C3C3C;
        height: toRem(28);
        line-height: toRem(28);
      }
      & > p{
        font-size: toRem(24);
        color: #A8A8A8;
        line-height: toRem(24);
        margin-top: toRem(20);
      }
    }
  }

  .coupons-content{
    display: block;
    width: toRem(140);
    height: toRem(140);
    background: #fff url('../../../static/img/extension/coupons.png') center center no-repeat;
    background-size: 100% auto;
    color: #fff;
    & > h5{
      font-size: toRem(24);
      line-height: 1;
      margin-top: toRem(26);
      span{
        font-size: toRem(48);
        vertical-align: toRem(-4);
      }
    }
    & > p{
      opacity: 0.6;
      font-size: toRem(20);
      line-height: toRem(20);
      margin-top: toRem(20);
    }
  }
  .content-footer-goods{
    padding: toRem(30) toRem(35) toRem(20);
  }
  .content-footer-list{
    margin-left: toRem(-40);
    li{
      margin-left: toRem(40);
      text-align: center;
      width: toRem(180);
      & > img{
        width: toRem(180);
        height: toRem(180);
      }
      & > h5{
        font-size: toRem(24);
        color: #3C3C3C;
        margin-top: toRem(10);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space:nowrap;
        word-break:keep-all;
        max-width: 100%;
      }
      & > p{
        font-size: toRem(20);
        color: #F45064;
        line-height: 1;
        span{
          font-size: toRem(32);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space:nowrap;
          word-break:keep-all;
          max-width: 100%;
        }
      }
    }
  }
  .to-look-box{
    padding: toRem(23) 0 toRem(35);
  }
  .to-look{
    display: block;
    margin: 0 auto;
    width: toRem(240);
    height: toRem(70);
    line-height: toRem(66);
    border: toRem(2) solid #389D38;
    border-radius: toRem(6);
    box-sizing: border-box;
    font-size: toRem(34);
    color: #389D38;
  }

  .footer-download{
    position: fixed;
    z-index: 9999;
    bottom: 0;
    left: 0;
    width: 100%;
    height: toRem(120);
    padding: toRem(25) toRem(30);
    box-sizing: border-box;
    background-color: #fff;
    img{
      float: left;
      width: toRem(80);
      height: toRem(80);
      margin-right: toRem(20);
    }
    p{
      float: left;
      font-size: toRem(32);
      height: toRem(80);
      line-height: toRem(80);
      color: #595959;
    }
    a{
      display: block;
      float: right;
      height: toRem(70);
      line-height: toRem(70);
      width: toRem(200);
      background-color: #389D38;
      border-radius: toRem(6);
      color: #fff;
      text-align: center;
    }
  }
</style>
