<template>
  <div class="red-packet-layer" v-if="config.showRedPacket" @click="closeRedPacket">
     <div class="red-packet-box pulse1">
       <img class="merchant-logo" v-bind:src="attMerPicUrl" alt="社区半径">
       <h5 class="merchant-name">{{attMerchantName}}</h5>
       <h4 class="red-packet-name">发了一个红包</h4>
       <p class="red-packet-title">{{rpgTitle}}</p>
       <button class="stamp pulse" @click="openRedPacket">{{stampText}}</button>
     </div>
  </div>
</template>
<script>
  export default {
    props: {
      config: {
        type: Object,
        default: {
          showRedPacket: false
        }
      }
    },
    data(){
      return {
        stampText: '戳我领红包',
        attMerPicUrl: '../../../wechat/static/img/common/shop_default_pic.png',
        rpgTitle: '',
        attMerchantName: ''
      }
    },
    methods: {
      closeRedPacket: function(e){
        if(e.target.className == 'red-packet-layer') this.config.showRedPacket = false
      },
      openRedPacket: function(){
        this.stampText = '红包领取中'
        setTimeout(() => {
          this.$emit('toRedPacketDetail',this.$store.state.redPacket.rpgId)
        },300)
      },
      getRedPacket: function(data){
        this.attMerchantName = data.attMerchantName
        this.rpgTitle = data.rpgTitle
        this.attMerPicUrl = (data.attMerPicUrl && data.attMerPicUrl != 'null' && data.attMerPicUrl != null) ? data.attMerPicUrl : '../../../wechat/static/img/common/shop_default_pic.png'
        // 缓存红包Id
        this.$store.commit('setRedPacket',{rpgId: data.rpgId})
        return false
      }
    },
    name: 'redPacket'
  }
</script>

<style lang="scss">
  @import "../../../static/scss/base/_toRem.scss";
  @-webkit-keyframes pulse {
    0% {
      -webkit-transform: scale(1)
    }
    50% {
      -webkit-transform: scale(1.1)
    }
    100% {
      -webkit-transform: scale(1)
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1)
    }
    50% {
      transform: scale(1.1)
    }
    100% {
      transform: scale(1)
    }
  }

  .red-packet-layer{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999;
    background: rgba(0,0,0,0.40);
  }
  .red-packet-box{
    width: toRem(500);
    height: toRem(640);
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    margin-left: toRem(-250);
    margin-top: toRem(-320);
    background: transparent url('../../../static/img/redPacket/red_envelope_aides_open@2x.png') center top no-repeat;
    background-size: contain;
    text-align: center;
      .merchant-logo{
        width: toRem(80);
        height: toRem(80);
        border-radius: 100%;
        border: toRem(2) solid #fff;
        margin-bottom: toRem(10);
        margin-top: toRem(102);
        box-sizing: border-box;
      }
      .merchant-name{
        font-size: toRem(28);
        color: #fff;
        margin: 0 toRem(50) toRem(10);
        line-height: toRem(40);
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      .red-packet-name{
        opacity: 0.6;
        font-size: toRem(24);
        color: #FFFFFF;
        line-height: toRem(32);
        margin-bottom: toRem(40);
      }
      .red-packet-title{
        font-size: toRem(42);
        color: #FFFFFF;
        line-height: toRem(52);
        margin: 0 toRem(50);
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      .stamp{
        position: absolute;
        z-index: 5;
        width: toRem(360);
        line-height: toRem(90);
        height: toRem(90);
        text-align: center;
        background: #FFFAB2;
        border-radius: toRem(100);
        font-size: toRem(32);
        color: #8B572A;
        bottom: toRem(50);
        left: 50%;
        margin-left: toRem(-180);
        border: 0;
        box-shadow: 0 0 toRem(8) toRem(8) rgba(0,0,0,0.1);
      }
      .pulse{
        -webkit-animation-duration: 1s;
        -webkit-animation-delay: .2s;
        -webkit-animation-timing-function: ease;
        -webkit-animation-fill-mode: both;
        -webkit-animation-iteration-count: infinite;
        -webkit-animation-name: pulse;
        animation-duration: 1s;
        animation-delay: .2s;
        animation-timing-function: ease;
        animation-fill-mode: both;
        animation-iteration-count: infinite;
        animation-name: pulse
      }
  }
  .pulse1{
    -webkit-animation-duration: 1s;
    -webkit-animation-delay: .2s;
    -webkit-animation-timing-function: ease;
    -webkit-animation-fill-mode: both;
    -webkit-animation-iteration-count: 1;
    -webkit-animation-name: pulse;
    animation-duration: 1s;
    animation-delay: .2s;
    animation-timing-function: ease;
    animation-fill-mode: both;
    animation-iteration-count: 1;
    animation-name: pulse
  }
</style>
