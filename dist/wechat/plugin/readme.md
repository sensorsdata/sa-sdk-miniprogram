# 插件规范
为了满足多变的需求，提供可无限扩展的能力。神策的 Web/小程序 SDK 将逐步演化为插件式架构。  
SDK 会越来越轻量化，在不久的将来 SDK = CORE + 插件。    
一切需求都是插件，业务都是通过插件来实现。  

## SDK 和插件下载
```
dist
├── web
    ├── plugin
    │   ├── plugin-xx
    │   │   ├── index.esm.js
    │   │   ├── index.cmd.js
    |── sensorsdata.esm.js
    |── sensorsdata.cjs.js
```
* SDK 位置： `/dist/wechat/sensorsdata.esm.js` 
* 插件位置： `/dist/wechat/plugin/ `

注意： 弹窗、abtesting 也都在 `/dist/wechat/plugin` 目录下

## 使用示例
```javascript
import sensors from '/dist/wechat/sensorsdata.esm.js';
import pluginXX from '/dist/wechat/plugin/xx/index.esm.js';
sensors.usePlugin(pluginXX, option);    
sensors.setPara();
sensors.init();  
``` 
注意：所有插件都是按照这种方式引入，各插件文档中不会再次介绍，如果 `option` 有参数时候，才会单独介绍参数的用法  

## 插件使用注意
1. 按顺序引入插件 ！ 先 `import` 主 SDK，后 `import plugin`。先调用 `use`，后调用 `init`。
2. 版本必须一致 ！ 如果单独升级了插件，必须同时单独更新主 SDK。建议插件和 SDK 都引用 `/dist/wechat/` 下的目录文件，这样就会一起更新，就不会出现版本不一致！
