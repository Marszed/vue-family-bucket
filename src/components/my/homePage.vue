<template>
  <div class="bgf8f8f8 home_box">
    <div class="my_header" v-on:click="toPersDetails">
      <div class="fl my_favicon">
        <i class="iconfont" v-if="!entifyMsg.iconUrl">&#xe65e;</i>
        <div class="headimg" v-if="entifyMsg.iconUrl">
          <div class="img-item-box" v-bind:style="{ backgroundImage: 'url('+entifyMsg.iconUrl+')' }"></div>
        </div>
        <span v-bind:class="{'lineheightSpan120':!entifyMsg.nickname,'lineheightSpan80':entifyMsg.nickname}">
          {{entifyMsg.phone}}
          <div class="realName" v-if="entifyMsg.nickname">{{entifyMsg.nickname}}</div>
        </span>
      </div>
      <div class="fr my_fasicInfo">
        <i class="iconfont">&#xe65a;</i>
      </div>
    </div>
    <div class="my_house my_list_box">
      <div class="my_list_title clearfix" v-on:click="toMyRedPacket">
        <div class="fl my_title_left">
          <i class="iconfont">&#xe66e;</i>
          我的红包
        </div>
        <div class="fr my_title_right" >
          <i class="iconfont">&#xe65a;</i>
        </div>
        <div class="my_list_line"></div>
      </div>
      <div class="my_list_title clearfix" v-on:click="toCityList">
        <div class="fl my_title_left">
          <i class="iconfont">&#xe65b;</i>
          我的房子
        </div>
        <div class="fr my_title_right" >
          {{attestation}}
          <i class="iconfont">&#xe65a;</i>
        </div>
      </div>
      <div @click="toFamilyHouseFn(item.isLandlord,item.houseId,item.occupantType,index)" class="my_list_content" v-for="(item, index) in house.items">
        <div class="my_list_content_child">
          <p class="clearfix">
            <i class="community-name">{{item.communityName}}</i>
            <span class="roomMsg">{{item.address}}</span>
            <span class="statusIcon sibings-child" v-if="item.isLandlord=='YES'" v-bind:class="{'owner':item.isLandlord=='YES'}">
              {{item.isLandlord,item.occupantType | isLand}}
            </span>
            <span class="statusIcon sibings-child" v-if="item.isLandlord=='NO'" v-bind:class="{'tenant':item.occupantType=='RENTER','visitor': item.occupantType=='VISITOR','owner':item.occupantType=='HOME'}">
              {{item.isLandlord,item.occupantType | isLand}}
            </span>
          </p>
          <p class="my_list_content_address"><i class="iconfont">&#xe656;</i>{{item.communityAddress}}</p>
          <h5 v-if="item.occupantType=='VISITOR'">访客截止时间:<i>{{item.visitEndTime | timeFormat}}</i></h5>
        </div>
      </div>
    </div>
    <div class="my_house my_list_box">
      <div class="my_list_title clearfix" v-on:click="toAbout()">
        <div class="fl my_title_left">
          <i class="iconfont">&#xe651;</i>
          关于
        </div>
        <div class="fr my_title_right">
          <i class="iconfont">&#xe65a;</i>
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
  import Filter from '../../lib/filter'
  import Config from '../../lib/config'

  export default {
    name: 'homePage',
    components: {
      Loading,
      Toast,
      Filter
    },
    data () {
      return {
        showLoading: true,
        textLoading: '加载中...',
        statusFlag:false,
        showToast: false,
        textToast: '异常',
        house:"",
        entifyMsg:this.$store.state.entifyMsg,
        config: {
          showUnauthorized: false
        },
        open: false,
        attestation:'去认证'
      }
    },
    methods: {
      toAbout:function(){//关于
        this.$router.push('/my/about');
      },
      toMyRedPacket: function(){
        if(this.$store.state.isRegister == "Y"){
          this.$router.push('/my/redPacket');
        }else{
          this.$store.commit('setUserTargetKey','my')
          this.$router.push('login');
        }
      },
      toCityList: function () {
        if(this.$store.state.isRegister == "Y"){
          this.$store.commit('setUserTargetKey','my')
          // 点击认证更多房子清除已选楼宇信息
          this.$store.commit('clearAuthLocationCommunity')
          this.$router.push('/authentication');
        }else{
          this.$store.commit('setUserTargetKey','my')
          this.$router.push('login');
        }
      },
      toPersDetails: function () {
        if(this.$store.state.isRegister == "Y"){
          this.$router.push('my/persDetails');
        }else{
          this.$store.commit('setUserTargetKey','my')
          this.$router.push('login');
        }
      },
      getFamilyHouse: function(){
        if(this.$store.state.isRegister == "Y"){
          this.$http.post(Config.host.map.apiWeChat+'/business/queryHouseList.do',{}).then((response) => {
            this.showLoading = false;
            if(response.body.items){
              if(response.body.items.length){
                this.attestation = "认证更多小区";
                this.house = response.body;
              }
            }else{
              Config.errorTips.call(this,response,'response');
            }
          }, (err) => {
            this.showLoading = false;
            Config.errorTips.call(this,err,'err','获取房屋信息失败')
          })
        }else{
          this.showLoading = false;
        }
      },
      toFamilyHouseFn:function(isLandlord,houseId,occupantType,index){
        if(isLandlord == 'YES'){
          this.$router.push('my/family');
          this.setHouseId(houseId);
          this.$store.commit('setHouseObjStore', this.house.items[index]);
        }else{
          if(occupantType == 'HOME'){
            this.$router.push('my/family');
            this.setHouseId(houseId);
            this.$store.commit('setHouseObjStore', this.house.items[index]);
          }
        }
      },
     setHouseId:function(houseId){
        this.$store.commit('setHouseIdStore', houseId);
     },
     getEntifyMsg:function(){
      if(this.$store.state.isRegister == "N"){
        this.entifyMsg = {phone:'去绑定'};
      }else{
          if(!this.$store.state.entifyMsg.userId){
           this.$http.post(Config.host.map.api+'/userIdentifyChange/getUserInfo.do',"").then((response) => {
            if(response.body.rspCd=='00000'){
              var obj = {
                 userId:response.body.userId,
                 phone:response.body.phone,
                 nickname:response.body.nickname,
                 iconUrl:response.body.iconUrl
              }
              this.entifyMsg = obj;
              this.$store.commit('setnEntifyMsg', obj)
            }else{
                Config.errorTips.call(this,response,'response');
            }
           }, (err) => {
              Config.errorTips.call(this,err,'err','获取个人信息失败')
           })
          }else{
            this.entifyMsg = this.$store.state.entifyMsg;
          }
        }
      }
    },
    filters:{
      isLand:function(text1,text2){
         if(text1 == 'YES'){
            return '业主';
         }else{
            if(text2 == 'HOME'){
              return '家人';
            } else if(text2 == 'VISITOR'){
              return '访客';
            }else if(text2 == 'RENTER'){
              return '租户';
            }
         }
      },
      timeFormat: function (value) {
        return Filter.timeFormat('YMDHI',value-0)
      }
    },
    created:function(){
      this.getFamilyHouse();
      this.getEntifyMsg();
    }
  }
</script>
<style lang="scss">
  @import "../../../static/scss/base/_toRem.scss";
  .home_box{
    padding-bottom: 1.2rem;
    box-sizing: border-box;
    overflow-y: scroll;
    -webkit-overflow-scrolling : touch;
  }
  .my_header{
    height:toRem(240);
    padding:0 toRem(30);
    background-image: linear-gradient(-195deg, #58BB58 0%, #389D38 88%);
    .my_favicon{
      margin-top: toRem(54);
      i{
        font-size: toRem(108);
        background-color: #afd8af;
        border-radius: 100%;
        color: #efe7ef;
        border:toRem(6) solid #d7ebd7;
      }
      .headimg{
        width:toRem(120);
        height:toRem(120);
        border:toRem(6) solid #d7ebd7;
        box-sizing: border-box;
        border-radius: 100%;
        display: inline-block;
      }
      span{
        white-space:nowrap;
        display: inline-block;
        height:toRem(120);
        margin-left: toRem(20);
        color: #fff;
        font-size: toRem(36);
        vertical-align: top;
        white-space:nowrap;
      }
      .lineheightSpan120{
        line-height: toRem(120);
      }
      .lineheightSpan80{
        line-height: toRem(80);
      }
      .realName{
        font-size:toRem(28);
        line-height:toRem(20);
      }
    }
    .my_fasicInfo{
      margin-top: toRem(100);
      i{
        font-size:toRem(40);
        color: #8acf8a;
      }
    }
  }
  .my_list_title{
    height:toRem(88);
    padding:0 toRem(30);
    position: relative;
    .my_title_left{
      font-size: toRem(32);
      color: #3C3C3C;
      line-height: toRem(88);
      i{
        font-size:toRem(50);
        color: #a8a8a8;
        vertical-align: sub;
        line-height: 1;
      }
    }
    .my_title_right{
      font-size: toRem(24);
      color: #A8A8A8;
      line-height: toRem(88);
      i{
        font-size: toRem(26);
      }
    }
  }
  .my_list_line{
    content: ' ';
    display: block;
    position: absolute;
    bottom: 0;
    left: toRem(30);
    right: 0;
    z-index: 2;
    height: 1px;
    background-color: #dcdbe4;
  }
  .my_list_box{
    background: #FFFFFF;
    border-top: 1px solid #DCDAE3;
    border-bottom: 1px solid #DCDAE3;
    margin-top: toRem(20);
    i{
      font-style: normal;
    }
    .my_list_content{
      padding-left: toRem(100);
    }
    .my_list_content_child{
      background: #FFFFFF;
      border-top: 1px solid #DCDBE4;
      padding:toRem(36) 0;
      h5{
        font-size: toRem(20);
        color: #76B600;
        margin-top: toRem(10);
        line-height: toRem(28);
        height: toRem(28);
        i{
          margin-left: toRem(10);
          vertical-align: toRem(-2);
        }
      }
      .my_list_content_address{
        font-size: toRem(24);
        line-height: toRem(33);
        color: #A8A8A8;
        margin-top: toRem(10);
        i{
          font-size: toRem(24);
          margin-right: toRem(4);
        }
      }
      p{
        .community-name{
          display: block;
          float: left;
          line-height: toRem(44);
          height: toRem(44);
          font-size: toRem(32);
          color: #3C3C3C;
          margin-right: toRem(20);
        }
        .roomMsg{
          display: block;
          float: left;
          line-height: toRem(44);
          height: toRem(44);
          font-size: toRem(28);
          color: #3C3C3C;
        }
        .statusIcon{
          display: block;
          float: left;
          line-height: toRem(32);
          height: toRem(32);
          border-radius:toRem(100);
          font-size: toRem(20);
          color: #FFFFFF;
          padding:0 toRem(14);
        }
        .owner{
          @extend .statusIcon;
          background: #FFAA00;
        }
        .tenant{
          @extend .statusIcon;
          background: #40abcf;
        }
        .visitor{
          @extend .statusIcon;
          background: #76B600;
        }
        .sibings-child{
          margin-top: toRem(4);
          display: block;
          font-size: toRem(24);
          color: #fff;
          line-height: toRem(32);
          height: toRem(32);
          margin-left: toRem(10);
          i{
            font-size: toRem(24);
            margin-right:toRem(4);
          }
        }
      }
    }
  }
  .img-item-box{
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    border-radius: 100%;
    background-repeat: no-repeat;
    -webkit-background-size: cover;
    background-size: cover;
    -webkit-background-origin: padding-box;
    background-origin: padding-box;
  }
</style>
