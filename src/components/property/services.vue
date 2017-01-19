<template>
  <div class="bgf8f8f8">
    <div class="services_header">
      <a class="services_location" href="javascript:;" @click="setUserTargetKey">{{locationCommunityName}}</a>
    </div>
    <div class="services_body">
      <ul class="services_list clearfix">
        <li v-on:click="toNotice()">
          <i class="iconfont notice_ico" style="background:#40abcf;">&#xe657;
            <span v-html="count" v-if="count"></span>
          </i>
          <p class="notice">公告</p>
          <p class="trends">实时关注小区动态</p>
        </li>
        <li v-if="propertyPhone">
          <a v-bind:href="propertyPhone" class="propertyPhone">
            <i class="iconfont" style="background:#ffaa00;">&#xe654;</i>
            <p class="notice">联系物业</p>
            <p class="trends">及时联系物业</p>
          </a>
        </li>
        <li v-if="!propertyPhone" @click="propertyPhoneTisp">
          <a class="propertyPhone">
            <i class="iconfont" style="background:#ffaa00;">&#xe654;</i>
            <p class="notice">联系物业</p>
            <p class="trends">及时联系物业</p>
          </a>
        </li>
      </ul>
    </div>
    <div>
      <loading :show="showLoading" :text="textLoading"></loading>
      <toast type="text" :show="showToast" :text="textToast"></toast>
    </div>
  </div>
</template>

<script>
  import Loading from 'vux-components/Loading'
  import Toast from 'vux-components/Toast'
  import Config from '../../lib/config'

  export default {
    name: 'door',
    components: {
      Loading,
      Toast
    },
    data () {
      return {
        showLoading: false,
        textLoading: '加载中...',
        showToast: false,
        textToast: '异常',
        count:"",
        propertyPhone:"",
        config: {
          showUnauthorized: false
        },
        open: false
      }
    },
    computed: {
      locationCommunityName: function () {
        return this.$store.state.switchLocation.communityName
      },
      getCommunityId:function(){
        return this.$store.state.switchLocation.communityId;
      }
    },
    methods: {
      setUserTargetKey: function () {
        this.$store.commit('setUserTargetKey','services')
        location.hash = '#/community'
      },
      toNotice: function () {
        location.hash = '#/services/notice'
      },
      getNoticeNum: function(){
          this.$http.post(Config.host.map.api+'/annoucement/getUnReadCount.do',{communityId: this.$store.state.switchLocation.communityId},{headers:Config.headers}).then((response) => {
            this.showLoading = false;
            if(response.body.rspCd=='00000'){
              if(response.body.count > 99){
                  response.body.count = 99;
              }
              this.count = response.body.count;
            }else{
              Config.errorTips.call(this,response,'response');
            }
          }, (err) => {
            Config.errorTips.call(this,err,'err','未读公告获取失败');
          })
      },
      getVillageTel: function(){
          this.$http.post(Config.host.map.api+'/property/getPropertyPhone.do',{communityId: this.$store.state.switchLocation.communityId}).then((response) => {
            if(response.body.rspCd=='00000'){
              if(!response.body.propertyPhone){
                this.propertyPhone = "";
              }else{
                this.propertyPhone = "tel:" +response.body.propertyPhone;
              }
            }else{
              if(response.body.rspCd != 'LP0302'){
                Config.errorTips.call(this,response,"response");
              }
            }
          }, (err) => {
            Config.errorTips.call(this,err,'err','物业联系方式获取失败');
          })
      },
      verifyIfIden:function(){
        this.getNoticeNum();
        this.getVillageTel();
      },
      propertyPhoneTisp: function(){
        this.showToast = true;
        this.textToast = '物业暂未提供联系方式';
        setTimeout(()=>{
          this.showToast = false
          this.textToast = ''
        },1000)
      }
    },
    created:function(){
        this.verifyIfIden();
    }
  }
</script>

<style lang="scss">
  @import "../../../static/scss/base/_toRem.scss";
  .services_header{
    background-color: #dfdfdf;
    background-position: center center;
    background-repeat: no-repeat;
    padding-top: toRem(30);
    position: relative;
    height: toRem(278-30);
    background-image: url('../../../static/img/common/main_banner_pic_1080w.jpg');
    background-size:100% 100%;
    text-align: center;
    .services_location{
      display:inline-block;
      background: rgba(0,0,0,.4);
      border-radius: 100px;
      height: toRem(60);
      padding:0 toRem(25);
      line-height: toRem(60);
      font-size: toRem(32);
      color: #FFFFFF;
      margin: 0 auto;
      text-align: center;
      &:before{
        font-family: "iconfont";
        content: '\e650';
        display: inline-block;
        font-size: toRem(32);
        margin-right: toRem(10);
      }
    }
  }
  .notice_ico{
    position: relative;
    span{
      position: absolute;
      top:0;
      right:toRem(-20);
      width:toRem(32);
      height:toRem(32);
      background-color:#FE3824;
      border-radius:100%;
      color: #fff;
      font-size:toRem(24);
      line-height:toRem(32);
      text-align: center;
    }
  }
  .services_list{
    li{
      width:50%;
      border-right:1px solid #eff0f0;
      border-bottom:1px solid #eff0f0;
      box-sizing: border-box;
      height:toRem(280);
      float: left;
      text-align: center;
      padding-top:toRem(50);
      background-color:#fff;
      i{
        font-size: toRem(90);
        border-radius:100%;
        color: #fff;
      }
      .notice{
        margin-top:toRem(20);
        font-size: toRem(32);
        color: #3C3C3C;
        line-height:toRem(44);
      }
      .trends{
        font-size: toRem(24);
        color: #A8A8A8;
        line-height:toRem(32);
      }
    }
  }
  .propertyPhone{
    width:100%;
    height:100%;
    display: block;
  }
</style>

