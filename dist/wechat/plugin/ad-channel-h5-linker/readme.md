# SAT - 微信小程序与 H5 用户关联和渠道打通

## 功能
本插件是 ad-channel 的扩展版，扩展支持 H5 的渠道归因打通。  
原理：包含 ad-channel 功能。同时提供 `addChannelInfoToUrl` 方法，传入要跳转的 URL ，返回新的 webview 的 URL，该 URL 中包含 `distinct_id`、`appid`、`lib`（固定为 `mp`）等信息。然后配合 Web SDK 的插件 wechat-webview-channel 达到渠道归因打通的目的。  

## API
```javascript
import adChannelH5Linker from 'index.esm.js'  
sensors.usePlugin(adChannelH5Linker, option);
var new_url = adChannelH5Linker.addChannelInfoToUrl(url, after_hash);

```
* `url`: webview 需要加载的 url。类型：`String`。<span style="color:red"> 必填 </span>   
* `after_hash`:  新增的参数是否放在在 `url` 的 `hash` 之后。默认：`false`，放在 query 中，hash 前。可选  


## ⚠ 注意：
* 不能和 ad-channel 插件共同使用。一般情况下不做 webview 归因打通时候，使用 ad-channel 即可  
* 不能和 h5-linker 插件共同使用。一般情况单纯做小程序和 H5 的话，使用 h5-linker 即可 
* 该插件已经包含上面两个插件的功能，且仅在 SAT + 小程序内嵌 H5 归因打通 的场景下使用 
