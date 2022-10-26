# 12h/30m session 切割

## 功能
给所有事件新增 `$event_session_id` 属性，标记当前事件属于哪个 session。  
原理： session 的切割规则满足以下两个条件中的一个：  
1. 两个连续的时间必须小于 30 分钟
2. 当前时间 - 首次 session 切割时间 小于 12 小时
在这个规则内的使用的是一个 session_id，否则会新开一个 session。

## 集成
```javascript
import sessionEvent from '/dist/wechat/plugin/session-event/index.esm.js'  
sensors.usePlugin(sessionEvent);

```

## 变动
新增 storage key `sensorsdata2015_wechat_session`  
新增 `$event_session_id` 属性  

## ⚠ 注意
* session 规则很多，当前只是一种实现，并不是一种通用实现，具体需求还需要具体分析