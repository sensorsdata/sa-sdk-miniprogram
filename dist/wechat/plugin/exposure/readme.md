# 元素曝光事件采集

## 功能
某视图元素，由不可见到可见，满足一定的限制条件（可见比例、有效停留时长），该插件上报该视图元素曝光事件。

## 集成
### ES Module 方式
```javascript
import exposure from '/dist/wechat/plugin/exposure/index.es6';
sensors.use(exposure, {
  class_tags:['sensors-exposure-track'],
  area_rate: 0, 
  stay_duration: 2, 
  repeated: true 
});
```
#### 参数配置
通过初始化参数设置全局统一的曝光采集逻辑的配置。  
- `class_tags`: 曝光元素检测标记。默认：['sensors-exposure-track']。类型: Array
- `area_rate`：曝光比例。默认：0，值域：0~1。类型：Number
- `stay_duration`: 有效曝光停留时长。 默认：0。类型：Number
- `repeated`:  重复曝光。 默认：true。类型：Boolean
### 配置曝光元素
1. 通过元素配置统一添加曝光参数
通过添加元素曝光 `class` 标记，并设置元素属性 `data-sensors-exposure-option` 统一进行曝光事件采集配置。

```html
<view class="sensors-exposure-track" data-sensors-exposure-option="{{option}}"></view>

// Page.js
Page({
  data: {
    option: {
      event_name: "exposure_name",
      config: {
        area_rate: 0,
        stay_duration: 0,
        repeated: true
      },
      properties: {
        propA: "valueA"
      }
    }
  }
})
```
- `sensors-exposure-track` 元素 `class` 属性设置曝光标记 （必须添加标记）
- `data-sensors-exposure-option` 设置曝光事件配置 （必须设置）
- - `event_name`  设置曝光事件名称 （必须设置）
- - `config.area_rate` 设置曝光比例
- - `config.stay_duration` 设置有效曝光停留时长
- - `config.repeated` 设置重复曝光
- - `properties`   设置该元素曝光事件自定义属性。支持区分大小写及属性值其他类型。

2. 通过元素配置单独添加曝光参数
通过添加元素曝光 `class` 标记，并单独设置相关元素属性设置曝光事件采集配置。
```html
<view class="sensors-exposure-track" data-sensors-exposure-event-name="home_top_banner" data-sensors-exposure-config-area_rate="1"  data-sensors-exposure-config-stay_duration="2" data-sensors-exposure-config-repeated="true" data-sensors-exposure-property-propA="valueA" data-sensors-exposure-property-propB="valueB"></view>
```
- `sensors-exposure-track` 元素 `class` 属性设置曝光标记 （必须添加标记）
- `data-sensors-exposure-event-name` 设置曝光事件名称 （必须设置）
- `data-sensors-exposure-config-area_rate`  设置曝光比例
- `data-sensors-exposure-config-stay_duration` 设置有效曝光停留时长
- `data-sensors-exposure-config-repeated` 设置重复曝光
- `data-sensors-exposure-property-*`   设置该元素曝光事件自定义属性。属性值为 String。无法是其他类型。

3. 通过 API 配置曝光参数
```javascript
exposure.addObserverByClassName('元素 class 标记', {
    area_rate: 0.5,
    stay_duration: 0,
    repeated: true
})
```
- `class_tag`：曝光元素标记。类型：String
- `config`：曝光配置
    - `area_rate`：曝光比例。默认：0，值域：0~1。类型：Number
    - `stay_duration`: 有效曝光停留时长。 默认：0。类型：Number
    - `repeated`: 重复曝光。 默认：true。类型：Boolean

4. 通过 API 删除曝光标记监听
```javascript
exposure.removeObserverByClassName('元素 class 标记')
```
- `class_tag`：曝光元素标记。类型：String

5. 动态渲染元素添加曝光
```
// index.wxml
<view class="sensors-exposure-track" wx:for="{{list}}" wx:key="index" data-sensors-exposure-event-name="exposure_{{index}}" data-sensors-exposure-config-stay_duration="2" data-sensors-exposure-config-repeated="true" data-sensors-exposure-property-propA="{{item.name}}" data-sensors-exposure-property-propB="valueB">
      {{index}}: {{item.name}}
    </view>
// index.js
const exposure = getApp().globalData.exposure
Page({
    data(){
        return {
            list:[]
        }
    },
    onShow(){
        // 延迟渲染列表
        setTimeout(()=>{
            this.setData({list:[{name:'list1'},{name:'list2'}]},()=>{
                exposure.addObserverByClassName('sensors-exposure-track',option); // option 同通过 API 配置曝光参数
            })
        },3000)
    }
})
```

## 变动
- 新增事件：通过 View 自定义曝光事件名。
- 新增属性：通过 View 自定义事件属性。

## ⚠️ 注意
- 已注册的曝光元素标记 `class_tag`，再次注册仅更新之前未注册的元素，已注册的元素不会再次注册，已注册的元素不会因调用注册 API 导致发送曝光事件。
- 每个曝光元素 `event-name` （事件名）或 `property`（事件属性） 必须有差异，否则在 `repeated` 为 `false` 时，只会曝光查询到的第一个参数。
- 如未设置元素 `ID`，是通过曝光元素 `event-name` （事件名）与 `property`（事件属性）区分曝光元素。
- 微信小程序 SDK 版本必须大于或等于 1.18.6。
- 插件和 SDK 必须在同一个版本中，请勿混合不同版本的 SDK 和插件进行使用。
