<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
// import sensors from './utils/sensorsdata.es6.full'
// sensors.setPara({
// 	name: 'sensors',
// 	server_url: '您的数据接收地址',
// 	// 全埋点控制开关
// 	autoTrack: {
//     appLaunch: true, // 默认为 true，false 则关闭 $MPLaunch 事件采集
// 		appShow: true, // 默认为 true，false 则关闭 $MPShow 事件采集
// 		appHide: true, // 默认为 true，false 则关闭 $MPHide 事件采集
// 		pageShow: true, // 默认为 true，false 则关闭 $MPViewScreen 事件采集
// 		pageShare: true, // 默认为 true，false 则关闭 $MPShare 事件采集
// 		mpClick: true, // 默认为 false，true 则开启 $MPClick 事件采集 
// 		mpFavorite: true // 默认为 true，false 则关闭 $MPAddFavorites 事件采集
//   },
// 	// 自定义渠道追踪参数，如source_channel: ["custom_param"]
// 	// source_channel: ['channel_test'],
// 	// 是否允许控制台打印查看埋点数据(建议开启查看)
//   show_log: true,
//   // batch_send: true,
// 	// 是否允许修改 onShareAppMessage 里 return 的 path，用来增加(登录 ID，分享层级，当前的 path)，在 app onShow 中自动获取这些参数来查看具体分享来源、层级等
//   allow_amend_share_path: true,
//   // is_persistent_save: {
//   //   utm: true
//   // }
// });
// //初始化方法 @Platform H5、小程序
// sensors.init();
import Vue from 'vue'

export default Vue.extend({
  name: 'App',
})
</script>
