# sa-sdk-miniprogram
## 神策微信小程序 SDK

使用文档请参考 https://sensorsdata.cn/manual/mp_sdk.html

sensorsdata.min.js 是主文件  
sensorsdata_conf.js 是配置文件  

## 获取发行版

> 注意 SDK 可能不完全向前兼容，请阅读具体的 Release Log。如果不确定是否支持，请联系神策技术支持人员。
 
请根据需要 [Releases](https://github.com/sensorsdata/sa-sdk-miniprogram/releases) 里下载对应的文件：

## 版本更新记录
| 版本号 | 更新内容 |
| ------ | ------ | 
|1.10.5|增加 $url_query 2 增加 sa.initWithOpenid(options,callback)  callback(openid) 3 增加sa.status.referrer sa.status.laster_referrer    |
|1.11.1| 更新 $manufacturer 设备制造商(brand)，修正 $screen_width的 取值(windowWidth)     |
|1.12.1| 更新支持插件的小程序 SDK 具体用法参考 https://sensorsdata.cn/manual/mp_sdk_plugin.html  |
|1.12.2| 修复在开启自动采集分享，且定义空的onShareAppMessage时候，控制台报错的问题   |
|1.12.3| 小程序identify和login如果传入的是非字符串时候，自动转化字符串类型。增加对onShareAppMessage返回空对象的判断。  |
|1.12.4| 增加init的多次使用的判断，去掉$MPLaunch,$MPShow中获取到的path带/的异常判断 |   
|1.12.5| 修复 autoTrack.pageShow 设置 false 仍然发送 $MPViewScreen 的问题    |
|1.12.6| 增加 batch_send 批量发数据的配置，设置为空对象或者true，表示开启这个功能，必须更新神策分析到最新版，否则去重功能无效。增加 autoTrackIsFirst的配置，不设置默认是先执行onLaunch等事件中的代码，（如果使用动态修改预置属性的功能会有影响！！！），后发送appLaunch的统计数据，可以单独给各个预置事件单独设置先后发送顺序。增加sa.quick('appLaunch',arguments,prop) 等单独发预置事件和属性的功能。  | 
|1.12.7| registerApp 方法不做缓存|    
|1.12.8| getPresetProperties去掉registerApp的属性。修复自动获取openid的url在某些特殊条件下的bug。增加批量发送最大数据量，batch_send:{send_timeout:6000,max_length:6}。   |
|1.12.9| 增加自动采集$first_visit_time 首次访问时间, 增加 datasend_timeout 配置请求最大链接多久取消。   |
|1.12.10| 修复$url_query在返回时候取值的错误，修复当没有onShareAppMessage没有return值，且使用allow_amend_share_path时候，自动补全的url只有path没有query的问题。去除了page在show的时候，解析utm参数和scene的功能，统一在app里解析。  |
|1.12.11| 修复1.12.10的bug，如果更新1.12.10的用户，必须更新到1.12.11|
|1.13.1|**重大更新**,去除了sensorsdata_conf.js，配置改成在 App.js中，通过 sensors.setPara({})或者在sensors.init({})中加入。另外分成三个文件，sensorsdata.min.js全埋点的非插件版，sensorsdata.plugin.min.js全埋点的插件版，sensorsdata.custom.min.js手动埋点版本支持插件和非插件。具体各个版本的用法参考文档。另外增加es6格式的对应版本。|
|1.13.2|增加两个 profile的操作 sa.appendProfile({catrgory: ['玉米']}) 喜爱的蔬菜增加玉米 和 sa.incrementProfile({'navClick': 1}) 导航点击次数 +1次 |

  


 


