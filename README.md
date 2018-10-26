# sa-sdk-miniprogram
## 神策微信小程序 SDK

使用文档请参考 https://sensorsdata.cn/manual/mp_sdk.html

sensorsdata.min.js 是主文件  
sensorsdata_conf.js 是配置文件  

## 获取发行版

> 注意 SDK 可能不完全向前兼容，请阅读具体的 Release Log。如果不确定是否支持，请联系神策技术支持人员。
 
请根据需要 [Releases](https://github.com/sensorsdata/sa-sdk-miniprogram/releases) 里下载对应的文件：

## 版本更新记录
1.10.5 1 增加 $url_query 2 增加 sa.initWithOpenid(options,callback)  callback(openid) 3 增加sa.status.referrer sa.status.laster_referrer    
1.11.1 更新 $manufacturer 设备制造商(brand)，修正 $screen_width的 取值(windowWidth)     
1.12.1 更新支持插件的小程序 SDK 具体用法参考 https://sensorsdata.cn/manual/mp_sdk_plugin.html  
1.12.2 修复在开启自动采集分享，且定义空的onShareAppMessage时候，控制台报错的问题
  


 


