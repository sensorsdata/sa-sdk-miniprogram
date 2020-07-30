## 1.13.26（2020-07-30）
1. 修复
    - 小程序 sa_utm 解析 bug 修复;
    - 微信小程 $MPViewScreen 事件 utm 信息解码;

## 1.13.25（2020-07-17）
1. 新增
    - 新增事件监听功能
    
## 1.13.24（2020-06-19）
1. 新增
    - 新增所有事件都有的预置属性 `$app_id`、`$timezone_offset`

## 1.13.23（2020-04-26）
1. 修复
    - 修复 `WePY` 框架运行` npm run build` 时语法不兼容问题；

## 1.13.22（2020-04-13）
1. 优化
    - 优化点击预置事件中 `$url_path` 预置属性的采集逻辑；

## 1.13.21（2020-04-07）
1. 优化
    - 优化预置事件 `$MPLaunch`、 `$MPShow` 中 `$share_depth` 的计算逻辑；
2.  新增
    - 新增所有事件都有的预置属性 `$latest_share_depth`、 `$latest_share_distinct_id`、 `$lastest_share_url_path`,神策分析系统需升级到 `1.14.745` `1.16.1414` `1.15.1413` `1.13.5875` 及以上版本；

## 1.13.20（2020-03-19）
1. 修复
    - 修复点击处理函数参数为 `null` 时，点击预置事件报错问题；

## 1.13.19（2020-03-11）
1.  新增
    - 新增预置点击事件 `$MPClick` 可通过配置确定是否采集功能；
    - 插件版 `SDK` 支持 `Component` 构造器构造的页面的预置事件采集功能;
2. 优化
    - 优化批量发送方式下请求取消时长配置;

## 1.13.18（2020-03-05）
1. 新增
    - 新增预置点击事件 $MPClick 采集功能；
    - 新增 logout() 接口;

## 1.13.17（2020-02-17）
1. 优化
    - 优化 `identify()` 接口逻辑；
    - 批量发送方式下，默认请求取消时长修改为 `10s`;

## 1.13.16（2019-12-25）
1. 更新
    - 更新场景值描述

## 1.13.15（2019-12-24）
1. 修复
    - 修复使用批量发送方式发送数据时，网络从无网切换到有网时，数据无法发送的问题
2. 优化
    - `onLaunch` `onShow` 生命周期函数中，参数对象中获取不到 `scene` 值时的处理逻辑

## 1.13.14（2019-12-02）
1. 修复
    - 修复参数中同时带有 `scene` 与渠道信息时，无法解析渠道信息
    - 修复多场景下扫描普通二维码时 `q` 参数的渠道解析逻辑
2. 新增
    - 新增渠道参数映射功能
3. 优化
    - 优化最近一次渠道参数解析规则


## 1.13.13(2019-11-9)
1. 优化
    - 优化扫描普通网页二维码的兼容性处理
    - 没有 `init` 前的队列做了清空
    - 为了兼容 `page` 在 `onshow` 时候，加自定义参数，去除了代码中 `$MPViewScreen` 的自定义方法

## 1.13.12(2019-10-31)
* 优化：server_url为空时候，不发数据。

## 1.13.11 
* 新增：所有事件增加 anonymous_id 属性，如果调用了 login 方法，就增加 login_id 属性。
* 例行更新：场景值的描述

## 1.13.10 (2019-09-18)
* 优化：默认decode了option.query的值。分享时候自动拼接的的query还是保持不变。

## 1.13.9 (2019-09-16)
* 新增：增加配置 is_persistent_save ，支持将最近一次站外渠道信息永久保存到 Storage 中  
* 优化：给未定义 Component 时候一个默认值 

## 1.13.8 (2019-08-30)
* 新增：支持自定义 utm 参数。通过配置 source_channel:['...','...']  
* 优化：storage 数据写入失败的话，会打印出失败的原因  
* 优化：$os的取值增加devtools，优化了$os和$os_version算法
* 优化：$url_query在$MPViewScreen中没有值时候，从未知改成空

## 1.13.7 (2019-08-22)

* 新增：$MPViewScreen 增加了 UTM 相关属性的解析
* 例行更新：场景值的描述

## 1.13.6 (2019-08-09)

* 新增：支持非插件模式下用Component作为页面构造器时候的，页面浏览自动采集功能，包括以下两种情况
1.原生小程序直接使用Component作为页面构造器 2.框架使用Component作为页面构造器，包括 Taro，Uniapp，wepy2 

## 1.13.5 (2019-07-05)

* 增加了获取匿名ID的方法 sensors.quick('getAnonymousID')

## 1.13.4 (2019-06-17)

* 同步小程序场景值描述
* server_url 默认地址为空
* 存储读取异常时候会重试

## 1.13.3 (Unknown)

* 获取预置属性方法可获取到 latest 相关属性
* 增加 appendProfile 与 incrementProfile 缓存

## 1.13.2 (2019-05-16)

* 增加两个 profile的操作 sa.appendProfile({catrgory: ['玉米']}) 喜爱的蔬菜增加玉米 和 sa.incrementProfile({'navClick': 1}) 导航点击次数 +1次

## 1.13.1 (2019-05-10)

* **重大更新**,去除了sensorsdata_conf.js，配置改成在 App.js中，通过 sensors.setPara({})或者在sensors.init({})中加入
* 分成三个文件，sensorsdata.min.js全埋点的非插件版，sensorsdata.plugin.min.js全埋点的插件版，sensorsdata.custom.min.js手动埋点版本支持插件和非插件。具体各个版本的用法参考文档。另外增加es6格式的对应版本

## 1.12.11 (2019-04-22)

* 修复12.10的bug，如果更新1.12.10的用户，必须更新到1.12.11

## 1.12.10 (2019-04-04)

* 修复$url_query在返回时候取值的错误，修复当没有onShareAppMessage没有return值，且使用allow_amend_share_path时候，自动补全的url只有path没有query的问题
* 去除了page在show的时候，解析utm参数和scene的功能，统一在app里解析

## 1.12.9 (2019-03-11)

* 增加自动采集$first_visit_time 首次访问时间
* 增加 datasend_timeout 配置请求最大链接多久取消

## 1.12.8 (2019-01-23)

* getPresetProperties去掉registerApp的属性
* 修复自动获取openid的url在某些特殊条件下的bug
* 增加批量发送最大数据量，batch_send:{send_timeout:6000,max_length:6}

## 1.12.7 (2019-01-11)

* registerApp 方法不做缓存

## 1.12.6 (2019-01-04)

* 增加 batch_send 批量发数据的配置，设置为空对象或者true，表示开启这个功能，必须更新神策分析到最新版，否则去重功能无效
* 增加 autoTrackIsFirst的配置，不设置默认是先执行onLaunch等事件中的代码，（如果使用动态修改预置属性的功能会有影响！！！），后发送appLaunch的统计数据，可以单独给各个预置事件单独设置先后发送顺序
* 增加sa.quick('appLaunch',arguments,prop) 等单独发预置事件和属性的功能

## 1.12.5 (2018-11-24)

* 修复 autoTrack.pageShow 设置 false 仍然发送 $MPViewScreen 的问题

## 1.12.4 (2018-11-09)

* 增加init的多次使用的判断，去掉$MPLaunch,$MPShow中获取到的path带/的异常判断

## 1.12.3 (Unkown)

* 小程序identify和login如果传入的是非字符串时候，自动转化字符串类型
* 增加对onShareAppMessage返回空对象的判断

## 1.12.2 (2018-10-26)

* 修复在开启自动采集分享，且定义空的onShareAppMessage时候，控制台报错的问题

## 1.12.1 (2018-10-16)

* 更新支持插件的小程序 SDK 具体用法参考 https://sensorsdata.cn/manual/mp_sdk_plugin.html

## 1.11.1 (2018-09-28)

* 更新 $manufacturer 设备制造商(brand)，修正 $screen_width的 取值(windowWidth)

## 1.10.5 (2018-09-19)

* 增加 $url_query
* 增加 sa.initWithOpenid(options,callback)  callback(openid)
* 增加sa.status.referrer sa.status.laster_referrer