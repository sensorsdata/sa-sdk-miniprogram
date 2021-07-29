// 微信 sdk 的引入
import sensors from 'sa-sdk-miniprogram'
import Vue from 'vue'
import App from './App'

sensors.setPara({
	name: 'sensors',
	server_url: '您的数据接收地址',
	autoTrack: {
		mpClick: true
	},
})
sensors.init();

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
