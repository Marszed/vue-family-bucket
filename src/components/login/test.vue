<template>
  <div id="app">
    <pull-to-refresh
      @on-pullup='onPullup'
      :disable-pullup="false"
      @on-pulldown='onPulldown'
      class="scroll-page">
      <ul @click="testClick($event)">
        <li :key="index" v-for="(item, index) in items">
          # item {{ index }}
        </li>
      </ul>
    </pull-to-refresh>

    <!--   <b>examples for disable on-pullup && pulldown:</b>
      <pull-to-refresh
        :disable-pullup="true"
        :disable-pulldown="true">
        <ul>
          <li :key="index" v-for="(item, index) in items">
            # item {{ index }}
          </li>
        </ul>
      </pull-to-refresh> -->
  </div>
</template>

<script>
  import PullToRefresh from '../common/scroll/pull-to-refresh.vue'

  export default {
    components: { PullToRefresh },

    data () {
      return {
        items: [2,3,4,5,1,2,3,4,5,2,3,4,5,1,2,3,4,5,2,3,4,5,2,3,4,5]
      }
    },

    methods: {
      onPullup(finshCallback) {
        console.log('onPullup');
        setTimeout(()=>{
          console.log('finshCallback');
          this.items=this.items.concat([6,6,6,6,6,6,6,6,6,6,6])
          finshCallback();//finish refreshing state
        },1000);
      },
      onPulldown(finshCallback) {
        console.log('onPulldown');
        setTimeout(()=>{
          console.log('finshCallback');
          this.items=[9,9,9,9,9,9,9,9,9,9,9,9,9,9]
          finshCallback();//finish refreshing state
        },1000);
      }
    }
  }
</script>

<style lang="scss">
  @import "../../../static/scss/base/_toRem.scss";
  .scroll-page{
    height: toRem(866); /*1334-88-40-240-100 1206*/
    position: relative;
    /* Prevent native touch events on Windows */
    -ms-touch-action: none;
    /* Prevent the callout on tap-hold and text selection */
    -webkit-touch-callout: none;
    user-select: none;
    text-size-adjust: none;
  }

  /*scrollbar start*/
  .iScrollVerticalScrollbar {
    position: absolute;
    z-index: 9999;
    width: toRem(2);
    bottom: toRem(2);
    top: toRem(2);
    right: toRem(2);
    overflow: hidden;
  }

  .iScrollVerticalScrollbar.iScrollBothScrollbars {
    bottom: toRem(18);
  }

  .iScrollIndicator {
    position: absolute;
    background: #999;
    border-radius: toRem(6);
    opacity: .8;
  }

  .iScrollVerticalScrollbar .iScrollIndicator {
    width: 100%;
    background: #999;
  }
  /*scrollbar end*/
</style>
