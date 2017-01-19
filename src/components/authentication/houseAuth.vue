<template>
  <div class="pb-50">
    <div class="list-city-items" v-for="(item, index) in items">
      <p class="list-title">{{ item.unitNo }}单元</p>
      <div class="list-city-item" v-for="(temp, index) in item.houseList" v-on:click="chooseHouse(temp.houseId,temp.roomId,item.unitNo,item.id,$event)">
        <p>{{temp.roomId}}室</p>
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
    name: 'HouseAuth',
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
      chooseHouse: function (id, name, unitNo, unitId, event) {
        if (event) event.preventDefault()
        this.$store.commit('setAuthLocationHouse', {
          id: id,
          name: name,
          unitNo: unitNo,
          unitId: unitId
        })
        location.hash = '#/authentication'
      },
      updateItems: function(){
        if(!this.$store.state.authLocation.floorId){
          location.hash = '#/authentication'
          return false
        }
        this.$http.get(Config.host.map.mobileAPI+'/property/house/floor/'+this.$store.state.authLocation.floorId).then((response) => {
          Config.errorTips.call(this,response,'response')
          this.showLoading = false
          this.items = response.data.data
          }, (err) => {
            Config.errorTips.call(this,err,'err','房间列表获取失败')
        })
      }
    },
    created: function(){
      this.updateItems()
    }
  }
</script>


