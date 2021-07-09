<script>
	// #ifdef MP-WEIXIN
	// 第二种方式
	import sensors from 'sa-sdk-miniprogram'
	sensors.setPara({
		name: 'sensors',
		server_url: 'https://jssdkdata.debugbox.sensorsdata.cn/sa?project=beiyong3',
		// 全埋点控制开关
		autoTrack: {
			mpClick: true, // 默认为 false，true 则开启 $MPClick 事件采集 
		},
		// 自定义渠道追踪参数，如source_channel: ["custom_param"]
		source_channel: [],
		// 是否允许控制台打印查看埋点数据(建议开启查看)
		show_log: true,
		// 是否允许修改 onShareAppMessage 里 return 的 path，用来增加(登录 ID，分享层级，当前的 path)，在 app onShow 中自动获取这些参数来查看具体分享来源、层级等
		allow_amend_share_path: true
	});
	sensors.init();
	// #endif

	export default {
		globalData: {},
		onLaunch: function() {
		},
		onShow: function(options) {
		},
		onHide: function() {
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
