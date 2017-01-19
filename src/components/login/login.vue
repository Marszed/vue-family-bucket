<template>
    <div class="bg">
      <div class="login-banner">
        <img src="../../../static/img/common/logo.png" alt="社区半径">
      </div>
      <div class="login-form">
        <div class="login-group login-mobile" v-bind:class="{'login-active': loginMobileActive}">
          <input type="tel" placeholder="请输入手机号码" maxlength="11" v-model="mobile">
          <a href="javascript:;" class="get-code" @click="getCode" v-bind:class="{'get-code-active': getCodeActive}">{{getCodeText}}</a>
        </div>
        <div class="login-group login-code" v-bind:class="{'login-active': loginCodeActive}">
          <input type="tel" placeholder="请输入验证码" v-model="code" maxlength="6">
        </div>
        <div class="login-submit" v-bind:class="{'login-submit-active': loginSubmitActive}">
          <div class="login-btn" @click="submit">验证并绑定</div>
        </div>
        <p class="login-service">未注册手机号将自动注册，且代表已同意<router-link to="/extension/userAgreement">《社区半径服务协议》</router-link></p>
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

    var windowHeight = window.innerHeight

    export default{
      name: 'login',
        data(){
          return {
            openId: this.$store.state.openId,
            clientOSVersion: this.$store.state.clientOSVersion,
            showLoading: false,
            textLoading: '加载中...',
            showToast: false,
            textToast: '异常',
            mobile: '',
            code: '',
            loginMobileActive: false,
            loginCodeActive: false,
            loginSubmitActive: false,
            getCodeText: '获取验证码',
            getCodeActive: true,
            time: 90,
            sendCodeFlag: false
          }
        },
        methods: {
          getCode: function(){
            // 验证手机号码格式是否合法
            if(this.loginMobileActive && this.getCodeActive){
              this.loginCodeActive = false
              this.getCodeActive = false
              this.getCodeText = this.time+'秒后重发'
              var timer = setInterval(() => {
                this.time -= 1
                if(this.time == 0){
                  clearInterval(timer)
                  this.time = 90
                  this.getCodeText = '获取验证码'
                  this.getCodeActive = true
                  return false
                }
                this.getCodeText = this.time+'秒后重发'
              },1000)
              this.$http.post(Config.host.map.api+'/verifyCode/sms.do', {
                phone: this.mobile,
                verifyCodeType: 'LOGIN'
              }).then((response) => {
                if(response.body.rspCd == '00000'){
                  if(response.body.succeed == true){
                    this.sendCodeFlag = true
                  }
                  return false
                }
                Config.errorTips.call(this,response,'response')
              }, (err) => {
                Config.errorTips.call(this,err,'err','获取验证码获取失败')
              })
            }else{
              if(!this.getCodeActive) return false
              Config.errorTips.call(this,{},'err','请输入正确的手机号')
            }
          },
          submit: function(){
            if(this.loginMobileActive && this.loginCodeActive && this.sendCodeFlag){
              this.showLoading = true
              this.$http.post(Config.host.map.api+'/user/weixin/login.do',{
                phone: this.mobile,
                verifyCode: this.code,
                communityId: this.$store.state.switchLocation.communityId
              }).then((response) => {

                Config.errorTips.call(this,response,'response')

                // 绑定失败
                if(response.body.rspCd != '00000'){
                  this.showLoading = false
                  return false;
                }

                // 更新登录状态
                this.$store.commit('setRegisterState', {
                  isRegister: 'Y'
                })

                // 更新store
                this.$store.commit('setSwitchLocationCity', {
                  cityId: this.$store.state.switchLocationOld.cityId ,
                  cityName: this.$store.state.switchLocationOld.cityName,
                  communityId: this.$store.state.switchLocationOld.communityId,
                  communityName: this.$store.state.switchLocationOld.communityName
                })

                // 更新store
                this.$store.commit('setSwitchLocationCity', {
                  cityId: this.$store.state.switchLocationOld.cityId ,
                  cityName: this.$store.state.switchLocationOld.cityName,
                  communityId: this.$store.state.switchLocationOld.communityId,
                  communityName: this.$store.state.switchLocationOld.communityName
                })

                this.$store.commit('setAuthLocationCity', {
                  id: this.$store.state.switchLocationOld.cityId ,
                  name: this.$store.state.switchLocationOld.cityName
                })
                this.$store.commit('setAuthLocationCommunity', {
                  id: this.$store.state.switchLocationOld.communityId ,
                  name: this.$store.state.switchLocationOld.communityName
                })

                // 更新config
                Config.detail.communityId = this.$store.state.switchLocationOld.communityId
                Config.detail.communityName = this.$store.state.switchLocationOld.communityName


                // 更新新用户登录信息
                if(updateUserLoginDetail(response.body)){
                  this.showLoading = false
                  this.$router.replace(this.$store.state.userTargetKey)
                  //location.hash = '#/'+this.$store.state.userTargetKey
                }

              }, (err) => {
                this.showLoading = false
                Config.errorTips.call(this,err,'err','注册失败')
              })
            }else{
              if(!this.loginMobileActive){
                Config.errorTips.call(this,{},'err','请输入正确的手机号')
                return false
              }
              if(!this.sendCodeFlag){
                Config.errorTips.call(this,{},'err','请获取短信验证码')
                return false
              }
              if(!this.loginCodeActive){
                Config.errorTips.call(this,{},'err','请输入正确的验证码')
              }
            }
          }
        },
        watch: {
          mobile: function(val, oldVal){
            if(/^\d{11,11}$/.test(val) && val.substr(0,1) == 1){
              this.loginMobileActive = true
            }else{
              this.loginMobileActive = false
            }
          },
          code: function(val, oldVal){
            if(/^\d{6,6}$/.test(val) && this.loginMobileActive){
              this.loginCodeActive = true
              this.loginSubmitActive = true
            }else{
              this.loginCodeActive = false
              this.loginSubmitActive = false
            }
          }
        },
        created: function(){
          // fix 软键盘挤压页面的样式兼容问题
          window.document.getElementById('SQBJBOX').style.height = windowHeight+'px'
        },
        components:{
          Loading,
          Toast
        }
    }

    function updateUserLoginDetail(obj) {
      Config.detail.userOpenId = obj.userOpenId
      Config.headers['API-User-OpenID'] = obj.userOpenId
      Config.detail.sessionToken = obj.sessionToken
      Config.headers['API-Session-Token'] = obj.sessionToken
      return true
    }
</script>
<style lang="scss">
  @import "../../../static/scss/base/_toRem.scss";
  .login-banner{
    text-align: center;
    padding: toRem(120) 0 toRem(60);
  &>img{
      width: toRem(180);
    }
  }
  .login-form{
    margin: 0 toRem(30);
  }
  .login-group{
    position: relative;
    box-shadow: inset 0 -1px 0 0 #DCDBE4;
    padding: toRem(19) toRem(20) toRem(19) toRem(108);
    height: toRem(88);
    box-sizing: border-box;
    &>input{
      font-size: toRem(32);
      color: #3c3c3c;
      height: toRem(44);
      line-height: toRem(44);
      border: 0;
      width: 100%;
      padding: toRem(6) 0;
      background: transparent;
    }
    &:before{
       font-family: 'iconfont';
       display: block;
       position: absolute;
       font-size: toRem(50);
       top: toRem(19);
       left: toRem(20);
       z-index: 5;
       color: #DCDBE4;
     }
  }
  .login-active{
    &:before{
       color: #389D38;
     }
  }
  .login-mobile:before{
    content: '\e653';
  }
  .login-code:before{
    content: '\e655';
  }
  .get-code{
    height: toRem(44);
    line-height: toRem(44);
    display: block;
    width: toRem(146);
    position: absolute;
    right: toRem(20);
    top: toRem(6+19);
    z-index: 5;
    font-size: toRem(28);
    color: #A8A8A8;
    text-align: right;
  }
  .get-code-active{
    color: #389D38;
  }
  .login-submit{
    margin: toRem(50) 0 toRem(30);
    background: #5FB05F;
    border-radius: toRem(6);
    height: toRem(88);
    line-height: toRem(88);
    font-size: toRem(34);
    text-align: center;
    color: rgba(255,255,255,0.5);
  }
  .login-service{
    font-size: toRem(24);
    height: toRem(33);
    line-height: toRem(33);
    color: #595959;
    &>a{
      color: #458FE5;
    }
  }
  .login-submit-active{
    background: #389D38;
    color: #fff;
  }
</style>

