<template>
  <div id="unauthorized" v-if="config.showUnauthorized">
      <img class="unauthorized-locker" src="../../../static/img/common/locker.png" alt="未验证">
      <h5 class="unauthorized-tip">{{config.content1}}</h5>
      <p class="unauthorized-reason">{{config.content2}}</p>
      <span @click="toAuth" class="unauthorized-auth" v-if="config.linkFlag">马上认证</span>
      <router-link to="/login" class="unauthorized-auth" v-if="config.linkFlag2" replace>马上绑定</router-link>
  </div>
</template>
<script>
  export default {
    props: {
      config: {
        type: Object,
        default: {
          showUnauthorized: false,
          content1: '无法使用开门',
          content2: '成为小区认证用户后即可体验社区半径开门功能',
          linkFlag: true,
          linkFlag2: false
        }
      }
    },
    methods: {
      toAuth: function(){
        // 点击认证更多房子清除已选楼宇信息
        this.$store.commit('clearAuthLocationCommunity')
        this.$router.push('authentication')
      }
    },
    name: 'unauthorized'
  }
</script>

<style lang="scss">
  @charset "UTF-8";
  @import "../../../static/scss/base/_toRem.scss";
  #unauthorized{
    text-align: center;
    .unauthorized-locker{
      padding-top: toRem(61);
      width: toRem(260);
    }
    .unauthorized-tip{
      font-size: toRem(34);
      color: #595959;
      line-height: 34px;
      margin: toRem(20) auto;
    }
    .unauthorized-reason{
      font-size: toRem(28);
      color: #A8A8A8;
      line-height: toRem(28);
      margin-bottom: toRem(48);
    }
    .unauthorized-auth{
      font-size: roRem();
      color: #389D38;
      line-height: 34px;
    }
  }
</style>
