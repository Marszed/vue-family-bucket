<template>
  <div class="pb-50">
    <div class="list-city-items" v-for="(item, index) in items">
      <p class="list-title">{{ item.regionInfoItem.name }}</p>
      <div class="list-nearby" v-on:click="chooseCommunity(item.communityId,item.name,$event)" v-for="(item, index) in item.communityItemList">
        <h5>{{item.name}}</h5>
        <p>{{item.position}}</p>
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
    name: 'CommunityBind',
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
        items: ''
      }
    },
    methods: {
      chooseCommunity: function (id, name, event) {
        if (event) event.preventDefault()

        //更新store切换小区信息

        this.$store.commit('setSwitchLocationCityOld', {
          communityId: id,
          communityName: name
        })

/*        // 更新认证store
        this.$store.commit('setAuthLocationCommunity', {
          id: id,
          name: name
        })

        // 缓存community storage
        this.$store.commit('setCityCommunityStorage',{
          communityId: id,
          communityName: name
        })

        this.$store.commit('clearAuthLocationCommunity')*/

        // 通知服务端更新用户切换的小区
        if(Config.detail.isRegister == 'Y'){
          this.$http.post(Config.host.map.apiWeChat+'/business/changeCommunity.do', {
            communityId: this.$store.state.switchLocationOld.communityId,
            wxOpenId: Config.detail.openId
          }).then((response) => {
            Config.errorTips.call(this,response,'response')
        }, (err) => {
            Config.errorTips.call(this,err,'err','更新切换小区失败') // todo 更新小区错误日志不抛出
          })
        }

        location.hash = '#/community'
      },
      updateItems: function(){
        if(!this.$store.state.switchLocationOld.cityId && !this.$store.state.location.cityId){
          this.showLoading = false
          location.hash = '#/community'
          return false
        }
        this.$http.get(Config.host.map.mobileAPI+'/community/region/city/'+(this.$store.state.switchLocationOld.cityId || this.$store.state.location.cityId)).then((response) => {
          Config.errorTips.call(this,response,'response')
          this.showLoading = false
          this.items = response.data.data
        }, (err) => {
          Config.errorTips.call(this,err,'err','小区列表获取失败')
        })
      }
    },
    created: function(){
      this.updateItems()
    }
  }
</script>


