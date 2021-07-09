import { Component } from 'react'
import './app.css'
import Taro from '@tarojs/taro'
import sensors from 'sa-sdk-miniprogram'
// SDK初始化配置
sensors.setPara({
	name: 'sensors',
	server_url: 'https://jssdkdata.debugbox.sensorsdata.cn/sa?project=beiyong3',
	// 全埋点控制开关
	autoTrack: {
    mpClick: true
  },
	// 自定义渠道追踪参数，如source_channel: ["custom_param"]
	source_channel: [],
	// 是否允许控制台打印查看埋点数据(建议开启查看)
	show_log: true,
	// 是否允许修改 onShareAppMessage 里 return 的 path，用来增加(登录 ID，分享层级，当前的 path)，在 app onShow 中自动获取这些参数来查看具体分享来源、层级等
  allow_amend_share_path: true,
  // 如果 Taro 版本是 3.0.0 到 3.0.19 之间版本才需要配置此参数,解决元素点击事件会触发多次的问题
  framework: {taro: Taro}
});
sensors.init();

class App extends Component {

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
