"use strict";var base={plugin_version:"1.19.10"};function createPlugin(e){if("object"==typeof e&&"string"==typeof e.plugin_name&&""!==e.plugin_name)return e.plugin_version=base.plugin_version,e.log=e.log||function(){"object"==typeof console&&"function"==typeof console.log&&console.log.apply(console,arguments)},e;"object"==typeof console&&"function"==typeof console.error&&console.error('plugin must contain  proprerty "plugin_name"')}var hasOwnProperty=Object.prototype.hasOwnProperty;function isFunction(e){if(!e)return!1;var t=Object.prototype.toString.call(e);return"[object Function]"==t||"[object AsyncFunction]"==t}function isObject(e){return null!=e&&"[object Object]"==Object.prototype.toString.call(e)}function isString(e){return"[object String]"==toString.call(e)}function log(){if("object"==typeof console&&console.log){isString(arguments[0])&&(arguments[0]="sensors registerProperties————"+arguments[0]);try{return console.log.apply(console,arguments)}catch(e){console.log("sensors registerProperties————",arguments[0])}}}function extend(e){return each(Array.prototype.slice.call(arguments,1),function(t){for(var r in t)void 0!==t[r]&&(e[r]=t[r])}),e}function each(e,t,r){var o=Array.prototype.forEach,n={};if(null==e)return!1;if(o&&e.forEach===o)e.forEach(t,r);else if(e.length===+e.length){for(var i=0,s=e.length;i<s;i++)if(i in e&&t.call(r,e[i],i,e)===n)return!1}else for(var c in e)if(hasOwnProperty.call(e,c)&&t.call(r,e[c],c,e)===n)return!1}var _sa,_={isFunction:isFunction,isObject:isObject,extend:extend,log:log,each:each},RegisterProperties={plugin_name:"RegisterProperties",version:"props_sdk_version"},register_list=[];function getRegisterProperties(e){var t={};return _.each(register_list,function(r){var o={};_.isFunction(r)?o=r({event:e.event,properties:e.properties,data:e}):-1!==r.events.indexOf(e.event)&&(o=r.properties);t=Object.assign(t,o)}),_.isObject(t)?t:{}}RegisterProperties.init=function(e){if(!e||!_.isObject(e))return _.log("请传入正确的 sensors 对象！"),!1;(_sa=e).ee.data.on("beforeBuildCheck",function(e){if(_.isObject(e)&&"track"===e.type&&_.isObject(e.properties)){var t=getRegisterProperties(e);e=Object.assign(e.properties,t)}})},RegisterProperties.register=function(e){e&&_.isObject(e)?e.properties&&_.isObject(e.properties)&&e.events&&e.events.length>0&&register_list.push(e):_.log("参数错误！")},RegisterProperties.hookRegister=function(e){_.isFunction(e)&&register_list.push(e)};var index=createPlugin(RegisterProperties);module.exports=index;