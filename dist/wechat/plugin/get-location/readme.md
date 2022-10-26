# 新增经纬度公共属性

## 功能
集成插件后，会自动获取经纬度坐标作为公共属性

## 集成
```javascript
import getLocation from '/dist/wechat/plugin/get-location/index.esm';
sensors.usePlugin(getLocation);

// wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
getLocation.getLocation({type:'wgs84'});
```

## 变动
新增属性 `$geo_coordinate_system` 、 `$latitude` 、 `$longitude`

## ⚠ 注意
* wx.getLocation 需要用户授权，用户授权后才能采集相关属性。
* wx.getLocation 是异步采集，所以冷启动后首次打开页面，`$MPLaunch`、`$MPShow`、`$MPViewScreen` 有可能是采集不到经纬度属性。
* 插件 getLocation() 方法需要在小程序应用授权的回调方法里面进行 API的调用，后续事件才会自动采集经纬度相关的属性。
