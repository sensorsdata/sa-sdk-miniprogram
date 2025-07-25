## 1.21.9 (2025-7-23)
1. 新增
    - 新增插件 duplicate-data，用来去除 time 完全一致数据。 

## 1.21.8 (2025-6-30)
1. 新增
    - 配置 appShow:true 后，可以开启热启动也支持 SAT 渠道归因。 

## 1.21.7 (2025-5-26)
1. 优化
    - 优化在某些安全工具下扫描出的 extend 方法的原型链污染的安全问题。
2. 新增
    - 支持分享的时候使用 async 的语法，但是不能开启 JS 转 ES5，否则还是不支持。    

## 1.21.6 (2025-3-31)
1. 优化
   - 增加异常判断，曝光插件中删除元素导致的报错。

## 1.21.5 (2025-3-18)
1. 优化
   - 考虑到 SAT 参数可能比较长，所以优化最大字符串长度从 500 到 5000。
   - 开源协议、demo 等相关修改。

## 1.21.4 (2025-3-5)
1. 优化
   - 优化 SAT channel 插件，新增 $ad_landing_page_url （没有 decode 的 $url）。

## 1.21.3 (2024-11-29)
1. 修复
   - 1.21 提供的 v2 目录里的文件没有更新，重新打包了。

## 1.21.1 (2024-11-8 废弃)
1. 新增
   - 新增打包 v2 目录，这个目录下打包的 SDK 去除了 setOpenid、initWithOpenid 等过期 API，且只能用批量发送。后续还会提供更多 v3、v4 等打包目录，去除一些过期或者不用的 API。

## 1.20.6 (2024-11-5)
1. 修复
   - 小程序 disable sdk 后还会发送 profile 的问题。
2. 新增
   - 弹窗支持下发可弹的时间段。

## 1.20.5 (2024-7-26)
1. 修复
   - 小程序弹窗点击 image 时候没有 $sf_msg_element_type。

## 1.20.4 (2024-4-19)
1. 新增
   - 支持在部分场景下，使用多 SDK。

## 1.20.3 (2024-3-26)
1. 优化
   - ID3 内外层匿名 ID 保持一致，不建议使用 loginWithKey, identify 默认是带 true 的结果。

## 1.20.2 (2023-11-17)
1. 新增
   - `sensors.resetAnonymousIdentity` 重置匿名 ID 的接口。
   - `sensors.kit.setData` 来设置内部 titile 变量，从而解决动态设置 titile 的问题。

## 1.20.1（2023-11-15）
1.  修复
   - 连续调用 track 和 bind，track 数据里有可能会包含 bind 信息的问题。

## 1.19.12（2023-10-30）
1.  修复
   - 自动全埋点和手动全埋点共存的时候，手动全埋点 pageShow 的 referrer 不准确。

## 1.19.11（2023-10-23）
1.  新增
   - 数据发送国密加密插件。

## 1.19.10（2023-10-9）
1.  修复
    - 曝光插件偶尔会报 Cannot read property 'area rate' of undefined 的问题。

## 1.19.9（2023-9-19）
1.  修复
    - 在开启 sampshare 且未定义 path 时，自动生成的 path 不带 query。

## 1.19.8（2023-8-30）
1.  修复
    - 曝光插件，监听元素过多（预计 200 个以上）时候导致内存溢出。

## 1.19.7（2023-8-8）
1.  新增
    - 弹窗支持复杂数据权限。

## 1.19.6（2023-7-25）
1.  修复
    - 修复 `PC` 端微信小程序上报失败的问题。

## 1.19.5（2023-6-20）
1.  新增
    - 曝光插件支持过程回调。

## 1.19.4（2023-6-9）
1.  新增
    - 新增 `registerPropertyPlugin` 接口，支持属性的删除和修改。

## 1.19.3（2023-6-1）
1.  修复
    - 修复 `enableDataCollect` 接口报错问题

## 1.19.2（2023-5-4）
1.  新增
    - `A/B Testing` 插件埋点逻辑配置化
    - 弹窗蒙层点击优化
    - 新增弹窗点击回调

## 1.19.1（2023-4-10）
1.  新增
    - 插件优化二期
2.  修复
    - 修复 `ad-channel-h5-linker` 插件在延迟初始化情况下 `log` 方法报错的问题。
    - 修复插件不兼容导致的属性缺失问题 

## 1.18.5（2023-3-31）
1.  新增
    - 支持曝光事件采集

## 1.18.4（2022-12-7）
1.  新增
    - 支持 `List` 列表元素非字符串类型

## 1.18.3（2022-12-2）
1.  修复
    - `ID-Mapping 3.0` 用户关联协议优化
    - 修复特殊场景下首次启动不生效的问题

## 1.18.2（2022-11-18）
1.  新增
    - 新增支持非对称加密框架插件
    - 支持关闭数据采集

## 1.18.1（2022-10-26）
1.  新增
    - 插件化重构
    - 新增支持 `webview` 渠道信息回传插件

## 1.17.13（2022-9-16）
1.  修复
    - 修复无法解绑 `$identity_mp_unionid` 的问题

## 1.17.12（2022-8-12）
1.  新增
    - 分享事件支持异步采集分享者信息

## 1.17.11（2022-7-22）
1.  新增
    - 新增 `referrer_path` 插件
2.  优化
    - 优化自定义属性插件，可以覆盖预置属性

## 1.17.10（2022-6-16）
1.  新增
    - 新增 `getLocation` 插件

## 1.17.9（2022-5-31）
1.  新增
    - 新增 `SessionEvent` 插件

## 1.17.8（2022-5-26）
1.  新增
    - 新增广告渠道插件

## 1.17.7（2022-4-29）
1.  修复
    - 删除获取经纬度的功能，修复微信小程序发布代码审核不通过的问题

## 1.17.6（2022-4-15）
1.  新增
    - 新增登录接口 `loginWithKey`，去除 `LOGIN_ID_KEY` 配置

## 1.17.5（2022-3-21）
1.  修复
    - 修复 `login` 传入匿名 `ID` 触发 `$SignUp` 事件的问题

## 1.17.4（2022-3-11）
1.  新增
    - 支持动态配置制定页面的 `$MPPageLeave` 采集规则


## 1.17.3（2022-1-13）
1.  新增
    - 支持自定义属性配置插件
    
## 1.17.2（2022-1-13）
1.  修复
    - 页面浏览时长出现负值的问题
    - 属性值为 `null` 和 `undefined` 日志提示不准确的问题

## 1.17.1（2021-12-31）
1.  新增
    - 支持合规功能，延迟初始化

## 1.16.3（2021-12-27）
1.  修复
    - 修复 `setOpenid` 接口上报 `$BindID` 事件导致后端埋点报错的问题

## 1.16.2（2021-12-22）
1.  新增
    - 支持 `ID-Mapping 3.0` 用户关联协议
    - 获取预置属性接口返回新增是否首次属性 `$is_first_time`
2.  修复
    - 修复 `Component` 传空对象，不采集页面浏览事件的问题
    - 修复批量发送的 `time` 和 `_flush_time` 相同的问题
    - 修复部分场景下 `$url_path` 取值不准确的问题

## 1.15.1（2021-12-2）
1.  新增
    - 新增支持数据传输加密

## 1.14.29（2021-11-29）
1.  新增
    - 新增所有事件采集 `$url`、`$title`、`$mp_client_basic_library_version`、`$mp_client_app_version` 和 `$app_version` 属性
    

## 1.14.28（2021-11-24）
1.  优化
    - 优化 `$referrer` 取值为 `url` 完整路径带 `query` 参数

## 1.14.27（2021-11-23）
1.  新增
    - 数据发送模块重构

## 1.14.26（2021-11-11）
1.  修复
    - 修复返回操作触发页面浏览事件时 `$referrer` 值不准确的问题
    - 修复不设置页面标题会出现错误日志的问题
    - 修复属性值传空数组会被删除不上报的问题

## 1.14.25（2021-10-28）
1.  修复
    - 修复 `setWebviewUrl` 方法可能会导致客户参数无法解析的问题

## 1.14.24（2021-10-11）
1.  修复
    - 修复 `sendPageLeave` 方法可能导致的报错问题
    - 修复 `Fortify` 扫描的安全漏洞问题

## 1.14.23（2021-09-28）
1.  修复
    - 修复 `setWebviewUrl` 方法可能会导致客户 `url` 中参数丢失的问题
    - 修复参数 `launched` 暴露修改方法可能会导致 `$MPLaunch` 无法采集的问题
    - 修复浏览插件页面退出小程序采集 `$MPHide` 事件时，控制台会捕获到异常的问题

## 1.14.22（2021-09-15）
1.  优化
    - 修改初始化配置参数 `show_log` 默认值为 `fasle`
    - 修改初始化配置参数 `max_string_length` 默认值为 `500`
2. 修复
    - 修复 `ES6` 语法报错问题

## 1.14.21（2021-08-27）
1.  优化
    - `$SignUp` 事件去除 `$is_first_day` 属性

## 1.14.20（2021-08-20）
1.  新增
    - 新增采集页面浏览时长事件 `$MPPageLeave`

## 1.14.19（2021-08-9）
1.  修复
    - 修复特定情况下分享字段解析报错问题

## 1.14.18（2021-08-6）
1.  优化
    - `fortify` 安全扫描问题优化

## 1.14.17（2021-08-5）
1.  新增
    - 新增公共预置属性 `$referrer_title`
1.  修复
    - 修复特定情况下 `$referrer` 取值异常的问题

## 1.14.16（2021-07-31）
1.  修复
    - 修复开发者工具企业微信小程序模式获取 `title` 报错问题

## 1.14.15（2021-07-29）
1.  优化
    - 优化批量发送 300 条限制逻辑

## 1.14.14（2021-07-19）
1.  修复
    - 修复自定义属性被预置属性覆盖问题
    - 修复 `Taro 3.1` 及以上框架，小程序内嵌元素自定义属性无法采集的问题

## 1.14.13（2021-07-9）
1.  新增
    - `$url_path` 设置为所有事件都有的预置属性
2.  修复
    - 修复页面浏览事件自定义属性值 `$title` 被覆盖问题
3.  优化
    - 可配置特定控件不采集全埋点点击事件逻辑优化

## 1.14.12（2021-06-26）
1.  新增
    - 支持在微信小程序中跟内嵌 `H5` 打通
    - 支持对特定控件不采集全埋点点击事件
    - 支持分享到朋友圈单页模式下页面的数据采集

## 1.14.11（2021-06-10）
1.  新增
    - 新增 `tabBar` 点击事件自动采集
    - 新增 `getServerUrl` 接口
    - 默认开启批量发送
2.  修复
    - 修复 `ES6` 语法报错问题

## 1.14.10（2021-05-21）
1.  新增
    - 新增预置属性 `$brand` 和 `$geo_coordinate_system`，统一 `$network_type` 属性值为大写
2.  修复
    - 修复自定义全埋点 `$MPViewScreen` 缺少 `$title` 预置属性

## 1.14.9（2021-04-22）
1.  新增
    - 新增本地 `storage` 加密

## 1.14.8（2021-04-20）
1. 修复
    - 修复页面参数含有 `scene` 时 `$url_query` 为空问题；
2. 新增
    - `TS` 文件新增对 `setOpenid` 方法的声明

## 1.14.7（2021-03-19）
1. 优化
    - 优化定时器，减少 `setTimeout` 方法使用；
    - 优化点击事件优先级处理；
2. 修复
    - 修复延迟初始化时，注册事件属性不一致问题；

## 1.14.6（2021-03-13）
1. 新增
    - 增加 `_flush_time` 和 `_track_id` 属性；
    - 新增 `ts` 声明文件

## 1.14.5（2020-12-25）
1. 新增
    - 页面浏览事件新增采集 `$title`；
2. 优化
    - 优化场景值映射，SA 需升级到 `2.1.5107` 及以上版本，SDG 需升级到 `0.7.5159` 及以上版本；
    - 优化打印日志方法；

## 1.14.4（2020-12-18）
1.  修复
    - 修复点击事件埋点 bug;

## 1.14.2（2020-12-4）
1.  新增
    - 页面浏览采集可配置;
    - 所有事件可配置采集 $url_path;

## 1.14.1（2020-11-10）
1. 优化
    - 全埋点优化，支持所有框架采集;
    - ID 修改逻辑优化，增加 ID 规则校验;

## 1.13.32（2020-11-07）
1. 新增
    - 新增 SF 渠道属性采集

## 1.13.31（2020-10-30）
1. 新增
    - 新增经纬度采集;

## 1.13.30（2020-10-23）
1. 优化
    - 获取场景值功能优化;

## 1.13.29（2020-09-16）
1. 新增
    - 新增获取匿名 ID 接口;

## 1.13.28（2020-09-10）
1. 优化
    - 获取预置属性接口新增是否首日属性;

## 1.13.27（2020-09-08）
1. 新增
    - 新增收藏预置事件，分享事件区分转发朋友圈和分享消息卡片;
    - 支持注册动态公共属性;

## 1.13.26（2020-07-30）
1. 修复
    - 小程序 sa_utm 解析 bug 修复;
    - 微信小程序 $MPViewScreen 事件 utm 信息解码;

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
