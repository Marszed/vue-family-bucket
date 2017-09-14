# vue-family-bucket (vue全家桶-移动端-spa)<br>

## vue vuex vux vue-router vue-resource vue-touch<br> 

    vue 主库<br> 
    vuex 数据状态管理<br> 
    vue-router 前端路由<br> 
    vue-resource ajax库<br> 
    vue-touch 移动端touch<br>
    vux 仿微信UI库

### 移动端踩的坑

#### `坑1: IOS页面切换页面title未变化`
引发原因: 兼容问题，andriod无此现象
解决原理： IOS通过装载iframe会触发IOS重新检索标题
解决方案： 在路由钩子afterEach生命周期中识别当前设备是否为IOS设备，若是IOS则加载一个空内容的html页面`(URL拼接随机参数,避免缓存)`，触发重新检索标题

#### `坑2: SPA应用跳转第三方网页，通过物理返回键返回，应用数据池数据全部丢失的问题`
引发原理： vuex的数据池是缓存在js内存中的，跳转至第三方网站时，内存中的数据已被释放
解决方案： 
  1: 通过iframe去转载载第三方页面
  2: cookie localStorage缓存store中的数据

##### UI展示
![](https://github.com/Marszed/vue-family-bucket/raw/master/gitImage/WechatIMG1.png)
![](https://github.com/Marszed/vue-family-bucket/raw/master/gitImage/WechatIMG2.png)
![](https://github.com/Marszed/vue-family-bucket/raw/master/gitImage/WechatIMG3.png)

开门动画有个小彩蛋，欢迎关注微信公众号`社区半径`，体验各种姿势开门
