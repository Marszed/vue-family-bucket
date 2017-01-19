<template>
  <div class="bgf8f8f8">
    <div class="my_family_header">
      <img src="../../../static/img/common/me_family_pic_1080w.jpg">
      <div class="my_family_place">
        <p class="my_family_place_top">
          {{setHouseObj.communityName}}
          <span>{{setHouseObj.address}}</span>
        </p>
        <p class="my_family_place_bottom">
          <i class="iconfont">&#xe656;</i>{{setHouseObj.communityAddress}}
        </p>
      </div>
    </div>
    <div class="my_family_member">
      <div class="my_family_member_header">
        <span></span>
        <div>
          家庭成员
        </div>
      </div>
      <div class="my_family_member_box" v-if="familyData.data">
        <div class="my_family_member_list clearfix" v-for="(item, index) in familyData.data" v-if="entifyMsg.phone==item.memberMobile">
          <img v-bind:src="item.iconUrl" class="headIcon fl" v-if="item.iconUrl">
          <i class="iconfont fl headIconI" v-if="!item.iconUrl">&#xe65e;</i>
          <div class="fl">
            <p class="my_family_member_name">{{item.memberMobile}}</p>
            <div class="clearfix">
              <i class="owner" v-if="item.isLandlord==1"><img src="../../../static/img/common/user_tag_1@3x.png">认证业主</i>
              <i class="itselfLog">自己</i>
            </div>
          </div>
        </div>

        <div class="my_family_member_list clearfix" v-for="(item, index) in familyData.data" v-if="entifyMsg.phone!=item.memberMobile">
          <img v-bind:src="item.iconUrl" class="headIcon fl" v-if="item.iconUrl">
          <i class="iconfont fl headIconI" v-if="!item.iconUrl">&#xe65e;</i>
          <div class="fl">
            <p class="my_family_member_name">{{item.memberMobile}}</p>
            <div class="clearfix">
              <i class="owner" v-if="item.isLandlord==1"><img src="../../../static/img/common/user_tag_1@3x.png">认证业主</i>
              <span class="nickName" v-if="item.nickName">{{item.nickName}}</span>
            </div>
          </div>
        </div>

        <div class="my_family_member_list clearfix my_add_list" v-on:click="addFamily" v-if="familyData.userHouseRelation.isLandlord==1">
          <img src="../../../static/img/common/me_add_button@3x.png" class="headIcon fl">
          <div class="fl">
            <p>添加家庭成员</p>
          </div>
        </div>

        <div class="my_quit_btn" v-if="familyData.userHouseRelation.isLandlord!=1" @click="quitFamily">
          退出家人圈
        </div>
      </div>
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
    name: 'family',
    components: {
      Loading,
      Toast
    },
    data () {
      return {
        showLoading: true,
        textLoading: '加载中...',
        showToast: false,
        textToast: '异常',
        familyData:[],
        setHouseObj:this.$store.state.setHouseObj,
        config: {
          showUnauthorized: false
        },
        open: false,
        entifyMsg:this.$store.state.entifyMsg
      }
    },
    methods: {
       addFamily:function(){
        location.hash = '#/my/addFamily'
       },
       getFamilyData:function(){
          this.$http.post(Config.host.map.api+'/family/getFamilyMemberList.do',{
            "houseId": this.$store.state.houseId
          }).then((response) => {
              this.showLoading = false;
             if(response.body.rspCd == '00000'){
                var items = response.body.data;
                var landlordArr1 = [],landlordArr2 = [];
              for(var i=0;i<items.length;i++){
                if(items[i].isLandlord==1){
                  landlordArr1.push(items[i]);
                }else{
                  landlordArr2.push(items[i]);
                }
              }
              response.body.data = landlordArr1.concat(landlordArr2);
              this.familyData = response.body;
             }else{
              Config.errorTips.call(this,response,'response');
             }
            }, (err) => {
              Config.errorTips.call(this,err,'err','家庭成员获取失败')
          })
       },
       quitFamily:function(){
          this.showLoading = true;
          this.textLoading = '',
          this.$http.put(Config.host.map.mobileAPI+'/family/member/remove',{'houseId':this.$store.state.houseId + ""}).then((response) => {
            this.showLoading = false;
            location.hash = '#/my'
          }, (err) => {
              Config.errorTips.call(this,err,'err','退出家人圈失败')
          })
       }
    },
    created:function(){
       this.getFamilyData();
    }
  }
</script>
<style lang="scss">
  @import "../../../static/scss/base/_toRem.scss";
  .my_family_header{
    img{
      width:100%;
      height:toRem(240);
    }
  }
  .my_family_place{
    padding: toRem(34);
    box-sizing: border-box;
    .my_family_place_top{
      font-size:toRem(32);
      color: #3C3C3C;
      span{
        font-size:toRem(28);
        color: #3C3C3C;
      }
    }
    .my_family_place_bottom{
      font-size:toRem(24);
      margin-top: toRem(10);
      color: #A8A8A8;
    }
  }
  .my_family_member{
    background-color: #f8f8f8;
    padding-bottom:toRem(140);
  }
  .my_family_member_header{
    span{
      background-image: url("../../../static/img/common/me_family_pic2@3x.png");
      height:toRem(8);
      background-repeat:repeat-x;
      display: block;
    }
    div{
      background: rgba(239,239,244,0.50);
      box-shadow: inset 0 -1px 0 0 #DCDBE4;
      padding:toRem(18) toRem(30) toRem(18) toRem(30);
      font-size: toRem(24);
      color: #A8A8A8;
    }
  }
  .my_family_member_list{
    border-bottom: 1px solid #DCDBE4;
    padding: toRem(30);
    background-color: #fff;
  }
  .headIcon{
    width:toRem(80);
    height:toRem(80);
    border-radius: 100%;
    margin-right:toRem(20);
  }
  .headIconI{
    font-size: toRem(80);
    background-color: #afd8af;
    border-radius: 100%;
    color: #efe7ef;
    margin-right:toRem(20);
    box-sizing: border-box;
    width:toRem(80);
    height:toRem(80);
    line-height: toRem(80);
  }

  .my_family_member_name{
    line-height: toRem(38);
    height: toRem(38);
    margin-bottom: toRem(4);
  }
  .my_add_list{
    font-size:toRem(28);
    color: #A8A8A8;
    line-height: toRem(80);
  }
  .my_quit_btn{
    height:toRem(88);
    font-size: toRem(32);
    color: #595959;
    line-height:toRem(88);
    background: #FFFFFF;
    box-shadow: inset 0 -1px 0 0 #DCDBE4, inset 0 1px 0 0 #DCDAE3;
    margin-top:toRem(50);
    text-align: center;
  }

  @mixin status($bgcolor){
    color: #fff !important;
    border-radius:toRem(28);
    background-color: $bgcolor !important;
    line-height: toRem(34);
    height: toRem(34);
    font-size:toRem(24);
    text-align: center;
    padding:0 toRem(10);
    display: block;
    float: left;;
    font-style: normal;
    margin-right: toRem(10);
  }

  .itselfLog{//自己
    @include status(#D8D2CA);
  }
  .wifeLof{//妻子
    @include status(#B671E0);
  }
  .maritoLog{//丈夫
    @include status(#60D3D3);
  }
  .sonLog{//儿子
    @include status(#71B6E0);
  }
  .daughterLog{//女儿
    @include status(#F98A99);
  }
  .fatherLog{//父亲
    @include status(#718DE0);
  }
  .motherLog{//母亲
    @include status(#71E08A);
  }
  .grandpaLog{//爷爷
    @include status(#E071A7);
  }
  .grandmaLog{//奶奶
    @include status(#E0BF71);
  }
  .grannyLog{//外婆
    @include status(#8571E0);
  }
  .grandfatherLog{//外公
    @include status(#E09B71);
  }
  .nipotinoLog{//孙子
    @include status(#D67E6B);
  }
  .nipotinaLog{//孙女
    @include status(#9CD461);
  }
  .bhajraLog{//哥哥
    @include status(#71e0bb);
  }
  .sisterLog{//姐姐
    @include status(#e07188);
  }
  .brotherLog{//弟弟
    @include status(#e0b571);
  }
  .youngerSisterLog{//妹妹
    @include status(#d571e0);
  }
  .defaultLog{
    @include status(#fff);
  }
  .owner{//认证业主
    @include status(#F5A623);
    img{
      width:toRem(22);
      height:toRem(22);
      vertical-align: middle;
      margin-right: toRem(6);
    }
  }
  .nickName{
    float: left;
    display: block;
    font-size:toRem(24);
    height: toRem(34);
    line-height: toRem(34);
    color: #A8A8A8;
    margin-left: toRem(10);
  }
</style>
