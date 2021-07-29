// 集成 sdk
import sensors from 'sa-sdk-miniprogram';
sensors.setPara({
	name: 'sensors',
	server_url: '您的数据接收地址',
	// 全埋点控制开关
	autoTrack: {
    appLaunch: true, // 默认为 true，false 则关闭 $MPLaunch 事件采集
		appShow: true, // 默认为 true，false 则关闭 $MPShow 事件采集
		appHide: true, // 默认为 true，false 则关闭 $MPHide 事件采集
		pageShow: true, // 默认为 true，false 则关闭 $MPViewScreen 事件采集
		pageShare: true, // 默认为 true，false 则关闭 $MPShare 事件采集
		mpClick: true, // 默认为 false，true 则开启 $MPClick 事件采集 
		mpFavorite: true // 默认为 true，false 则关闭 $MPAddFavorites 事件采集
  },
	// 自定义渠道追踪参数，如source_channel: ["custom_param"]
	// source_channel: ['channel_test'],
	// 是否允许控制台打印查看埋点数据(建议开启查看)
  show_log: true,
});
//初始化方法
sensors.init();


App({
    onLaunch(options) {},
    onShow(options) {
      console.log('onShow!!!')
    },
    onHide() {},
    onError(err) {},
    onPageNotFound(options) {},
    globalData: {
      // 将 sensors 添加到公共变量
      sensors: sensors
    }
})