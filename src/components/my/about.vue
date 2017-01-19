<template>
  <div class="bgf8f8f8">
    <div class="about_box">
        <p class="about_sqbj_ico">
          <img src="../../../static/img/common/about_sqbj_ico@3x.png">
        </p>
        <p class="about_text_pic">
          <img src="../../../static/img/common/about_text_pic@3x.png">
        </p>

      <span class="about_btn" @click="toThirdPartyWebPage">
        安装社区半径 <i>（体验更多贴心服务）</i>
      </span>
    </div>
  </div>
</template>
<script>
  import Config from '../../lib/config'
  export default {
    name: 'about',
    data () {
      return {
        config: {
          showUnauthorized: false
        },
        open: false
      }
    },
    methods: {
      toThirdPartyWebPage: function(){
        this.$router.push({ path: '/my/about', query: { thirdPartyWebPage: '1' }})
        Config.thirdPartyWebPage('http://a.app.qq.com/o/simple.jsp?pkgname=cn.lejiayuan#opened')
      }
    }
  }
</script>
<style lang="scss">
  @import "../../../static/scss/base/_toRem.scss";
  .about_box{
    height:100%;
    background-image: url("../../../static/img/common/me_family_background_pic_1080w.jpg");
    background-size: 100% 100%;
    padding-top: toRem(50);
    box-sizing: border-box;
    p{
      text-align: center;
    }
  }
  .about_sqbj_ico{
    img{
      width:toRem(180);
      height:toRem(180);
    }
  }
  .about_text_pic{
    margin-top: toRem(30);
    img{
      width: toRem(288);
      height: toRem(40);
    }
  }
  .about_btn{
    text-align: center;
    height: 0.8rem;
    display: block;
    background: #389D38;
    border-radius: 0.06rem;
    font-size: 0.34rem;
    color: #FFFFFF;
    margin-left: 0.3rem;
    margin-top: 1.13rem;
    margin-right: 0.3rem;
    line-height: 0.8rem;
    i{
      font-size: toRem(24);
      color: #FFFFFF;
      font-style: normal;
    }
  }
</style>
