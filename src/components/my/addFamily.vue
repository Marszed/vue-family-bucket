<template>
  <div class="bgf8f8f8 my_box">
    <div class="my_add_input">
      <div class="my_add_mob clearfix">
        <span class="fl">手机号</span>
        <input class="fl" v-model="memberMobile"  placeholder="请填写家人手机号" type="tel" maxlength="11">
      </div>
      <div class="my_add_desc clearfix">
        <span class="fl">姓名 </span>
        <input class="fl" v-model="familyMemberName" placeholder="必填">
      </div>
    </div>
    <span class="my_addBtn" v-bind:class="{my_disabled:isDisabled}" @click="addFamilyFn">邀请并添加</span>
    <div class="my_point">
      <span>温馨提示：</span>
      <p>
        邀请家人后，该用户将成为您此房屋下的家人，并与其它家人可见、使用物业服务（含报事、报修、蓝牙门禁等），请谨慎添加，如误操作可将该用户移出家人圈并在住户列表中禁用该用户权限。
      </p>
    </div>
    <div>
      <layerModel :config="config"></layerModel>
    </div>
  </div>

</template>
<script>
  import LayerModel from '../common/layerModel'
  import Config from '../../lib/config'

  export default {
    name: 'addFamily',
    components: {
      LayerModel
    },
    data () {
      return {
        config: {
          showLayerModel:false,
          imgUrlClass:"img_success",
          contentText:"邀请并添加家人成功",
          toUrl:"/my/family",
          animate: false
        },
        open: false,
        memberMobile:"",
        familyMemberName:"",
        isDisabled:true
      }
    },
    methods: {
      addFamilyFn:function(){
        if(!this.isDisabled){
          var addFamilyData = {
            "houseId":this.$store.state.houseId,
            "memberMobile":this.memberMobile,
            "familyMemberName":this.familyMemberName
          };

          this.$http.put(Config.host.map.mobileAPI+'/family/member/add',addFamilyData).then((response) => {
            if(response.body.userHouseId){
              this.config.showLayerModel = true;
            }else{
                Config.errorTips.call(this,response,'response');
            }
          }, (err) => {
              Config.errorTips.call(this,err,'err','添加家庭成员失败')
          })
        }
      }
    },
    watch: {
      memberMobile: function(val,oldVal){
        if(/^\d{11,11}$/.test(val) && val.substr(0,1) == 1 && this.familyMemberName){
          this.isDisabled = false;
        }else{
          this.isDisabled = true;
        }
      },
      familyMemberName: function(name,valnamew){
        if(/^\d{11,11}$/.test(this.memberMobile) && this.memberMobile.substr(0,1) == 1 && name){
          this.isDisabled = false;
        }else{
          this.isDisabled = true;
        }
      }
    }
  }
</script>
<style lang="scss">
  @import "../../../static/scss/base/_toRem.scss";
  .my_box{
    padding-top: toRem(50);
    box-sizing: border-box;
  }
  .my_add_input{
    background-color:#fff ;
    border-bottom: 1px solid #DCDAE3;
    border-top: 1px solid #DCDAE3;
    padding-left:toRem(30);
    div{
      background: #FFFFFF;
      padding:toRem(22) toRem(30) toRem(22) 0;
      span{
        font-size: toRem(32);
        color: #3C3C3C;
        display: inline-block;
        height:toRem(45);
        line-height: toRem(45);
      }
    }
  }
  .my_add_desc{
    border-top: 1px solid #DCDAE3;
    input{
      width:toRem(750-176-20);
      font-size: toRem(32);
      color: #3C3C3C;
      border:none;
      margin-left:toRem(20);
    }
  }
  .my_add_mob{
    input{
      width:toRem(750-176-20);
      font-size: toRem(32);
      color: #3C3C3C;
      border:none;
      margin-left:toRem(20);
    }
  }
  .my_addressBook{
    i{
      vertical-align: middle;
      font-size: toRem(30);
    }
    border-left:1px solid #DCDBE4;
    background: #FFFFFF;
    width:toRem(142);
    height: toRem(45);
    line-height: toRem(45);
    padding-left: toRem(22);
    box-sizing: border-box;
    font-size: toRem(24);
    color: #A8A8A8;
  }
  .my_addBtn{
    background: #389D38;
    border-radius: toRem(6);
    margin:toRem(50) toRem(30) 0 toRem(30);
    line-height: toRem(48);
    padding:toRem(16) 0;
    text-align: center;
    display: block;
    font-size: toRem(34);
    color: #fff;
  }
  .my_disabled{
    background: #DCDCE0 !important;
    color: #c1c1c4 !important;
    font-size: toRem(34) !important;
  }
  .my_point{
    margin-top: toRem(50);
    padding:0 toRem(30);
    span{
      font-size:toRem(28);
      color: #A8A8A8;
    }
    p{
      margin-top: toRem(10);
      font-size:toRem(24);
      color: #A8A8A8;
      line-height:toRem(32);
    }
  }

</style>
