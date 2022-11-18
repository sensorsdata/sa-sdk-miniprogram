# SAT - 微信小程序广告渠道

## 功能
神策 SAT 标准功能。微信小程序支持 SAT 广告渠道。   
原理：判断有 `sat_cf` 参数时候，第一时间发送 `$ChannelLinkReaching` 事件。如果是首次触发的自定义事件，增加 `$is_channel_callback_event` 属性。  

## 集成
```javascript
import channel from '/dist/wechat/plugin/ad-channel/index.esm';
sensors.usePlugin(channel);
```

## 变动
新增事件 `$ChannelLinkReaching`    
新增属性 `$is_channel_callback_event`  

## ⚠ 注意
* 属于神策 SAT 功能。请按照需求在需要支持 SAT 时候使用，没有 SAT 不需要使用。
