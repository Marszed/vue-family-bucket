<template>
  <div class="full-page" style="background-color: #efefef">
    <p class="list-title">选择认证类型</p>
    <ul class="other-auth-list">
      <router-link tag="li" to="/authentication/role-auth/1" class="clearfix" style="box-shadow: inset 0 -1px 0 0 #DCDBE4;">
        <div class="iconfont" style="color: #76b600;">&#xe666;</div>
        <div class="other-auth-content">
          <h5>业主认证</h5>
          <p>如你是业主发现预留信息有误，可进行业主信息更正认证，由物业公司完成认证审批</p>
        </div>
      </router-link>
      <router-link tag="li" to="/authentication/role-auth/2" class="clearfix" style="box-shadow: inset 0 -1px 0 0 #DCDBE4;">
        <div class="iconfont" style="color: #40abcf;">&#xe65b;</div>
        <div class="other-auth-content">
          <h5>家人认证</h5>
          <p>如你是业主家人，可进行线上认证申请，由物业公司完成认证审批</p>
        </div>
      </router-link>
      <router-link tag="li" to="/authentication/role-auth/3" class="clearfix">
        <div class="iconfont" style="color: #f37737;">&#xe667;</div>
        <div class="other-auth-content">
          <h5>租户认证</h5>
          <p>如你是该房屋租户，可进行线上认证申请，由物业公司完成认证审批</p>
        </div>
      </router-link>
    </ul>
  </div>
</template>
<script>
  export default {
    name: 'otherAuth'
  }
</script>
<style lang="scss">
  @import "../../../static/scss/base/_toRem.scss";
  .other-auth-list{
    background: #FFFFFF;
    box-shadow: inset 0 -1px 0 0 #DCDBE4;
    & > li{
      margin-left: toRem(30);
      padding: toRem(34) toRem(30) toRem(34) 0;
    }
    .iconfont{
      float: left;
      font-size: toRem(120);
      width: toRem(120);
      height: toRem(120);
      line-height: toRem(120);
      margin-right: toRem(20);
    }
    .other-auth-content{
      float: left;
      max-width: 79.71%;
      h5{
        font-size: toRem(32);
        color: #3C3C3C;
        line-height: toRem(44);
        margin-bottom: toRem(10);
      }
      p{
        font-size: toRem(24);
        color: #A8A8A8;
        line-height: toRem(33);
      }
    }
  }
</style>


