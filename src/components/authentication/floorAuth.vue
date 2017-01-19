<template>
  <div class="pb-50">
    <div class="list-city-items" v-for="(item, index) in items">
      <p class="list-title">{{ item.areaName }}</p>
      <div class="list-city-item" v-for="(temp, index) in item.floorInfoList" v-on:click="chooseFloor(temp.id,temp.floorNo,item.areaId,item.areaName,$event)">
        <p>{{temp.floorNo}}栋</p>
      </div>
    </div>
    <err :config="config"></err>
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
  import Filter from '../../lib/filter'
  import Err from '../common/err'

  export default {
    name: 'floorAuth',
    components: {
      Loading,
      Toast,
      Err
    },
    data () {
      return {
        showLoading: true,
        textLoading: '加载中...',
        showToast: false,
        textToast: '异常',
        items: '',
        config: {
          errTip: false,
          src: 'data:image/png;base64,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',
          tip: '小区下面未配置管理区域'
        }
      }
    },
    methods: {
      chooseFloor: function (id, name, areaId, areaName, event) {
        if (event) event.preventDefault()
        this.$store.commit('setAuthLocationFloor', {
          id: id,
          name: name,
          areaId: areaId,
          areaName: areaName
        })
        this.$store.commit('clearAuthLocationFloor')
        location.hash = '#/authentication/floor-auth/house-auth'
      },
      updateItems: function(){
        if(!this.$store.state.authLocation.communityId){
          location.hash = '#/authentication'
          return false
        }
        this.$http.get(Config.host.map.mobileAPI+'/property/floor/community/' + this.$store.state.authLocation.communityId).then((response) => {
          Config.errorTips.call(this,response,'response')
          this.showLoading = false
          if(response.data.data && response.data.data.length){
            this.items = response.data.data
          } else{
            this.config.errTip = true
            Config.errorTips.call(this,{},'err','小区下面未配置管理区域')
          }
        }, (err) => {
          this.config.errTip = true
          this.showLoading = false
          // Config.errorTips.call(this,{},'err','小区下面未配置管理区域')
        })
      }
    },
    created: function(){
      this.updateItems()
    }
  }
</script>


