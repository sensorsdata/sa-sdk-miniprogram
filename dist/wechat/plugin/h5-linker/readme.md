# 微信小程序与 H5 用户关联

## 功能
微信小程序与 WebView 中的 H5 的用户打通。  
原理： 通过插件提供的 `addDistinctIdToUrl` 对 WebView 要使用的 url 增加 `_sasdk` 参数， 参数的值是当前微信小程序数据采集中的 distinct_id。

## 集成
```javascript
import H5Linker from '/dist/wechat/plugin/h5-linker/index.esm';
sensors.usePlugin(H5Linker);
var new_url = H5Linker.addDistinctIdToUrl(url ,after_hash);
```
### 参数配置
* `url`: webview 需要加载的 url。类型：`String`。必填 
* `after_hash`: 添加 `_sasdk` 参数位置是否在 `url` 的 `hash` 之后。默认：`false`。可选

## ⚠ 注意
* 该插件用来替换 微信小程序 v1.18.1 之前的版本中不推荐的 `setWebViewUrl` 方法。如果使用此方法的尽快替换成当前插件
* 不能和 ad-channel-h5-linker 插件共同使用
* 需要配合 Web 的 site-linker 插件共同使用，才能达到 H5 的打通