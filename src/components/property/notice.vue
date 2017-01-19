<template>
    <div class="bgf8f8f8">
        <pull-to-refresh
          :disable-pulldown="true"
          @on-pullup="onPullup"
          class="scroll-page">
      <div v-if="noData">
        <img src="data:image/png;base64,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" class="abnormal-img">
        <h5 class="abnormal-tip">暂无数据~</h5>
      </div>
        <div v-if="!noData">
          <ul class="notice_box">
            <li @click="toNoticeDetail(index)"  v-for="(item, index) in list" :key="index">
              <p class="notice_title">{{item.subject}} <span v-if="item.readStatus==0"></span></p>
              <div class="notice_footer">
                <span class="top_ico" v-if="item.isTop==1">置顶</span>
                <time>{{item.publishedTime}}</time>
                <span class="notice_views"> {{item.views}}阅读</span>
              </div>
            </li>
          </ul>
        </div>
      </pull-to-refresh>
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
  import PullToRefresh from '../common/scroll/pull-to-refresh.vue'

  export default {
    name: 'door',
    components: {
      Loading,
      Toast,
      PullToRefresh
    },
    data () {
      return {
        showLoading: true,
        textLoading: '加载中...',
        showToast: false,
        textToast: '异常',
        config: {
          showUnauthorized: false
        },
        list:[],
        open: false,
        noData: false,
        pageIndex:0,
        pagecount:0
      }
    },
    methods: {
      getNoticeList: function(){
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
               this.list = response.body.data.data;
               this.$store.commit('setnNoticeList', this.list);
               this.pagecount = parseInt(response.body.data.total / response.body.data.pageSize);
               this.$store.commit('setNoticePagecount', {pagecount:this.pagecount,pageIndex:this.pageIndex});
             }else{
               this.noData = true;
             }
           }else{
             Config.errorTips.call(this,response,'response');
             setTimeout(()=>{
               window.history.back();
             },1000)
           }
         }, (err) => {
           Config.errorTips.call(this,err,'err','公告列表获取失败');
         })
      },
      toNoticeDetail: function(index){
        location.hash = '#/services/notice/noticeDetail/'+index+''
      },
      onPullup(finshCallback) {
        if(this.pagecount == this.pageIndex){
          finshCallback();//finish refreshing state
          this.showToast = true,
          this.textToast = '没有数据了...',
          setTimeout(() => {
            this.showToast = false
            this.textToast = ''
          },1000);
          return false
        }else{
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
                this.list = this.list.concat(response.body.data.data);
                this.$store.commit('setnNoticeList', this.list);
                this.pagecount = parseInt(response.body.data.total / response.body.data.pageSize);
                this.$store.commit('setNoticePagecount', {pagecount:this.pagecount,pageIndex:this.pageIndex});
                finshCallback();//finish refreshing state
              }else{
               if(this.pageIndex == 0){
                this.noData = true;
               }
              }
            }else{
              Config.errorTips.call(this,response,'response');
              setTimeout(()=>{
                window.history.back();
              },1000)
            }
          }, (err) => {
            Config.errorTips.call(this,err,'err','公告列表获取失败');
          })
        }
      }
    },
    created:function(){
      this.getNoticeList();
    }
  }
</script>
<style lang="scss">
  @import "../../../static/scss/base/_toRem.scss";
  .notice_box{
    padding-top:toRem(20);
    li{
      background-color: #fff;
      box-sizing: border-box;
      padding:toRem(26) toRem(30);
      &:first-child{
        border-top: 1px solid #dcdae3;
      }
      height:toRem(140);
      border-bottom:1px solid #dcdae3;
      .notice_title{
        font-size:toRem(32);
        color: #3C3C3C;
        margin-bottom: toRem(12);
        line-height: toRem(45);
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        span{
          width:toRem(12);
          height:toRem(12);
          background-color:#FD3824;
          display: inline-block;
          line-height: toRem(45);
          border-radius: 100%;
          vertical-align: middle;
        }
      }
      .notice_footer{
        font-size:toRem(24);
        color: #A8A8A8;
        line-height:toRem(32);
        .top_ico{
          line-height:toRem(32);
          border: 1px solid #389D38;
          color:#389D38;
          box-sizing: border-box;
          padding:toRem(6) toRem(12);
          border-radius: 4px;
        }
        .notice_views{
          margin-left: toRem(20);
          padding-bottom: toRem(20);
        }
      }
    }
  }

  .scroll-page{
    height:100%;
    position: relative;
    /* Prevent native touch events on Windows */
    -ms-touch-action: none;
    /* Prevent the callout on tap-hold and text selection */
    -webkit-touch-callout: none;
    user-select: none;
    text-size-adjust: none;
  }

  /*scrollbar start*/
  .iScrollVerticalScrollbar {
    position: absolute;
    z-index: 9999;
    width: toRem(2);
    bottom: toRem(2);
    top: toRem(2);
    right: toRem(2);
    overflow: hidden;
  }

  .iScrollVerticalScrollbar.iScrollBothScrollbars {
    bottom: toRem(18);
  }

  .iScrollIndicator {
    position: absolute;
    background: #999;
    border-radius: toRem(6);
    opacity: .8;
  }

  .iScrollVerticalScrollbar .iScrollIndicator {
    width: 100%;
    background: #999;
  }
  /*scrollbar end*/
</style>
