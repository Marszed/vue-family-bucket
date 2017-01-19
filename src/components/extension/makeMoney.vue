<template>
    <div class="make-money">
      <div class="top clearfix">
        <img class="fl" src="../../../static/img/redPacket/share_qrcode_pic@3x.png" alt="社区半径">
        <div class="top-content fl">
          <p class="top-label">方法一</p>
          <p class="top-title">关注社区半径微信公众号</p>
          <h5>开门即有机会领取红包</h5>
        </div>
      </div>
      <div class="bottom clearfix">
        <img class="fl" src="../../../static/img/redPacket/red_envelope_help_pic1@3x.png" alt="社区半径">
        <div class="top-content fl">
          <p class="top-label">方法二</p>
          <p class="top-title">下载并安装社区半径APP</p>
          <h5>开门即有机会领取红包</h5>
          <a href="javascript:;" @click="toThirdPartyWebPage" class="now-download">立即下载</a>
        </div>
      </div>
    </div>
</template>
<script>
    import Config from '../../lib/config'
    export default{
        name: 'makeMoney',
        methods: {
          toThirdPartyWebPage: function(){
            this.$router.push({ path: '/extension/makeMoney', query: { thirdPartyWebPage: '1' }})
            Config.thirdPartyWebPage('http://a.app.qq.com/o/simple.jsp?pkgname=cn.lejiayuan#opened')
          }
        }
    }
</script>
<style lang="scss">
  @import "../../../static/scss/base/_toRem.scss";
  .make-money{
    background-color: #fff;
    min-height: 100%;
    box-sizing: border-box;
    padding: toRem(100) toRem(60) 0;
  }
  .make-money{
    .top-content > h5{
      font-size: toRem(32);
      color: #389D38;
      line-height: toRem(44);
    }
    .top-content > .now-download{
      display: block;
      border: toRem(2) solid #389D38;
      border-radius: toRem(6);
      width: toRem(220);
      height: toRem(68);
      line-height: toRem(68);
      box-sizing: border-box;
      color: #389D38;
      font-size: toRem(28);
      text-align: center;
      margin-top: toRem(20);
    }
    .top{
      font-size: 0;
      border-bottom: 1px dashed #DCDAE3;
      padding-bottom: toRem(80);
      & > img{
        width: toRem(200);
        height: toRem(200);
        margin-right: toRem(30);
      }
    }
    .bottom{
      font-size: 0;
      padding-top: toRem(80);
      & > img{
        width: toRem(200);
        margin-right: toRem(30);
      }
    }
    .top-label{
      background: #389D38;
      padding-left: toRem(10);
      width: toRem(80);
      height: toRem(42);
      line-height: toRem(42);
      font-size: toRem(24);
      color: #FFFFFF;
      margin-bottom: toRem(30);
      position: relative;
      &:before{
         position: absolute;
         top: 0;
         right: toRem(-40);
         display: block;
         border: toRem(21.5) solid #389D38;
         border-color: transparent transparent transparent #389D38;
         font-size: 0;
         content: '';
         z-index: 5;
      }
    }
    .top-title{
      font-size: toRem(28);
      color: #A8A8A8;
      height: toRem(40);
      line-height: toRem(40);
      margin-bottom: toRem(10);
    }
  }
</style>
