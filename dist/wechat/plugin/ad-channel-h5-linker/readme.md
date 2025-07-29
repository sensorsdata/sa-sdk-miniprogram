# SAT - 微信小程序与 H5 用户关联和渠道打通

## 功能
本插件是 ad-channel 的扩展版，扩展支持 H5 的渠道归因打通。  
原理：包含 ad-channel 功能。同时提供 `addChannelInfoToUrl` 方法，传入要跳转的 URL ，返回新的 webview 的 URL，该 URL 中包含 `distinct_id`、`appid`、`lib`（固定为 `mp`）等信息。然后配合 Web SDK 的插件 wechat-webview-channel 达到渠道归因打通的目的。  

## API
```javascript
import adChannelH5Linker from '/dist/wechat/plugin/ad-channel-h5-linker/index.esm.js'  
sensors.use(adChannelH5Linker, option);
var new_url = adChannelH5Linker.addChannelInfoToUrl(url, after_hash);

```
* `url`: webview 需要加载的 url。类型：`String`。<span style="color:red"> 必填 </span>   
* `after_hash`:  新增的参数是否放在在 `url` 的 `hash` 之后。默认：`false`，放在 query 中，hash 前。可选  

## 相关插件的使用场景差异
| 编号| 场景说明| 需要用到的小程序插件 |需要用到的 Web 配套插件 |
| ------| ------ | ------ | ------ |
|1|推 SAT 小程序，并且小程序内的 webview 网页不需要做渠道和用户的打通，请优先使用该方案。 | ad-channel | 不需要 |
|2|推 SAT 小程序，并且希望支持小程序内的 webview 网页的用户关联和 SAT 渠道打通，使用该方案| ad-channel-h5-linker  | wechat-webview-channel | 
|3|非 SAT 的渠道场景，只是实现小程序和 webview 网页的用户关联| h5-linker | site-linker |

### ⚠ 注意：
* 2 和 1，以及 2 和 3 是互斥的，因为 2 包含了 1 和 3 的部分功能（例如 3 会去解析 webview 的 URL 参数，并做用户关联。2 也会做这些操作，所以同时使用会导致冲突），所以不要同时使用。
* 2 不能完全替代 1，以及 2 也不能完全替代 3 。因为 2 虽然有 1 和 3 的大部分功能，但是 2 会多加的 mp 和 appid （ 在 1 中会增加多余的属性进行上报，在 3 中会新增多余的 URL 参数进行传递，另外有一些逻辑处理也是不一致的 ），这对 1 和 3 的场景没有用处，且强行套用有可能会引发异常。
* 总结：请根据当前的需求先去适配上面表格中的场景，然后使用表格提供的相应方案。
* option 参数的使用参考 ad-channel 插件。注意如果要使用 ad-channel 的热启动归因，这里必须用 sensors.use 替换 sensors.usePlugin。如果是用标准版的冷启动归因，可以继续使用 usePlugin。


