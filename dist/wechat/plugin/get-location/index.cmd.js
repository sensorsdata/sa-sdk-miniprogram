"use strict";var base={plugin_version:"1.20.5"};function createPlugin(o){if("object"==typeof o&&"string"==typeof o.plugin_name&&""!==o.plugin_name)return o.plugin_version=base.plugin_version,o.log=o.log||function(){"object"==typeof console&&"function"==typeof console.log&&console.log.apply(console,arguments)},o;"object"==typeof console&&"function"==typeof console.error&&console.error('plugin must contain  proprerty "plugin_name"')}function isObject(o){return null!=o&&"[object Object]"==Object.prototype.toString.call(o)}function isString(o){return"[object String]"==toString.call(o)}function log(){if("object"==typeof console&&console.log){isString(arguments[0])&&(arguments[0]="sensors getLocation————"+arguments[0]);try{return console.log.apply(console,arguments)}catch(o){console.log("sensors getLocation————",arguments[0])}}}var _={isObject:isObject,log:log},sa=null,GetLocation={plugin_name:"GetLocation",init:function(o,t){if(!o||!_.isObject(o))return _.log("请传入正确的 sensors 对象！"),!1;sa=o,t&&this.getLocation(t)},getLocation(o){"wgs84"!==o.type&&"gcj02"!==o.type||wx.getSetting({success:function(t){t&&t.authSetting["scope.userLocation"]&&wx.getLocation({type:o.type,success:function(t){t&&sa.registerApp({$latitude:t.latitude*Math.pow(10,6),$longitude:t.longitude*Math.pow(10,6),$geo_coordinate_system:sa._.setUpperCase(o.type)})},fail:function(o){sa._.logger.info("获取位置失败",o)}})}})}},index=createPlugin(GetLocation);module.exports=index;