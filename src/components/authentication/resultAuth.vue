<template>
  <div class="full-page">
    <div class="bg bg-blur"></div>
    <div class="bg-box">
      <div class="result-1" v-if="result == 1">
        <img class="result-logo" src="../../../static/img/common/result_ico_1@3x.png" alt="社区半径">
        <h5>业主预留信息不完整，无法认证</h5>
        <p>请到物业修改业主信息后重试<br>或通过其他方式进行认证</p>
        <router-link to="/authentication/other-auth" class="other-auth">其他方式认证</router-link>
      </div>
      <div class="result-2" v-if="result == 2">
        <img class="result-logo" src="../../../static/img/common/result_ico_2@3x.png" alt="社区半径">
        <h5>恭喜您成为认证业主！</h5>
        <p>{{address}}</p>
        <div class="list-form-items">
          <div class="list-content clearfix" style="box-shadow: inset 0 -1px 0 0 #DCDBE4;">
            <h3>业主</h3>
            <h4>{{name}}</h4>
          </div>
          <div class="list-content clearfix">
            <h3>身份证号</h3>
            <h4>{{idCardNumber | password}}</h4>
          </div>
        </div>
        <div class="result-tip">注：如以上预留信息不符，请及时前往所在小区物业更新。</div>
        <div class="other-auth" @click="goBack">返回</div>
      </div>
      <div class="result-2" v-if="result == 3">
        <img class="result-logo" src="../../../static/img/common/result_ico_2@3x.png" alt="社区半径">
        <h5>恭喜您成为认证租户！</h5>
        <p>{{address}}</p>
        <!--<div class="list-form-items" v-if="name">-->
          <!--<div class="list-content clearfix" style="box-shadow: inset 0 -1px 0 0 #DCDBE4;">-->
            <!--<h3>业主</h3>-->
            <!--<h4>{{name}}</h4>-->
          <!--</div>-->
          <!--<div class="list-content clearfix">-->
            <!--<h3>预留手机</h3>-->
            <!--<h4>{{phone}}</h4>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="result-tip" v-if="name">注：如以上预留信息不符，请及时前往所在小区物业更新。</div>-->
        <div class="other-auth" @click="goBack">返回</div>
      </div>
      <div class="result-2" v-if="result == 4">
        <img class="result-logo" src="../../../static/img/common/result_ico_3@3x.png" alt="社区半径">
        <h5>你的业主认证申请正在审核中！</h5>
        <p>请耐心等待物业审核，审核结果将及时向你告知</p>
        <div class="other-auth" @click="goBack">返回</div>
      </div>
      <div class="result-1" v-if="result == 5">
        <img class="result-logo" src="../../../static/img/common/result_ico_1@3x.png" alt="社区半径">
        <h5>物管系统查询业主预留信息失败</h5>
        <p>请通过其他方式进行认证</p>
        <router-link to="/authentication/other-auth" class="other-auth">其他方式认证</router-link>
      </div>
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

  export default {
    name: 'resultAuth',
    components: {
      Loading,
      Toast
    },
    data(){
      return{
        showLoading: true,
        textLoading: '加载中...',
        showToast: false,
        textToast: '异常',
        result: this.$route.params.resultId,
        idCardNumber: '',
        phone: '',
        name: ''
      }
    },
    computed: {
      address: function(){
        return this.$store.state.authLocation.cityName + (this.$store.state.authLocation.floorName ? '-'+ this.$store.state.authLocation.floorName+'栋' : '') + (this.$store.state.authLocation.unitNo ? this.$store.state.authLocation.unitNo+'单元' : '') + (this.$store.state.authLocation.houseName ? this.$store.state.authLocation.houseName+'室' : '')
      }
    },
    filters: {
      password: function (value) {
        if(value){
          return value.substr(0,6)+'********'+value.substr(value.length-4,4)
        } else {
          return ''
        }
      }
    },
    methods: {
      init: function(){
        this.$http.post(
          Config.host.map.api+'/userIdentifyChange/getUserInfo.do', '').then((response) => {
          this.showLoading = false
          if(response.body.rspCd == '00000'){
            this.idCardNumber = response.body.idCardNumber
            this.phone = response.body.phone
            this.name = response.body.realName
            return false
          }
          Config.errorTips.call(this,response,'response')
      }, (err) => {
          this.showLoading = false
          Config.errorTips.call(this,err,'err','自身信息获取失败')
        })
      },
      goBack: function(){
        location.hash = '#/'+this.$store.state.userTargetKey
      }
    },
    created: function(){
      this.init()
    }
  }
</script>

<style lang="scss">
  @import "../../../static/scss/base/_toRem.scss";
  .result-1{
    text-align: center;
    margin-top: toRem(140);
    h5{
      font-size: toRem(36);
      line-height: toRem(50);
      color: #595959;
      margin: toRem(20) auto toRem(10);
    }
    p{
      font-size: toRem(28);
      color: #A8A8A8;
      line-height: toRem(40);
      margin-bottom: toRem(30);
    }
  }
  .result-2{
    @extend .result-1;
    .other-auth{
      margin-top: toRem(51);
    }
  }
  .result-logo{
    width: toRem(120);
    height: toRem(120);
  }
  .result-tip{
    margin-top: toRem(40);
    font-size: toRem(24);
    color: #F45064;
    line-height: toRem(33);
  }
  .other-auth{
    display: block;
    width: 50%;
    font-size: toRem(34);
    color: #389D38;
    line-height: toRem(48);
    margin: 0 auto;
  }
  .list-form-items{
    background: #FFFFFF;
    box-shadow: inset 0 1px 0 0 #DCDAE3, inset 0 -1px 0 0 #DCDBE4;
  }
  .list-content{
    margin-left: toRem(30);
    & > h3{
      float: left;
      min-width: toRem(112);
      margin-right: toRem(20);
      font-size: toRem(28);
      line-height: toRem(88);
      height: toRem(88);
      color: #7C797A;
      text-align: left;
    }
    & > h4{
      float: left;
      font-size: toRem(28);
      line-height: toRem(88);
      height: toRem(88);
      color: #A8A8A8;
    }
  }
</style>



