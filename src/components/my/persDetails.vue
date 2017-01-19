<template>
  <div class="bgf8f8f8">
    <p class="my_pers_title">基本信息</p>
    <div class="my_pers_content">
      <div class="my_pers_avatar my_pers_list clearfix" @click="chooseImage">
        <span>头像</span>
        <img v-bind:src="entifyMsg.iconUrl" v-if="entifyMsg.iconUrl">
        <i class="iconfont headIco" v-if="!entifyMsg.iconUrl">&#xe65e;</i>
        <i class="iconfont fr">&#xe65a;</i>
      </div>
      <div class="my_pers_list my_pers_contact clearfix">
        <span>账号</span>
        <span class="contact_span">{{entifyMsg.phone | shieldMobile}}</span>
      </div>
      <div class="my_pers_list my_pers_name clearfix" v-on:click="toUpdateName">
        <span>昵称</span>
        <span class="name_span">{{entifyMsg.nickname}}</span>
        <i class="iconfont fr">&#xe65a;</i>
      </div>
    </div>
  </div>
</template>
<script>
  import Config from '../../lib/config'
  import Loading from 'vux-components/Loading'
  import Toast from 'vux-components/Toast'

  export default {
    name: 'persDetails',
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
        config: {
          showUnauthorized: false
        },
        open: false
      }
    },
    computed: {
      entifyMsg: function(){
        return this.$store.state.entifyMsg
      }
    },
    methods: {
      toUpdateName:function(){
        location.hash = '#/my/PersDetails/updateName'
      },
      syncUpload: function(localId){
        var that = this
        wx.uploadImage({// 上传图片
          localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {// 返回图片的服务器端ID serverId 字符串
            that.$http.post(Config.host.map.apiWeChat+'/business/downloadPictures.do',{
              "mediaId": res.serverId, // 多媒体编号
              "uploadFileEnum": 'USER_ICON'// 上传图片业务类型 USER_ICON用户头像，HOME_AUTH家庭认证
            }).then((response) => {
              if(response.body.rspCd == '00000'){
                // 不用服务端返回的绝对地址图片路径了,没必要
                // that.$store.commit('setnEntifyMsgIcon',{iconUrl: response.body.prefix + response.body.relativeUrl})
                return false
              }
              Config.errorTips.call(that,response,'response')
            }, (err) => {
              Config.errorTips.call(that,err,'err','更新头像上传失败')
            })
          }
        })
      },
      chooseImage: function(){ // 选取图片
        var that = this
        wx.ready(function () {
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) { // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片, localIds 数组
              //先用微信返回的本地图片做缩略图
              that.$store.commit('setnEntifyMsgIcon',{iconUrl: res.localIds[0]})
              // 异步上传
              that.syncUpload(res.localIds[0])
            }
          })
        })
      }
    },
    filters:{
      shieldMobile:function(e){  //判断成员与业主关系
         return e.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
      }
    }
  }
</script>
<style lang="scss">
  @import "../../../static/scss/base/_toRem.scss";
  .my_pers_title{
    font-size:toRem(24);
    color: #A8A8A8;
    background: rgba(239,239,244,0.50);
    box-shadow: inset 0 -1px 1px 0 #DCDBE4;
    line-height: toRem(33);
    padding:toRem(14) 0 toRem(14) toRem(30);
  }
  .my_pers_content{
    padding-left:toRem(30);
    background-color: #fff;
    border-bottom: 1px solid #dcdbe4;
    color: #3c3c3c;
  }
  .my_pers_list{
    border-top: 1px solid #dcdbe4;
    padding:toRem(30) toRem(30) toRem(30) 0 ;
    &:first-child{
      border:none;
    }
    .contact_span,.name_span{
      margin-left:toRem(84) ;
    }
  }
  .my_pers_avatar{
    span{
      font-size:toRem(32);
      color: #3C3C3C;
      line-height: toRem(80);
      vertical-align: top;
      display: inline-block;
      height: toRem(80);
    }
    img{
      width:toRem(80);
      height:toRem(80);
      margin-left: toRem(84);
      border-radius: 100%;
    }
    i{
      margin-top: toRem(27);
      color: #3C3C3C;
    }
  }
  .headIco{
    font-size: toRem(80);
    background-color: #afd8af;
    border-radius: 100%;
    margin-left: toRem(84);
    color: #efe7ef !important;
  }
</style>
