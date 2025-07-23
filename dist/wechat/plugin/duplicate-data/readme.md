# 重复数据 - 去除检测 time 等所有信息完全一致的数据

## 功能
经过本地测试，如果 for 循环连续track 5 条相同数据，大概率有 2 条的 time 是一致的。部分客户的小程序因为卡，会出现连续点击按钮无响应的情况。此时就会类似 for 循环一样，连续触发相同的数据。有些客户会认为是重复数据。
对此我们做了这个插件。如果认为 time 等信息完全一致的数据是重复数据，可以引入这个插件来做去重。

## 集成
```javascript
import DuplicateData from '/dist/wechat/plugin/duplicate-data/index.esm';
sensors.usePlugin(DuplicateData);
```

## ⚠ 注意：
* 保证 SDK 代码放在顶部位置。且立即执行 sensors.usePlugin(DuplicateData) 。