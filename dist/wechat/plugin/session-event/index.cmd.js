"use strict";var base={plugin_version:"1.19.2"};function createPlugin(e){if("object"==typeof e&&"string"==typeof e.plugin_name&&""!==e.plugin_name)return e.plugin_version=base.plugin_version,e.log=e.log||function(){"object"==typeof console&&"function"==typeof console.log&&console.log.apply(console,arguments)},e;"object"==typeof console&&"function"==typeof console.error&&console.error('plugin must contain  proprerty "plugin_name"')}var hasOwnProperty=Object.prototype.hasOwnProperty;function isFunction(e){if(!e)return!1;var t=Object.prototype.toString.call(e);return"[object Function]"==t||"[object AsyncFunction]"==t}function isObject(e){return null!=e&&"[object Object]"==Object.prototype.toString.call(e)}function isString(e){return"[object String]"==toString.call(e)}function log(){if("object"==typeof console&&console.log){isString(arguments[0])&&(arguments[0]="sensors registerProperties————"+arguments[0]);try{return console.log.apply(console,arguments)}catch(e){console.log("sensors registerProperties————",arguments[0])}}}function extend(e){return each(Array.prototype.slice.call(arguments,1),function(t){for(var s in t)void 0!==t[s]&&(e[s]=t[s])}),e}function each(e,t,s){var r=Array.prototype.forEach,o={};if(null==e)return!1;if(r&&e.forEach===r)e.forEach(t,s);else if(e.length===+e.length){for(var n=0,i=e.length;n<i;n++)if(n in e&&t.call(s,e[n],n,e)===o)return!1}else for(var c in e)if(hasOwnProperty.call(e,c)&&t.call(s,e[c],c,e)===o)return!1}var _sa,_={isFunction:isFunction,isObject:isObject,extend:extend,log:log,each:each},RegisterProperties={plugin_name:"RegisterProperties",version:"props_sdk_version"},register_list=[];function getRegisterProperties(e){var t={};return _.each(register_list,function(s){var r={};_.isFunction(s)?r=s({event:e.event,properties:e.properties,data:e}):-1!==s.events.indexOf(e.event)&&(r=s.properties);t=Object.assign(t,r)}),_.isObject(t)?t:{}}RegisterProperties.init=function(e){if(!e||!_.isObject(e))return _.log("请传入正确的 sensors 对象！"),!1;(_sa=e).ee.data.on("beforeBuildCheck",function(e){if(_.isObject(e)&&"track"===e.type&&_.isObject(e.properties)){var t=getRegisterProperties(e);e=Object.assign(e.properties,t)}})},RegisterProperties.register=function(e){e&&_.isObject(e)?e.properties&&_.isObject(e.properties)&&e.events&&e.events.length>0&&register_list.push(e):_.log("参数错误！")},RegisterProperties.hookRegister=function(e){_.isFunction(e)&&register_list.push(e)};var registerProperties=createPlugin(RegisterProperties),flag="data:enc;",store={_sa:null,readObjectVal:function(e){try{var t=store._sa._.getStorageSync(e)||"";return store._sa._.isString(t)&&-1!==t.indexOf(flag)&&(t=t.substring(flag.length),t=JSON.parse(store._sa._.rot13defs(t))),t}catch(e){return null}},saveObjectVal:function(e,t){var s="";store._sa._.isObject(t)?s=flag+store._sa._.rot13obfs(JSON.stringify(t)):store._sa._.isString(t)&&-1===t.indexOf(flag)&&(s=flag+store._sa._.rot13obfs(t)),store._sa._.setStorageSync(e,s)}},_sa$1=null,_$1={isObject:function(e){return null!=e&&"[object Object]"==toString.call(e)},log:function(){if("object"==typeof console&&console.log)try{return console.log.apply(console,arguments)}catch(e){console.log("sensors sessionEvent---",arguments[0])}}},STORAGE_NAME="sensorsdata2015_wechat_session",SessionEvent={plugin_name:"SessionEvent",version:"props_sdk_version",storage_name:STORAGE_NAME,init:function(e){if(!e||"object"!=typeof e)return _$1.log("请传入正确的 sensors 对象！"),!1;_sa$1=e,store._sa=e,_$1.log=e._.logger,registerProperties.init(e),registerProperties.hookRegister(SessionEvent.addSessionID)},addSessionID:function(){var e=+new Date,t=store.readObjectVal(SessionEvent.storage_name)||{},s=t.first_session_time,r=t.latest_session_time;!s||!r||s>e||r>e||e-s>432e5||e-r>18e5?t={session_id:_sa$1.store.getUUID().replace(/-/g,""),first_session_time:e,latest_session_time:e}:t.latest_session_time=e;return store.saveObjectVal(SessionEvent.storage_name,t),{$event_session_id:t.session_id}}},index=createPlugin(SessionEvent);module.exports=index;