# 自定义属性

## 功能
针对特定事件，注册特定属性。   
原理：通过在事件发送前 hook 数据，新增/修改数据，达到对指定事件的新增/修改属性

## API
```javascript
import registerProperties from '/dist/wechat/plugin/register-properties/index.esm';
sensors.usePlugin(registerProperties);

// 给 '$MPLaunch' 和 '$MPShow' 注册 tel 和 project 属性
registerProperties.register({
    properties: {
        tel: '133xxxxxxxx',
        project: 'xxx'
    },
    events: ['$MPLaunch', '$MPShow']
});


// 动态注册公共属性
// 对象包括 event<事件名称>、properties<事件属性>、data<包含所有属性的事件对象>

registerProperties.hookRegister(function ({event, properties, data}) {
    // 根据传入的 参数进行处理，返回自定义属性
    var prop = {};
    if(event === 'test1') {
        prop = {tel: '133xxxxxxxx'};
    }
    if(event === 'test2') {
        prop = {project: 'pro-xxx'}
    }
    return prop;
})
  
```

## ⚠ 注意
* 对指定事件注册属性，可以通过 `register` 
* 如果要对所有事件进行注册属性，可以通过 `hookRegister`
* 如果注册的属性需要动态判断，可以通过 `hookRegister`