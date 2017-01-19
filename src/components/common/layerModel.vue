<template>
    <div v-if="config.showLayerModel">
      <div class="my_layer">
        <div class="my_add_success" v-bind:class="{'my_add_success_height': config.animate}">
          <div v-bind:class="config.imgUrlClass" class="imgBox"></div>
          <p>{{config.contentText}}</p>
          <span @click="affirmCallback">确定</span>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'layerModel',
    props: {
      config: {
        type: Object,
        default: {
          showLayerModel: false,
          imgUrlClass:"img_success",
          contentText:"",
          toUrl:"",
          animate: false
        }
      }
    },
    methods: {
      affirmCallback:function(){
        location.hash = this.config.toUrl;
      }
    },
    mounted: function(){
      setTimeout(() => {
        this.config.animate = true
      },100);
    }
  }
</script>

<style lang="scss">
  @import "../../../static/scss/base/_toRem.scss";

  .my_add_success{
    position: absolute;
    background: #FFFFFF;
    bottom:0;
    height: 0;
    overflow: hidden;
    width:100%;
    z-index:5;
    text-align: center;
    -webkit-transition: all 0.3s ease 0s;
    transition: all 0.3s ease 0s;
    .imgBox{
      width:toRem(120);
      height:toRem(120);
      margin:toRem(100) auto 0;
    }
    p{
      font-size:toRem(28);
      color: #595959;
      margin-top: toRem(20);
    }
    span{
      position: absolute;
      bottom:0;
      left:0;
      right:0;
      background: #FFFFFF;
      border-top:1px solid #DCDAE3;
      display: block;
      height:toRem(90);
      font-size:toRem(34);
      line-height:toRem(90);
      color: #389D38;
    }
  }
  .my_add_success_height{
    height: toRem(470);
  }
  .my_layer{
    position: fixed;
    background: rgba(0,0,0,0.4);
    top:0;
    left:0;
    right:0;
    bottom: 0;
    z-index:999;
  }
  .img_success{
    background-image:url("../../../static/img/common/result_ico_2@3x.png");
    background-size: 100% 100%;
  }
</style>
