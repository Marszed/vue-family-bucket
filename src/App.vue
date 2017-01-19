<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
    <footer class="menu-footer" v-if="showMenu">
      <ul class="menu-footer-list">
        <li>
          <router-link to="/open-door" replace>
            <p class="iconfont iconfont-1">&#xe663;</p>
            <p class="iconfont iconfont-2">&#xe65c;</p>
            <span>开门</span>
          </router-link>
        </li>
        <li>
          <router-link to="/services" replace>
            <p class="iconfont iconfont-1">&#xe662;</p>
            <p class="iconfont iconfont-2">&#xe665;</p>
            <span>物业服务</span>
          </router-link>
        </li>
        <li>
          <router-link to="/my" replace>
            <p class="iconfont iconfont-1">&#xe660;</p>
            <p class="iconfont iconfont-2">&#xe65f;</p>
            <span>我的</span>
          </router-link>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script>
  export default{
    name: 'box',
/*    data () {
      return {
        transitionName: 'slide-left'
      }
    },*/
    computed: {
      showMenu: function () {
        return this.$store.state.showMenu // 从『唯一数据源(SSOT)』store中获取状态
      }/*,
      toPath: function () {
        return this.$router.to.path // 从『唯一数据源(SSOT)』store中获取状态
      }*/
    }/*,
    // dynamically set transition based on route change 搞个全局路由过渡效果
    watch: {
      '$route' (to, from) {
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        console.log(to.path)
        this.transitionName = toDepth < fromDepth ? 'slide-left' : 'slide-right'
      }
    }*/
  }
</script>

<style>

</style>
