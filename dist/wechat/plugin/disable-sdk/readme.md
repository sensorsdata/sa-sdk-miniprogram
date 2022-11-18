# 合规 - 启用和禁用微信小程序 API
>⚠️ 此插件已自动集成在 SDK 中，请勿集成！

## 功能
通过调用 `sensors.disableSDK()`，来禁用 API（例如 `track` 、`setProfile` ） 的执行。也可以通用调用 `sensors.enableSDK()` 来恢复 API 的执行，但是之前 `diableSDK` 时的数据不会存储，是完全丢失的。     
原理： 通过给提供的所有 API 设置 flag ，如果是禁用状态，API 就不会执行。  


### 新增 3 个 API
* `sensors.disableSDK()`: 禁用所有 API 执行
* `sensors.enableSDK()`:  恢复 API 执行
* `sensors.getDisabled()` 获取当前禁用的状态，`true` 表示禁用


## ⚠ 注意：
* 全埋点需要对 API 进行代理操作，这里的代理操作行为 disableSDK 是无法中止的，只能中止 track 、register 这些 API
* disableSDK 后触发的行为数据，都会丢失。需要 enableSDK 后重新开始。
* 所有的插件提供出来的 API （disableSDK、 enableSDK 等）都需要在 init 后执行，init 前调用会报错 ！！！
