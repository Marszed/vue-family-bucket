<template>
  <div class="spend-money">
    <div class="top">
      <img src="../../../static/img/redPacket/red_envelope_help_pic2.png" alt="社区半径">
    </div>
    <div class="bottom">
      <div class="spend-intro">
        <p>通过社区半径微信公众号领取的红包</p>
        <p>均存入社区半径零钱账户中</p>
      </div>
      <div class="spend-title">零钱可用于<span>缴物业费、手机充值、转账、消费</span>等</div>
      <div class="spend-tip">下载安装社区半径APP，立即体验吧！</div>
      <a href="javascript:;" @click="toThirdPartyWebPage" class="now-download">立即下载</a>
    </div>
  </div>
</template>
<script>
  import Config from '../../lib/config'
  export default{
    name: 'spendMoney',
    methods: {
      toThirdPartyWebPage: function(){
        this.$router.push({ path: '/extension/spendMoney', query: { thirdPartyWebPage: '1' }})
        Config.thirdPartyWebPage('http://a.app.qq.com/o/simple.jsp?pkgname=cn.lejiayuan#opened')
      }
    }
  }
</script>
<style lang="scss">
  @import "../../../static/scss/base/_toRem.scss";
  .spend-money{
    background-color: #fff;
    min-height: 100%;
    box-sizing: border-box;
    padding: toRem(105) toRem(77) 0;
  }
  .spend-money {
    .top{
      font-size: 0;
      margin-bottom: toRem(50);
      & > img{
        width: 100%;
      }
    }
    .bottom{
      text-align: center;
    }
    .spend-intro{
      font-size: toRem(28);
      color: #A8A8A8;
      line-height: toRem(40);
      margin-bottom: toRem(20);
    }
    .spend-title{
      font-size: toRem(28);
      color: #595959;
      margin-bottom: toRem(50);
      line-height: toRem(40);
      & > span{
        color: #389D38;
      }
    }
    .spend-tip{
      font-size: toRem(24);
      color: #A8A8A8;
      line-height: toRem(33);
    }
    .now-download{
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
      margin: toRem(20) auto 0;
    }
  }
</style>
