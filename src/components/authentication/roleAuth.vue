<template>
  <div class="full-page"  style="background-color: #efefef;padding-bottom: 0.8rem;">
      <p class="list-title">选择认证类型</p>
      <div class="other-auth-addr" v-html="addr"></div>
      <p class="list-title">{{content.title}}</p>
      <div style="background-color: #fff;">
        <div class="list-input-group clearfix" style="box-shadow: inset 0 -1px 0 0 #DCDBE4;">
          <label>姓名</label>
          <input type="text" v-bind:placeholder="content.placeholder" v-model="name" v-bind:readonly="nameFlag">
        </div>
        <div class="list-input-group clearfix">
          <label>手机号</label>
          <input type="tel" maxlength="11" placeholder="请填写手机号码" v-model="phone" readonly="readonly">
        </div>
      </div>
      <p class="list-title" style="box-shadow: inset 0 -1px 0 0 #DCDBE4,inset 0 1px 0 0 #DCDBE4;">认证理由</p>
      <div style="font-size: 0;">
        <textarea v-model="reason" class="list-reason" maxlength="200" placeholder="填写认证理由（最多200字）"></textarea>
      </div>
      <div class="list-img-box clearfix" style="box-shadow: inset 0 -1px 0 0 #DCDBE4,inset 0 1px 0 0 #DCDBE4;">
        <div class="img-item" v-for="(item, $index) in imgItem" v-show="imgItem.length">
          <div class="img-item-box" v-bind:style="{ backgroundImage: 'url('+item.localId+')' }" @click="toPreviewImage(item)"></div>
          <div class="img-close iconfont" @click="delImg(item.localId)">&#xe668;</div>
        </div>
        <div class="img-add" @click="chooseImage"><img src="../../../static/img/common/home_add_pic_button@3x.png" alt="社区半径"></div>
      </div>
      <p class="list-auth-tip">{{content.tip}}</p>
      <a type="button" class="bg-btn
       mt-10" href="javascript:;"
         v-bind:class="{'bg-btn-default': btnDefault}"
         @click="toSubmit">确认</a>
      <div>
        <layerModel :config="config"></layerModel>
        <loading :show="showLoading" :text="textLoading"></loading>
        <toast type="text" :show="showToast" :text="textToast"></toast>
      </div>
  </div>
</template>

<script>
  import Config from '../../lib/config'
  import LayerModel from '../common/layerModel'
  import Loading from 'vux-components/Loading'
  import Toast from 'vux-components/Toast'

  var windowHeight = window.innerHeight

  export default {
    name: 'roleAuth',
    components: {
      LayerModel,
      Loading,
      Toast
    },
    data()  {
      return{
        showLoading: true,
        textLoading: '加载中...',
        showToast: false,
        textToast: '异常',
        config:{
          showLayerModel:false,
          imgUrlClass:"img_success",
          contentText:"认证信息提交成功",
          toUrl: '/'+this.$store.state.userTargetKey,
          animate: false
        },
        imgItem: [],
        reason: '',
        name: '',
        nameFlag: true,
        phone: '',
        addr: this.$store.state.authLocation.cityName+
          this.$store.state.authLocation.communityName +
          this.$store.state.authLocation.areaName +
          (this.$store.state.authLocation.floorName ? '-'+ this.$store.state.authLocation.floorName+'栋' : '') +
          (this.$store.state.authLocation.unitNo ? this.$store.state.authLocation.unitNo+'单元' : '') +
          (this.$store.state.authLocation.houseName ? this.$store.state.authLocation.houseName+'室' : '')
      }
    },
    computed: {
      content: function(){
        var obj = {}
        if(this.$route.params.role == 1){
          obj.title = '业主信息'
          obj.placeholder = '请填写业主姓名'
          obj.tip = '上传房产证或物业缴费照片有助于物业快速通过认证申请'
        }
        if(this.$route.params.role == 2){
          obj.title = '家人信息'
          obj.placeholder = '请填写姓名'
          obj.tip = '上传房产证或物业缴费照片有助于物业快速通过认证申请'
        }
        if(this.$route.params.role == 3){
          obj.title = '租户信息'
          obj.placeholder = '请填写姓名'
          obj.tip = '上传租房合同等凭证有助于物业快速通过认证申请'
        }
        return obj
      },
      btnDefault: function(){
        // 必填信息房屋编号 房屋信息 小区编号 姓名 纠错理由 认证类型
        if(this.$store.state.authLocation.houseId && this.$store.state.authLocation.houseId && this.$store.state.authLocation.communityId && this.name && this.reason && this.$route.params.role){
          return false
        }else{
          return true
        }
      }
    },
    methods: {
      init: function(){
        this.$http.post(
          Config.host.map.api+'/userIdentifyChange/getUserInfo.do', '').then((response) => {
            this.showLoading = false
            if(response.body.rspCd == '00000'){
              this.name = response.body.realName
              this.nameFlag = response.body.realName ? true : false
              this.phone = response.body.phone
              this.$store.commit('setAuthLocationPhone',response.body.phone)
              this.$store.commit('setAuthLocationName',response.body.realName)
              return false
            }
            Config.errorTips.call(this,response,'response')
          }, (err) => {
            this.showLoading = false
            Config.errorTips.call(this,err,'err','自身信息获取失败')
        })
      },
      syncUpload: function(tempImgItem){
        var tempItem = tempImgItem.shift(),
            that = this
        if(tempItem.src){ // 图片已上传
          if(tempImgItem.length > 0){
            this.syncUpload(tempImgItem)
          }
          return false
        }
        wx.uploadImage({// 上传图片
          localId: tempItem.localId, // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 0, // 默认为1，显示进度提示
          success: function (res) {// 返回图片的服务器端ID serverId 字符串
            //还存在图片继续上传
            if(tempImgItem.length > 0){
              that.syncUpload(tempImgItem)
            }
            that.$http.post(Config.host.map.apiWeChat+'/business/downloadPictures.do',{
              "mediaId": res.serverId, // 多媒体编号
              "uploadFileEnum": 'HOME_AUTH'// 上传图片业务类型 USER_ICON用户头像，HOME_AUTH家庭认证
            }).then((response) => {
            if(response.body.rspCd == '00000'){
              var index = tempItem.index
              that.imgItem[index].src = response.body.prefix + response.body.relativeUrl
              that.imgItem[index].imgId = response.body.id
              return false
            }
              Config.errorTips.call(that,response,'response')
            }, (err) => {
              Config.errorTips.call(that,err,'err','家庭认证图片上传失败')
            })
          }
        })
      },
      chooseImage: function(){ // 选取图片
        if(this.imgItem.length >= 3){
          Config.errorTips.call(this,{url:''},'err','最多只能上传三张图片')
          return false
        }else{
          var surplus = 3 - this.imgItem.length
        }
        var that = this
        wx.ready(function () {
          wx.chooseImage({
            count: surplus || 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) { // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片, localIds 数组
              //先用微信返回的本地图片做缩略图
              for(var i = 0, len = res.localIds.length; i < len; i++ ){
                that.imgItem.push({
                  localId: res.localIds[i],
                  index: that.imgItem.length // 图片编号
                })
              }
              // 递归异步上传
              var tempImgItem = JSON.parse(JSON.stringify(that.imgItem)) // deep copy
              that.syncUpload(tempImgItem)
            }
          })
        })
      },
      imgHasLoad: function(item){
        if(!item.src){
          this.showLoading = true
          return false
        } else {
          this.showLoading = false
          return true
        }
      },
      toPreviewImage: function(item){
        var timer  = setInterval(() => { // 间隔500ms检测一次当前异步上传的图片是否已在自己服务器下载完毕
          if(this.imgHasLoad(item)){
            clearInterval(timer)
            this.previewImage(item)
            return false
          }
        },500)
      },
      delImg: function(localId){
        var temp = []
        for(var i = 0, len = this.imgItem.length; i < len; i++){
          if(localId != this.imgItem[i].localId){
            temp.push(this.imgItem[i])
          }
        }
        this.imgItem = temp
      },
      previewImage: function(item){ // 预览图片
        var urls = []
        for(var i = 0, len = this.imgItem.length; i < len; i++){
          urls.push(this.imgItem[i].src)
        }
        wx.previewImage({
          current: item.src, // 当前显示图片的http链接
          urls: urls // 需要预览的图片http链接列表
        })
      },
      toSubmit: function(){
        if(this.btnDefault){
          return false
        }
        // 满足提交提交开启loading动画
        this.showLoading = true
        var len = this.imgItem.length,
          imageList = []

        if(len){ // 用户有上传图片
          for(var i = 0; i < len; i++){
            if(this.imgItem[i].imgId && this.imgItem[i].imgId != null && this.imgItem[i].imgId != 'null' && this.imgItem[i].imgId != 'undefined'){
              imageList.push(this.imgItem[i].imgId)
            }
          }
          if(imageList.length != len){ // 如果上传成功图片张数不等于预览图张数,说明图片还没上传完,弄个定时器脏检查下
            setTimeout(() => { // 间隔300ms检测所有异步上传的图片是否已在自己服务器下载完毕
              this.toSubmit()
            }, 300)
          } else {
            this.submit(imageList)
          }
        }else{ // 用户未上传图片
          this.submit('')
          return false
        }
      },
      submit: function(imageList){
        var req = {
          "realName": this.name /*姓名*/,
          "houseId": this.$store.state.authLocation.houseId /*认证房屋ID*/,
          "houseInfo": this.$store.state.authLocation.communityName + '-'+
          (this.$store.state.authLocation.areaName ? this.$store.state.authLocation.areaName+'' : '')+
          (this.$store.state.authLocation.floorName ? this.$store.state.authLocation.floorName+'栋' : '')+
          (this.$store.state.authLocation.unitNo ? this.$store.state.authLocation.unitNo+'单元' : '')+
          (this.$store.state.authLocation.houseName ? this.$store.state.authLocation.houseName+'室' : ''),/*认证房屋信息(小区＋房号) 御溪国际办公楼-1栋栋1单元20007室*/
          "communityId": this.$store.state.authLocation.communityId /*小区编号*/,
          "identifyType": this.$route.params.role /*认证类型：1-业主认证 2-家人认证 3-租户认证*/,
          "reason": this.reason /*理由*/
        }
        if(imageList){
          req.imageList = imageList /*图片集合*/
        }
        this.$http.post(Config.host.map.api+'/userIdentifyChange/identifyApply.do', req).then((response) => {
          this.showLoading = false
          Config.errorTips.call(this,response,'response')
          if(response.body.rspCd == '00000'){
            this.config.showLayerModel = true
          }
        }, (err) => {
          Config.errorTips.call(this,err,'err','认证失败')
        })
      }
    },
    created: function () {
      this.init()
      // fix 软键盘挤压页面的样式兼容问题
      window.document.getElementById('SQBJBOX').style.height = windowHeight+'px'
    }
  }

</script>

<style lang="scss">
  @import "../../../static/scss/base/_toRem.scss";
  .other-auth-addr{
    font-size: toRem(32);
    color: #3C3C3C;
    height: toRem(88);
    line-height: toRem(88);
    background: #FFFFFF;
    box-shadow: inset 0 -1px 0 0 #DCDBE4;
    padding-left: toRem(30);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: keep-all;
  }
  .list-input-group{
    padding: toRem(22) 0 toRem(21);
    margin-left: toRem(30);
    label{
      float: left;
      display: block;
      font-size: toRem(32);
      color: #3C3C3C;
      height: toRem(45);
      line-height: toRem(45);
      min-width: toRem(96);
      margin-right: toRem(20);
    }
    input{
      float: left;
      display: block;
      width: ((399+205-30)/(750-30))*100#{%};
      font-size: toRem(32);
      color: #3C3C3C;
      height: toRem(45);
      line-height: toRem(45);
      border: 0;
    }
  }
  .list-reason{
    background-color: #fff;
    width: 100%;
    border: 0;
    padding: toRem(20) toRem(30);
    height: toRem(300);
    line-height: toRem(40);
    resize: none;
    font-size: toRem(28);
    box-sizing: border-box;
    &:focus{
       color: #3C3C3C;
     }
  }
  .list-img-box{
    background-color: #fff;
    padding: toRem(20) toRem(30);
    margin-left: toRem(-30);
  }
  .img-add,.img-item{
    margin-left: toRem(30);
    float: left;
    width: toRem(140);
    height: toRem(140);
    font-size: 0;
    position: relative;
    img{
      width: 100%;
      border: 0;
    }
    .img-close{
      position: absolute;
      width: toRem(58);
      height: toRem(58);
      line-height: toRem(58);
      text-align: center;
      font-size: toRem(45);
      color: #3C3C3C;
      top: toRem(-58/2+10);
      right: toRem(-58/2);
      z-index: 3;
    }
    .img-item-box{
      width: 100%;
      height: 0;
      padding-bottom: 100%;   /* 关键部分 */
      background-repeat: no-repeat;
      /* 指定图片自动缩放大小 */
      -webkit-background-size: cover;
      background-size: cover;
      /* 指定使用padding-box区域显示背景图片 */
      -webkit-background-origin: padding-box;
      background-origin: padding-box;
    }
  }
  .list-auth-tip{
    margin: toRem(20) toRem(30) 0;
    font-size: toRem(24);
    color: #A8A8A8;
    line-height: toRem(33);
  }
</style>



