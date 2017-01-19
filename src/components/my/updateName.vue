<template>
  <div class="bgf8f8f8">
    <div class="updataName_input">
      <span>昵称</span>
      <input v-model="nickname" id="nameVal">
      <i class="iconfont fr" v-on:click="clearVal">&#xe668;</i>
    </div>
    <span class="updateName_btn" @click="saveName">保存</span>
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
        nickname:this.$store.state.entifyMsg.nickname,
        config: {
          showUnauthorized: false
        },
        open: false
      }
    },
    watch: {
      nickname: function(val,oldVal){
        if(!val){
          this.nickname = val
          return false
        }
        if(/^[\u4E00-\u9FA5A-Za-z0-9_]+$/.test(val)){ // 中文、英文、数字包括下划线,空字符串
          this.nickname = val
        } else {
          this.nickname = oldVal
        }
      }
    },
    methods: {
      clearVal:function(){
         this.nickname = "";
         document.getElementById('nameVal').focus();
      },
      saveName:function(){
         var obj = {
            "userId":this.$store.state.entifyMsg.userId,
            "nickname":this.nickname
          };
         this.showLoading = true;
         this.textLoading = "修改中";
         this.$http.post(Config.host.map.api+'/user/updateNickname.do',obj).then((response) => {
            this.showLoading = false;
            if(response.body.rspCd == "00000"){
                var entifyMsgObj = this.$store.state.entifyMsg;
                entifyMsgObj.nickname = this.nickname;
                this.$store.commit('setnEntifyMsg', entifyMsgObj);
                location.hash = '/my'
            }else{
              Config.errorTips.call(this,response,'response');
            }
         }, (err) => {
            Config.errorTips.call(this,err,'err','昵称修改失败')
         })
      }
    }
  }
</script>
<style lang="scss">
  @import "../../../static/scss/base/_toRem.scss";
  .updataName_input{
    background: #FFFFFF;
    border-top: 1px solid #DCDAE3;
    border-bottom: 1px solid #DCDAE3;
    padding:toRem(22) toRem(30);
    margin-top: toRem(50);
    span{
      font-size: toRem(32);
      color: #3C3C3C;
      display: inline-block;
      height:toRem(45);
      line-height: toRem(45);
    }
    input{
      font-size: toRem(32);
      color: #3C3C3C;
      width:toRem(750-192);
      border:none;
    }
    i{
      font-size: toRem(28);
      color: #c7c7c7;
      margin-top: toRem(8);
    }
  }
  .updateName_btn{
    background: #389D38;
    border-radius: 6px;
    margin:toRem(50) toRem(30) 0 toRem(30);
    line-height: toRem(48);
    padding:toRem(16) 0;
    text-align: center;
    display: block;
    font-size: toRem(34);
    color: #fff;
  }
</style>
