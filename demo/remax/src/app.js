import './app.css';
// SDK 初始化
import sensors from './utils/sensorsdata.min.es6'
sensors.setPara({
	name: 'sensors',
	server_url: '您的数据接收地址',
	// 全埋点控制开关
	autoTrack: {
		mpClick: true
	},
	// 自定义渠道追踪参数，如source_channel: ["custom_param"]
	source_channel: [],
	// 是否允许控制台打印查看埋点数据(建议开启查看)
	show_log: true,
	// 是否允许修改 onShareAppMessage 里 return 的 path，用来增加(登录 ID，分享层级，当前的 path)，在 app onShow 中自动获取这些参数来查看具体分享来源、层级等
	allow_amend_share_path: true
});
sensors.init();

const App = props => props.children;

export default App;
