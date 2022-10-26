# 插件的开发方式

## 插件开发注意点
1. 插件目录是 pluginXX，默认文件名为 `index.esm.js`
2. 末尾建议是 `export default pluginXX`
3. pluginXX 必须是 `object`  
4. pluginXX 必须包含 `name` ，`name` 必须是首字母大写的字符串，命名是大驼峰  
5. pluginXX 必须提供 `init` 方法  

## 示例代码
下面我们实现一个插件，当小程序进入后台后，自动发送一个 `hide` 事件并包含传入的自定义属性  

```javascript
// index.js
var TrackHide = {
  name: 'TrackHide',
  init: function(sensors, config){
    wx.onAppHide(function(){
      sensors.track('hide',config);
    });
  }
};
export default TrackHide;
```

以上一个插件就编写好了，下面是使用方式  

```javascript
import sensors from '/dist/wechat/sensorsdata.ems';
import trackHide from '/dist/wechat/plugin/track-hide/index.esm';
sensors.setPara({...});
sensors.use(trackHide,{platform:'wechat'});
sensors.init();
```

这样，当小程序隐藏的时候，会自动发送 `hide` 事件。