var base={plugin_version:"1.19.6"};function createPlugin(e){if("object"==typeof e&&"string"==typeof e.plugin_name&&""!==e.plugin_name)return e.plugin_version=base.plugin_version,e.log=e.log||function(){"object"==typeof console&&"function"==typeof console.log&&console.log.apply(console,arguments)},e;"object"==typeof console&&"function"==typeof console.error&&console.error('plugin must contain  proprerty "plugin_name"')}var hasOwnProperty=Object.prototype.hasOwnProperty;function isFunction(e){if(!e)return!1;var r=Object.prototype.toString.call(e);return"[object Function]"==r||"[object AsyncFunction]"==r}function isObject(e){return null!=e&&"[object Object]"==Object.prototype.toString.call(e)}function isString(e){return"[object String]"==toString.call(e)}function log(){if("object"==typeof console&&console.log){isString(arguments[0])&&(arguments[0]="sensors registerProperties————"+arguments[0]);try{return console.log.apply(console,arguments)}catch(e){console.log("sensors registerProperties————",arguments[0])}}}function extend(e){return each(Array.prototype.slice.call(arguments,1),function(r){for(var t in r)void 0!==r[t]&&(e[t]=r[t])}),e}function each(e,r,t){var n=Array.prototype.forEach,i={};if(null==e)return!1;if(n&&e.forEach===n)e.forEach(r,t);else if(e.length===+e.length){for(var o=0,s=e.length;o<s;o++)if(o in e&&r.call(t,e[o],o,e)===i)return!1}else for(var c in e)if(hasOwnProperty.call(e,c)&&r.call(t,e[c],c,e)===i)return!1}var _sa,_={isFunction:isFunction,isObject:isObject,extend:extend,log:log,each:each},RegisterProperties={plugin_name:"RegisterProperties",version:"props_sdk_version"},register_list=[];function getRegisterProperties(e){var r={};return _.each(register_list,function(t){var n={};_.isFunction(t)?n=t({event:e.event,properties:e.properties,data:e}):-1!==t.events.indexOf(e.event)&&(n=t.properties);r=Object.assign(r,n)}),_.isObject(r)?r:{}}RegisterProperties.init=function(e){if(!e||!_.isObject(e))return _.log("请传入正确的 sensors 对象！"),!1;(_sa=e).ee.data.on("beforeBuildCheck",function(e){if(_.isObject(e)&&"track"===e.type&&_.isObject(e.properties)){var r=getRegisterProperties(e);e=Object.assign(e.properties,r)}})},RegisterProperties.register=function(e){e&&_.isObject(e)?e.properties&&_.isObject(e.properties)&&e.events&&e.events.length>0&&register_list.push(e):_.log("参数错误！")},RegisterProperties.hookRegister=function(e){_.isFunction(e)&&register_list.push(e)};var sa,registerProperties=createPlugin(RegisterProperties),setReferrerPath={plugin_name:"SetReferrerPath",init:function(e){if(!(sa=e))return console.log("当前主sdk 初始化失败，请传入正确的 sensors 对象！"),!1;this.setRefPath()},setRefPath:function(){registerProperties.init(sa),registerProperties.hookRegister(function(e){var r="",t={};if(e&&e.properties&&(r=e.properties.$referrer||"",sa._.isString(r))){var n=r.indexOf("?");t={referrer_path:n>0?r.substring(0,n):r}}return t})}},index=createPlugin(setReferrerPath);export default index;