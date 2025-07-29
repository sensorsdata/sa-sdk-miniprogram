# SAT - 微信小程序广告渠道

## 功能
神策 SAT 标准功能。微信小程序支持 SAT 广告渠道。   
原理：判断有 `sat_cf` 参数时候，第一时间发送 `$ChannelLinkReaching` 事件。如果是首次触发的自定义事件，增加 `$is_channel_callback_event` 属性。  

## 集成
```javascript
import channel from '/dist/wechat/plugin/ad-channel/index.esm';
sensors.use(channel);
```
以上是标准用法，一般情况下使用上面方式既可，支持的是冷启动的归因( $MPLaunch )。从 v1.21.8 开始，支持热启动的归因，也就是热启动事件( $MPShow ) 的归因。如果要改成热启动归因，需要使用下面的额代码配置.
```javascript
import channel from '/dist/wechat/plugin/ad-channel/index.esm';
sensors.use(channel,{appShow:true});
```

## 变动
新增事件 `$ChannelLinkReaching`    
新增属性 `$is_channel_callback_event`  

## ⚠ 注意
* 从 v1.2.8 的开始支持的热启动归因，必须使用 sensors.use 方法，不能使用 sensors.usePlugin 方法，因为 usePlugin 要等 init 完成。如果做了 init 的延迟调用，会导致热启动监听不到，从而无法触发归因。
* 属于神策 SAT 功能。请按照需求在需要支持 SAT 时候使用，没有 SAT 不需要使用。
