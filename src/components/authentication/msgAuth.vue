<template>
  <div class="full-page">
    <div class="bg bg-blur"></div>
    <div class="bg-box">
      <div class="msg-auth-header">验证码已发至预留手机号{{phone}}</div>
      <div class="msg-auth-tip">验证码5分钟内有效</div>
      <div class="msg-auth-input-box">
        <label>验证码</label>
        <input type="tel" maxlength="6" placeholder="请输入短信验证码" v-model="msg">
        <a href="javascript:;" class="msg-send-code" @click="getCode" v-bind:class="{'msg-send-code-active': getCodeActive}">{{getCodeText}}</a>
      </div>
      <a type="button" class="bg-btn mt-10" href="javascript:;" v-bind:class="{'bg-btn-default': btnDefault}" @click="authMobile">确认</a>
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
  var timeLength = 299
  export default {
    name: 'mobileAuth',
    data()  {
      return{
        showLoading: false,
        textLoading: '加载中...',
        showToast: false,
        textToast: '异常',
        btnDefault: true,
        msg: '',
        getCodeText: timeLength+'秒后重发',
        getCodeActive: false,
        time: timeLength
      }
    },
    computed: {
      phone: function(){
        return this.$store.state.authLocation.phone
      }
    },
    watch: {
      msg: function (newVal, oldVal) {
        if(/^\d{6,6}$/.test(newVal)){
          this.btnDefault = false
        } else {
          this.btnDefault = true
        }
      }
    },
    methods: {
      otherAuth: function(){
        location.hash = '#/authentication/other-auth'
      },
      authMobile: function(){
        if(!this.btnDefault){
          this.showLoading = true
          this.$http.post(Config.host.map.api+'/identify/VerifyOccupant.do', {
            houseOwnerPhone: this.$store.state.authLocation.phone,
            smscode: this.msg,
            houseId: this.$store.state.authLocation.houseId
          }).then((response) => {
            Config.errorTips.call(this,response,'response')
            this.showLoading = false
            if(response.body.rspCd == '00000'){
              if(this.$store.state.authLocation.role == 'owner'){
                location.hash = '#/authentication/result/2'
              }
              if(this.$store.state.authLocation.role == 'tenant'){
                location.hash = '#/authentication/result/3'
              }
            }
          }, (err) => {
            Config.errorTips.call(this,err,'err','认证失败')
          })
        }
      },
      getCode: function(){
        if(!this.getCodeActive) return false
        this.getCodeText = this.time+'秒后重发'
        this.getCodeActive = false
        var timer = setInterval(() => {
          this.time -= 1
          if(this.time == 0){
            clearInterval(timer)
            this.time = timeLength
            this.getCodeText = '获取验证码'
            this.getCodeActive = true
            return false
          }
          this.getCodeText = this.time+'秒后重发'
        },1000)
      },
      init: function(){
        this.getCodeText = this.time+'秒后重发'
        var timer = setInterval(() => {
          this.time -= 1
          if(this.time == 0){
            clearInterval(timer)
            this.time = timeLength
            this.getCodeText = '获取验证码'
            this.getCodeActive = true
            return false
          }
          this.getCodeText = this.time+'秒后重发'
        },1000)
      }
    },
    created: function () {
      this.init()
    },
    components: {
      Loading,
      Toast
    }
  }
</script>



