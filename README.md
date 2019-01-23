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
1.12.3 小程序identify和login如果传入的是非字符串时候，自动转化字符串类型。增加对onShareAppMessage返回空对象的判断。  
1.12.4 增加init的多次使用的判断，去掉$MPLaunch,$MPShow中获取到的path带/的异常判断    
1.12.5 修复 autoTrack.pageShow 设置 false 仍然发送 $MPViewScreen 的问题    
1.12.6 增加 batch_send 批量发数据的配置，设置为空对象或者true，表示开启这个功能，必须更新神策分析到最新版，否则去重功能无效。增加 autoTrackIsFirst的配置，不设置默认是先执行onLaunch等事件中的代码，（如果使用动态修改预置属性的功能会有影响！！！），后发送appLaunch的统计数据，可以单独给各个预置事件单独设置先后发送顺序。增加sa.quick('appLaunch',arguments,prop) 等单独发预置事件和属性的功能。   
1.12.7 registerApp 方法不做缓存    
1.12.8 getPresetProperties去掉registerApp的属性。修复自动获取openid的url在某些特殊条件下的bug。增加批量发送最大数据量，batch_send:{send_timeout:6000,max_length:6}。  

  


 


