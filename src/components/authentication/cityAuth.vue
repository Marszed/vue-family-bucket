<template>
  <div class="pb-50">
    <div class="search" v-if="none">
      <p><i class="iconfont">&#xe659;</i>搜索城市，支持按首字母搜索</p>
    </div>
    <p class="list-title" v-if="locationCityName">当前定位</p>
    <p class="list-city-item" v-if="locationCityName" @click="chooseCity(locationCityId,locationCityName)">{{locationCityName}}</p>
    <div class="list-city-items" v-for="(item, index) in items">
      <p class="list-title">{{ item.groupKey }}</p>
      <p class="list-city-item" v-for="(item, index) in item.regionInfoItemList" @click="chooseCity(item.regionId,item.name)">{{item.name}}</p>
    </div>
    <div class="list-city-arrows"
         v-bind:style="{ height: (items.length*50/100)+'rem', marginTop: -(items.length*50/100/2)+'rem', display: 'block' }">
      <a class="list-city-arrow"
         v-for="(item, index) in items"
         @click="tap(item)">{{ item.groupKey }}</a>
    </div>
    <div class="letter" v-show="letter">{{letter}}</div>
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

  var fontSize = window.document.getElementById('SQBJBOX').style.fontSize
  fontSize = fontSize.substr(0,fontSize.length-2)
  export default {
    name: 'CityAuth',
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
        items: '',
        letter: ''
      }
    },
    computed: {
      locationCityName: function () {
        return this.$store.state.location.cityName
      },
      locationCityId: function () {
        return this.$store.state.location.cityId
      }
    },
    methods: {
      scrollDistance: function (letter) { // 0.6rem 0.88rem
        var distance = 0, len = this.items.length

        if(len){
          for(var i = 0; i < len; i++){
            if(letter == this.items[i].groupKey){
              break
            } else {
              distance += (this.items[i].regionInfoItemList.length*0.88 + 0.6)*fontSize
            }
          }
          window.scrollTo(0,distance)
          setTimeout(() => {
            this.letter = ''
          },1000)
        }
      },
      tap: function(item){
        this.letter = item.groupKey
        this.scrollDistance(this.letter)
      },
      pan: function(e) {
        this.letter = e.target.innerHTML
        this.scrollDistance(e.target.innerHTML)
        e.preventDefault()
      },
      chooseCity: function (id, name) {
        this.$store.commit('setAuthLocationCity', {
          id: id,
          name: name
        })

        // 选择不同的小区时才进行清空操作
        if(id != this.locationCityId){
          this.$store.commit('clearAuthLocationCity')
        }

        location.hash = '#/authentication'
      },
      updateItems: function(){
        this.$http.get(Config.host.map.mobileAPI+'/region/city/served').then((response) => {
          this.showLoading = false
          this.items = response.data.data
        }, (err) => {
          Config.errorTips.call(this,err,'err','城市列表获取失败')
        })
      }
    },
    created: function(){
      this.updateItems()
    }
  }
</script>


