<template>
  <div class="full-page">
    <div class="bg bg-blur"></div>
    <div class="bg-box">
      <p class="list-title">选择房屋信息</p>
      <ul class="list-split">
        <li @click="toCityAuth">
          <label class="list-split-tip">城市</label>
          <p class="list-split-value" v-if="locationCityName">{{locationCityName}}</p>
          <p class="list-split-help" v-if="locationTip">当前定位</p>
        </li>
        <li @click="toCommunityAuth">
          <label class="list-split-tip">小区</label>
          <p class="list-split-value" v-if="locationCommunityName">{{locationCommunityName}}</p>
          <p class="list-split-placeholder" v-if="!locationCommunityName">请选择小区</p>
        </li>
        <li @click="toFloorAuth">
          <label class="list-split-tip">房号</label>
          <p class="list-split-value" v-if="locationFloorName">{{locationFloorName}}</p>
          <p class="list-split-placeholder" v-if="!locationFloorName">请选择认证房号</p>
        </li>
      </ul>
      <a type="button" class="bg-btn mt-10" href="javascript:;" v-bind:class="{'bg-btn-default': btnDefault}" @click="authMobile">下一步</a>
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
    name: 'Authentication',
    data()  {
      return{
        showLoading: false,
        textLoading: '加载中...',
        showToast: false,
        textToast: '异常',
        btnDefault: true
      }
    },
    components: {
      Loading,
      Toast
    },
    computed: {
      btnDefault: function(){
        if((this.$store.state.authLocation.cityId || this.$store.state.location.cityId) && this.$store.state.authLocation.communityName && this.$store.state.authLocation.areaId && this.$store.state.authLocation.floorId && this.$store.state.authLocation.houseId){
          return false
        }else{
          return true
        }
      },
      locationCityName: function () {
        return this.$store.state.authLocation.cityName || this.$store.state.location.cityName
      },
      locationTip: function(){
        if(this.$store.state.location.cityName){
          return true
        } else {
          return false
        }
      },
      locationCommunityName: function () {
        return this.$store.state.authLocation.communityName
      },
      locationFloorName: function () {
        return this.$store.state.authLocation.areaName + (this.$store.state.authLocation.floorName ? '-'+ this.$store.state.authLocation.floorName+'栋' : '') + (this.$store.state.authLocation.unitNo ? this.$store.state.authLocation.unitNo+'单元' : '') + (this.$store.state.authLocation.houseName ? this.$store.state.authLocation.houseName+'室' : '')
      }
    },
    methods: {
      toCityAuth: function () {
        location.hash = '#/authentication/city-auth'
      },
      toCommunityAuth: function(){
        if(this.$store.state.authLocation.cityName || this.$store.state.location.cityName){
          location.hash = '#/authentication/community-auth'
        }else{
          this.showToast = true
          this.textToast = '请选择城市'
        }
      },
      toFloorAuth: function(){
        if(this.$store.state.authLocation.communityName){
          location.hash = '#/authentication/floor-auth'
        }else{
          this.showToast = true
          this.textToast = '请选择小区'
        }
      },
      authMobile: function(){
        if(!this.btnDefault){
          this.showLoading = true
          //认证信息查询
          this.$http.post(
            Config.host.map.api+'/userIdentifyChange/queryUserIdentifyChangeInfo.do',
            {
              houseId: this.$store.state.authLocation.houseId,
              communityId: this.$store.state.authLocation.communityId
            }).then((response) => {
              this.showLoading = false
              var code = response.body.rspCd
              if(code == 'LU1309'){ // 物管系统查询业主预留信息失败
                location.hash = '#/authentication/result/5'
              } else if(code == 'LU1310'){ // 业主未预留正确的手机号,无法认证
                location.hash = '#/authentication/result/1'
              } else if (code == 'LU1321'){
                location.hash = '#/authentication/result/4'
              } else if(code == '00000'){
                this.showLoading = true

                //查询当前用户手机号在物管系统中记录的房产列表 看是否是业主认证
                this.$http.get(Config.host.map.mobileAPI+'/property/user/house/listHousesInProperty', {
                    houseId: this.$store.state.authLocation.houseId,
                    communityId: this.$store.state.authLocation.communityId
                  }).then((response) => {
                    Config.errorTips(this, response,'response')
                    this.showLoading  = false
                    if(response.body.data || response.body.data.length){
                      var listHousesInProperty = response.body.data
                      var flag = false
                      for(var i = 0, len = listHousesInProperty.length; i < len; i++){
                        if(listHousesInProperty[i].houseId == this.$store.state.authLocation.houseId){
                          index = i
                          flag = true
                          break
                        }
                      }
                      if(!flag){
                        this.$store.commit('setAuthLocationRole','tenant')
                        location.hash = '#/authentication/mobile'
                      }else{
                        this.$store.commit('setAuthLocationRole','owner')
                        location.hash = '#/authentication/mobile/msg'
                      }
                  }
                }, (err) => {
                  this.showLoading = false
                  Config.errorTips.call(this,err,'err','房产列表获取失败')
                })

              }else{
                Config.errorTips.call(this,response,'response')
              }
            }, (err) => {
                this.showLoading = false
                Config.errorTips.call(this,err,'err','认证信息获取失败')
            })
        }
      }
    }
  }
</script>

