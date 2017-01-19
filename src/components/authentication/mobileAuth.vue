<template>
  <div class="full-page">
    <div class="bg bg-blur"></div>
    <div class="bg-box">
      <p class="mobile-auth-title">请补全此房屋业主的预留手机号</p>
      <p class="mobile-auth-addr">{{locationAddr}}</p>
      <div class="mobile-auth-group">
        <div class="mobile-auth-box clearfix">
          <span class="fl">{{phone.substr(0,5)}}</span>
          <div class="mobile-auth-input-box fl">
            <div class="input-copy" v-text="mobile"></div>
            <input type="tel" maxlength="4" v-model="mobile">
            <i class="mobile-auth-line"></i>
          </div>
          <span class="fl">{{phone.substr(9,2)}}</span>
        </div>
        <div class="mobile-auth-switch" @click="switchPhone" v-if="phoneArray">切换</div>
      </div>
      <a type="button" class="bg-btn mt-10" href="javascript:;" v-bind:class="{'bg-btn-default': btnDefault}" @click="authMobile">下一步</a>
      <p class="mobile-auth-tip">你也可以通过其他方式进行认证</p>
      <p class="mobile-auth-other" @click="otherAuth">其他方式认证</p>
    </div>
    <div>
      <loading :show="showLoading" :text="textLoading"></loading>
      <toast type="text" :show="showToast" :text="textToast"></toast>
      <confirm :config="config"></confirm>
    </div>
  </div>
</template>

<script>
  import Config from '../../lib/config'
  import Confirm from '../common/confirm'
  import Loading from 'vux-components/Loading'
  import Toast from 'vux-components/Toast'

  export default {
    name: 'mobileAuth',
    data()  {
      return{
        showLoading: true,
        textLoading: '加载中...',
        showToast: false,
        textToast: '异常',
        phoneArray: '',
        phone: '',
        config: {
          showConfirmBox: false,
          title: '提示',
          content: '你填写的手机号和此房屋业主的预留手机号匹配失败',
          cancel: '其他方式认证',
          sure: '知道了',
          href: '#/authentication/other-auth'
        },
        btnDefault: true,
        mobile: ''
      }
    },
    computed: {
      locationAddr: function () {
        return this.$store.state.authLocation.cityName+'市'+this.$store.state.authLocation.communityName+this.$store.state.authLocation.areaName + (this.$store.state.authLocation.floorName ? '-'+ this.$store.state.authLocation.floorName+'栋' : '') + (this.$store.state.authLocation.unitNo ? this.$store.state.authLocation.unitNo+'单元' : '') + (this.$store.state.authLocation.houseName ? this.$store.state.authLocation.houseName+'室' : '')
      },
      locationCityName: function () {
        return this.$store.state.authLocation.cityName
      },
      locationCommunityName: function () {
        return this.$store.state.authLocation.communityName
      },
      locationFloorName: function () {
        if(!this.$store.state.authLocation.cityName || !this.$store.state.authLocation.communityName || !this.$store.state.authLocation.floorName || !this.$store.state.authLocation.houseName){
          this.btnDefault = true
        }else{
          this.btnDefault = false
        }
        return this.$store.state.authLocation.floorName + (this.$store.state.authLocation.houseName ? '-' : '') + this.$store.state.authLocation.houseName
      }
    },
    watch: {
      mobile: function (newVal, oldVal) {
        if(/^\d{4,4}$/.test(newVal)){
          this.btnDefault = false
        } else {
          this.btnDefault = true
        }
      }
    },
    methods: {
      switchPhone: function(){
        var len = this.phoneArray.length
        if(!len) return false
        for(var i = 0; i < len; i++){
          if(this.phone == this.phoneArray[i].telephone){
            if(i+1 == len){
              this.phone = this.phoneArray[0].telephone
              break
              return false
            }
            this.phone = this.phoneArray[i+1].telephone
            break
          }
        }
      },
      toCityAuth: function () {
        location.hash = '#/authentication/city-auth'
      },
      toCommunityAuth: function(){
        if(this.$store.state.authLocation.cityName){
          location.hash = '#/authentication/community-auth'
        }
      },
      toFloorAuth: function(){
        if(this.$store.state.authLocation.communityName){
          location.hash = '#/authentication/floor-auth'
        }
      },
      authMobile: function(){
        if(!this.btnDefault){
          this.showLoading = true
          var reqBody = {
            phone: this.phone.substr(0,5) + this.mobile + this.phone.substr(9,2),
            houseId: this.$store.state.authLocation.houseId,
            "verifyCodeType": 'VERIFY_HOUSE',
            'smsFlag': 'Yes'
          }
          this.$http.post(Config.host.map.api+'/verifyCode/identifyCode.do',reqBody).then((response) => {
            Config.errorTips.call(this,response,'response')
            this.showLoading = false
            if(response.body.rspCd != '00000'){
              this.config.showConfirmBox = true
            }else{
              this.$store.commit('setAuthLocationPhone',reqBody.phone)
              location.hash = '#/authentication/mobile/msg'
            }
          }, (err) => {
            Config.errorTips.call(this,err,'err','验证预留手机号获取失败')
          })
        }
      },
      getLocation: function(){
        this.$http.post(Config.host.map.api+'/userIdentifyChange/queryUserIdentifyChangeInfo.do', {
          houseId: this.$store.state.authLocation.houseId,
          communityId: this.$store.state.authLocation.communityId
        }).then((response) => {
          Config.errorTips.call(this,response,'response')
          this.showLoading = false
          if(response.body.rspCd = '00000'){
            this.phoneArray = response.body.landlordPhoneList
            this.phone = response.body.landlordPhoneList[0].telephone
          }
        }, (err) => {
          Config.errorTips.call(this,err,'err','预留手机号获取失败')
        })
      },
      otherAuth: function(){
        location.hash = '#/authentication/other-auth'
      }
    },
    created: function () {
      this.getLocation()
    },
    components: {
      Confirm,
      Loading,
      Toast
    }
  }
</script>


