<template>
  <div :id="eleId" class="pull-container">
    <div class="scroller">
      <div class="pulldown"
      :class="[pulldownChangeStyle,{'hide':!displaypullDownDiv}]">
      <div class="pulldown-icon"></div>
      <div class="pulldown-label">{{pullDownTip}}</div>
    </div>
    <slot></slot>
    <div class="pullup"
    :class="[pullupChangeStyle,{'hide':!displaypullUpDiv}]">
    <div class="pullup-icon"></div>
    <div class="pullup-label">{{pullUpTip}}</div>
  </div>
</div>
</div>
</template>

<script>

  import Scroll from './myScroll'

  const PULL_DOWN_NORMAL='下拉刷新'
  const PULL_DOWN_RELEASE='释放加载'
  const PULL_DOWN_LOADING='加载中，请稍后'

  const PULL_UP_NORMAL='上拉刷新'
  const PULL_UP_RELEASE='释放加载'
  const PULL_UP_LOADING='加载中，请稍后'

// 加载状态-1默认，0显示提示下拉信息，1显示释放刷新信息，2执行加载数据，只有当为-1时才能再次加载
const STATE_DEFAULT=-1
const STATE_PULL_NORMAL=0
const STATE_PULL_RELEASE=1
const STATE_PULL_LOADING=2

const STYLE_RELEASE='release'
const STYLE_REFRESH='refresh'

//不写到vue data中，优化内存
var timeoutHandler = 0,
  timeout = 8000,// 如果没有手动更新,8s之后更新状态
  pullDownHeight = 50,//pull down element height
  pullUpHeight = 50;

export default {
  props: {
    disablePulldown: {
      type: Boolean,
      default: false,
    },
    disablePullup: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      displaypullDownDiv: false,
      displaypullUpDiv: false,
      pullUpTip: PULL_UP_NORMAL,
      pullDownTip: PULL_DOWN_NORMAL,
      refreshStep:STATE_DEFAULT,
      eleId:'bajianscroll',
      pulldownChangeStyle:'',
      pullupChangeStyle:''
    }
  },
  mounted(){
    this.$nextTick(function () {
      this.eleId='bajian'+Math.round(Math.random()*1000)
      setTimeout(()=>{
        this.registerDrag()
      },50)

    })
  }
  ,
  methods: {
    registerDrag(){
      this.myscroll=new Scroll('#'+this.eleId)
      this.myscroll.on('scroll', this._onTouchMove);
      this.myscroll.on('scrollEnd', this._onTouchEnd);
    },

    _onTouchMove () {
      if(this.refreshStep==STATE_PULL_LOADING)
        return;

      if(!this.disablePulldown && this.myscroll.y > 5 && this.myscroll.y < pullDownHeight/2){
        this.displaypullDownDiv=true
        this.displaypullUpDiv=false
        this.pulldownChangeStyle='';
        this.pullDownTip = PULL_DOWN_NORMAL
        this.refreshStep = STATE_PULL_NORMAL
      }else if(!this.disablePulldown && this.myscroll.y >= pullDownHeight){
        this.pulldownChangeStyle=STYLE_RELEASE
        this.pullDownTip=PULL_DOWN_RELEASE
        this.refreshStep = STATE_PULL_RELEASE
      }else if(!this.disablePullup && this.myscroll.y < -5 && -this.myscroll.y >= pullUpHeight-this.myscroll.maxScrollY){
        this.pullupChangeStyle=STYLE_RELEASE
        this.pullUpTip=PULL_UP_RELEASE
        this.refreshStep = STATE_PULL_RELEASE
      }else if(!this.disablePullup && this.myscroll.y < -5 && this.myscroll.y<this.myscroll.maxScrollY && this.myscroll.y > -pullUpHeight/2+this.myscroll.maxScrollY){
        this.displaypullUpDiv=true
        this.displaypullDownDiv=false
        this.pullupChangeStyle='';
        this.pullUpTip=PULL_UP_NORMAL
        this.refreshStep = STATE_PULL_NORMAL
      }
    },
    reset(){
      if(this.refreshStep!=STATE_DEFAULT){
        this.refreshStep=STATE_DEFAULT
        if(!this.disablePulldown){
          this.displaypullDownDiv=false
          this.pulldownChangeStyle=''
        }
        if(!this.disablePullup){
          this.displaypullUpDiv=false
          this.pullupChangeStyle=''
        }
        setTimeout(()=>{
          this.myscroll.refresh();
        },0)
        clearTimeout(timeoutHandler)
      }
    },

    _onTouchEnd () {
      if(this.refreshStep == STATE_PULL_RELEASE){
        if (!this.disablePullup && this.pullupChangeStyle==STYLE_RELEASE) {
          this.myscroll.maxScrollY<-10 &&this.myscroll.scrollTo(0,this.myscroll.maxScrollY-pullUpHeight)
          this.pullupChangeStyle=STYLE_REFRESH
          this.pullUpTip=PULL_UP_LOADING
          this.refreshStep = STATE_PULL_LOADING;
          this.$emit('on-pullup',this.reset);
        }else if(!this.disablePulldown && this.pulldownChangeStyle==STYLE_RELEASE){
          this.pulldownChangeStyle=STYLE_REFRESH
          this.pullDownTip=PULL_DOWN_LOADING
          this.refreshStep = STATE_PULL_LOADING;
          this.$emit('on-pulldown',this.reset);
        }

        timeoutHandler=window.setTimeout(()=>{
          if(this.refreshStep==STATE_PULL_LOADING)
            this.reset();
        },timeout);
      }else if(this.refreshStep!=STATE_PULL_LOADING){
        this.reset();
      }

    }
  }
}
</script>

<style lang="scss">
  @import "../../../../static/scss/base/_toRem.scss";
  /*通用转动动画*/
  @-webkit-keyframes spinner {
    0% { -webkit-transform: rotate(0deg); }
    50% { -webkit-transform: rotate(180deg); }
    100% { -webkit-transform: rotate(360deg); }
  }
  @keyframes spinner {
    0% { -webkit-transform: rotate(0deg); }
    50% { -webkit-transform: rotate(180deg); }
    100% { -webkit-transform: rotate(360deg); }
  }

  .scroller{
    min-height: 101%;/*修正内容高度不够无法scroll*/
    -webkit-tap-highlight-color:rgba(0,0,0,0);
  }
  .pulldown,.pullup{
    transition: all 0.2s linear;
  }
  .hide{
    display: none;
  }
  .pull-container {
    overflow: hidden;
    transform: translateZ(0);
    user-select: none;
    text-size-adjust: none;
  }

  /*refresh start*/
  .pulldown,.pullup {
    height: toRem(50*2);
    line-height: toRem(50*2);
    padding: toRem(5*2) toRem(15*2);
    font-weight: bold;
    font-size: 0;
    color: #888;
    text-align: center;
  }

  .pulldown .pulldown-icon,.pullup .pullup-icon {
    display: inline-block;
    vertical-align: toRem(-12);
    width: toRem(40);
    height: toRem(40);
    background: url(./pull-icon@2x.png) 0 0 no-repeat;
    background-size: toRem(40) toRem(80);
    -webkit-transition-property: -webkit-transform;
    -webkit-transition-duration: 250ms;
    margin-right: toRem(2);
  }

  .pulldown .pulldown-label, .pullup .pullup-label{
    display: inline-block;
    font-size: toRem(14*2);
  }
  .pulldown .pulldown-icon {
    -webkit-transform: rotate(0deg) translateZ(0);
  }
  .pullup .pullup-icon {
    -webkit-transform: rotate(-180deg) translateZ(0);
  }

  .pulldown.release .pulldown-icon {
    -webkit-transform: rotate(-180deg) translateZ(0);
  }

  .pullup.release .pullup-icon {
    -webkit-transform: rotate(0deg) translateZ(0);
  }

  .pulldown.refresh .pulldown-icon,.pullup.refresh .pullup-icon {
    background-position: 0 100%;
    -webkit-transition-duration: 0ms;
    -webkit-animation: spinner 3s infinite linear;
    animation: spinner 3s infinite linear;
  }
  /*refresh end*/

</style>
