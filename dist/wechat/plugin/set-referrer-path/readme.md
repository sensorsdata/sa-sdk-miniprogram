## 新增 referrer_path 公共属性

## 功能
增加 `referrer_path` 属性，相比 `$referrer` ，`referrer_path` 只包含 path。

## 集成
```javascript
import referrerPath from '/dist/wechat/plugin/set-referrer-path/index.esm.js'  
sensors.usePlugin(referrerPath);
```

## 变动
新增 `referrer_path` 属性