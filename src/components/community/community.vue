<template>
  <div>
    <p class="list-title">选择自己所在的小区</p>
    <ul class="list-split">
      <li @click="toCityBind">
        <label class="list-split-tip">城市</label>
        <p class="list-split-value" v-if="locationCityName">{{locationCityName}}</p>
        <p class="list-split-help" v-if="locationTip">当前定位</p>
      </li>
      <li @click="toCommunityBind">
        <label class="list-split-tip">小区</label>
        <p class="list-split-value" v-if="locationCommunityName">{{locationCommunityName}}</p>
        <p class="list-split-placeholder" v-if="!locationCommunityName">请选择小区</p>
      </li>
    </ul>
    <a type="button" class="bg-btn mt-10" href="javascript:;" v-bind:class="{'bg-btn-default': btnDefault}" @click="toNext">下一步</a>
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
    name: 'CommunityChoose',
    components: {
      Loading,
      Toast
    },
    data () {
      return {
        showLoading: false,
        textLoading: '加载中...',
        showToast: false,
        textToast: '异常'
      }
    },
    computed: {
      btnDefault: function(){
        if(this.$store.state.switchLocationOld.communityName && (this.$store.state.switchLocationOld.cityId || this.$store.state.location.cityId)){
          return false
        } else {
          return true
        }
      },
      locationCityName: function () {
        return this.$store.state.switchLocationOld.cityName || this.$store.state.location.cityName
      },
      locationCommunityName: function () {
        return this.$store.state.switchLocationOld.communityName
      }
    },
    methods: {
      toCommunityBind: function(){
        if(this.$store.state.switchLocationOld.cityId || this.$store.state.switchLocation.cityId || this.$store.state.location.cityId){
           this.$router.push('community/community-bind?SQBJPath=cityCommunity')
        }
      },
      toCityBind: function (){
         this.$router.push('community/city-bind?SQBJPath=cityCommunity')
      },
      locationTip: function(){
        if(this.$store.state.location.cityName){
          return true
        } else {
          return false
        }
      },
      toNext: function(){
        if(this.btnDefault){
          return false
        }

         // 更新store
         this.$store.commit('setSwitchLocationCity', {
           cityId: this.$store.state.switchLocationOld.cityId ,
           cityName: this.$store.state.switchLocationOld.cityName,
           communityId: this.$store.state.switchLocationOld.communityId,
           communityName: this.$store.state.switchLocationOld.communityName
         })


        // 更新城市本地store缓存,防止未绑定用户使用其它功能时仍然需要选择城市小区的bug
        this.$store.commit('setLocalSwitchLocationCity',{
          cityId: this.$store.state.switchLocationOld.cityId ,
          cityName: this.$store.state.switchLocationOld.cityName
        })

        // 缓存city storage
        this.$store.commit('setCityCommunityStorage',{
          cityId: this.$store.state.switchLocationOld.cityId ,
          cityName: this.$store.state.switchLocationOld.cityName
        })

        // 缓存community storage
        this.$store.commit('setCityCommunityStorage',{
          communityId: this.$store.state.switchLocationOld.communityId,
          communityName: this.$store.state.switchLocationOld.communityName
        })

        if(this.$store.state.isRegister === 'N' && this.$route.meta.requiresAuth == true){
          this.$router.replace('login')
        }else{
          this.$router.replace(this.$store.state.userTargetKey)
        }
      }
    }
  }
</script>

