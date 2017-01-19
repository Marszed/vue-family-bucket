<template>
  <div id="confirmBox" v-if="config.showConfirmBox" class="layer1">
    <div class="confirm-box">
      <h5>{{config.title}}</h5>
      <p>{{config.content}}</p>
      <div class="operate-box clearfix">
        <div class="operate-cancel" @click="cancel">{{config.cancel}}</div>
        <div class="operate-sure" @click="sure" >{{config.sure}}</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      config: {
        type: Object,
        default: {
          showConfirmBox: false,
          title: '',
          content: '',
          cancel: '',
          sure: '',
          href: ''
        }
      }
    },
    methods: {
      sure: function(){
        this.config.showConfirmBox = false
      },
      cancel: function(){
        if(this.config.href){
          this.config.showConfirmBox = false
          location.hash = this.config.href
        }else{
          this.config.showConfirmBox = false
        }
      }
    },
    name: 'confirm'
  }
</script>

<style lang="scss">
  @charset "UTF-8";
  @import "../../../static/scss/base/_toRem.scss";
  .confirm-box{
    background: #FFFFFF;
    border-radius: toRem(20);
    padding-top: toRem(30);
    width: 560/750*100#{'%'};
    &>h5{
      text-align: center;
      font-size: toRem(34);
      line-height: toRem(48);
      color: #3C3C3C;
      margin-bottom: toRem(29);
    }
    &>p{
      text-align: left;
      font-size: toRem(28);
      color: #3C3C3C;
      line-height: toRem(40);
      padding: 0 toRem(30);
    }
    .operate-box{
      box-shadow: inset 0 1px 0 0 #DCDAE3;
      margin-top: toRem(50);
      &>div{
        width: 50%;
        float: left;
        height: toRem(90);
        line-height: toRem(90);
        font-size: toRem(34);
        color: #389D38;
        letter-spacing: -1px;
        text-align: center;
        position: relative;
      }
      .operate-cancel:after{
    position: absolute;
    right: 0;
    top: toRem(25);
    z-index: 3;
    content: ' ';
    width: 1px;
    height: toRem(40);
    background-color: #DCDAE3;
  }
    }
  }
</style>
