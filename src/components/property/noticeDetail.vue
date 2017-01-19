<template>
  <div class="bgf8f8f8 notice_detail_box">
    <input type="hidden">
    <p class="notice_detail_title">{{noticeList[index].subject}}</p>
    <div class="notice_detail_tips">
      <time>{{noticeList[index].publishedTime}}</time>
      <span> {{noticeList[index].views}}阅读</span>
    </div>
    <div class="notice_detail_text" v-html="noticeList[index].content"></div>
    <div class="notice_detail_btn clearfix">
      <router-link tag="span" :to="pre" v-bind:class="{'action':index>0}" replace><i class="iconfont">&#xe661;</i> 上一条</router-link>
      <router-link tag="span" :to="next" v-bind:class="{'action':index<(noticeList.length-1)}" replace>下一条<i class="iconfont">&#xe65a;</i></router-link>
    </div>
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
        noticeList:this.$store.state.noticeList,
        pagecount:this.$store.state.pageInfoObj.pagecount,
        pageIndex:this.$store.state.pageInfoObj.pageIndex,
        config: {
          showUnauthorized: false
        },
        open: false
      }
    },
    computed: {
      next: function(){
         if(this.$route.params.index<(this.noticeList.length-1)){
            if(this.index == this.noticeList.length-2 && this.pagecount != this.pageIndex){
              this.pageIndex = this.pageIndex+1;
              var noticeListObj = {
                "pageIndex":this.pageIndex,
                "pageSize":10,
                "type":"QUARTER_NOTICE",
                "communityId":this.$store.state.switchLocation.communityId
              }
              this.$http.post(Config.host.map.apiWeChat+'/business/queryAnnounceList.do',noticeListObj).then((response) => {
                this.showLoading = false;
                if(response.body.rspCd=='00000'){
                  if(response.body.data.data.length){
                    this.noData = false;
                    this.noticeList = this.noticeList.concat(response.body.data.data);
                    this.pagecount = parseInt(response.body.data.total / response.body.data.pageSize);
                  }
                }else{
                  Config.errorTips.call(this,response,'response');
                }
              }, (err) => {
                Config.errorTips.call(this,err,'err','公告详情列表获取失败');
              })
          }

            return '/services/notice/noticeDetail/'+(this.$route.params.index-0+1)
         }else{
            return '/services/notice/noticeDetail/'+(this.$route.params.index)
         }
      },
      pre: function(){
        if((this.$route.params.index) > 0){
          return '/services/notice/noticeDetail/'+(this.$route.params.index-0-1)
        }else{
          return '/services/notice/noticeDetail/'+(this.$route.params.index)
        }
      },
      index: function(){
        this.addIncreaseViews();
        return this.$route.params.index
      }
    },
    methods: {
      addIncreaseViews: function(){
        var readCountObj = {
          'id':this.noticeList[this.$route.params.index].id,
          'areaId': this.$store.state.switchLocation.communityId
        };
        this.$http.post(Config.host.map.apiWeChat+'/business/increaseAnnounceReadCount.do',readCountObj).then((response) => {
              this.showLoading = false;
          }, (err) => {
            console.log('err' + err);
        })
      }
    }
  }
</script>
<style lang="scss">
  @import "../../../static/scss/base/_toRem.scss";
  .notice_detail_box{
    padding: toRem(50) toRem(30) 0;
    box-sizing: border-box;
    position: relative;
  }
  .notice_detail_title{
    font-size: toRem(40);
    color: #3C3C3C;
    line-height: toRem(56);
  }
  .notice_detail_tips{
    font-size: toRem(24);
    color: #a8a8a8;
    line-height: toRem(33);
    margin: toRem(13) 0 toRem(27) 0;
  }
  .notice_detail_text{
    font-size: toRem(28);
    color: #595959;
    padding-bottom:toRem(100);
  }
  #app{
    position: relative;
  }
  .notice_detail_btn{
    position: fixed;
    bottom:0;
    left:0;
    right:0;
    background-color: #fff;
    span{
      width:50%;
      height:toRem(90);
      font-size: toRem(28);
      color: #a8a8a8;
      line-height: toRem(90);
      float: left;
      text-align: center;
      &.action{
        color: #389D38;
      }
    }
  }
</style>
