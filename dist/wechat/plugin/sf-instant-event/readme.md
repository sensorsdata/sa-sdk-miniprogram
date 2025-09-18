## SF - 即时事件上报

## 功能
根据即时事件配置 `instant_events` 配置的事件名称列表，将符合的事件增加 `instant_event` 标记。用以智能运营优先处理该条数据。

## 集成
### ES Module 方式
```js
import sfInstantEvent  from '/dist/wechat/plugin/sf-instant-event/index.esm.js';
sensors.use(sfInstantEvent,{
    instant_events:['$pageview','test1'] // 配置即时上报事件名称
});
```

## ⚠️ 注意
- 需 SF v4.4 以上版本支持。
- 请联系技术顾问确认是否使用该插件! 该插件非 SDK 通用功能，仅限在 SF 特定环境下使用。